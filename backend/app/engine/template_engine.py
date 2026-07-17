# # # # from jinja2 import Environment, FileSystemLoader, select_autoescape
# # # # import os

# # # # def fill_template(template_type: str, content:dict)->str:
# # # #     """
# # # #     Loads templates/{template_type}layout.html and fills all
# # # #     {{placeholders}} with Claude-generated content via Jinja2.

# # # #     Args:
# # # #     template_type:"developer_doc"| "client_doc"|"comp"|"invoice"
# # # #     content: structured-JSON from llm_service.generate_content()

# # # #     Returns:
# # # #     Fully rendered HTML string - saved to DB, served at /doc/:id
# # # #     """
# # # #     template_dir = os.path.abspath(
# # # #         os.path.join("./templates",template_type)
# # # #     )

# # # #     if not os.path.exists(template_dir):
# # # #         raise FileNotFoundError(
# # # #             f"Template folder not found: {template_dir}\n"
# # # #             f"Make sure templates/{template_type}/layout.html exists."
# # # #         )
    
# # # #     env=Environment(
# # # #         loader=FileSystemLoader(template_dir),
# # # #         autoescape = select_autoescape(["html"]),
# # # #         trim_blocks=True,
# # # #         lstrip_blocks=True,
# # # #     )

# # # #     content["assets_path"]=os.path.abspath("./assets")

# # # #     try:
# # # #         template=env.get_template("layout.html")
# # # #         return template.render(**content)
# # # #     except Exception as e:
# # # #         raise ValueError(f"Template rendering failed for '{template_type}:{e}")
# # # from jinja2 import Environment, FileSystemLoader, select_autoescape
# # # import os
# # # import logging

# # # logger = logging.getLogger(__name__)
# # # def _calculate_totals(content: dict) -> dict:
# # #     line_items = content.get("line_items", [])

# # #     if not line_items:
# # #         logger.warning("No line_items provided — totals will be zero")

# # #     for item in line_items:
# # #         hours = float(item.get("hours") or 0)
# # #         unit_price = float(item.get("unit_price") or 0)

# # #         amount = hours * unit_price
# # #         item["amount"] = amount
# # #         item["amount_display"] = f"₹{amount:,.0f}"
# # #         item["unit_price_display"] = f"₹{unit_price:,.0f}"

# # #     subtotal = sum(
# # #         float(item.get("hours") or 0) * float(item.get("unit_price") or 0)
# # #         for item in line_items
# # #     )
# # #     gst_percent = float(content.get("gst_percent", 18))
# # #     gst_amount = subtotal * (gst_percent / 100)
# # #     total = subtotal + gst_amount

# # #     content["subtotal"] = subtotal
# # #     content["gst_percent"] = gst_percent
# # #     content["gst_amount"] = gst_amount
# # #     content["total"] = total

# # #     content["subtotal_display"] = f"₹{subtotal:,.0f}"
# # #     content["gst_amount_display"] = f"₹{gst_amount:,.0f}"
# # #     content["total_display"] = f"₹{total:,.0f}"

# # #     logger.info(f"Totals calculated — subtotal={subtotal}, gst={gst_amount}, total={total}")
# # #     return content

# # # # def _calculate_totals(content: dict) -> dict:
# # # #     """
# # # #     Auto-calculates amount per line item, subtotal, GST, and total.
# # # #     Called before rendering for client_doc and invoice.

# # # #     Expects line_items with plain numeric hours and unit_price.
# # # #     Injects amount, subtotal, gst_amount, total back into content dict.
# # # #     """
# # # #     line_items = content.get("line_items", [])

# # # #     for item in line_items:
# # # #        hours = float(item.get("hours") or 0)
# # # #     unit_price = float(item.get("unit_price") or 0)

# # # #     amount = hours * unit_price
# # # #     item["amount"] = amount

# # # #     # Format for display in template
# # # #     item["amount_display"] = f"₹{amount:,.0f}"
# # # #     item["unit_price_display"] = f"₹{unit_price:,.0f}"

# # # #     subtotal = sum(
# # # #     float(item.get("hours") or 0) *
# # # #     float(item.get("unit_price") or 0)
# # # #     for item in line_items
# # # # )
# # # #     gst_percent = float(content.get("gst_percent", 18))
# # # #     gst_amount  = subtotal * (gst_percent / 100)
# # # #     total       = subtotal + gst_amount

# # # #     content["subtotal"]        = subtotal
# # # #     content["gst_percent"]     = gst_percent
# # # #     content["gst_amount"]      = gst_amount
# # # #     content["total"]           = total

