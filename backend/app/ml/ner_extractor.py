try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
    NLP_AVAILABLE = True
except Exception:
    NLP_AVAILABLE = False
    nlp = None


def extract_entities(text: str) -> dict:
    """
    spaCy NER — pulls names, dates, amounts, orgs from raw PDF text.
    Used to enrich Claude output if it misses anything.
    """
    if not NLP_AVAILABLE or not nlp:
        return {"names": [], "dates": [], "amounts": [], "orgs": []}

    doc = nlp(text[:5000])  # limit to avoid memory issues on large PDFs
    entities = {"names": [], "dates": [], "amounts": [], "orgs": []}

    for ent in doc.ents:
        if ent.label_ == "PERSON":
            entities["names"].append(ent.text)
        elif ent.label_ == "DATE":
            entities["dates"].append(ent.text)
        elif ent.label_ in ("MONEY", "CARDINAL"):
            entities["amounts"].append(ent.text)
        elif ent.label_ == "ORG":
            entities["orgs"].append(ent.text)

    # Deduplicate
    for key in entities:
        entities[key] = list(dict.fromkeys(entities[key]))

    return entities
