from sqlalchemy import Column, String, DateTime, Text, JSON
from sqlalchemy.sql import func
from app.config.database import Base
import uuid

class Document(Base):
    __tablename__ = "documents"

    id            = Column(String, primary_key=True, default=lambda: str(uuid.uuid4())[:8])
    project_name  = Column(String,  nullable=False)
    template_type = Column(String,  nullable=False)  # developer_doc | client_doc | compliance | invoice
    raw_input     = Column(Text)                      # extracted text from the uploaded PDF
    content       = Column(JSON)                      # structured JSON from Claude
    html_content  = Column(Text)                      # filled HTML — served at /doc/:id
    source_file   = Column(String)                    # original uploaded filename
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), onupdate=func.now())