# # # #     # Pre-formatted display strings for templates
# # # #     content["subtotal_display"]    = f"₹{subtotal:,.0f}"
# # # #     content["gst_amount_display"]  = f"₹{gst_amount:,.0f}"
# # # #     content["total_display"]       = f"₹{total:,.0f}"

# # # #     logger.info(f"Totals calculated — subtotal={subtotal}, gst={gst_amount}, total={total}")
# # # #     return content


# # # # Doc types that need pricing calculations
# # # _PRICING_DOC_TYPES = {"client_doc", "invoice"}


# # # def fill_template(template_type: str, content: dict) -> str:
# # #     """
# # #     Loads templates/{template_type}/layout.html and fills all
# # #     {{ placeholders }} with AI-generated content via Jinja2.

# # #     For client_doc and invoice: auto-calculates totals from line_items
# # #     before rendering — no manual total entry needed.

# # #     Args:
# # #         template_type: "receipt_template" | "client_doc" | "compliance" | "invoice" | "timeline"
# # #         content: structured JSON from llm_service.generate_document_content()

# # #     Returns:
# # #         Fully rendered HTML string — saved to DB, served at /doc/:id
# # #     """
# # #     # CHANGED: Auto-calculate totals before rendering for pricing doc types
# # #     if template_type in _PRICING_DOC_TYPES:
# # #         content = _calculate_totals(content)

# # #     template_dir = os.path.abspath(
# # #         os.path.join("./templates", template_type)
# # #     )

# # #     if not os.path.exists(template_dir):
# # #         raise FileNotFoundError(
# # #             f"Template folder not found: {template_dir}\n"
# # #             f"Make sure templates/{template_type}/layout.html exists."
# # #         )

# # #     env = Environment(
# # #         loader=FileSystemLoader(template_dir),
# # #         autoescape=select_autoescape(["html"]),
# # #         trim_blocks=True,
# # #         lstrip_blocks=True,
# # #     )

# # #     content["assets_path"] = os.path.abspath("./assets")

# # #     try:
# # #         template = env.get_template("layout.html")
# # #         return template.render(**content)
# # #     except Exception as e:
# # #         raise ValueError(f"Template rendering failed for '{template_type}': {e}")

# # from jinja2 import Environment, FileSystemLoader, select_autoescape
# # import os
# # import logging

# # logger = logging.getLogger(__name__)


# # def _safe_float(val, default=0.0):
# #     """Parses '₹1,500', '-', '', None, numbers, etc. safely into a float."""
# #     if val is None:
# #         return default
# #     if isinstance(val, (int, float)):
# #         return float(val)
# #     s = str(val).replace("₹", "").replace(",", "").strip()
# #     if not s or s == "-":
# #         return default
# #     try:
# #         return float(s)
# #     except ValueError:
# #         return default

# #     def _calculate_totals(content: dict) -> dict:
# #     line_items = content.get("line_items", [])

# #     if line_items:
# #         for item in line_items:
# #             hours = _safe_float(item.get("hours"))
# #             unit_price = _safe_float(item.get("unit_price"))
# #             amount = hours * unit_price
# #             item["amount"] = amount
# #             item["amount_display"] = f"₹{amount:,.0f}"
# #             item["unit_price_display"] = f"₹{unit_price:,.0f}"

# #         subtotal = sum(
# #             _safe_float(item.get("hours")) * _safe_float(item.get("unit_price"))
# #             for item in line_items
# #         )
# #     else:
# #         # Line items nahi hain — jo user ne manually Subtotal field mein type kiya, wahi trust karo
# #         subtotal = _safe_float(content.get("subtotal"))

# #     gst_percent = _safe_float(content.get("gst_percent"), default=18)
# #     gst_amount = subtotal * (gst_percent / 100)
# #     total = subtotal + gst_amount

# #     content["subtotal"] = subtotal
# #     content["gst_percent"] = gst_percent
# #     content["gst_amount"] = gst_amount
# #     content["total"] = total

# #     content["subtotal_display"] = f"₹{subtotal:,.0f}"
# #     content["gst_amount_display"] = f"₹{gst_amount:,.0f}"
# #     content["total_display"] = f"₹{total:,.0f}"

# #     logger.info(f"Totals calculated — subtotal={subtotal}, gst={gst_amount}, total={total}")
# #     return content

