from jinja2 import Environment, FileSystemLoader, select_autoescape
import os

def fill_template(template_type: str, content:dict)->str:
    """
    Loads templates/{template_type}layout.html and fills all
    {{placeholders}} with Claude-generated content via Jinja2.

    Args:
    template_type:"developer_doc"| "client_doc"|"comp"|"invoice"
    content: structured-JSON from llm_service.generate_content()

    Returns:
    Fully rendered HTML string - saved to DB, served at /doc/:id
    """
    template_dir = os.path.abspath(
        os.path.join("./templates",template_type)
    )

    if not os.path.exists(template_dir):
        raise FileNotFoundError(
            f"Template folder not found: {template_dir}\n"
            f"Make sure templates/{template_type}/layout.html exists."
        )
    
    env=Environment(
        loader=FileSystemLoader(template_dir),
        autoescape = select_autoescape(["html"]),
        trim_blocks=True,
        lstrip_blocks=True,
    )

    content["assets_path"]=os.path.abspath("./assets")

    try:
        template=env.get_template("layout.html")
        return template.render(**content)
    except Exception as e:
        raise ValueError(f"Template rendering failed for '{template_type}:{e}")