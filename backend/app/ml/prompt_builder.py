# import os
# import json
# def build_prompt(template_type: str)->str:
#     """
#     Loads the system prompt from templates/{type}/prompt.txt.
#     Falls back to a generic prompt if file not found.
#     """

#     prompt_path = os.path.join("./templates",template_type,"prompt.txt")
#     if os.path.exists(prompt_path):
#         with open(prompt_path,"r") as f:
#             return f.read().strip()
        
#     return (
#         "You are a professional document writer. "
#         "Given raw notes, return structured JSON content for the document."
#         "Return pure JSON only, no markdown, no explanation. "
#     )

# def build_user_message(raw_input: str,schema:dict)->str:
#     """
#     Build the user message sent to Claude.
#     Includes the schema field names so Claude knows exactly what to return.
#     """

#     field_names = [f["name"] for f in schema.get("fields",[])]
#     return (
#         f"Raw notes:\n{raw_input}\n\n"
#         f"Return a JSON object with these fields: {field_names}\n"
#         f"Fill every field based on the notes above."
#     )
# def load_schema(template_type:str)->dict:
#     """Loads schema.jon for a given template type."""
#     schema_path=os.path.join("./templates",template_type,"schema.json")

#     if not os.path.exists(schema_path):
#         return {}
    
#     with open(schema_path,"r") as f:
#         return json.load(f)

import os
import json
import logging

logger = logging.getLogger(__name__)


def build_prompt(template_type: str) -> str:
    """
    Loads the system prompt from templates/{type}/prompt.txt.
    Falls back to a generic prompt if file not found.
    """
    prompt_path = os.path.join("./templates", template_type, "prompt.txt")
    if os.path.exists(prompt_path):
        with open(prompt_path, "r") as f:
            return f.read().strip()

    # CHANGED: Generic fallback now instructs full NL → content writing,
    # not just field extraction. Matches the SYSTEM_PROMPT in llm_service.py.
    return (
        "You are a professional business document writer for MakeWithUs, a software agency. "
        "Given a raw natural language input, write complete professional document content. "
        "Do not return placeholders — write real paragraphs, descriptions, and details "
        "specific to the project and client mentioned in the input. "
        "Return pure JSON only. No markdown, no code fences, no explanation. "
        "Start with { and end with }."
    )


def build_user_message(raw_input: str, template_type: str, schema: dict) -> str:
    """
    Build the user message sent to the LLM.

    CHANGED:
    - Accepts template_type so the message can give doc-type-specific instructions
    - Uses full schema dict (not just field names) so AI knows exact structure + types
    - Adds pricing instructions for client_doc and invoice —
      tells AI to return hours and unit_price as plain numbers only
    - Removed field_names list approach — was too vague, AI needs full schema context
    """
    schema_str = json.dumps(schema, indent=2)

    # Extra instruction injected for pricing doc types
    pricing_note = ""
    if template_type in ("client_doc", "invoice"):
        pricing_note = (
            "\n\nPRICING INSTRUCTIONS:"
            "\n- line_items must have: description (string), hours (number), unit_price (number)"
            "\n- hours and unit_price must be plain integers or floats — no ₹ symbol, no commas"
            "\n- Do NOT include amount, subtotal, gst_amount, or total — backend calculates these"
            "\n- If a total budget is mentioned (e.g. ₹2.5 lakh = 250000), distribute it "
            "logically across line items as unit_price values"
        )

    return (
        f"Document Type: {template_type.replace('_', ' ').title()}\n\n"
        f"Raw Input:\n{raw_input}\n\n"
        f"Required JSON Schema:\n{schema_str}"
        f"{pricing_note}\n\n"
        "Write complete professional content for every field based on the raw input above. "
        "All text fields (body_paragraphs, descriptions, summaries) must be fully written "
        "and specific to this project and client — not generic placeholders. "
        "Return ONLY valid JSON matching the schema. No markdown. No code fences. "
        "Start with { and end with }."
    )


def load_schema(template_type: str) -> dict:
    """
    Loads schema.json for a given template type.
    CHANGED: Added logging for missing schema files instead of silent empty dict.
    """
    schema_path = os.path.join("./templates", template_type, "schema.json")

    if not os.path.exists(schema_path):
        # CHANGED: Warn instead of silently returning {} — helps catch missing files early
        logger.warning(
            f"schema.json not found for '{template_type}' at {schema_path}. "
            f"Returning empty schema — AI will use llm_service.py SCHEMAS as fallback."
        )
        return {}

    with open(schema_path, "r") as f:
        return json.load(f)
