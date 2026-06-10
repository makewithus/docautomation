from fastapi import APIRouter, HTTPException, Depends

from sqlalchemy.orm import Session
from app.models.document import Document
from app.schemas.generate_schema import UpdateDocumentRequest
# from app.engine.template_engine import fill_template
from app.engine.template_engine import fill_template
from app.config.database import get_db
from fastapi.responses import HTMLResponse, Response
from pydantic import BaseModel
import uuid
# from app.engine.pdf_generator import generate_pdf


router=APIRouter()
class CreateDocRequest(BaseModel):
    template_type: str 

# Default placeholder content per template type
DEFAULT_CONTENT = {
    "invoice": {
        "invoice_number": "INV-2026-001",
        "project_name": "",
        "client_name": "",
        "client_phone": "",
        "upi_phone": "",
        "upi_id": "",
        "date": "",
        "due_date": "",
        "payment_status": "UNPAID",
        "line_items": [
            {"description": "", "hours": "", "unit_price": "", "amount": ""}
        ],
        "subtotal": "0",
        "gst_percent": 0,
        "gst_amount": "0",
        "total": "0",
        "bank_name": "SBI / UPI",
    },
    "developer_doc": {
        "project_name": "",
        "project_type": "APP",
        "tagline": "",
        "overview": "",
        "features": [
            {"title": "", "points": [{"text": "", "sub": []}]}
        ],
        "uvp": [
            {"keyword": "", "description": ""}
        ],
    },
    "client_doc": {
        "client_name": "",
        "client_organisation": "",
        "client_place": "",
        "date": "",
        "sender_name": "Mohammed Sherhan",
        "sender_designation": "Co-Founder, MakeWithUs",
        "body_paragraphs": [""],
        "quotation_number": "QT-2026-001",
        "project_name": "",
        "line_items": [
            {"description": "", "hours": "", "unit_price": "", "amount": ""}
        ],
        "subtotal": "0",
        "gst_amount": "0",
        "total": "0",
    },
    "compliance": {
        "client_name": "",
        "purpose_paragraphs": ["", ""],
        "provider_obligations": ["", "", ""],
        "client_obligations": ["", ""],
        "payment_commitment_intro": "The Client agrees that all project payments shall be completed either:",
        "payment_commitment_points": ["In full upon delivery, OR", "Within a maximum period of 7 days from the date of delivery/invoice"],
        "payment_commitment_note": "unless otherwise agreed in writing before project initiation.",
        "phase_payment_intro": "Phase-wise or split payments are acceptable under this Agreement only if:",
        "phase_payment_points": ["", "", ""],
        "payment_phases": [
            {"name": "ADVANCE PAYMENT", "timeline": "BEFORE PROJECT START", "amount": "XX%"},
            {"name": "MIDWAY PAYMENT",  "timeline": "DURING DEVELOPMENT",   "amount": "XX%"},
            {"name": "FINAL PAYMENT",   "timeline": "WITHIN 7 DAYS OF DELIVERY", "amount": "XX%"}
        ],
        "delayed_payment_intro": "If payments are delayed beyond the agreed timeline:",
        "delayed_payment_points": ["", "", ""],
        "delayed_payment_note": "This clause is included solely to maintain operational efficiency.",
        "professional_understanding_intro": "Both parties acknowledge that:",
        "professional_understanding_points": ["", "", ""],
        "confidentiality_text": "Any business information, project details, pricing structures, software systems, client data, or operational processes shared between both parties shall remain confidential unless otherwise authorized.",
        "modifications_text": "Any modifications to this Agreement must be discussed and mutually agreed upon by both parties.",
        "acceptance_text": "By signing below, both parties confirm that they understand and agree to the terms mentioned in this Agreement.",
    },
    "timeline": {
        "project_name": "",
        "project_description": "",
        "client_name": "",
        "page_number": "01",
        "timeline_items": [
            {"description": "INFRA SETUP & VERSION CONTROL",    "timeline": "", "hours": ""},
            {"description": "PROJECT TECH DESIGN & PLANNING",   "timeline": "", "hours": ""},
            {"description": "PROJECT FRONTEND DESIGNING",       "timeline": "", "hours": ""},
            {"description": "PROJECT FRONTEND DEVELOPMENT",     "timeline": "", "hours": ""},
            {"description": "PROJECT BACKEND PLANNING",         "timeline": "", "hours": ""},
            {"description": "PROJECT BACKEND DEVELOPMENT",      "timeline": "", "hours": ""},
            {"description": "ITERATIONS AND BUG FIX",           "timeline": "", "hours": ""},
            {"description": "PUSHING TO DOMAIN",                "timeline": "", "hours": ""},
            {"description": "FEATURE ADDITION & BETTERMENT",    "timeline": "", "hours": ""},
            {"description": "FINISHING & DEPLOYMENT",           "timeline": "", "hours": ""},
            {"description": "HANDOVER/TRANSFER",                "timeline": "", "hours": ""},
        ],
        "total_time": "XX DAYS",
        "expected_dev_time": "XX DAYS",
        "expected_closure": "XX DAYS",
        "closure_date": "DD MM YYYY",
    },
}


