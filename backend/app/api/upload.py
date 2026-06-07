# # from fastapi import APIRouter, UploadFile,File,HTTPException
# # from app.ml.pdf_reader import extract_text_from_pdf
# # import shutil
# # from app.ml.classifier import classify_document
# # from app.ml.ocr_service import extract_text_from_image
# # from app.schemas.generate_schema import UploadResponse
# # import uuid
# # import os
# # router=APIRouter()

# # PDF_TYPES = {"application/pdf"}
# # IMAGE_TYPES ={"image/png","image/jpeg","image/jpg","image/tiff","image/bmp"}
# # ALL_ALLOWED = PDF_TYPES | IMAGE_TYPES

# # MAX_SIZE_MB=20

# # @router.post("/upload",response_model=UploadResponse)
# # async def upload_file(file: UploadFile = File(...)):
# #     """
# #     Accepts a PDF or image upload from the user.
# #     For PDF -> MyMuPDF extracts text directly (fast,accurate)
# #     For image -> Tesseract OCR extracts text (for scanned docs)

# #     Returns extracted text + auto-detected doc type.
# #     Frontend passes this text to POST/generate.
# #     """

# #     if file.content_type not in ALL_ALLOWED:
# #         raise HTTPException(
# #             status_code=400,
# #             detail=(
# #                 f"Unsupported file type: '{file.content_type}'."
# #                 f"Upload a PDF or image (PNG,JPG,TIFF)."

# #             )
# #         )
# #     ext= file.filename.rsplit(".",1)[-1].lower() if "." in file.filename else "pdf"
# #     filename= f"{uuid.uuid4()}.{ext}"
# #     save_path= os.path.join("./uploads",filename)

# #     os.makedirs("./uploads",exist_ok=True)
# #     with open(save_path,"wb") as f:
# #         shutil.copyfileobj(file.file,f)


# #     #check file size
# #     size_mb = os.path.getsize(save_path)/(1024*1024)
# #     if size_mb> MAX_SIZE_MB:
# #         os.remove(save_path)
# #         raise HTTPException(
# #             status_code=413,
# #             detail=f"File too large: {size_mb:.1f}MB. Maximum is {MAX_SIZE_MB}MB."
# #         )
    

# #     #extract text based on file type
# #     try:
# #         if file.content_type  in PDF_TYPES:
# #             extracted_text=extract_text_from_pdf(save_path)
# #         else:
# #             extracted_text=extract_text_from_image(save_path)
# #     except Exception as e:
# #         raise HTTPException(status_code=422, detail=f"Text extraction failed: {str(e)}")
    
# #     if not extracted_text.strip():
# #         raise HTTPException(
# #             status_code=422,
# #             detail="Could not extract text from file. Try a clearer scan or a text-based PDF."
# #         )
    

# #     #Auto detect document type from extracted_test
# #     detected_type= classify_document(extracted_text)
# #     return UploadResponse(
# #         filename=filename,
# #         extracted_text=extracted_text,
# #         detected_type=detected_type,
# #         char_count=len(extracted_text),
# #     )

# from fastapi import APIRouter, UploadFile, File, HTTPException
# from app.ml.pdf_reader   import extract_text_from_pdf
# from app.ml.classifier   import classify_document
# from app.schemas.generate_schema import UploadResponse
# import shutil, os, uuid

# router = APIRouter()

# PDF_TYPES   = {"application/pdf"}
# IMAGE_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/tiff", "image/bmp"}
# ALL_ALLOWED = PDF_TYPES | IMAGE_TYPES
# MAX_SIZE_MB = 20


# @router.post("/upload", response_model=UploadResponse)
# async def upload_file(file: UploadFile = File(...)):
#     if file.content_type not in ALL_ALLOWED:
#         raise HTTPException(
#             status_code=400,
#             detail=f"Unsupported file type: '{file.content_type}'. Upload a PDF or image."
#         )

#     ext      = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "pdf"
#     filename = f"{uuid.uuid4()}.{ext}"
#     save_path = os.path.join("./uploads", filename)

#     os.makedirs("./uploads", exist_ok=True)
#     with open(save_path, "wb") as f:
#         shutil.copyfileobj(file.file, f)

#     size_mb = os.path.getsize(save_path) / (1024 * 1024)
#     if size_mb > MAX_SIZE_MB:
#         os.remove(save_path)
#         raise HTTPException(status_code=413, detail=f"File too large: {size_mb:.1f}MB. Max {MAX_SIZE_MB}MB.")

#     try:
#         if file.content_type in PDF_TYPES:
#             # PDF uses PyMuPDF — NO Tesseract needed
#             extracted_text = extract_text_from_pdf(save_path)
#         else:
#             # Image uses Tesseract OCR
#             from app.ml.ocr_service import extract_text_from_image
#             extracted_text = extract_text_from_image(save_path)

#     except Exception as e:
#         raise HTTPException(status_code=422, detail=f"Text extraction failed: {str(e)}")

#     if not extracted_text.strip():
#         raise HTTPException(status_code=422, detail="Could not extract text. Try a text-based PDF.")

#     detected_type = classify_document(extracted_text)

#     return UploadResponse(
#         filename=filename,
#         extracted_text=extracted_text,
#         detected_type=detected_type,
#         char_count=len(extracted_text),
#     )
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.ml.pdf_reader  import extract_text_from_pdf
from app.ml.classifier  import classify_document_ai
from app.schemas.generate_schema import UploadResponse
import shutil, os, uuid

router = APIRouter()

PDF_TYPES   = {"application/pdf"}
IMAGE_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/tiff", "image/bmp"}
ALL_ALLOWED = PDF_TYPES | IMAGE_TYPES
MAX_SIZE_MB = 20


@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    Step 1 — Upload PDF or image.
    Step 2 — Extract text (PyMuPDF for PDF, Tesseract for image).
    Step 3 — AI classifies the doc type using OpenRouter.
    Returns extracted text + detected type to frontend.
    """
    if file.content_type not in ALL_ALLOWED:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: '{file.content_type}'. Upload a PDF or image."
        )

    # ── Save file ──────────────────────────────────────────────────────
    ext       = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "pdf"
    filename  = f"{uuid.uuid4()}.{ext}"
    save_path = os.path.join("./uploads", filename)

    os.makedirs("./uploads", exist_ok=True)
    with open(save_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # ── Size check ─────────────────────────────────────────────────────
    size_mb = os.path.getsize(save_path) / (1024 * 1024)
    if size_mb > MAX_SIZE_MB:
        os.remove(save_path)
        raise HTTPException(
            status_code=413,
            detail=f"File too large: {size_mb:.1f}MB. Maximum is {MAX_SIZE_MB}MB."
        )

    # ── Extract text ───────────────────────────────────────────────────
    try:
        if file.content_type in PDF_TYPES:
            # PDF → PyMuPDF — no Tesseract needed
            extracted_text = extract_text_from_pdf(save_path)
        else:
            # Image → Tesseract OCR
            from app.ml.ocr_service import extract_text_from_image
            extracted_text = extract_text_from_image(save_path)

    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Text extraction failed: {str(e)}"
        )

    if not extracted_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Could not extract any text. Try a clearer PDF."
        )

    # ── AI classifies the doc type ─────────────────────────────────────
    # Uses OpenRouter to read the full context — not just keywords
    detected_type = await classify_document_ai(extracted_text)

    return UploadResponse(
        filename=filename,
        extracted_text=extracted_text,
        detected_type=detected_type,
        char_count=len(extracted_text),
    )
