from weasyprint import HTML, CSS
import os
import datetime


def generate_pdf(html_content: str, project_name: str, template_type: str) -> str:
    """
    Converts filled HTML to a branded A4 PDF using WeasyPrint.

    Args:
        html_content:  fully filled HTML string from template_engine
        project_name:  used for the output filename
        template_type: used to load matching styles.css if exists

    Returns:
        filename of the generated PDF saved in ./output/
    """
    date_str  = datetime.datetime.now().strftime("%Y-%m-%d")
    safe_name = project_name.replace(" ", "_").replace("/", "-")
    filename  = f"{safe_name}_{template_type.upper()}_{date_str}.pdf"

    output_dir  = "./output"
    output_path = os.path.join(output_dir, filename)
    os.makedirs(output_dir, exist_ok=True)

    # Load template-specific CSS if exists
    css_path    = os.path.join("./templates", template_type, "styles.css")
    stylesheets = [CSS(filename=css_path)] if os.path.exists(css_path) else []

    HTML(string=html_content, base_url=".").write_pdf(
        output_path,
        stylesheets=stylesheets
    )

    return filename
 