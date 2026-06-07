# import joblib
# import os
# import re

# MODEL_PATH = "./ml_models/doc_classifier.pkl"

# # ── Keyword map — expanded + weighted ────────────────────────────────────────
# # Each entry: (keyword, weight)
# # weight 2 = strong signal, weight 1 = normal signal

# KEYWORDS = {

#     "developer_doc": [
#         ("requirement",           2), ("requirements",          2),
#         ("feature",               1), ("user story",            2),
#         ("acceptance criteria",   2), ("functional spec",       2),
#         ("technical spec",        2), ("system design",         2),
#         ("api endpoint",          2), ("rest api",              2),
#         ("database schema",       2), ("module",                1),
#         ("backend",               1), ("frontend",              1),
#         ("authentication",        1), ("dashboard",             1),
#         ("integration",           1), ("sprint",                2),
#         ("scope of work",         2), ("use case",              2),
#         ("tech stack",            2), ("architecture",          2),
#         ("component",             1), ("microservice",          2),
#         ("deployment",            1), ("unit test",             2),
#     ],

#     "client_doc": [
#         ("project proposal",      2), ("proposal",              2),
#         ("timeline",              2), ("milestone",             2),
#         ("phase",                 1), ("deliverable",           2),
#         ("quotation",             2), ("quote",                 2),
#         ("project plan",          2), ("schedule",              1),
#         ("week",                  1), ("deadline",              2),
#         ("sign off",              2), ("kickoff",               2),
#         ("handover",              1), ("client",                2),
#         ("scope",                 1), ("approval",              1),
#         ("payment terms",         2), ("total cost",            2),
#         ("project cost",          2), ("estimated",             1),
#     ],

#     "compliance": [                   # ← FIXED typo: compilance → compliance
#         ("letter",                2), ("to whom it may concern", 2),
#         ("request",               1), ("hereby",                2),
#         ("authority",             1), ("employee",              2),
#         ("dear sir",              2), ("dear madam",            2),
#         ("respectfully",          2), ("subject:",              2),
#         ("reference:",            2), ("sincerely",             2),
#         ("yours faithfully",      2), ("human resources",       2),
#         ("hr department",         2), ("official letter",       2),
#         ("noc",                   2), ("no objection",          2),
#         ("experience letter",     2), ("offer letter",          2),
#         ("appointment letter",    2), ("organization",          1),
#         ("management",            1), ("department",            1),
#         ("policy",                1), ("notice",                1),
#     ],

#     "invoice": [
#         ("invoice",               2), ("invoice no",            2),
#         ("invoice number",        2), ("inv-",                  2),
#         ("bill",                  2), ("billing",               2),
#         ("payment",               1), ("amount due",            2),
#         ("total amount",          2), ("subtotal",              2),
#         ("gst",                   2), ("cgst",                  2),
#         ("sgst",                  2), ("igst",                  2),
#         ("hsn",                   2), ("gstin",                 2),
#         ("tax invoice",           2), ("due date",              2),
#         ("bank details",          2), ("upi",                   2),
#         ("neft",                  2), ("receipt",               2),
#         ("payable",               2), ("paid",                  1),
#         ("unit price",            2), ("quantity",              1),
#         ("rate",                  1), ("line item",             2),
#     ],
# }


# def classify_document(text: str) -> str:
#     """
#     Auto-detects which of the 4 document types this text belongs to.
#     Uses trained ML model if available, weighted keyword scoring as fallback.

#     Returns: "developer_doc" | "client_doc" | "compliance" | "invoice"
#     """
#     # ── Try trained ML model first ────────────────────────────────
#     if os.path.exists(MODEL_PATH):
#         try:
#             model = joblib.load(MODEL_PATH)
#             return model.predict([text])[0]
#         except Exception:
#             pass

#     # ── Fallback: weighted keyword scoring ────────────────────────
#     return _keyword_classify(text)


# def _keyword_classify(text: str) -> str:
#     text_lower = text.lower()

#     scores = {}
#     for doc_type, keyword_list in KEYWORDS.items():
#         score = 0
#         for keyword, weight in keyword_list:
#             # Count every occurrence, multiply by weight
#             count = len(re.findall(re.escape(keyword), text_lower))
#             score += count * weight
#         scores[doc_type] = score

#     # ── Debug log (remove in production) ─────────────────────────
#     print(f"[Classifier Scores] {scores}")

