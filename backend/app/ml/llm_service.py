# """
# LLM Service — OpenRouter
# ────────────────────────
# Replaces Anthropic Claude with OpenRouter.
# OpenRouter uses the OpenAI-compatible SDK so only the client setup changes.
# Everything else (prompts, JSON schemas, parsing) stays the same.

# Docs: https://openrouter.ai/docs
# """

# import json
# import logging
# import re
# from typing import Optional
# from openai import OpenAI

# from app.config.settings import settings

# logger = logging.getLogger(__name__)

# # ── OpenRouter client ─────────────────────────────────────────────────────────
# client = OpenAI(
#     api_key=settings.OPENROUTER_API_KEY,
#     base_url=settings.OPENROUTER_BASE_URL,
#     default_headers={
#         # These appear in your OpenRouter dashboard — helps track usage
#         "HTTP-Referer": settings.OPENROUTER_SITE_URL,
#         "X-Title":      settings.OPENROUTER_SITE_NAME,
#     }
# )

# # ── System prompt ─────────────────────────────────────────────────────────────
# SYSTEM_PROMPT = """
# You are a professional business document writer for MakeWithUs, a software agency based in Trivandrum, Kerala.

# Brand writing style:
# - Tone: Professional, clear, and confident
# - Language: Modern business English
# - Currency: Indian Rupees (₹) by default
# - Dates: DD/MM/YYYY
# - Use active voice

# CRITICAL OUTPUT RULES:
# 1. Return ONLY valid JSON — no markdown, no explanation, no preamble.
# 2. Do NOT wrap output in ```json``` or any code fences.
# 3. Start your response with { and end with }
# 4. Fill every field with realistic, professional content.
# 5. Expand brief notes into complete polished content.
# """

# # ── JSON schemas per document type ───────────────────────────────────────────
# SCHEMAS = {

#     "developer_doc": {
#         "title": "string",
#         "version": "v1.0",
#         "date": "DD/MM/YYYY",
#         "author": "string",
#         "project_name": "string",
#         "summary": "2-3 sentence overview",
#         "objectives": ["objective 1", "objective 2"],
#         "scope": {
#             "in_scope": ["item 1", "item 2"],
#             "out_of_scope": ["item 1"]
#         },
#         "features": [
#             {
#                 "name": "Feature name",
#                 "description": "description",
#                 "priority": "High/Medium/Low",
#                 "acceptance_criteria": ["criteria 1"]
#             }
#         ],
#         "technical_stack": {
#             "frontend": "string",
#             "backend": "string",
#             "database": "string",
#             "other": ["item"]
#         },
#         "user_flows": ["flow 1", "flow 2"],
#         "api_endpoints": [
#             {"method": "GET", "path": "/endpoint", "description": "string"}
#         ],
#         "timeline": [
#             {"phase": "Phase name", "duration": "X weeks", "deliverables": ["item"]}
#         ],
#         "assumptions": ["assumption 1"],
#         "risks": [{"risk": "string", "mitigation": "string"}]
#     },

#   "client_doc": {
#     "client_name": "string",
#     "client_organisation": "string",
#     "client_place": "string",
#     "date": "DD/MM/YYYY",
#     "sender_name": "Mohammed Sherhan",
#     "sender_designation": "CEO, MakeWithUs",
#     "body_paragraphs": [
#         "We are pleased to present this proposal for your project.",
#         "Our team has carefully reviewed your requirements and we are confident in delivering a world-class solution.",
#         "We look forward to working with you and building something great together."
#     ],
#     "quotation_number": "QT-2026-001",
#     "project_name": "PROJECT NAME IN CAPS",
#     "line_items": [
#         {
#             "description": "SERVICE DESCRIPTION IN CAPS",
#             "hours": "XX",
#             "unit_price": "₹XX,XXX",
#             "amount": "₹XX,XXX"
#         }
#     ],
#     "subtotal": "₹XX,XXX",
#     "gst_amount": "₹XX,XXX",
#     "total": "₹XX,XXX"
# },
#     "compliance_doc": {
#         "title": "string",
#         "doc_number": "HR/2025/001",
#         "date": "DD/MM/YYYY",
#         "from": "sender name and designation",
#         "to": "recipient name and designation",
#         "subject": "string",
#         "salutation": "Dear Sir/Madam",
#         "body_paragraphs": ["paragraph 1", "paragraph 2", "paragraph 3"],
#         "closing": "Yours sincerely",
#         "signatory_name": "string",
#         "signatory_designation": "string",
#         "company_name": "MakeWithUs",
#         "enclosures": []
#     },

