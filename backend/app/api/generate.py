# from fastapi import APIRouter, HTTPException, Depends
# from sqlalchemy.orm import Session
# from app.schemas.generate_schema import SmartGenerateRequest, GenerateResponse
# from app.ml.llm_service import llm_service
# from app.ml.classifier       import classify_document
# from app.ml.ner_extractor    import extract_entities
# from app.ml.validator        import validate_fields
# from app.engine.template_engine import fill_template
# from app.models.document     import Document
# from app.config.database     import get_db
# import uuid

# router = APIRouter()


# @router.post("/generate", response_model=GenerateResponse)
# async def smart_generate(
#     request: SmartGenerateRequest,
#     db: Session = Depends(get_db)
# ):
#     """
#     Full automatic pipeline — no forms, no manual field entry.

#     Input:  raw text extracted from the user's uploaded PDF
#     Output: unique editable link at /doc/{id}

#     Steps:
#     1. Classifier auto-detects doc type from the text
#     2. NER extracts any structured entities (names, dates, amounts)
#     3. Claude API generates all content — structured JSON
#     4. Validator checks required fields
#     5. Jinja2 fills the HTML template
#     6. Saved to DB → editable link returned
#     """
#     try:
#         raw_text = request.raw_input.strip()

#         if not raw_text:
#             raise HTTPException(status_code=400, detail="No text provided.")

#         if len(raw_text) < 30:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Input too short. Please provide more content from your PDF."
#             )

#         # ── Step 1: Auto-detect document type ─────────────────────────────────
#         template_type = classify_document(raw_text)

#         # ── Step 2: NER — extract entities to enrich Claude output ────────────
#         entities = extract_entities(raw_text)

#         # ── Step 3: Claude generates full structured content ──────────────────
#         content = llm_service.generate_document_content(
#     raw_text=raw_text,
#     doc_type=template_type,
#     entities=entities
# )

#         # Enrich with NER data if Claude missed client/org names
#         if not content.get("client_name") and entities.get("orgs"):
#             content["client_name"] = entities["orgs"][0]
#         if not content.get("recipient_company") and entities.get("orgs"):
#             content["recipient_company"] = entities["orgs"][0]

#         # ── Step 4: Validate required fields ──────────────────────────────────
#         validate_fields(content, template_type)

#         # ── Step 5: Fill the HTML template ────────────────────────────────────
#         filled_html = fill_template(template_type, content)

#         # ── Step 6: Save to DB with unique ID ─────────────────────────────────
#         doc_id       = str(uuid.uuid4())[:8]
#         project_name = (
#             content.get("project_name")
#             or content.get("client_name")
#             or content.get("letter_type")
#             or "Untitled"
#         )

#         doc = Document(
#             id=doc_id,
#             project_name=project_name,
#             template_type=template_type,
#             raw_input=raw_text,
#             content=content,
#             html_content=filled_html,
#             source_file=request.file_path or "",
#         )
#         db.add(doc)
#         db.commit()

#         return GenerateResponse(
#             success=True,
#             doc_id=doc_id,
#             edit_url=f"/doc/{doc_id}",
#             template_type=template_type,
#             project_name=project_name,
#             content=content,
#         )

#     except HTTPException:
#         raise
#     except ValueError as e:
#         raise HTTPException(status_code=422, detail=str(e))
#     except FileNotFoundError as e:
#         raise HTTPException(status_code=404, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


# @router.get("/templates")
# def list_template_types():
#     """Lists all available document types with their labels."""
#     return {
#         "types": [
#             {
#                 "id":          "developer_doc",
#                 "label":       "Developer Document",
#                 "description": "Requirements for the dev team — no tech stack"
#             },
#             {
#                 "id":          "client_doc",
#                 "label":       "Client Document",
#                 "description": "Timeline, quote and invoice for the client"
#             },
#             {
#                 "id":          "compliance",
#                 "label":       "Compliance / Letter",
#                 "description": "Official letters, requests, employee communications"
#             },
#             {
#                 "id":          "invoice",
#                 "label":       "Invoice",
#                 "description": "Standalone single invoice"
#             },
#         ]
#     }

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