#     best       = max(scores, key=scores.get)
#     best_score = scores[best]

#     # ── FIX: don't blindly default to developer_doc ───────────────
#     # If scores are tied or zero → check simple heuristics
#     if best_score == 0:
#         return _heuristic_fallback(text_lower)

#     # If top 2 scores are very close → use heuristic to break tie
#     sorted_scores = sorted(scores.values(), reverse=True)
#     if len(sorted_scores) >= 2 and sorted_scores[0] - sorted_scores[1] <= 1:
#         return _heuristic_fallback(text_lower) or best

#     return best


# def _heuristic_fallback(text_lower: str) -> str:
#     """
#     Simple rule-based fallback when keyword scores are 0 or tied.
#     Looks at document structure patterns.
#     """
#     # Invoice signals
#     if any(p in text_lower for p in ["₹", "rs.", "inr", "amount", "total"]):
#         return "invoice"

#     # Compliance signals
#     if any(p in text_lower for p in ["dear", "sincerely", "regards", "to,"]):
#         return "compliance"

#     # Client doc signals
#     if any(p in text_lower for p in ["weeks", "months", "phase", "deliver"]):
#         return "client_doc"

#     # Default last resort
#     return "developer_doc"


# def train_classifier(training_data: list) -> None:
#     """
#     Train the ML Classifier from labeled text examples.

#     Args:
#         training_data: [{"text": "...", "label": "developer_doc"}, ...]

#     Labels must be one of:
#         "developer_doc" | "client_doc" | "compliance" | "invoice"
#     """
#     from sklearn.pipeline import Pipeline
#     from sklearn.feature_extraction.text import TfidfVectorizer
#     from sklearn.linear_model import LogisticRegression

#     texts  = [d["text"]  for d in training_data]
#     labels = [d["label"] for d in training_data]

#     pipeline = Pipeline([
#         ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=8000)),
#         ("clf",   LogisticRegression(max_iter=300)),
#     ])
#     pipeline.fit(texts, labels)

#     os.makedirs("./ml_models", exist_ok=True)
#     joblib.dump(pipeline, MODEL_PATH)
#     print(f"Classifier trained and saved → {MODEL_PATH}")

# import httpx
# import joblib
# import os
# from app.config.settings import settings

# MODEL_PATH        = "./ml_models/doc_classifier.pkl"
# OPENROUTER_URL    = "https://openrouter.ai/api/v1/chat/completions"
# OPENROUTER_MODEL  = "anthropic/claude-sonnet-4"

# CLASSIFY_PROMPT = """You are a document classifier. Given extracted text from a document, 
# return ONLY one of these exact strings — nothing else:
# developer_doc
# client_doc
# compliance
# invoice
# timeline

# Rules:
# - developer_doc  → pre-development doc, features list, app brief, requirements for dev team
# - client_doc     → project proposal, quote, letter to client with timeline and pricing
# - compliance     → legal agreement, service provision, official letter, NDA, employee letter
# - invoice        → standalone invoice or billing document with line items and totals
# - timeline       → project timeline, onboarding schedule, phase breakdown with hours

# Return only the single label. No explanation. No punctuation."""


# async def classify_document_ai(text: str) -> str:
#     """
#     Uses OpenRouter AI to classify the document type.
#     Most accurate — reads the full context, not just keywords.
#     Falls back to keyword matching if API call fails.
#     """
#     try:
#         headers = {
#             "Authorization": f"Bearer {settings.openrouter_api_key}",
#             "Content-Type":  "application/json",
#             "HTTP-Referer":  "https://makewithus.in",
#             "X-Title":       "MakeWithUs Doc Automation",
#         }

#         payload = {
#             "model":       OPENROUTER_MODEL,
#             "max_tokens":  10,       # only needs one word back
#             "temperature": 0,        # deterministic output
#             "messages": [
#                 {"role": "system", "content": CLASSIFY_PROMPT},
#                 {"role": "user",   "content": text[:3000]},  # first 3000 chars is enough
#             ],
#         }

#         async with httpx.AsyncClient(timeout=20.0) as client:
#             response = await client.post(
#                 OPENROUTER_URL,
#                 headers=headers,
#                 json=payload,
#             )

#         if response.status_code != 200:
#             raise ValueError(f"OpenRouter error {response.status_code}")

#         result = response.json()["choices"][0]["message"]["content"].strip().lower()

