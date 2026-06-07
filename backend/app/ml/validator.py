from fastapi import HTTPException

REQUIRED_FIELDS = {
    "developer_doc": [
        "project_name",
        "summary",
        "objectives",
        "features"
    ],

    "client_doc": [
    "client_name",
    "date",
    "body_paragraphs",
    "project_name",
    "line_items",
    "subtotal",
    "total"
],

    "compliance_doc": [
        "subject",
        "body_paragraphs",
        "signatory_name"
    ],

    "invoice": [
        "client_name",
        "line_items",
        "total"
    ],

    "timeline": [
        "project_name",
        "timeline_items",
        "total_time"
    ]
}
def validate_fields (content: dict,template_type:str)->None:
    """
    Checks all required fields are present and non-empty
    before injected into the HTML template.
    Raises HTTP 422 if anything is missing.
    """
    required = REQUIRED_FIELDS.get(template_type,[])
    missing=[]
    for field in required:
        val = content.get(field)
        if val is None:
            missing.append(field)
        elif isinstance(val,str) and not val.strip():
            missing.append(field)

        elif isinstance(val,list) and len(val)==0:
            missing.append(field)
        elif isinstance(val,dict) and len(val)==0:
            missing.append(field)

    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"AI response missing required fields: {missing}.Try again."
        )