# # # def _calculate_totals(content: dict) -> dict:
# # #     """
# # #     Auto-calculates amount per line item, subtotal, GST, and total.
# # #     Used for client_doc and invoice — assumes plain numeric hours/unit_price.
# # #     """
# # #     line_items = content.get("line_items", [])

# # #     if not line_items:
# # #         logger.warning("No line_items provided — totals will be zero")

# # #     for item in line_items:
# # #         hours = _safe_float(item.get("hours"))
# # #         unit_price = _safe_float(item.get("unit_price"))

# # #         amount = hours * unit_price
# # #         item["amount"] = amount
# # #         item["amount_display"] = f"₹{amount:,.0f}"
# # #         item["unit_price_display"] = f"₹{unit_price:,.0f}"

# # #     subtotal = sum(
# # #         _safe_float(item.get("hours")) * _safe_float(item.get("unit_price"))
# # #         for item in line_items
# # #     )
# # #     gst_percent = _safe_float(content.get("gst_percent"), default=18)
# # #     gst_amount = subtotal * (gst_percent / 100)
# # #     total = subtotal + gst_amount

# # #     content["subtotal"] = subtotal
# # #     content["gst_percent"] = gst_percent
# # #     content["gst_amount"] = gst_amount
# # #     content["total"] = total

# # #     content["subtotal_display"] = f"₹{subtotal:,.0f}"
# # #     content["gst_amount_display"] = f"₹{gst_amount:,.0f}"
# # #     content["total_display"] = f"₹{total:,.0f}"

# # #     logger.info(f"Totals calculated — subtotal={subtotal}, gst={gst_amount}, total={total}")
# # #     return content


# # def _calculate_receipt_totals(content: dict) -> dict:
# #     """
# #     Auto-calculates subtotal, GST, and total for receipt_template.

# #     Unlike invoice/client_doc, receipt line items may have hours/unit_price
# #     as '-' (non-numeric), and if no line_items exist at all, falls back to
# #     the amount_received field as the base amount — same logic used on the
# #     frontend (ReceiptFields component).
# #     """
# #     line_items = content.get("line_items", [])

# #     base_amount = 0.0

# #     if line_items:
# #         for item in line_items:
# #             hours = _safe_float(item.get("hours"))
# #             unit_price = _safe_float(item.get("unit_price"))

# #             # Only recompute amount from hours*unit_price if both are
# #             # actually numeric (not '-'); otherwise trust whatever
# #             # amount was already set (manual entry / frontend edit).
# #             existing_amount = _safe_float(item.get("amount"))
# #             if hours > 0 and unit_price > 0:
# #                 amount = hours * unit_price
# #             else:
# #                 amount = existing_amount

# #             item["amount"] = amount

# #         base_amount = sum(_safe_float(item.get("amount")) for item in line_items)

# #     # Fallback: no usable line item amounts, use Amount Received field
# #     if base_amount <= 0:
# #         base_amount = _safe_float(content.get("amount_received"))

# #     gst_percent = _safe_float(content.get("gst_percent"), default=0)  # receipts default to NO GST
# #     gst_amount = base_amount * (gst_percent / 100)
# #     total = base_amount + gst_amount

# #     content["subtotal"] = base_amount
# #     content["gst_percent"] = gst_percent
# #     content["gst_amount"] = gst_amount
# #     content["total"] = total

# #     logger.info(
# #         f"Receipt totals calculated — subtotal={base_amount}, "
# #         f"gst={gst_amount}, total={total}"
# #     )
# #     return content


# # # Doc types that need pricing calculations
# # _PRICING_DOC_TYPES = {"client_doc", "invoice"}
# # _RECEIPT_DOC_TYPES = {"receipt_template"}


# # def fill_template(template_type: str, content: dict) -> str:
# #     """
# #     Loads templates/{template_type}/layout.html and fills all
# #     {{ placeholders }} with AI-generated content via Jinja2.

# #     For client_doc and invoice: auto-calculates totals from line_items
# #     (hours * unit_price) before rendering.

# #     For receipt_template: auto-calculates totals from line_items OR
# #     falls back to amount_received if no line items exist.

# #     Args:
# #         template_type: "receipt_template" | "client_doc" | "compliance" | "invoice" | "timeline"
# #         content: structured JSON from llm_service.generate_document_content()

# #     Returns:
# #         Fully rendered HTML string — saved to DB, served at /doc/:id
# #     """
# #     if template_type in _PRICING_DOC_TYPES:
# #         content = _calculate_totals(content)
# #     elif template_type in _RECEIPT_DOC_TYPES:
# #         content = _calculate_receipt_totals(content)

