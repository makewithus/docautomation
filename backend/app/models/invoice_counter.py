from sqlalchemy import Column, Integer
from app.config.database import Base


class InvoiceCounter(Base):
    """
    Single-row table that tracks the last issued invoice number.
    Kept completely separate from Document.content['invoice_number']
    so that a user editing that field can NEVER desync or reset
    the auto-numbering sequence.
    """
    __tablename__ = "invoice_counter"

    id = Column(Integer, primary_key=True, default=1)
    current_number = Column(Integer, nullable=False, default=0)
