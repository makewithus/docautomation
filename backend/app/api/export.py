from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.document import Document

router = APIRouter()


# @router.get("/documents/{doc_id}/pdf")
@router.get("/documents/{doc_id}/pdf") 
def download_pdf(doc_id: str, db: Session = Depends(get_db)):
    """
    Convert stored HTML → PDF using WeasyPrint.
    Returns a direct file download — no print dialog.
    """

    # 1. Fetch document
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    html = getattr(doc, "rendered_html", None) or getattr(doc, "html_content", None)
    if not html:
        raise HTTPException(status_code=400, detail="Document HTML not generated yet")

    # 2. HTML → PDF via WeasyPrint
    try:
        from weasyprint import HTML
        pdf_bytes = HTML(
            string=html,
            base_url="http://localhost:8000"  # resolves /static/ paths (fonts, logo)
        ).write_pdf()

    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="WeasyPrint not installed. Run: pip install weasyprint"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

    # 3. Return as downloadable file
    safe_name = (
        getattr(doc, "project_name", None) or doc_id
    ).replace(" ", "_").replace("/", "-")

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{safe_name}.pdf"',
            "Content-Length": str(len(pdf_bytes)),
        }
    )
