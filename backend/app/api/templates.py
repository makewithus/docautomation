from fastapi import APIRouter

router = APIRouter()


@router.get("/templates")
def get_templates():
    return {
        "templates": [
            "developer_doc",
            "client_doc",
            "invoice",
            "compliance_doc",
        ]
    }