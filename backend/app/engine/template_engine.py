# from jinja2 import Environment, FileSystemLoader, select_autoescape
# import os

# def fill_template(template_type: str, content:dict)->str:
#     """
#     Loads templates/{template_type}layout.html and fills all
#     {{placeholders}} with Claude-generated content via Jinja2.

#     Args:
#     template_type:"developer_doc"| "client_doc"|"comp"|"invoice"
#     content: structured-JSON from llm_service.generate_content()

#     Returns:
#     Fully rendered HTML string - saved to DB, served at /doc/:id
#     """
#     template_dir = os.path.abspath(
#         os.path.join("./templates",template_type)
#     )

#     if not os.path.exists(template_dir):
#         raise FileNotFoundError(
#             f"Template folder not found: {template_dir}\n"
#             f"Make sure templates/{template_type}/layout.html exists."
#         )
    
#     env=Environment(
#         loader=FileSystemLoader(template_dir),
#         autoescape = select_autoescape(["html"]),
#         trim_blocks=True,
#         lstrip_blocks=True,
#     )

#     content["assets_path"]=os.path.abspath("./assets")

#     try:
#         template=env.get_template("layout.html")
#         return template.render(**content)
#     except Exception as e:
#         raise ValueError(f"Template rendering failed for '{template_type}:{e}")
from jinja2 import Environment, FileSystemLoader, select_autoescape
import os
import logging

logger = logging.getLogger(__name__)


def _calculate_totals(content: dict) -> dict:
    """
    Auto-calculates amount per line item, subtotal, GST, and total.
    Called before rendering for client_doc and invoice.

    Expects line_items with plain numeric hours and unit_price.
    Injects amount, subtotal, gst_amount, total back into content dict.
    """
    line_items = content.get("line_items", [])

    for item in line_items:
       hours = float(item.get("hours") or 0)
    unit_price = float(item.get("unit_price") or 0)

    amount = hours * unit_price
    item["amount"] = amount

    # Format for display in template
    item["amount_display"] = f"₹{amount:,.0f}"
    item["unit_price_display"] = f"₹{unit_price:,.0f}"

    subtotal = sum(
    float(item.get("hours") or 0) *
    float(item.get("unit_price") or 0)
    for item in line_items
)
    gst_percent = float(content.get("gst_percent", 18))
    gst_amount  = subtotal * (gst_percent / 100)
    total       = subtotal + gst_amount

    content["subtotal"]        = subtotal
    content["gst_percent"]     = gst_percent
    content["gst_amount"]      = gst_amount
    content["total"]           = total

    # Pre-formatted display strings for templates
    content["subtotal_display"]    = f"₹{subtotal:,.0f}"
    content["gst_amount_display"]  = f"₹{gst_amount:,.0f}"
    content["total_display"]       = f"₹{total:,.0f}"

    logger.info(f"Totals calculated — subtotal={subtotal}, gst={gst_amount}, total={total}")
    return content


# Doc types that need pricing calculations
_PRICING_DOC_TYPES = {"client_doc", "invoice"}


def fill_template(template_type: str, content: dict) -> str:
    """
    Loads templates/{template_type}/layout.html and fills all
    {{ placeholders }} with AI-generated content via Jinja2.

    For client_doc and invoice: auto-calculates totals from line_items
    before rendering — no manual total entry needed.

    Args:
        template_type: "developer_doc" | "client_doc" | "compliance" | "invoice" | "timeline"
        content: structured JSON from llm_service.generate_document_content()

    Returns:
        Fully rendered HTML string — saved to DB, served at /doc/:id
    """
    # CHANGED: Auto-calculate totals before rendering for pricing doc types
    if template_type in _PRICING_DOC_TYPES:
        content = _calculate_totals(content)

    template_dir = os.path.abspath(
        os.path.join("./templates", template_type)
    )

    if not os.path.exists(template_dir):
        raise FileNotFoundError(
            f"Template folder not found: {template_dir}\n"
            f"Make sure templates/{template_type}/layout.html exists."
        )

    env = Environment(
        loader=FileSystemLoader(template_dir),
        autoescape=select_autoescape(["html"]),
        trim_blocks=True,
        lstrip_blocks=True,
    )

    content["assets_path"] = os.path.abspath("./assets")

    try:
        template = env.get_template("layout.html")
        return template.render(**content)
    except Exception as e:
        raise ValueError(f"Template rendering failed for '{template_type}': {e}")
