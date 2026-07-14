

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.generate_schema import SmartGenerateRequest, GenerateResponse
from app.ml.llm_service import llm_service
from app.ml.classifier       import classify_document_ai
from app.ml.ner_extractor    import extract_entities
from app.ml.validator        import validate_fields
from app.engine.template_engine import fill_template
from app.models.document     import Document
from app.config.database     import get_db
from pydantic import BaseModel
import uuid
import traceback

router = APIRouter()

class RefillRequest(BaseModel):
    prompt: str

@router.post("/doc/{doc_id}/refill")
def refill_document(doc_id: str, body: RefillRequest, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    try:
        new_content = llm_service.generate_document_content(
            raw_text=body.prompt,
            doc_type=doc.template_type,
        )

        doc.content = new_content

        # HTML preview bhi update karo
        doc.html_content = fill_template(doc.template_type, new_content)

        db.commit()
        db.refresh(doc)

        return {
            "success": True,
            "content": new_content,
        }
    except Exception as e:
    
        print(traceback.format_exc())
        raise
    # except Exception as e:
    #     db.rollback()
    #     raise HTTPException(
    #         status_code=503,
    #         detail=f"AI generation failed: {str(e)}"
    #     )

# @router.post("/doc/{doc_id}/refill")
# def refill_document(doc_id: str, body: RefillRequest, db: Session = Depends(get_db)):
#     """
#     User ke prompt se document ka content regenerate karo.
#     Naya document nahi banta — sirf content update hota hai.
#     """
#     doc = db.query(Document).filter(Document.id == doc_id).first()
#     if not doc:
#         raise HTTPException(status_code=404, detail="Document not found")

#     # LLM se naya content generate karo
#     # from app.ml.llm_service import llm_service
#     new_content = llm_service.generate_document_content(
#         raw_text=body.prompt,
#         doc_type=doc.template_type,
#     )

#     # DB mein save karo
#     doc.content = new_content
#     db.commit()

#     return { "success": True, "content": new_content }

@router.post("/generate", response_model=GenerateResponse)
async def smart_generate(
    request: SmartGenerateRequest,
    db: Session = Depends(get_db)
):
    """
    Full automatic pipeline:
    1. AI classifies doc type via OpenRouter
    2. NER extracts entities
    3. AI generates structured content
    4. Jinja2 fills HTML template
    5. Saves to DB → returns editable link
    """
    try:
        raw_text = request.raw_input.strip()

        if not raw_text:
            raise HTTPException(status_code=400, detail="No text provided.")
        if len(raw_text) < 30:
            raise HTTPException(status_code=400, detail="Input too short. Provide more content.")

        # ── Step 1: AI classifies doc type ────────────────────────────
        template_type = await classify_document_ai(raw_text)

        # ── Step 2: NER extracts entities ─────────────────────────────
        entities = extract_entities(raw_text)

        # ── Step 3: AI generates structured content ───────────────────
        content = llm_service.generate_document_content(
    raw_text=raw_text,
    doc_type=template_type,
    entities=entities
)

        # Enrich with NER if AI missed names
        if not content.get("client_name") and entities.get("orgs"):
            content["client_name"] = entities["orgs"][0]

        # ── Step 4: Validate fields ───────────────────────────────────
        validate_fields(content, template_type)

        # ── Step 5: Fill HTML template ────────────────────────────────
        filled_html = fill_template(template_type, content)

        # ── Step 6: Save to DB ────────────────────────────────────────
        doc_id = str(uuid.uuid4())[:8]
        project_name = (
            content.get("project_name")
            or content.get("client_name")
            or content.get("letter_type")
            or "Untitled"
        )

        doc = Document(
            id=doc_id,
            project_name=project_name,
            template_type=template_type,
            raw_input=raw_text,
            content=content,
            html_content=filled_html,
            source_file=request.file_path or "",
        )
        db.add(doc)
        db.commit()

        return GenerateResponse(
            success=True,
            doc_id=doc_id,
            edit_url=f"/doc/{doc_id}",
            template_type=template_type,
            project_name=project_name,
            content=content,
        )

    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@router.get("/templates")
def list_template_types():
    return {
        "types": [
            {"id": "developer_doc", "label": "Developer Document",   "description": "Features & brief for the dev team"},
            {"id": "client_doc",    "label": "Client Proposal",      "description": "Timeline, quote and letter for client"},
            {"id": "compliance",    "label": "Compliance / Letter",  "description": "Agreements, letters, employee communications"},
            {"id": "invoice",       "label": "Invoice",               "description": "Standalone single invoice"},
            {"id": "timeline",      "label": "Project Timeline",      "description": "Phase breakdown with hours and schedule"},
        ]
    }
# from pydantic import BaseModel

SUPPORTED_LANGUAGES = {
    "hindi":     "Hindi (हिंदी)",
    "malayalam": "Malayalam (മലയാളം)",
    "tamil":     "Tamil (தமிழ்)",
    "telugu":    "Telugu (తెలుగు)",
    "kannada":   "Kannada (ಕನ್ನಡ)",
    "bengali":   "Bengali (বাংলা)",
    "marathi":   "Marathi (मराठी)",
}

class TranslateRequest(BaseModel):
    language: str   # e.g. "hindi"

@router.post("/doc/{doc_id}/translate")
def translate_document(
    doc_id: str,
    body: TranslateRequest,
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    lang_label = SUPPORTED_LANGUAGES.get(body.language)
    if not lang_label:
        raise HTTPException(status_code=400, detail=f"Unsupported language: {body.language}")

    from app.ml.llm_service import llm_service
    import json

    prompt = f"""
Translate the following JSON document content into {lang_label}.

Rules:
1. Translate ALL text values — descriptions, paragraphs, titles, labels.
2. Keep ALL keys in English — do NOT translate JSON keys.
3. Keep numbers, dates, amounts (₹), and phone numbers exactly as-is.
4. Keep company names (makewithus, MakeWithUs) in English.
5. Return ONLY valid JSON. No markdown. No explanation.

Content to translate:
{json.dumps(doc.content, ensure_ascii=False, indent=2)}
"""

    translated_content = llm_service.generate_raw(prompt)

    # Update DB with translated content
    doc.content = translated_content
    db.commit()

    return { "success": True, "content": translated_content, "language": lang_label }