# #     template_dir = os.path.abspath(
# #         os.path.join("./templates", template_type)
# #     )

# #     if not os.path.exists(template_dir):
# #         raise FileNotFoundError(
# #             f"Template folder not found: {template_dir}\n"
# #             f"Make sure templates/{template_type}/layout.html exists."
# #         )

# #     env = Environment(
# #         loader=FileSystemLoader(template_dir),
# #         autoescape=select_autoescape(["html"]),
# #         trim_blocks=True,
# #         lstrip_blocks=True,
# #     )

# #     content["assets_path"] = os.path.abspath("./assets")

# #     try:
# #         template = env.get_template("layout.html")
# #         return template.render(**content)
# #     except Exception as e:
# #         raise ValueError(f"Template rendering failed for '{template_type}': {e}")


# from jinja2 import Environment, FileSystemLoader, select_autoescape
# import os
# import logging

# logger = logging.getLogger(__name__)


# def _safe_float(val, default=0.0):
#     """Parses '₹1,500', '-', '', None, numbers, etc. safely into a float."""
#     if val is None:
#         return default
#     if isinstance(val, (int, float)):
#         return float(val)
#     s = str(val).replace("₹", "").replace(",", "").strip()
#     if not s or s == "-":
#         return default
#     try:
#         return float(s)
#     except ValueError:
#         return default
# def _calculate_receipt_totals(content: dict) -> dict:
#     """
#     Auto-calculates subtotal, GST, and total for receipt_template.
#     """
#     line_items = content.get("line_items", [])

#     base_amount = 0.0

#     if line_items:
#         for item in line_items:
#             hours = _safe_float(item.get("hours"))
#             unit_price = _safe_float(item.get("unit_price"))

#             existing_amount = _safe_float(item.get("amount"))
#             if hours > 0 and unit_price > 0:
#                 amount = hours * unit_price
#             else:
#                 amount = existing_amount

#             item["amount"] = amount

#         base_amount = sum(_safe_float(item.get("amount")) for item in line_items)

#     # Fallback 1: no usable line item amounts, try Amount Received field
#     if base_amount <= 0:
#         base_amount = _safe_float(content.get("amount_received"))

#     # Fallback 2: still zero — trust whatever the user manually typed into Subtotal
#     if base_amount <= 0:
#         base_amount = _safe_float(content.get("subtotal"))

#     gst_percent = _safe_float(content.get("gst_percent"), default=0)
#     gst_amount = base_amount * (gst_percent / 100)
#     total = base_amount + gst_amount

#     content["subtotal"] = base_amount
#     content["gst_percent"] = gst_percent
#     content["gst_amount"] = gst_amount
#     content["total"] = total

#     content["subtotal_display"] = f"₹{base_amount:,.0f}"
#     content["gst_amount_display"] = f"₹{gst_amount:,.0f}"
#     content["total_display"] = f"₹{total:,.0f}"

#     logger.info(
#         f"Receipt totals calculated — subtotal={base_amount}, "
#         f"gst={gst_amount}, total={total}"
#     )
#     return content


# # def _calculate_totals(content: dict) -> dict:
# #     """
# #     Auto-calculates amount per line item, subtotal, GST, and total.
# #     Used for client_doc and invoice — assumes numeric-ish hours/unit_price
# #     (parsed safely via _safe_float).

# #     If no line_items exist, falls back to a manually provided "subtotal"
# #     field in content.
# #     """
# #     line_items = content.get("line_items", [])

# #     if line_items:
# #         for item in line_items:
# #             hours = _safe_float(item.get("hours"))
# #             unit_price = _safe_float(item.get("unit_price"))
# #             amount = hours * unit_price
# #             item["amount"] = amount
# #             item["amount_display"] = f"₹{amount:,.0f}"
# #             item["unit_price_display"] = f"₹{unit_price:,.0f}"

# #         subtotal = sum(
# #             _safe_float(item.get("hours")) * _safe_float(item.get("unit_price"))
# #             for item in line_items
# #         )
# #     else:
# #         logger.warning("No line_items provided — falling back to manual subtotal field")
# #         subtotal = _safe_float(content.get("subtotal"))

# #     gst_percent = _safe_float(content.get("gst_percent"), default=18)
# #     gst_amount = subtotal * (gst_percent / 100)
# #     total = subtotal + gst_amount

# #     content["subtotal"] = subtotal
# #     content["gst_percent"] = gst_percent
# #     content["gst_amount"] = gst_amount
# #     content["total"] = total

