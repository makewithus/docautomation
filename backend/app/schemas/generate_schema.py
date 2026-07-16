from pydantic import BaseModel
from typing import Optional

class SmartGenerateRequest(BaseModel):
    """
    User provides only the raw text (extracted from their PDF).
    Everything else - doc type, content structuring - is automatic.
    """
    raw_input: str
    file_path: Optional[str]=None #path to uploaded file

    class Config:
        json_schema_exta = {
            "example":{
                "raw_input":"Project:Ritual App. Requirements: User login, dosha quiz, AI skin scan product recommendations, subscription checkout. Timeline: 12 weeks. Budget: 2.5L"
            }
        }

class GenerateResponse(BaseModel):
    success: bool
    doc_id: str
    edit_url:str
    template_type: str
    project_name: str
    content: dict

class UpdateDocumentRequest(BaseModel):
    content: dict
class UploadResponse(BaseModel):
    filename: str
    extracted_text:str
    detected_type: Optional[str]=None
    char_count:int