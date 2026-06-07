# from pydantic_settings import BaseSettings
# from functools import lru_cache
# from pathlib import Path


# class Settings(BaseSettings):

#     # ── App ───────────────────────────────────────────────────────
#     APP_NAME: str = "DocAutomationPlatform"
#     APP_ENV: str = "development"
#     DEBUG: bool = True
#     SECRET_KEY: str = "change-me-in-production"
#     BASE_URL: str = "http://localhost:8000"

#     # ── Database ──────────────────────────────────────────────────
#     DATABASE_URL: str = "sqlite:///./documents.db"
#     SYNC_DATABASE_URL: str = "sqlite:///./documents.db"

#     # ── Redis / Celery ────────────────────────────────────────────
#     REDIS_URL: str = "redis://localhost:6379/0"
#     CELERY_BROKER_URL: str = "redis://localhost:6379/0"
#     CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"

#     # ── OpenRouter ────────────────────────────────────────────────
#     # Get free API key → https://openrouter.ai/keys
#     # REMOVED: ANTHROPIC_API_KEY
#     OPENROUTER_API_KEY: str = ""
#     OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
#     OPENROUTER_SITE_URL: str = "http://localhost:8000"
#     OPENROUTER_SITE_NAME: str = "MakeWithUs DocPlatform"

#     # Free model options — change anytime in .env, no code change needed:
#     # "meta-llama/llama-3.3-70b-instruct:free"   ← best quality (recommended)
#     # "google/gemini-2.0-flash-exp:free"          ← fast + smart
#     # "mistralai/mistral-7b-instruct:free"        ← lightweight
#     # "qwen/qwen-2-7b-instruct:free"              ← good structured JSON
#     LLM_MODEL: str = "meta-llama/llama-3.3-70b-instruct:free"

#     # ── OCR ───────────────────────────────────────────────────────
#     TESSERACT_CMD: str = r"C:\Users\hp\OneDrive\Desktop\tesseract.exe"

#     # ── Storage ───────────────────────────────────────────────────
#     UPLOAD_DIR: str = "./uploads"
#     TEMPLATES_DIR: str = "./templates"

#     # ── ML ────────────────────────────────────────────────────────
#     ML_MODELS_DIR: str = "./ml/models"

#     class Config:
#         env_file = ".env"
#         case_sensitive = True


# @lru_cache()
# def get_settings() -> Settings:
#     return Settings()


# settings = get_settings()

# Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
# Path(settings.ML_MODELS_DIR).mkdir(parents=True, exist_ok=True)


from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    
    OPENROUTER_API_KEY: str
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_SITE_URL: str = "http://localhost:5173"
    OPENROUTER_SITE_NAME: str = "Doc Automation"
    
    # Primary — best JSON accuracy
    LLM_MODEL: str = "openai/gpt-4o-mini"

# Fallback — agar primary slow ho
# LLM_MODEL_FALLBACK=meta-llama/llama-4-maverick:free

    # ── Database ──────────────────────────────────────────────────────
    DATABASE_URL: str = "sqlite:///./docautomation.db"

    # ── File paths ────────────────────────────────────────────────────
    output_path:  str = "./output"
    upload_path:  str = "./uploads"

    # ── Tesseract ─────────────────────────────────────────────────────
    # Windows path to tesseract.exe
    # Mac/Linux: leave as empty string — tesseract is found automatically
    tesseract_cmd: str = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    # ── Server ────────────────────────────────────────────────────────
    port: int = 8000

    class Config:
        env_file = ".env"

settings = Settings()