#     "invoice": {
#         "invoice_number": "INV-2025-001",
#         "project_name": "PROJECT NAME IN CAPS",
#         "client_name": "string",
#         "client_phone": "string",
#         "upi_phone": "string",
#         "upi_id": "string",
#         "date": "DD/MM/YYYY",
#         "due_date": "DD/MM/YYYY",
#         "payment_status": "UNPAID",
#         "line_items": [
#             {
#                 "description": "SERVICE DESCRIPTION IN CAPS",
#                 "hours": "XX",
#                 "unit_price": "₹XX,XXX",
#                 "amount": "₹XX,XXX"
#             }
#         ],
#         "subtotal": "₹XX,XXX",
#         "gst_percent": 0,
#         "gst_amount": "0",
#         "total": "₹XX,XXX",
#         "bank_name": "SBI / UPI"
#     },

#     "timeline": {
#         "project_name": "PROJECT NAME IN CAPS",
#         "project_description": "SHORT DESCRIPTION IN CAPS",
#         "client_name": "Mr/Mrs Client Name",
#         "page_number": "01",
#         "timeline_items": [
#             {
#                 "description": "PHASE NAME IN CAPS",
#                 "timeline": "X days",
#                 "hours": "XX"
#             }
#         ],
#         "total_time": "XX DAYS",
#         "expected_dev_time": "XX DAYS",
#         "expected_closure": "XX DAYS",
#         "closure_date": "DD MM YYYY"
#     }
# }


# class LLMService:

#     def generate_document_content(
#         self,
#         raw_text: str,
#         doc_type: str,
#         entities: Optional[dict] = None,
#     ) -> dict:
#         """
#         Send raw text + doc type to OpenRouter.
#         Returns parsed dict ready for Jinja2 template rendering.
#         """
#         schema   = SCHEMAS.get(doc_type, SCHEMAS["client_doc"])
#         entities_str = json.dumps(entities or {}, indent=2)

#         user_prompt = f"""
# Document Type: {doc_type.replace("_", " ").title()}

# Raw Input:
# {raw_text}

# Extracted Entities (use where relevant):
# {entities_str}

# Required JSON Schema:
# {json.dumps(schema, indent=2)}

# Generate a complete professional document.
# Return ONLY valid JSON matching the schema.
# No markdown. No code fences. Start with {{ end with }}.
# """

#         logger.info(f"OpenRouter call — model={settings.LLM_MODEL}, doc_type={doc_type}")

#         response = client.chat.completions.create(
#             model=settings.LLM_MODEL,
#             max_tokens=4096,
#             temperature=0.3,          # lower = more consistent structured output
#             messages=[
#                 {"role": "system", "content": SYSTEM_PROMPT},
#                 {"role": "user",   "content": user_prompt},
#             ],
#         )

#         raw = response.choices[0].message.content.strip()
#         logger.info(f"OpenRouter response received — {len(raw)} chars")

#         return self._safe_parse(raw, doc_type)

#     def generate_title(self, raw_text: str, doc_type: str) -> str:
#         """Quick single call to generate a short document title."""
#         response = client.chat.completions.create(
#             model=settings.LLM_MODEL,
#             max_tokens=25,
#             temperature=0.2,
#             messages=[
#                 {
#                     "role": "user",
#                     "content": (
#                         f"Input: \"{raw_text[:300]}\"\n"
#                         f"Document type: {doc_type}\n"
#                         "Write a concise professional document title (max 7 words).\n"
#                         "Return ONLY the title. No quotes. No explanation."
#                     )
#                 }
#             ]
#         )
#         return response.choices[0].message.content.strip().strip('"\'')

#     def _safe_parse(self, text: str, doc_type: str) -> dict:
#         """
#         Safely extract and parse JSON from LLM response.
#         Handles cases where model adds markdown fences despite instructions.
#         """
#         # Strip ```json ... ``` fences if present
#         if "```" in text:
#             match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
#             if match:
#                 text = match.group(1).strip()

#         # Trim to first { ... last }
#         start = text.find("{")
#         end   = text.rfind("}")
#         if start != -1 and end != -1:
#             text = text[start : end + 1]

#         try:
#             return json.loads(text)
#         except json.JSONDecodeError as e:
#             logger.error(f"JSON parse failed for '{doc_type}': {e}")
#             logger.debug(f"Raw text: {text[:300]}")
#             return {
#                 "title": "Generated Document",
#                 "summary": text[:500],
#                 "_parse_error": str(e),
#             }