#         # Validate it returned one of the known types
#         valid_types = {"developer_doc", "client_doc", "compliance", "invoice", "timeline"}
#         if result in valid_types:
#             return result

#         # If unexpected output, fall back to keywords
#         return _keyword_classify(text)

#     except Exception:
#         # If API fails for any reason, fall back to keyword classifier
#         return _keyword_classify(text)


# def classify_document(text: str) -> str:
#     """
#     Sync version — uses keyword matching only.
#     Use classify_document_ai() for AI-powered classification.
#     """
#     if os.path.exists(MODEL_PATH):
#         try:
#             model = joblib.load(MODEL_PATH)
#             return model.predict([text])[0]
#         except Exception:
#             pass
#     return _keyword_classify(text)


# def _keyword_classify(text: str) -> str:
#     """Keyword fallback — always returns a type, never None."""
#     text_lower = text.lower()

#     scores = {
#         "developer_doc": sum(1 for kw in [
#             "requirement", "feature", "module", "user story", "scope",
#             "backend", "frontend", "api", "mvp", "onboarding", "development"
#         ] if kw in text_lower),
#         "client_doc": sum(1 for kw in [
#             "timeline", "milestone", "phase", "deliverable", "client",
#             "quote", "quotation", "proposal", "schedule", "deadline"
#         ] if kw in text_lower),
#         "compliance": sum(1 for kw in [
#             "letter", "agreement", "hereby", "authority", "employee",
#             "company", "subject", "provision", "policy", "terms"
#         ] if kw in text_lower),
#         "invoice": sum(1 for kw in [
#             "invoice", "bill", "payment", "gst", "total",
#             "tax", "subtotal", "due date", "amount", "paid"
#         ] if kw in text_lower),
#         "timeline": sum(1 for kw in [
#             "timeline", "onboarding", "infra", "deployment",
#             "handover", "iteration", "total time", "closure"
#         ] if kw in text_lower),
#     }

#     best = max(scores, key=scores.get)
#     return best if scores[best] > 0 else "developer_doc"
import httpx
import joblib
import os
from app.config.settings import settings

MODEL_PATH       = "./ml_models/doc_classifier.pkl"
OPENROUTER_URL   = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODEL = "anthropic/claude-sonnet-4"

# ── Very clear prompt — each type described with what makes it DIFFERENT ──
CLASSIFY_PROMPT = """You are a document classifier for MakeWithUs, a software agency.

Given extracted text from a document, return ONLY one of these 5 exact strings:
developer_doc
client_doc
compliance
invoice
timeline

DEFINITIONS — read carefully before deciding:

developer_doc:
- Pre-development documentation for the dev team
- Lists app features, modules, user stories, requirements
- No prices, no payment terms, no client letter
- Example keywords: feature, module, requirement, onboarding, user flow, scope

client_doc:
- A PROJECT PROPOSAL letter sent to a client
- Has a formal letter body ("Dear Client", "Thank you for considering...")
- ALSO has a quotation table (Description / Hours / Unit Price / Amount)
- Has both letter content AND pricing together in one document
- Example keywords: proposal, quotation, dear client, sincerely, project scope, deliverable

compliance:
- A LEGAL AGREEMENT between two parties
- Title is usually: SERVICE PROVISION AGREEMENT, NDA, or similar
- Has formal legal sections: PURPOSE OF AGREEMENT, PROJECT EXECUTION, PAYMENT TERMS, CONFIDENTIALITY, ACCEPTANCE
- Has a SIGNATURE BLOCK at the end (MAKEWITHUS / CLIENT signature lines)
- Has payment phase table: ADVANCE PAYMENT / MIDWAY PAYMENT / FINAL PAYMENT with percentages
- Has: DELAYED PAYMENT POLICY, PROFESSIONAL UNDERSTANDING, MODIFICATIONS sections
- Keywords: service provision agreement, purpose of agreement, both parties, confidentiality, acceptance, ceo cofounder, delayed payment policy, professional understanding


invoice:
- A STANDALONE billing document only — no letter, no proposal body
- Just the invoice header, line items table, totals, and payment info
- Has: Invoice No, Date, Client Name, line items with amounts, SUBTOTAL, GST, TOTAL
- NO letter body, NO "Dear Client", NO proposal text
- Example keywords: invoice no, subtotal, gst, total amount, bank details, upi

timeline:
- Project timeline and onboarding schedule
- Has phases with hours and duration (weeks/days)
- Example keywords: timeline, phase, infra setup, deployment, handover, total time

KEY DISTINCTION — client_doc vs invoice:
- client_doc = proposal LETTER + quotation table combined
- invoice = ONLY a billing document, no letter content at all

CRITICAL RULES — apply these first before any other logic:

RULE 1: If text contains "SERVICE PROVISION AGREEMENT" → return compliance
RULE 2: If text contains "PURPOSE OF AGREEMENT" → return compliance
RULE 3: If text contains "DELAYED PAYMENT POLICY" → return compliance
RULE 4: If text contains "CONFIDENTIALITY" and "ACCEPTANCE" → return compliance
RULE 5: If text contains "Dear Client" or "Thank you for considering" → return client_doc
RULE 6: If text contains "Invoice No" or "Invoice Number" but NO letter body → return invoice
Return only the single label. No explanation. No punctuation."""