@router.post("/doc/create")
def create_empty_document(body: CreateDocRequest, db: Session = Depends(get_db)):
    """
    Selected template type ka empty document banao with placeholders.
    Returns doc_id — frontend seedha Editor pe navigate karta hai.
    """
    # from app.engine.template_engine import render_template
    # import uuid

    template_type = body.template_type
    if template_type not in DEFAULT_CONTENT:
        raise HTTPException(status_code=400, detail=f"Unknown template type: {template_type}")

    content      = DEFAULT_CONTENT[template_type]
    html_content = fill_template(template_type, content)
    doc_id       = str(uuid.uuid4())

    doc = Document(
        id            = doc_id,
        template_type = template_type,
        project_name  = "New Document",
        content       = content,
        html_content  = html_content,
    )
    db.add(doc)
    db.commit()

    return { "doc_id": doc_id, "edit_url": f"/doc/{doc_id}" }
@router.get("/doc/{doc_id}")
def get_document(doc_id:str,db: Session = Depends(get_db)):
    """
    Returns the full document data for the frontend editor.
    Called when user opens their editable link.
    """


    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found.")
    return {
        "id": doc.id,
        "project_name":doc.project_name,
        "template_type":doc.template_type,
        "content":doc.content,
        "html_content": doc.html_content,
        "source_file":doc.source_file,
        "created_At":str(doc.created_at),
    }
@router.get("/doc/{doc_id}/preview",response_class=HTMLResponse)
def preview_document(doc_id: str,db:Session = Depends(get_db)):
    """
    Returns the raw HTML of the document.
    Uses as the iframe src in the frontend editor for live preview.
    """

    doc=db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404,detail="Document not found.")
    return HTMLResponse(content=doc.html_content)

@router.get("/doc/{doc_id}/download")
def download_pdf(doc_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    from xhtml2pdf import pisa
    from bs4 import BeautifulSoup
    import io, re

    html = doc.html_content

    # Poori style block hatao
    soup = BeautifulSoup(html, 'html.parser')
    for tag in soup.find_all('style'):
        tag.decompose()
    html = str(soup)

    pdf_buffer = io.BytesIO()
    pisa.CreatePDF(src=html, dest=pdf_buffer, encoding='utf-8')
    pdf_bytes = pdf_buffer.getvalue()

    safe_name = (doc.project_name or doc_id).replace(" ", "_")

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{safe_name}.pdf"'
        }
    )


@router.put("/doc/{doc_id}")
def update_document(
    doc_id:str,
    body: UpdateDocumentRequest,
    db: Session= Depends(get_db)
):
    """
    User edited a field in the frontend editor.
    Saves the updated content JSON and regenerates the HTML.
    """
    doc= db.query(Document).filter(Document.id==doc_id).first()
    if not doc:
        raise HTTPException(status_code=500,detail=f"Update failed: {str(e)}")
    try:
        doc.content= body.content
        doc.html_content=fill_template(doc.template_type,body.content)
        db.commit()

    except Exception as e:
        raise HTTPException(status_code=500, detail= f"Update failed: {str(e)}")
    @router.get("/documents")
    def list_documents(db:Session= Depends(get_db)):
        """
        Returns all generate documents, newest first.
        """
        docs= db.query(Document).order_by(Document.created_at.desc()).all()
        return {
        "documents": [
            {
                "id":            d.id,
                "project_name":  d.project_name,
                "template_type": d.template_type,
                "edit_url":      f"/doc/{d.id}",
                "source_file":   d.source_file,
                "created_at":    str(d.created_at),
            }
            for d in docs
        ]
    }



@router.delete("/doc/{doc_id}")
def delete_document(doc_id: str, db: Session = Depends(get_db)):
    """Permanently deletes a document."""
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    db.delete(doc)
    db.commit()
    return {"success": True, "deleted": doc_id}
