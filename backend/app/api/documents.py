from fastapi import APIRouter, HTTPException, Depends

from sqlalchemy.orm import Session
from app.models.document import Document
from app.schemas.generate_schema import UpdateDocumentRequest
from app.engine.template_engine import fill_template
from app.config.database import get_db
from fastapi.responses import HTMLResponse, Response
# from app.engine.pdf_generator import generate_pdf

router=APIRouter()

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
