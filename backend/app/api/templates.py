from fastapi import APIRouter

router = APIRouter()


@router.get("/templates")
def get_templates():
    return {
        "templates": [
            "receipt_template",
            "client_doc",
            "invoice",
            "compliance_doc",
            "project_timeline"
        ]
    }