# #     content["subtotal_display"] = f"₹{subtotal:,.0f}"
# #     content["gst_amount_display"] = f"₹{gst_amount:,.0f}"
# #     content["total_display"] = f"₹{total:,.0f}"

# #     logger.info(f"Totals calculated — subtotal={subtotal}, gst={gst_amount}, total={total}")
# #     return content


# def _calculate_receipt_totals(content: dict) -> dict:
#     """
#     Auto-calculates subtotal, GST, and total for receipt_template.

#     Unlike invoice/client_doc, receipt line items may have hours/unit_price
#     as '-' (non-numeric), and if no line_items exist at all, falls back to
#     the amount_received field as the base amount — same logic used on the
#     frontend (ReceiptFields component).
#     """
#     line_items = content.get("line_items", [])

#     base_amount = 0.0

#     if line_items:
#         for item in line_items:
#             hours = _safe_float(item.get("hours"))
#             unit_price = _safe_float(item.get("unit_price"))

#             # Only recompute amount from hours*unit_price if both are
#             # actually numeric (not '-'); otherwise trust whatever
#             # amount was already set (manual entry / frontend edit).
#             existing_amount = _safe_float(item.get("amount"))
#             if hours > 0 and unit_price > 0:
#                 amount = hours * unit_price
#             else:
#                 amount = existing_amount

#             item["amount"] = amount

#         base_amount = sum(_safe_float(item.get("amount")) for item in line_items)

#     # Fallback: no usable line item amounts, use Amount Received field
#     if base_amount <= 0:
#         base_amount = _safe_float(content.get("amount_received"))

#     gst_percent = _safe_float(content.get("gst_percent"), default=0)  # receipts default to NO GST
#     gst_amount = base_amount * (gst_percent / 100)
#     total = base_amount + gst_amount

#     content["subtotal"] = base_amount
#     content["gst_percent"] = gst_percent
#     content["gst_amount"] = gst_amount
#     content["total"] = total

#     content["subtotal_display"] = f"₹{base_amount:,.0f}"
#     content["gst_amount_display"] = f"₹{gst_amount:,.0f}"
#     content["total_display"] = f"₹{total:,.0f}"

#     logger.info(
#         f"Receipt totals calculated — subtotal={base_amount}, "
#         f"gst={gst_amount}, total={total}"
#     )
#     return content


# # Doc types that need pricing calculations
# _PRICING_DOC_TYPES = {"client_doc", "invoice"}
# _RECEIPT_DOC_TYPES = {"receipt_template"}


# def fill_template(template_type: str, content: dict) -> str:
#     """
#     Loads templates/{template_type}/layout.html and fills all
#     {{ placeholders }} with AI-generated content via Jinja2.

#     For client_doc and invoice: auto-calculates totals from line_items
#     (hours * unit_price) before rendering.

#     For receipt_template: auto-calculates totals from line_items OR
#     falls back to amount_received if no line items exist.

#     Args:
#         template_type: "receipt_template" | "client_doc" | "compliance" | "invoice" | "timeline"
#         content: structured JSON from llm_service.generate_document_content()

#     Returns:
#         Fully rendered HTML string — saved to DB, served at /doc/:id
#     """
#     if template_type in _PRICING_DOC_TYPES:
#         content = _calculate_totals(content)
#     elif template_type in _RECEIPT_DOC_TYPES:
#         content = _calculate_receipt_totals(content)

#     template_dir = os.path.abspath(
#         os.path.join("./templates", template_type)
#     )

#     if not os.path.exists(template_dir):
#         raise FileNotFoundError(
#             f"Template folder not found: {template_dir}\n"
#             f"Make sure templates/{template_type}/layout.html exists."
#         )

#     env = Environment(
#         loader=FileSystemLoader(template_dir),
#         autoescape=select_autoescape(["html"]),
#         trim_blocks=True,
#         lstrip_blocks=True,
#     )

#     content["assets_path"] = os.path.abspath("./assets")

#     try:
#         template = env.get_template("layout.html")
#         return template.render(**content)
#     except Exception as e:
#         raise ValueError(f"Template rendering failed for '{template_type}': {e}")4

from jinja2 import Environment, FileSystemLoader, select_autoescape
import os
import logging

logger = logging.getLogger(__name__)


def _safe_float(val, default=0.0):
    """Parses '₹1,500', '-', '', None, numbers, etc. safely into a float."""
    if val is None:
        return default
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).replace("₹", "").replace(",", "").strip()
    if not s or s == "-":
        return default
    try:
        return float(s)
    except ValueError:
        return default


