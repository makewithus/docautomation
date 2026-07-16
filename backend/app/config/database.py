# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base
# from app.config.settings import settings
# #sqlite for dev, postgresql for productin=on

# engine=create_engine(
#     settings.DATABASE_URL,
#     connect_args = {"check_same_thread":False}
#     if "sqlite" in settings.DATABASE_URL else {}

# )
# SessionLocal = sessionmaker(autocommit = False, autoflush=False, bind=engine)
# Base = declarative_base()

# def get_db():
#     db=SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# def create_tables():
#     from app.models.document import Document
#     Base.metadata.create_all(bind=engine)
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config.settings import settings
# sqlite for dev, postgresql for production

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
    if "sqlite" in settings.DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    # IMPORTANT: every model must be imported here before create_all(),
    # otherwise SQLAlchemy doesn't know the table exists and silently
    # skips creating it — this was the reason invoice_counter never
    # got created, causing invoice number generation to fail.
    from app.models.document import Document
    from app.models.invoice_counter import InvoiceCounter

    Base.metadata.create_all(bind=engine)