# # ── Singleton instance ────────────────────────────────────────────────────────
# llm_service = LLMService()
"""
LLM Service — OpenRouter
────────────────────────
Replaces Anthropic Claude with OpenRouter.
OpenRouter uses the OpenAI-compatible SDK so only the client setup changes.

CHANGES FROM PREVIOUS VERSION:
1. line_items now return hours + unit_price as plain numbers (no ₹ symbol)
   → backend (template_engine.py) calculates amount, subtotal, gst, total
2. SYSTEM_PROMPT now instructs AI to write full document content from NL input
   → body_paragraphs, descriptions, letters are fully AI-written, not placeholders
3. Schemas cleaned — removed pre-filled amount/subtotal/gst/total fields from
   client_doc and invoice (template_engine.py owns all math now)
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
        "HTTP-Referer": settings.OPENROUTER_SITE_URL,
        "X-Title":      settings.OPENROUTER_SITE_NAME,
    }
)

# ── System prompt ─────────────────────────────────────────────────────────────
# CHANGED: Added explicit instructions to write full content from NL input.
# AI must write complete letters, paragraphs, descriptions — not placeholders.
SYSTEM_PROMPT = """
You are a professional business document writer for MakeWithUs, a software agency based in Trivandrum, Kerala.

Brand writing style:
- Tone: Professional, clear, and confident
- Language: Modern business English
- Currency: Indian Rupees (₹) — but return numeric values only for prices (no ₹ symbol in numbers)
- Dates: DD/MM/YYYY
- Use active voice

YOUR JOB — READ THIS CAREFULLY:
You receive a raw natural language prompt from a user. It may be rough notes, messy sentences, or a quick brief.
You must:
1. Understand the full context from that raw input
2. Write complete, professional document content — not placeholders
3. body_paragraphs must be fully written professional paragraphs about this specific project/client
4. Feature descriptions must be detailed and specific to the project described
5. All names, project details, budgets, timelines must come from the raw input
6. If budget is mentioned (e.g. ₹2.5 lakh), distribute it logically across line items as unit_price

PRICING RULES — CRITICAL:
- Return hours and unit_price as plain integers or floats (e.g. 20, 1500) — NO ₹ symbol, NO commas
- Do NOT calculate amount, subtotal, gst_amount, or total — leave those fields OUT of your response
- The backend will calculate all totals automatically

