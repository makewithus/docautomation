"""
LLM Service — OpenRouter
────────────────────────
Replaces Anthropic Claude with OpenRouter.
OpenRouter uses the OpenAI-compatible SDK so only the client setup changes.
Everything else (prompts, JSON schemas, parsing) stays the same.

Docs: https://openrouter.ai/docs
"""

import json
import logging
import re
from typing import Optional
from openai import OpenAI

from app.config.settings import settings

logger = logging.getLogger(__name__)

# ── OpenRouter client ─────────────────────────────────────────────────────────
client = OpenAI(
    api_key=settings.OPENROUTER_API_KEY,
    base_url=settings.OPENROUTER_BASE_URL,
    default_headers={
        # These appear in your OpenRouter dashboard — helps track usage
        "HTTP-Referer": settings.OPENROUTER_SITE_URL,
        "X-Title":      settings.OPENROUTER_SITE_NAME,
    }
)

# ── System prompt ─────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """
You are a professional business document writer for MakeWithUs, a software agency based in Trivandrum, Kerala.

Brand writing style:
- Tone: Professional, clear, and confident
- Language: Modern business English
- Currency: Indian Rupees (₹) by default
- Dates: DD/MM/YYYY
- Use active voice

CRITICAL OUTPUT RULES:
1. Return ONLY valid JSON — no markdown, no explanation, no preamble.
2. Do NOT wrap output in ```json``` or any code fences.
3. Start your response with { and end with }
4. Fill every field with realistic, professional content.
5. Expand brief notes into complete polished content.
"""

# ── JSON schemas per document type ───────────────────────────────────────────
SCHEMAS = {

    "developer_doc": {
        "title": "string",
        "version": "v1.0",
        "date": "DD/MM/YYYY",
        "author": "string",
        "project_name": "string",
        "summary": "2-3 sentence overview",
        "objectives": ["objective 1", "objective 2"],
        "scope": {
            "in_scope": ["item 1", "item 2"],
            "out_of_scope": ["item 1"]
        },
        "features": [
            {
                "name": "Feature name",
                "description": "description",
                "priority": "High/Medium/Low",
                "acceptance_criteria": ["criteria 1"]
            }
        ],
        "technical_stack": {
            "frontend": "string",
            "backend": "string",
            "database": "string",
            "other": ["item"]
        },
        "user_flows": ["flow 1", "flow 2"],
        "api_endpoints": [
            {"method": "GET", "path": "/endpoint", "description": "string"}
        ],
        "timeline": [
            {"phase": "Phase name", "duration": "X weeks", "deliverables": ["item"]}
        ],
        "assumptions": ["assumption 1"],
        "risks": [{"risk": "string", "mitigation": "string"}]
    },

  "client_doc": {
    "client_name": "string",
    "client_organisation": "string",
    "client_place": "string",
    "date": "DD/MM/YYYY",
    "sender_name": "Mohammed Sherhan",
    "sender_designation": "CEO, MakeWithUs",
    "body_paragraphs": [
        "We are pleased to present this proposal for your project.",
        "Our team has carefully reviewed your requirements and we are confident in delivering a world-class solution.",
        "We look forward to working with you and building something great together."
    ],
    "quotation_number": "QT-2026-001",
    "project_name": "PROJECT NAME IN CAPS",
    "line_items": [
        {
            "description": "SERVICE DESCRIPTION IN CAPS",
            "hours": "XX",
            "unit_price": "₹XX,XXX",
            "amount": "₹XX,XXX"
        }
    ],
    "subtotal": "₹XX,XXX",
    "gst_amount": "₹XX,XXX",
    "total": "₹XX,XXX"
},
    "compliance_doc": {
        "title": "string",
        "doc_number": "HR/2025/001",
        "date": "DD/MM/YYYY",
        "from": "sender name and designation",
        "to": "recipient name and designation",
        "subject": "string",
        "salutation": "Dear Sir/Madam",
        "body_paragraphs": ["paragraph 1", "paragraph 2", "paragraph 3"],
        "closing": "Yours sincerely",
        "signatory_name": "string",
        "signatory_designation": "string",
        "company_name": "MakeWithUs",
        "enclosures": []
    },

    "invoice": {
        "invoice_number": "INV-2025-001",
        "project_name": "PROJECT NAME IN CAPS",
        "client_name": "string",
        "client_phone": "string",
        "upi_phone": "string",
        "upi_id": "string",
        "date": "DD/MM/YYYY",
        "due_date": "DD/MM/YYYY",
        "payment_status": "UNPAID",
        "line_items": [
            {
                "description": "SERVICE DESCRIPTION IN CAPS",
                "hours": "XX",
                "unit_price": "₹XX,XXX",
                "amount": "₹XX,XXX"
            }
        ],
        "subtotal": "₹XX,XXX",
        "gst_percent": 0,
        "gst_amount": "0",
        "total": "₹XX,XXX",
        "bank_name": "SBI / UPI"
    },

    "timeline": {
        "project_name": "PROJECT NAME IN CAPS",
        "project_description": "SHORT DESCRIPTION IN CAPS",
        "client_name": "Mr/Mrs Client Name",
        "page_number": "01",
        "timeline_items": [
            {
                "description": "PHASE NAME IN CAPS",
                "timeline": "X days",
                "hours": "XX"
            }
        ],
        "total_time": "XX DAYS",
        "expected_dev_time": "XX DAYS",
        "expected_closure": "XX DAYS",
        "closure_date": "DD MM YYYY"
    }
}


class LLMService:

    def generate_document_content(
        self,
        raw_text: str,
        doc_type: str,
        entities: Optional[dict] = None,
    ) -> dict:
        """
        Send raw text + doc type to OpenRouter.
        Returns parsed dict ready for Jinja2 template rendering.
        """
        schema   = SCHEMAS.get(doc_type, SCHEMAS["client_doc"])
        entities_str = json.dumps(entities or {}, indent=2)

        user_prompt = f"""
