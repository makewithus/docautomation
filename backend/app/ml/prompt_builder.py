import os
import json
def build_prompt(template_type: str)->str:
    """
    Loads the system prompt from templates/{type}/prompt.txt.
    Falls back to a generic prompt if file not found.
    """

    prompt_path = os.path.join("./templates",template_type,"prompt.txt")
    if os.path.exists(prompt_path):
        with open(prompt_path,"r") as f:
            return f.read().strip()
        
    return (
        "You are a professional document writer. "
        "Given raw notes, return structured JSON content for the document."
        "Return pure JSON only, no markdown, no explanation. "
    )

def build_user_message(raw_input: str,schema:dict)->str:
    """
    Build the user message sent to Claude.
    Includes the schema field names so Claude knows exactly what to return.
    """

    field_names = [f["name"] for f in schema.get("fields",[])]
    return (
        f"Raw notes:\n{raw_input}\n\n"
        f"Return a JSON object with these fields: {field_names}\n"
        f"Fill every field based on the notes above."
    )
def load_schema(template_type:str)->dict:
    """Loads schema.jon for a given template type."""
    schema_path=os.path.join("./templates",template_type,"schema.json")

    if not os.path.exists(schema_path):
        return {}
    
    with open(schema_path,"r") as f:
        return json.load(f)