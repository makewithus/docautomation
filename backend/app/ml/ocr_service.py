# import pytesseract 
# from PIL import Image
# import os
# from app.config.settings import settings

# def extract_text_from_image(image_path: str)->str:

#     """
#     Tesseract OCR - reads uploaded image or scanned document.
#     Used when the user uploads a JPG/PNG instead of a PDF.

#     Supports: PNG, JPG, JPEG, TIFF,BMP
    
    
#     """
#     if not os.path.exists (image_path):
#         raise FileNotFoundError(f"File not found: {image_path}")
#     ext= image_path.rsplit(".",1)[-1].lower()
#     if ext not in ("png","jpg","jpeg","tiff","bmp","webp"):
#         return f"Unsupported image type {ext}"
    
#     try:
#         image = Image.open(image_path).convert("L")
#         text = pytesseract.image_to_string(image,lang="eng")

#         return text.strip()
#     except Exception as e:
#         return f"OCR failed : {str(e)}"

# import pytesseract
# from PIL import Image
# import os
# from app.config.settings import settings

# # ── Point pytesseract to the correct tesseract.exe ────────────────────────
# # Reads TESSERACT_CMD from settings.py / .env
# # On Windows this must be the full path to tesseract.exe
# # On Mac/Linux leave it as empty string — pytesseract finds it automatically
# if settings.tesseract_cmd:
#     pytesseract.pytesseract.tesseract_cmd = settings.tesseract_cmd


# def extract_text_from_image(image_path: str) -> str:
#     """
#     Tesseract OCR — reads uploaded image or scanned document.
#     Used when the user uploads a JPG/PNG instead of a PDF.

#     Supports: PNG, JPG, JPEG, TIFF, BMP, WEBP

#     Args:
#         image_path: full path to the uploaded image file

#     Returns:
#         Extracted text as a plain string.
#         Returns an error message string if extraction fails.
#     """

#     # ── Check file exists ──────────────────────────────────────────────
#     if not os.path.exists(image_path):
#         raise FileNotFoundError(f"File not found: {image_path}")

#     # ── Check file extension ───────────────────────────────────────────
#     ext = image_path.rsplit(".", 1)[-1].lower()
#     if ext not in ("png", "jpg", "jpeg", "tiff", "bmp", "webp"):
#         return f"Unsupported image type: {ext}"

#     # ── Run OCR ───────────────────────────────────────────────────────
#     try:
#         # Convert to grayscale — improves OCR accuracy
#         image = Image.open(image_path).convert("L")
#         text  = pytesseract.image_to_string(image, lang="eng")
#         return text.strip()

#     except pytesseract.TesseractNotFoundError:
#         raise RuntimeError(
#             "Tesseract not found. "
#             "Check that TESSERACT_CMD in your .env points to the correct tesseract.exe path.\n"
#             f"Current path: {settings.tesseract_cmd}"
#         )
#     except Exception as e:
#         return f"OCR failed: {str(e)}"


from PIL import Image
import os


def extract_text_from_image(image_path: str) -> str:
    """
    Tesseract OCR for image uploads only.
    NOT called for PDFs — PDFs use pdf_reader.py instead.
    """
    import pytesseract
    from app.config.settings import settings

    # Set tesseract path only on Windows
    if settings.tesseract_cmd:
        pytesseract.pytesseract.tesseract_cmd = settings.tesseract_cmd

    if not os.path.exists(image_path):
        raise FileNotFoundError(f"File not found: {image_path}")

    ext = image_path.rsplit(".", 1)[-1].lower()
    if ext not in ("png", "jpg", "jpeg", "tiff", "bmp", "webp"):
        return f"Unsupported image type: {ext}"

    try:
        image = Image.open(image_path).convert("L")
        text  = pytesseract.image_to_string(image, lang="eng")
        return text.strip()
    except pytesseract.TesseractNotFoundError:
        raise RuntimeError(
            f"Tesseract not found at: {settings.tesseract_cmd}\n"
            "Install Tesseract from https://github.com/UB-Mannheim/tesseract/wiki\n"
            "Default Windows path: C:\\Program Files\\Tesseract-OCR\\tesseract.exe\n"
            "Then update TESSERACT_CMD in your .env file."
        )
    except Exception as e:
        return f"OCR failed: {str(e)}"