Document Type: {doc_type.replace("_", " ").title()}

Raw Input:
{raw_text}

Extracted Entities (use where relevant):
{entities_str}

Required JSON Schema:
{json.dumps(schema, indent=2)}

Generate a complete professional document.
Return ONLY valid JSON matching the schema.
No markdown. No code fences. Start with {{ end with }}.
"""

        logger.info(f"OpenRouter call — model={settings.LLM_MODEL}, doc_type={doc_type}")

        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            max_tokens=4096,
            temperature=0.3,          # lower = more consistent structured output
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": user_prompt},
            ],
        )

        raw = response.choices[0].message.content.strip()
        logger.info(f"OpenRouter response received — {len(raw)} chars")

        return self._safe_parse(raw, doc_type)

    def generate_title(self, raw_text: str, doc_type: str) -> str:
        """Quick single call to generate a short document title."""
        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            max_tokens=25,
            temperature=0.2,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Input: \"{raw_text[:300]}\"\n"
                        f"Document type: {doc_type}\n"
                        "Write a concise professional document title (max 7 words).\n"
                        "Return ONLY the title. No quotes. No explanation."
                    )
                }
            ]
        )
        return response.choices[0].message.content.strip().strip('"\'')

    def _safe_parse(self, text: str, doc_type: str) -> dict:
        """
        Safely extract and parse JSON from LLM response.
        Handles cases where model adds markdown fences despite instructions.
        """
        # Strip ```json ... ``` fences if present
        if "```" in text:
            match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
            if match:
                text = match.group(1).strip()

        # Trim to first { ... last }
        start = text.find("{")
        end   = text.rfind("}")
        if start != -1 and end != -1:
            text = text[start : end + 1]

        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse failed for '{doc_type}': {e}")
            logger.debug(f"Raw text: {text[:300]}")
            return {
                "title": "Generated Document",
                "summary": text[:500],
                "_parse_error": str(e),
            }


# ── Singleton instance ────────────────────────────────────────────────────────
llm_service = LLMService()