CRITICAL OUTPUT RULES:
1. Return ONLY valid JSON — no markdown, no explanation, no preamble
2. Do NOT wrap output in ```json``` or any code fences
3. Start your response with { and end with }
4. Every string field must be filled with real content specific to the input — never leave example placeholders
5. body_paragraphs must reference the actual client name, project name, and features from the input
"""

# ── JSON schemas per document type ───────────────────────────────────────────
# CHANGED:
# - client_doc and invoice line_items now only have description, hours, unit_price (numbers)
# - Removed amount, subtotal, gst_amount, total from schema — backend calculates these
# - Added clear comments so AI knows what to write vs what to leave out

SCHEMAS = {

    "developer_doc": {
        "title": "string — document title",
        "version": "v1.0",
        "date": "DD/MM/YYYY",
        "author": "string",
        "project_name": "PROJECT NAME IN CAPS",
        "summary": "2-3 sentence overview written from the raw input",
        "objectives": ["fully written objective 1", "fully written objective 2"],
        "scope": {
            "in_scope": ["specific item from input", "specific item from input"],
            "out_of_scope": ["item not covered"]
        },
        "features": [
            {
                "name": "Feature name",
                "description": "Detailed description written from the input — not a placeholder",
                "priority": "High/Medium/Low",
                "acceptance_criteria": ["specific criteria 1", "specific criteria 2"]
            }
        ],
        "technical_stack": {
            "frontend": "string",
            "backend": "string",
            "database": "string",
            "other": ["item"]
        },
        "user_flows": ["specific flow 1 based on input", "specific flow 2"],
        "api_endpoints": [
            {"method": "GET", "path": "/endpoint", "description": "string"}
        ],
        "timeline": [
            {"phase": "Phase name", "duration": "X weeks", "deliverables": ["specific deliverable"]}
        ],
        "assumptions": ["assumption based on input"],
        "risks": [{"risk": "specific risk", "mitigation": "specific mitigation"}]
    },

    # CHANGED: Removed amount, subtotal, gst_amount, total — backend calculates
    # CHANGED: hours and unit_price are now plain numbers (int/float), not strings
    # CHANGED: body_paragraphs must be fully written about this specific project
    "client_doc": {
        "client_name": "string — full name from input",
        "client_organisation": "string — organisation from input",
        "client_place": "string — city/place if mentioned",
        "date": "DD/MM/YYYY",
        "sender_name": "Mohammed Sherhan",
        "sender_designation": "CEO, MakeWithUs",
        "body_paragraphs": [
            "First paragraph — written specifically about this project and client. Reference the client name and what they are building.",
            "Second paragraph — explain what MakeWithUs will deliver for this specific project. Mention key features.",
            "Third paragraph — closing, express enthusiasm, mention timeline or next steps."
        ],
        "quotation_number": "QT-2026-001",
        "project_name": "PROJECT NAME IN CAPS",
        "gst_percent": 18,
        "line_items": [
            {
                "description": "SERVICE DESCRIPTION IN CAPS — specific to the project",
                "hours": 20,
                "unit_price": 1500
            }
        ]
    },

    "compliance_doc": {
        "title": "string",
        "doc_number": "HR/2025/001",
        "date": "DD/MM/YYYY",
        "from": "sender name and designation",
        "to": "recipient name and designation",
        "subject": "string — specific subject from input",
        "salutation": "Dear Sir/Madam",
        "body_paragraphs": [
            "Fully written paragraph 1 — specific to the document purpose",
            "Fully written paragraph 2 — legal/compliance details",
            "Fully written paragraph 3 — closing/obligations"
        ],
        "closing": "Yours sincerely",
        "signatory_name": "string",
        "signatory_designation": "string",
        "company_name": "MakeWithUs",
        "enclosures": []
    },

    # CHANGED: Removed amount, subtotal, gst_amount, total — backend calculates
    # CHANGED: hours and unit_price are plain numbers, not strings with ₹
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
        "gst_percent": 18,
        "line_items": [
            {
                "description": "SERVICE DESCRIPTION IN CAPS",
                "hours": 20,
                "unit_price": 1500
            }
        ],
        "bank_name": "SBI / UPI"
    },

    "timeline": {
        "project_name": "PROJECT NAME IN CAPS",
        "project_description": "SHORT DESCRIPTION IN CAPS — specific to the project",
        "client_name": "Mr/Mrs Client Name from input",
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
        Send raw NL text + doc type to OpenRouter.
        Returns parsed dict — totals are NOT in this dict.
        template_engine.py will calculate and inject totals after this call.
        """
        schema       = SCHEMAS.get(doc_type, SCHEMAS["client_doc"])
        entities_str = json.dumps(entities or {}, indent=2)

        user_prompt = f"""
Document Type: {doc_type.replace("_", " ").title()}

Raw User Input (this is the only source of truth — read it carefully):
{raw_text}

Extracted Entities (use where relevant, do not override raw input):
{entities_str}

Required JSON Schema (follow this structure exactly):
{json.dumps(schema, indent=2)}

INSTRUCTIONS:
- Write all text fields as complete, professional content specific to this project and client
- For body_paragraphs: write real paragraphs referencing the actual client, project, and features from the input
- For line_items: hours and unit_price must be plain numbers (e.g. 20, 1500) — no ₹, no commas
- Do NOT include amount, subtotal, gst_amount, or total in your response — backend handles math
- If the raw input mentions a total budget (e.g. ₹2.5 lakh = 250000), distribute it across line items logically
- Return ONLY valid JSON. No markdown. No code fences. Start with {{ end with }}
"""

        logger.info(f"OpenRouter call — model={settings.LLM_MODEL}, doc_type={doc_type}")

        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            max_tokens=4096,
            temperature=0.3,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": user_prompt},
            ],
        )

        raw = response.choices[0].message.content.strip()
        logger.info(f"OpenRouter response received — {len(raw)} chars")

        parsed = self._safe_parse(raw, doc_type)

        # Sanitise line_items — ensure hours and unit_price are always numbers
        # so template_engine.py never receives strings for math fields
        if "line_items" in parsed:
            for item in parsed["line_items"]:
                item["hours"]      = self._to_number(item.get("hours", 0))
                item["unit_price"] = self._to_number(item.get("unit_price", 0))

        return parsed

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

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _to_number(self, value) -> float:
        """
        Convert anything the AI might return for a price/hour field to a float.
        Handles: 1500, "1500", "₹1,500", "1,500.00", etc.
        """
        if isinstance(value, (int, float)):
            return float(value)
        if isinstance(value, str):
            cleaned = re.sub(r"[₹,\s]", "", value)
            try:
                return float(cleaned)
            except ValueError:
                logger.warning(f"Could not convert '{value}' to number, defaulting to 0")
                return 0.0
        return 0.0

    def _safe_parse(self, text: str, doc_type: str) -> dict:
        """
        Safely extract and parse JSON from LLM response.
        Handles cases where model adds markdown fences despite instructions.
        """
        if "```" in text:
            match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
            if match:
                text = match.group(1).strip()

        start = text.find("{")
        end   = text.rfind("}")
        if start != -1 and end != -1:
            text = text[start : end + 1]

        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse failed for '{doc_type}': {e}")
            logger.debug(f"Raw text snippet: {text[:300]}")
            return {
                "title": "Generated Document",
                "summary": text[:500],
                "_parse_error": str(e),
            }


# ── Singleton instance ────────────────────────────────────────────────────────
llm_service = LLMService()
