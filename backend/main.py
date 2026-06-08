# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# # import routes
# from app.api.generate import router as generate_router
# from app.api.upload import router as upload_router
# from app.api.documents import router as documents_router
# from app.api.templates import router as templates_router

# app = FastAPI(
#     title="Document Automation API",
#     version="1.0.0"
# )

# # CORS for React frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Root test route
# @app.get("/")
# def root():
#     return {"message": "Backend running successfully"}

# # Register routes
# app.include_router(generate_router, prefix="/api")
# app.include_router(upload_router, prefix="/api")
# app.include_router(documents_router, prefix="/api")
# app.include_router(templates_router, prefix="/api")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import generate, documents, upload
from app.config.database import create_tables
import os
from app.api.export import router as export_router
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="MakeWithUs — Doc Automation API",
    description="AI/ML powered document generation from PDF input",
    version="2.0.0"
)
app.mount("/static", StaticFiles(directory="static"), name="static")
# ── CORS ──────────────────────────────────────────────────────────────────
# ── CORS ──────────────────────────────────────────────────────────────────
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#         "http://localhost:5173",
#         "http://127.0.0.1:3000",
#         "http://127.0.0.1:5173",

#         # Vercel frontend
#         "https://docautomation-tawny.vercel.app",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
os.makedirs("./output",  exist_ok=True)
os.makedirs("./uploads", exist_ok=True)

@app.on_event("startup")
def on_startup():
    create_tables()

app.include_router(generate.router,  prefix="/api", tags=["Generate"])
app.include_router(documents.router, prefix="/api", tags=["Documents"])
app.include_router(upload.router,    prefix="/api", tags=["Upload"])
app.include_router(export_router, prefix="/api")
@app.get("/")
def root():
    return {"status": "running", "docs": "/docs", "version": "2.0.0"}