async def classify_document_ai(text: str) -> str:
    """
    Uses OpenRouter AI to classify doc type.
    Falls back to keyword matching if API fails.
    """
    try:
        headers = {
            "Authorization": f"Bearer {settings.openrouter_api_key}",
            "Content-Type":  "application/json",
            "HTTP-Referer":  "https://makewithus.in",
            "X-Title":       "MakeWithUs Doc Automation",
        }

        payload = {
            "model":       OPENROUTER_MODEL,
            "max_tokens":  10,
            "temperature": 0,
            "messages": [
                {"role": "system", "content": CLASSIFY_PROMPT},
                {"role": "user",   "content": text[:3000]},
            ],
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                OPENROUTER_URL,
                headers=headers,
                json=payload,
            )

        if response.status_code != 200:
            raise ValueError(f"OpenRouter error {response.status_code}")

        result = response.json()["choices"][0]["message"]["content"].strip().lower()

        valid = {"developer_doc", "client_doc", "compliance", "invoice", "timeline"}
        if result in valid:
            return result

        return _keyword_classify(text)

    except Exception:
        return _keyword_classify(text)


def classify_document(text: str) -> str:
    """Sync fallback using keyword scoring."""
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            return model.predict([text])[0]
        except Exception:
            pass
    return _keyword_classify(text)


def _keyword_classify(text: str) -> str:
    """
    Keyword fallback with clear separation between client_doc and invoice.
    """
    text_lower = text.lower()

    scores = {
        "developer_doc": sum(1 for kw in [
            "requirement", "feature", "module", "user story", "scope",
            "backend", "frontend", "api", "mvp", "onboarding", "development",
            "pre development", "core features", "user profiling"
        ] if kw in text_lower),

        # client_doc must have BOTH letter signals AND quotation signals
        "client_doc": sum(1 for kw in [
            "dear client", "thank you for considering", "proposal",
            "sincerely", "project scope", "deliverable", "dear",
            "this proposal", "project plan", "quotation"
        ] if kw in text_lower),
         "compliance": sum(1 for kw in [
            "agreement", "hereby", "parties", "confidentiality",
            "payment terms", "clause", "cofounder", "phase payments",
            "advance payment", "midway payment", "final payment"
        ] if kw in text_lower),


#         "compliance": sum(1 for kw in [
#     "agreement", "hereby", "parties", "confidentiality",
#     "acceptance", "clause", "service provision", "terms and conditions",
#     "payment terms", "professional understanding", "cofounder",
#     "service provision agreement", "signing", "both parties",
#     "delayed payment", "modifications", "makewithus pvt ltd"
# ] if kw in text_lower),

        # invoice must have billing-specific words but NOT letter words
        "invoice": sum(1 for kw in [
            "invoice no", "invoice number", "subtotal", "gst",
            "bank: sbi", "upi id", "amount due", "paid/unpaid",
            "unit price", "billing"
        ] if kw in text_lower),

        "timeline": sum(1 for kw in [
            "infra setup", "version control", "frontend designing",
            "backend development", "handover", "total time",
            "project closure", "onboarding schedule"
        ] if kw in text_lower),
    }

    # If text has "dear client" or "proposal letter" → always client_doc
    if any(kw in text_lower for kw in ["dear client", "thank you for considering", "this proposal letter"]):
        return "client_doc"

    # If text has invoice-specific words but NO letter words → invoice
    if scores["invoice"] >= 2 and scores["client_doc"] == 0:
        return "invoice"

    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "developer_doc"
