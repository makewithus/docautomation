import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadPDF, generateDoc } from "../services/api";
import logo from "../assets/logo.png";

const DOC_TYPES = [
  {
    id:   "Timeline",
    label: "timeline",
    desc:  "Documents for the timeline",

    keywords: ["deadline", "status", "deployment_phase", "testing_phase"]
  },
  {
    id:   "client_doc",
    label: "Client Proposal",
    desc:  "Timeline, quote & letter for client",
  
    keywords: ["proposal", "quote", "timeline", "client"]
  },
  {
    id:   "compliance",
    label: "Compliance Letter",
    desc:  "Official letters & company requests",
  
    keywords: ["letter", "request", "employee", "authority"]
  },
  {
    id:   "invoice",
    label: "Invoice",
    desc:  "Standalone single invoice",
  
    keywords: ["invoice", "gst", "payment", "bill"]
  },
];

const GEN_STEPS = [
  "Reading your PDF",
  "Detecting document type",
  "AI writing all sections",
  "Filling your branded template",
  "Creating editable link",
];

export default function Home() {
  const [file, setFile]                   = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [detectedType, setDetectedType]   = useState(null);
  const [step, setStep]                   = useState(1); // 1=upload 2=confirm 3=generating
  const [genStep, setGenStep]             = useState(0);
  const [uploading, setUploading]         = useState(false);
  const [error, setError]                 = useState(null);
  const fileRef  = useRef();
  const navigate = useNavigate();

  // ── Handle file selection ──────────────────────────────────────────
  const handleFile = async (f) => {
    if (!f) return;

    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/tiff",
      "image/bmp",
    ];

    if (!allowed.includes(f.type)) {
      setError("Please upload a PDF or image file (PNG, JPG, TIFF).");
      return;
    }

    setFile(f);
    setError(null);
    setUploading(true);

    try {
      const res = await uploadPDF(f);
      setExtractedText(res.data.extracted_text);
      setDetectedType(res.data.detected_type);
      setStep(2);
    } catch (e) {
      setError(
        e.response?.data?.detail ||
        "Upload failed. Make sure the backend is running and try again."
      );
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  // ── Drag and drop ──────────────────────────────────────────────────
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // ── Generate document ──────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!extractedText.trim()) {
      setError("No text was extracted. Try a different file.");
      return;
    }

    setStep(3);
    setGenStep(0);
    setError(null);

    // Animate through steps while waiting
    const interval = setInterval(() => {
      setGenStep(prev => {
        if (prev < GEN_STEPS.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 900);

    try {
      // const res = await generateDoc(extractedText);
      // console.log("API Response:", res.data);
      // clearInterval(interval);
      // // navigate(`/doc/${res.data.doc_id}`);
      // navigate(res.data.edit_url);
       const res = await generateDoc(extractedText);

    console.log("FULL RESPONSE:", res);
    console.log("DATA:", res.data);

    clearInterval(interval);

    // Backend response
    const responseData = res.data;

    // check doc_id exists
    if (responseData?.doc_id) {
      navigate(`/doc/${responseData.doc_id}`);
    } else if (responseData?.edit_url) {
      navigate(responseData.edit_url);
    } else {
      console.log("No doc_id or edit_url found", responseData);
      setError("Document URL not found");
    }
    } catch (e) {
      clearInterval(interval);
      setError(
        e.response?.data?.detail ||
        "Generation failed. Try again."
      );
      setStep(2);
    }
  };

  // ── Reset ──────────────────────────────────────────────────────────
  const handleReset = () => {
    setFile(null);
    setExtractedText("");
    setDetectedType(null);
    setError(null);
    setStep(1);
    setGenStep(0);
  };

  const detectedDocType = DOC_TYPES.find(t => t.id === detectedType);


    return (
  <div style={s.page}>
    <div style={s.wrap}>

      {/* ── Header ── */}
      <div style={s.header}>
        <div style={s.logo}>
          <img
            src={logo}
            alt="Logo"
            style={{
              height: "40px",
              objectFit: "contain",
            }}
          />
        </div>

        {/* <a href="/documents" style={s.navLink}>
          All documents →
        </a> */}
      </div>

      {/* STEP 1 — UPLOAD */}

        {step === 1 && (
          <>
            <div style={s.hero}>
              <h1 style={s.h1}>
                Upload your PDF.<br />Get a document.
              </h1>
              <p style={s.sub}>
                Drop your project brief, notes, or any existing document.
                AI reads it, picks the right template, and gives you an editable link.
              </p>
            </div>

            {/* Drop zone */}
            <div
              style={uploading ? { ...s.dropzone, ...s.dropzoneActive } : s.dropzone}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => !uploading && fileRef.current.click()}
            >
              {uploading ? (
                <div style={s.dzInner}>
                  <div style={s.spinner} />
                  <p style={s.dzLabel}>Reading your file...</p>
                  <p style={s.dzSub}>Extracting text from PDF</p>
                </div>
              ) : (
                <div style={s.dzInner}>
                  <div style={s.dzIconWrap}>
                    <span style={s.dzIcon}>📄</span>
                  </div>
                  <p style={s.dzLabel}>Drop your PDF here</p>
                  <p style={s.dzSub}>or click to browse · PDF, PNG, JPG supported · max 20MB</p>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileRef}
              accept=".pdf,image/png,image/jpeg,image/tiff,image/bmp"
              style={{ display: "none" }}
              onChange={e => handleFile(e.target.files[0])}
            />

            {/* Error */}
            {error && <div style={s.error}>{error}</div>}

            {/* Doc type info cards */}
            <div style={s.typeSection}>
              <p style={s.typeSectionLabel}>Supports 4 document types</p>
              <div style={s.typeGrid}>
                {DOC_TYPES.map(t => (
                  <div key={t.id} style={s.typeCard}>
                    <span style={s.typeIcon}>{t.icon}</span>
                    <div style={s.typeLabel}>{t.label}</div>
                    <div style={s.typeDesc}>{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
        
          </>
        )}

        {/* ════════════════════ STEP 2 — CONFIRM ════════════════════ */}
        {step === 2 && (
          <div style={s.confirmWrap}>

            {/* File info */}
            <div style={s.confirmFile}>
              <div style={s.confirmFileIcon}>📄</div>
              <div style={s.confirmFileInfo}>
                <div style={s.confirmFileName}>{file?.name}</div>
                <div style={s.confirmFileMeta}>
                  {(file?.size / 1024).toFixed(0)} KB
                  &nbsp;·&nbsp;
                  {extractedText.length.toLocaleString()} characters extracted
                </div>
              </div>
              <button style={s.changeBtn} onClick={handleReset}>
                ✕ Change file
              </button>
            </div>

            {/* Detected type */}
            {detectedDocType && (
              <div style={s.detectedBox}>
                <div style={s.detectedLeft}>
                  <span style={s.detectedIcon}>{detectedDocType.icon}</span>
                  <div>
                    <div style={s.detectedLabel}>AI detected document type</div>
                    <div style={s.detectedType}>{detectedDocType.label}</div>
                    <div style={s.detectedDesc}>{detectedDocType.desc}</div>
                  </div>
                </div>
                <div style={s.detectedDot} />
              </div>
            )}

            {/* Extracted text preview */}
            <div style={s.previewBox}>
              <div style={s.previewLabel}>Extracted text preview</div>
              <div style={s.previewText}>
                {extractedText.slice(0, 600)}
                {extractedText.length > 600 ? "..." : ""}
              </div>
            </div>

            {/* Error */}
            {error && <div style={s.error}>{error}</div>}

            {/* Actions */}
            <div style={s.confirmActions}>
              <button style={s.btnGenerate} onClick={handleGenerate}>
                 Generate document
              </button>
              <button style={s.btnSecondary} onClick={handleReset}>
                ← Upload different file
              </button>
            </div>

          </div>
        )}

        {/* ════════════════════ STEP 3 — GENERATING ════════════════ */}
        {step === 3 && (
          <div style={s.generatingWrap}>
            <div style={s.generatingInner}>

              {/* Spinning asterisk */}
              <div style={s.genLogoWrap}>
  <img
    src={logo}
    alt="Logo"
    style={{
      width: "60px",
      height: "60px",
      objectFit: "contain",
      animation: "spin 2s linear infinite",
    }}
  />
</div>

              <div style={s.genTitle}>Generating your document</div>
              <div style={s.genSub}>This takes about 10–15 seconds</div>

              {/* Step indicators */}
              <div style={s.genSteps}>
                {GEN_STEPS.map((label, i) => {
                  const done   = i < genStep;
                  const active = i === genStep;
                  return (
                    <div key={i} style={{ ...s.genStepRow, opacity: done || active ? 1 : 0.3 }}>
                      <div style={{
                        ...s.genStepDot,
                        background:   done   ? "#111" : "transparent",
                        border:       done   ? "none" : active ? "2px solid #111" : "1.5px solid #bbb",
                      }}>
                        {done && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
                        {active && !done && <span style={s.genActiveDot} />}
                      </div>
                      <span style={{
                        ...s.genStepLabel,
                        fontWeight: active ? 600 : 400,
                        color:      done ? "#555" : active ? "#111" : "#bbb",
                      }}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Asterisk icon component ────────────────────────────────────────────────
// function AsteriskIcon({ size = 20, spinning = false }) {
//   return (
//     <svg
//       width={size}
//       height={size}
//       viewBox="0 0 44 44"
//       fill="none"
//       style={spinning ? { animation: "spin 1.2s linear infinite" } : {}}
//     >
//       <path
//         d="M22 4 L22 40 M4 22 L40 22 M7.5 7.5 L36.5 36.5 M36.5 7.5 L7.5 36.5"
//         stroke="#111"
//         strokeWidth="5"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }

// ── Styles ─────────────────────────────────────────────────────────────────
const s = {
  page:        { minHeight: "100vh", background: "#fafafa", fontFamily: "system-ui, -apple-system, sans-serif" },
  wrap:        { maxWidth: 680, margin: "0 auto", padding: "40px 24px 100px" },

  // Header
  header:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 56 },
  logo:        { display: "flex", alignItems: "center", gap: 8 },
  logoText:    { fontSize: 15, fontWeight: 700, letterSpacing: -0.3, color: "#111" },
  navLink:     { fontSize: 13, color: "#666", textDecoration: "none" },

  // Hero
  hero:        { marginBottom: 36 },
  h1:          { fontSize: 42, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1.5, marginBottom: 14, color: "#111" },
  sub:         { fontSize: 15, color: "#666", lineHeight: 1.65, maxWidth: 500 },

  // Drop zone
  dropzone: {
    border: "1.5px dashed #d0d0d0",
    borderRadius: 14,
    padding: "56px 24px",
    cursor: "pointer",
    background: "#fff",
    marginBottom: 16,
    transition: "border-color .2s, background .2s",
    userSelect: "none",
  },
  dropzoneActive: {
    borderColor: "#888",
    background: "#f8f8f8",
    cursor: "wait",
  },
  dzInner:     { display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  dzIconWrap:  { width: 52, height: 52, background: "#f5f5f5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  dzIcon:      { fontSize: 24 },
  dzLabel:     { fontSize: 15, fontWeight: 600, color: "#111" },
  dzSub:       { fontSize: 13, color: "#999" },
  spinner: {
    width: 28,
    height: 28,
    border: "2.5px solid #eee",
    borderTopColor: "#111",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  // Error
  error: {
    fontSize: 13,
    color: "#c0392b",
    background: "#fdf2f2",
    border: "1px solid #f5c6cb",
    borderRadius: 8,
    padding: "10px 14px",
    marginBottom: 16,
    lineHeight: 1.5,
  },

  // Doc types
  typeSection:      { marginTop: 40 },
  typeSectionLabel: { fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
  typeGrid:         { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  typeCard:         { background: "#fff", border: "1px solid #efefef", borderRadius: 10, padding: "14px 16px" },
  typeIcon:         { fontSize: 20, display: "block", marginBottom: 6 },
  typeLabel:        { fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 3 },
  typeDesc:         { fontSize: 12, color: "#888", lineHeight: 1.4 },

  // How it works
  howRow:  { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 32 },
  howCard: { background: "#fff", border: "1px solid #efefef", borderRadius: 10, padding: "14px 16px" },
  howIcon: { fontSize: 18, display: "block", marginBottom: 8 },
  howTitle:{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 4 },
  howDesc: { fontSize: 12, color: "#888", lineHeight: 1.4 },

  // ── Step 2 — confirm ──
  confirmWrap: { display: "flex", flexDirection: "column", gap: 16 },

  confirmFile: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#fff",
    border: "1px solid #efefef",
    borderRadius: 12,
    padding: "16px 18px",
  },
  confirmFileIcon: { fontSize: 28, flexShrink: 0 },
  confirmFileInfo: { flex: 1 },
  confirmFileName: { fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 3 },
  confirmFileMeta: { fontSize: 12, color: "#999" },
  changeBtn: {
    fontSize: 12,
    color: "#666",
    background: "none",
    border: "1px solid #e0e0e0",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    flexShrink: 0,
  },

  detectedBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f0f7ff",
    border: "1px solid #cce0ff",
    borderRadius: 12,
    padding: "14px 18px",
  },
  detectedLeft:  { display: "flex", alignItems: "flex-start", gap: 12 },
  detectedIcon:  { fontSize: 24, flexShrink: 0 },
  detectedLabel: { fontSize: 11, color: "#666", marginBottom: 3 },
  detectedType:  { fontSize: 14, fontWeight: 700, color: "#1a56db", marginBottom: 2 },
  detectedDesc:  { fontSize: 12, color: "#888" },
  detectedDot: {
    width: 10,
    height: 10,
    background: "#27ae60",
    borderRadius: "50%",
    flexShrink: 0,
  },

  previewBox: {
    background: "#fff",
    border: "1px solid #efefef",
    borderRadius: 10,
    padding: "14px 16px",
  },
  previewLabel: { fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  previewText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 1.6,
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    maxHeight: 160,
    overflow: "hidden",
  },

  confirmActions: { display: "flex", gap: 10, flexWrap: "wrap" },
  btnGenerate: {
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    background: "#111",
    border: "none",
    borderRadius: 8,
    padding: "12px 28px",
    cursor: "pointer",
  },
  btnSecondary: {
    fontSize: 13,
    color: "#666",
    background: "none",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "12px 18px",
    cursor: "pointer",
  },

  // ── Step 3 — generating ──
  generatingWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 420,
  },
  generatingInner: { textAlign: "center", maxWidth: 380 },
  genLogoWrap:     { marginBottom: 24, display: "flex", justifyContent: "center" },
  genTitle:        { fontSize: 22, fontWeight: 700, color: "#111", marginBottom: 8, letterSpacing: -0.5 },
  genSub:          { fontSize: 14, color: "#999", marginBottom: 36 },
  genSteps:        { textAlign: "left", display: "inline-block" },
  genStepRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "6px 0",
    transition: "opacity .4s",
  },
  genStepDot: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all .3s",
  },
  genActiveDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#111",
  },
  genStepLabel: { fontSize: 14, transition: "all .3s" },
};
