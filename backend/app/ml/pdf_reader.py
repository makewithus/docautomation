import fitz
import os

def extract_text_from_pdf (pdf_path:str)->str:
    """
    Reads every page of a PDF and extracts all text.
    Uses PyMuPDF(fitz) - works on text-based and most scanned PDFs.

    Args:
    pdf_path: path to the uploaded PDF file

    Returns:
    Full extracted text as a single string
    """

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")
    
    doc= fitz.open(pdf_path)
    text=""

    for page_num, page in enumerate(doc,start=1):
        page_text=page.get_text("text")
        if page_text.strip():
            text+=f"\n--- Page {page_num} ---\n{page_text}"
    doc.close()
    cleaned=text.strip()

    if not cleaned:
        raise ValueError(
            "No text extracted from PDF. "
            "The PDF may be image-only - try uploading a JPG/PNG instead."
        )
    return cleaned

def get_pdf_metadata(pdf_path:str)->dict:
    """
    Returns page count and basic PDF metadata.
    """
    doc= fitz.open(pdf_path)
    meta = {
        "page_count": doc.page_count,
        "title":doc.metadata.get("title",""),
        "author":doc.metadata.get("author",""),
    }
    doc.close()
    return meta