def _calculate_totals(content: dict) -> dict:
    """
    Auto-calculates amount per line item, subtotal, GST, and total.
    Used for client_doc and invoice — assumes numeric-ish hours/unit_price
    (parsed safely via _safe_float).

    If no line_items exist, falls back to a manually provided "subtotal"
    field in content.
    """
    line_items = content.get("line_items", [])

    if line_items:
        for item in line_items:
            hours = _safe_float(item.get("hours"))
            unit_price = _safe_float(item.get("unit_price"))
            amount = hours * unit_price
            item["amount"] = amount
            item["amount_display"] = f"₹{amount:,.0f}"
            item["unit_price_display"] = f"₹{unit_price:,.0f}"

        subtotal = sum(
            _safe_float(item.get("hours")) * _safe_float(item.get("unit_price"))
            for item in line_items
        )
    else:
        logger.warning("No line_items provided — falling back to manual subtotal field")
        subtotal = _safe_float(content.get("subtotal"))

    gst_percent = _safe_float(content.get("gst_percent"), default=18)
    gst_amount = subtotal * (gst_percent / 100)
    total = subtotal + gst_amount

    content["subtotal"] = subtotal
    content["gst_percent"] = gst_percent
    content["gst_amount"] = gst_amount
    content["total"] = total

    content["subtotal_display"] = f"₹{subtotal:,.0f}"
    content["gst_amount_display"] = f"₹{gst_amount:,.0f}"
    content["total_display"] = f"₹{total:,.0f}"

    logger.info(f"Totals calculated — subtotal={subtotal}, gst={gst_amount}, total={total}")
    return content


def _calculate_receipt_totals(content: dict) -> dict:
    """
    Auto-calculates subtotal, GST, and total for receipt_template.

    Unlike invoice/client_doc, receipt line items may have hours/unit_price
    as '-' (non-numeric), and if no line_items exist at all, falls back to
    the amount_received field, and finally to a manually typed subtotal.
    """
    line_items = content.get("line_items", [])

    base_amount = 0.0

    if line_items:
        for item in line_items:
            hours = _safe_float(item.get("hours"))
            unit_price = _safe_float(item.get("unit_price"))

            existing_amount = _safe_float(item.get("amount"))
            if hours > 0 and unit_price > 0:
                amount = hours * unit_price
            else:
                amount = existing_amount

            item["amount"] = amount

        base_amount = sum(_safe_float(item.get("amount")) for item in line_items)

    # Fallback 1: no usable line item amounts, try Amount Received field
    if base_amount <= 0:
        base_amount = _safe_float(content.get("amount_received"))

    # Fallback 2: still zero — trust whatever the user manually typed into Subtotal
    if base_amount <= 0:
        base_amount = _safe_float(content.get("subtotal"))

    gst_percent = _safe_float(content.get("gst_percent"), default=0)  # receipts default to NO GST
    gst_amount = base_amount * (gst_percent / 100)
    total = base_amount + gst_amount

    content["subtotal"] = base_amount
    content["gst_percent"] = gst_percent
    content["gst_amount"] = gst_amount
    content["total"] = total

    content["subtotal_display"] = f"₹{base_amount:,.0f}"
    content["gst_amount_display"] = f"₹{gst_amount:,.0f}"
    content["total_display"] = f"₹{total:,.0f}"

    logger.info(
        f"Receipt totals calculated — subtotal={base_amount}, "
        f"gst={gst_amount}, total={total}"
    )
    return content


# Doc types that need pricing calculations
_PRICING_DOC_TYPES = {"client_doc", "invoice"}
_RECEIPT_DOC_TYPES = {"receipt_template"}


def fill_template(template_type: str, content: dict) -> str:
    """
    Loads templates/{template_type}/layout.html and fills all
    {{ placeholders }} with AI-generated content via Jinja2.

    For client_doc and invoice: auto-calculates totals from line_items
    (hours * unit_price) before rendering.

    For receipt_template: auto-calculates totals from line_items OR
    falls back to amount_received / manual subtotal if no line items exist.

    Args:
        template_type: "receipt_template" | "client_doc" | "compliance" | "invoice" | "timeline"
        content: structured JSON from llm_service.generate_document_content()

    Returns:
        Fully rendered HTML string — saved to DB, served at /doc/:id
    """
    if template_type in _PRICING_DOC_TYPES:
        content = _calculate_totals(content)
    elif template_type in _RECEIPT_DOC_TYPES:
        content = _calculate_receipt_totals(content)

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