import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocument, updateDocument, previewUrl } from "../services/api";


const TYPE_LABELS = {
  developer_doc: "Developer Doc",
  client_doc:    "Client Proposal",
  compliance:    "Compliance Letter",
  invoice:       "Invoice",
  timeline:      "Project Timeline",
};

export default function Editor() {
  // const { docId }  = useParams();
  const { id } = useParams();

  const navigate   = useNavigate();
  const [doc, setDoc]         = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [dirty, setDirty]     = useState(false);
  const [copied, setCopied]   = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  // const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getDocument(id)
      .then(res => {
        setDoc(res.data);
        setContent(res.data.content);
      })
      .catch(() => setDoc(null))
      .finally(() => setLoading(false));
  }, [id]);

  const update = (key, val) => {
    setContent(p => ({ ...p, [key]: val }));
    setDirty(true);
  };

  const handleSave = async () => {
    if (!dirty) return;
    setSaving(true);
    try {
      await updateDocument(id, content);
      setDirty(false);
      setSaved(true);
      setIframeKey(k => k + 1);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // REPLACE the entire handleDownloadPDF function with this:
// const handleDownloadPDF = () => {
//   window.open(
//     `http://localhost:8000/api/doc/${id}/preview?autoprint=1`,
//     "_blank",
//     "width=900,height=700"
//   );
// };

const handleDownloadPDF = () => {
  window.open(
    `http://localhost:8000/api/doc/${id}/preview?autoprint=1`,
    "_blank"
  );
};
//  const handleDownloadPDF = async () => {
//   try {
//     const response = await fetch(previewUrl(id));
//     const html = await response.text();

//     const tempDiv = document.createElement("div");
//     tempDiv.style.position = "absolute";
//     tempDiv.style.left = "-9999px";
//     tempDiv.style.width = "794px"; // A4 width
//     tempDiv.style.background = "#fff";
//     tempDiv.innerHTML = html;

//     document.body.appendChild(tempDiv);

//     // render hone ka wait
//     await new Promise(resolve =>
//       setTimeout(resolve, 500)
//     );

//     const canvas = await html2canvas(tempDiv, {
//       scale: 2,
//       useCORS: true,
//       backgroundColor: "#ffffff",
//     });

//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");

//     const pdfWidth = 210;
//     const pdfHeight = 297;

//     // Full page fit
//     pdf.addImage(
//       imgData,
//       "PNG",
//       0,
//       0,
//       pdfWidth,
//       pdfHeight
//     );

//     pdf.save(
//       `${doc?.project_name || "invoice"}.pdf`
//     );

//     document.body.removeChild(tempDiv);

//   } catch (err) {
//     console.error(err);
//     alert("PDF download failed");
//   }
// };
 
   

// const handleDownloadPdf = async () => {
//   setDownloading(true);
//   try {
//     const filename = `${doc.project_name || id}.pdf`;
//     await downloadPdf(id, filename);
//   } catch (err) {
//     alert(`PDF download failed: ${err.message}`);
//   } finally {
//     setDownloading(false);
//   }
// };

//   const handleDownloadPDF = () => {
//   const iframe = document.querySelector("iframe");

//   if (!iframe) {
//     alert("Preview not found");
//     return;
//   }

//   const iframeDoc =
//     iframe.contentDocument ||
//     iframe.contentWindow.document;

//   const element = iframeDoc.body;

//   const options = {
//     margin: 0,
//     filename: `${doc.project_name || "document"}.pdf`,
//     image: {
//       type: "jpeg",
//       quality: 1,
//     },
//     html2canvas: {
//       scale: 2,
//       useCORS: true,
//     },
//     jsPDF: {
//       unit: "mm",
//       format: "a4",
//       orientation: "portrait",
//     },
//   };

//   html2pdf().set(options).from(element).save();
// };

  // ── Loading state ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={s.centerScreen}>
        <div style={s.spinner} />
        <p style={s.loadingText}>Loading document...</p>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────
  if (!doc) {
    return (
      <div style={s.centerScreen}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <p style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 8 }}>
          Document not found
        </p>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>
          This link may have expired or been deleted.
        </p>
        <button style={s.btnPrimary} onClick={() => navigate("/")}>
          ← Back to home
        </button>
      </div>
    );
  }

  return (
    <div style={s.page}>

      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div style={s.topbar}>
        <div style={s.topLeft}>
          {/* Logo */}
          <a href="/" style={s.topLogo}>
            <AsteriskIcon size={16} />
          </a>
          <div style={s.topDivider} />
          {/* Doc info */}
          <span style={s.docName}>{doc.project_name}</span>
          <TypeBadge type={doc.template_type} />
          {dirty && <span style={s.unsavedDot} title="Unsaved changes" />}
        </div>

        <div style={s.topRight}>
          {/* Save button */}
          {dirty && (
            <button
              style={saving ? s.btnSavingDisabled : s.btnSave}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          )}
          {saved && !dirty && (
            <span style={s.savedPill}>✓ Saved</span>
          )}

          {/* Toggle panel */}
          <button
            style={s.btnIcon}
            onClick={() => setPanelOpen(p => !p)}
            title={panelOpen ? "Hide editor" : "Show editor"}
          >
            {panelOpen ? "◀" : "▶"}
          </button>

          {/* Share link */}
          <button style={s.btnOutline} onClick={handleCopyLink}>
            {copied ? "✓ Copied!" : "🔗 Share link"}
          </button>
          {/* Download PDF */}
        
  <button
  style={s.btnOutline}
  onClick={handleDownloadPDF}
>
  ⬇ Download PDF
</button>
{/* <button
  style={s.btnOutline}
  onClick={() => {
    const win = window.open(previewUrl(id), "_blank");
    setTimeout(() => {
      if (win) win.print();
    }, 1500); // 1.5 sec wait — page load hone do
  }}
>
  ⬇ Download PDF
</button> */}

          {/* Open full page */}
          <a
            href={previewUrl(id)}
            // target="_blank"
            rel="noreferrer"
            style={s.btnOutline}
          >
            Open ↗
          </a>

          {/* Back to all docs */}
          {/* <a href="/documents" style={s.btnOutline}>
            All docs
          </a> */}
        </div>
      </div>

      {/* ── Two-panel layout ──────────────────────────────────────── */}
      <div style={s.panels}>

        {/* Left — edit panel */}
        {panelOpen && (
          <div style={s.leftPanel}>
            <div style={s.panelHeader}>
              <span style={s.panelTitle}>Edit content</span>
              <span style={s.panelSubtitle}>{TYPE_LABELS[doc.template_type]}</span>
            </div>
            <div style={s.panelScroll}>
              {doc.template_type === "developer_doc" && (
                <DevDocFields content={content} update={update} />
              )}
              {doc.template_type === "client_doc" && (
                <ClientDocFields content={content} update={update} />
              )}
              {doc.template_type === "compliance" && (
                <ComplianceFields content={content} update={update} />
              )}
              {doc.template_type === "invoice" && (
                <InvoiceFields content={content} update={update} />
              )}
              {doc.template_type === "timeline" && (     // ← ADD THIS BLOCK
  <TimelineFields content={content} update={update} />
)}
            </div>

            {/* Save footer */}
            {dirty && (
              <div style={s.saveFooter}>
                <button
                  style={saving ? s.btnSavingDisabled : s.btnSaveFull}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Right — live preview */}
        <div style={s.rightPanel}>
          <div style={s.iframeWrap}>
            <iframe
              key={iframeKey}
              src={previewUrl(id)}
              style={s.iframe}
              title="Document preview"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// FIELD PANELS — one per doc type
// ══════════════════════════════════════════════════════════════════════

// ── 1. Developer Doc ──────────────────────────────────────────────────
function DevDocFields({ content, update }) {
  const updateFeature = (fi, key, val) => {
    const updated = [...content.features];
    updated[fi] = { ...updated[fi], [key]: val };
    update("features", updated);
  };

  const updatePoint = (fi, pi, val) => {
    const updated = [...content.features];
    const pts = [...updated[fi].points];
    pts[pi] = typeof pts[pi] === "object"
      ? { ...pts[pi], text: val }
      : val;
    updated[fi] = { ...updated[fi], points: pts };
    update("features", updated);
  };

  const updateUvp = (i, key, val) => {
    const updated = [...(content.uvp || [])];
    updated[i] = { ...updated[i], [key]: val };
    update("uvp", updated);
  };

  return (
    <div style={f.wrap}>
      <Field label="Project name" value={content.project_name} onChange={v => update("project_name", v)} />
      <Field label="Tagline"      value={content.tagline}      onChange={v => update("tagline", v)} />
      <Field label="Overview"     value={content.overview}     onChange={v => update("overview", v)} multiline />

      <SectionLabel>Features</SectionLabel>
      {content.features?.map((feat, fi) => (
        <div key={fi} style={f.card}>
          <input
            style={f.cardTitle}
            value={feat.title}
            onChange={e => updateFeature(fi, "title", e.target.value)}
            placeholder="Feature title"
          />
          {feat.points?.map((pt, pi) => (
            <div key={pi} style={f.pointRow}>
              <span style={f.bullet}>◆</span>
              <input
                style={f.pointInput}
                value={typeof pt === "object" ? pt.text : pt}
                onChange={e => updatePoint(fi, pi, e.target.value)}
                placeholder="Point"
              />
            </div>
          ))}
        </div>
      ))}

      {content.uvp?.length > 0 && (
        <>
          <SectionLabel>UVP</SectionLabel>
          {content.uvp.map((u, i) => (
            <div key={i} style={f.uvpRow}>
              <input
                style={{ ...f.input, fontWeight: 600, width: "44%" }}
                value={u.keyword}
                onChange={e => updateUvp(i, "keyword", e.target.value)}
                placeholder="KEYWORD"
              />
              <span style={{ color: "#ccc", padding: "0 4px", fontSize: 12 }}>→</span>
              <input
                style={{ ...f.input, flex: 1 }}
                value={u.description}
                onChange={e => updateUvp(i, "description", e.target.value)}
                placeholder="Description"
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ── 2. Client Proposal ────────────────────────────────────────────────
function ClientDocFields({ content, update }) {
  const updatePara = (i, val) => {
    const updated = [...content.body_paragraphs];
    updated[i] = val;
    update("body_paragraphs", updated);
  };

  const updateItem = (i, key, val) => {
    const updated = [...content.line_items];
    updated[i] = { ...updated[i], [key]: val };
    update("line_items", updated);
  };

  const addItem = () =>
    update("line_items", [...content.line_items, { description: "", hours: "", unit_price: "", amount: "" }]);

  const removeItem = (i) =>
    update("line_items", content.line_items.filter((_, idx) => idx !== i));

  return (
    <div style={f.wrap}>
      <SectionLabel>Page 1 — Letter</SectionLabel>
      <Field label="Client name"       value={content.client_name}         onChange={v => update("client_name", v)} />
      <Field label="Organisation"      value={content.client_organisation} onChange={v => update("client_organisation", v)} />
      <Field label="Place"             value={content.client_place}        onChange={v => update("client_place", v)} />
      <Field label="Date"              value={content.date}                onChange={v => update("date", v)} />
      <Field label="Sender name"       value={content.sender_name}         onChange={v => update("sender_name", v)} />
      <Field label="Sender title"      value={content.sender_designation}  onChange={v => update("sender_designation", v)} />

      <SectionLabel>Letter body</SectionLabel>
      {content.body_paragraphs?.map((p, i) => (
        <div key={i} style={f.group}>
          <div style={f.label}>Paragraph {i + 1}</div>
          <textarea style={f.textarea} value={p} rows={3} onChange={e => updatePara(i, e.target.value)} />
        </div>
      ))}

      <SectionLabel>Page 2 — Quotation</SectionLabel>
      <Field label="Quotation number" value={content.quotation_number} onChange={v => update("quotation_number", v)} />
      <Field label="Project name"     value={content.project_name}     onChange={v => update("project_name", v)} />

      <SectionLabel>Line items</SectionLabel>
      {content.line_items?.map((item, i) => (
        <div key={i} style={f.card}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#aaa" }}>Item {i + 1}</span>
            <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
          </div>
          <Field label="Description" value={item.description} onChange={v => updateItem(i, "description", v)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
            {["hours", "unit_price", "amount"].map(key => (
              <div key={key} style={f.group}>
                <div style={f.label}>{key.replace("_", " ")}</div>
                <input style={f.input} value={item[key] || ""} onChange={e => updateItem(i, key, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button style={f.addBtn} onClick={addItem}>+ Add line item</button>

      <SectionLabel>Totals</SectionLabel>
      <Field label="Subtotal"   value={content.subtotal}   onChange={v => update("subtotal", v)} />
      <Field label="GST amount" value={content.gst_amount} onChange={v => update("gst_amount", v)} />
      <Field label="Total"      value={content.total}      onChange={v => update("total", v)} />
    </div>
  );
}

// ── 3. Compliance ─────────────────────────────────────────────────────
function ComplianceFields({ content, update }) {
  const updatePara = (i, val) => {
    const updated = [...content.body_paragraphs];
    updated[i] = val;
    update("body_paragraphs", updated);
  };

  return (
    <div style={f.wrap}>
      <Field label="Letter type"           value={content.letter_type}           onChange={v => update("letter_type", v)} />
      <Field label="Date"                  value={content.date}                  onChange={v => update("date", v)} />
      <Field label="Recipient name"        value={content.recipient_name}        onChange={v => update("recipient_name", v)} />
      <Field label="Recipient designation" value={content.recipient_designation} onChange={v => update("recipient_designation", v)} />
      <Field label="Recipient company"     value={content.recipient_company}     onChange={v => update("recipient_company", v)} />
      <Field label="Subject"               value={content.subject}               onChange={v => update("subject", v)} />
      <Field label="Salutation"            value={content.salutation}            onChange={v => update("salutation", v)} />

      <SectionLabel>Body paragraphs</SectionLabel>
      {content.body_paragraphs?.map((p, i) => (
        <div key={i} style={f.group}>
          <div style={f.label}>Paragraph {i + 1}</div>
          <textarea style={f.textarea} value={p} rows={3} onChange={e => updatePara(i, e.target.value)} />
        </div>
      ))}

      <SectionLabel>Sign-off</SectionLabel>
      <Field label="Closing"              value={content.closing}              onChange={v => update("closing", v)} />
      <Field label="Sender name"          value={content.sender_name}          onChange={v => update("sender_name", v)} />
      <Field label="Sender designation"   value={content.sender_designation}   onChange={v => update("sender_designation", v)} />
      <Field label="Sender contact"       value={content.sender_contact}       onChange={v => update("sender_contact", v)} />
    </div>
  );
}

// ── 4. Invoice ────────────────────────────────────────────────────────
function InvoiceFields({ content, update }) {
  const updateItem = (i, key, val) => {
    const updated = [...content.line_items];
    updated[i] = { ...updated[i], [key]: val };
    update("line_items", updated);
  };

  const addItem = () =>
    update("line_items", [...(content.line_items || []), { description: "", hours: "", unit_price: "", amount: "" }]);

  const removeItem = (i) =>
    update("line_items", content.line_items.filter((_, idx) => idx !== i));

  return (
    <div style={f.wrap}>
      <SectionLabel>Invoice info</SectionLabel>
      <Field label="Invoice number" value={content.invoice_number} onChange={v => update("invoice_number", v)} />
      <Field label="Date"           value={content.date}           onChange={v => update("date", v)} />
      <Field label="Project name"   value={content.project_name}   onChange={v => update("project_name", v)} />

      <SectionLabel>Client info</SectionLabel>
      <Field label="Client name"    value={content.client_name}    onChange={v => update("client_name", v)} />
      <Field label="Client email"   value={content.client_email}   onChange={v => update("client_email", v)} />
      <Field label="Client address" value={content.client_address} onChange={v => update("client_address", v)} />

      <SectionLabel>Project description</SectionLabel>
      <Field label="Description"    value={content.project_description} onChange={v => update("project_description", v)} multiline />

      <SectionLabel>Line items</SectionLabel>
      {content.line_items?.map((item, i) => (
        <div key={i} style={f.card}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#aaa" }}>Item {i + 1}</span>
            <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
          </div>
          <Field label="Description" value={item.description} onChange={v => updateItem(i, "description", v)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
            {["hours", "unit_price", "amount"].map(key => (
              <div key={key} style={f.group}>
                <div style={f.label}>{key.replace("_", " ")}</div>
                <input style={f.input} value={item[key] || ""} onChange={e => updateItem(i, key, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button style={f.addBtn} onClick={addItem}>+ Add line item</button>

      <SectionLabel>Totals</SectionLabel>
      <Field label="Subtotal"    value={content.subtotal}    onChange={v => update("subtotal", v)} />
      <Field label="GST"         value={content.gst_amount}  onChange={v => update("gst_amount", v)} />
      <Field label="Total"       value={content.total}       onChange={v => update("total", v)} />

      <SectionLabel>Payment & status</SectionLabel>
      <Field label="Payment status" value={content.payment_status} onChange={v => update("payment_status", v)} />
      <Field label="Payment date"   value={content.payment_date}   onChange={v => update("payment_date", v)} />
      <Field label="Bank name"      value={content.bank_name}      onChange={v => update("bank_name", v)} />
      <Field label="Account name"   value={content.account_name}   onChange={v => update("account_name", v)} />
      <Field label="Phone number"   value={content.phone_number}   onChange={v => update("phone_number", v)} />
      <Field label="UPI ID"         value={content.upi_id}         onChange={v => update("upi_id", v)} />
      <Field label="Notes"          value={content.notes}          onChange={v => update("notes", v)} multiline />
    </div>
  );
}
function TimelineFields({ content, update }) {

  const updateItem = (i, key, val) => {
    const updated = [...(content.timeline_items || [])];
    updated[i] = { ...updated[i], [key]: val };
    update("timeline_items", updated);
  };

  const addItem = () =>
    update("timeline_items", [
      ...(content.timeline_items || []),
      { description: "", timeline: "", hours: "" }
    ]);

  const removeItem = (i) =>
    update("timeline_items",
      (content.timeline_items || []).filter((_, idx) => idx !== i)
    );

  return (
    <div style={f.wrap}>

      <SectionLabel>Project Info</SectionLabel>
      <Field label="Project name"        value={content.project_name}        onChange={v => update("project_name", v)} />
      <Field label="Project description" value={content.project_description} onChange={v => update("project_description", v)} />
      <Field label="Client name"         value={content.client_name}         onChange={v => update("client_name", v)} />

      <SectionLabel>Timeline Items</SectionLabel>
      {(content.timeline_items || []).map((item, i) => (
        <div key={i} style={f.card}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#aaa" }}>Phase {i + 1}</span>
            <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
          </div>
          <Field
            label="Description"
            value={item.description}
            onChange={v => updateItem(i, "description", v)}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
            <div style={f.group}>
              <div style={f.label}>Timeline</div>
              <input
                style={f.input}
                value={item.timeline || ""}
                onChange={e => updateItem(i, "timeline", e.target.value)}
                placeholder="e.g. 5 days"
              />
            </div>
            <div style={f.group}>
              <div style={f.label}>Hours</div>
              <input
                style={f.input}
                value={item.hours || ""}
                onChange={e => updateItem(i, "hours", e.target.value)}
                placeholder="e.g. 20"
              />
            </div>
          </div>
        </div>
      ))}
      <button style={f.addBtn} onClick={addItem}>+ Add phase</button>

      <SectionLabel>Totals</SectionLabel>
      <Field label="Total time"          value={content.total_time}       onChange={v => update("total_time", v)}       placeholder="e.g. 62 DAYS" />
      <Field label="Expected dev time"   value={content.expected_dev_time} onChange={v => update("expected_dev_time", v)} placeholder="e.g. 58 DAYS" />
      <Field label="Expected closure"    value={content.expected_closure}  onChange={v => update("expected_closure", v)} placeholder="e.g. 90 DAYS" />
      <Field label="Closure date"        value={content.closure_date}      onChange={v => update("closure_date", v)}     placeholder="DD MM YYYY" />

    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// SHARED HELPER COMPONENTS
// ══════════════════════════════════════════════════════════════════════

function Field({ label, value, onChange, multiline }) {
  return (
    <div style={f.group}>
      <div style={f.label}>{label}</div>
      {multiline
        ? <textarea style={{ ...f.input, minHeight: 68, resize: "vertical" }} value={value || ""} onChange={e => onChange(e.target.value)} />
        : <input style={f.input} value={value || ""} onChange={e => onChange(e.target.value)} />
      }
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={f.sectionLabel}>{children}</div>;
}

function TypeBadge({ type }) {
  const colors = {
    developer_doc: { bg: "#EEEDFE", color: "#534AB7" },
    client_doc:    { bg: "#E1F5EE", color: "#0F6E56" },
    compliance:    { bg: "#FAEEDA", color: "#854F0B" },
    invoice:       { bg: "#FAECE7", color: "#993C1D" },
  };
  const labels = {
    developer_doc: "Developer Doc",
    client_doc:    "Client Proposal",
    compliance:    "Compliance",
    invoice:       "Invoice",
  };
  const c = colors[type] || { bg: "#f0f0f0", color: "#666" };
  return (
    <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 20, fontWeight: 500, background: c.bg, color: c.color }}>
      {labels[type] || type}
    </span>
  );
}

function AsteriskIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <path d="M22 4 L22 40 M4 22 L40 22 M7.5 7.5 L36.5 36.5 M36.5 7.5 L7.5 36.5"
        stroke="#111" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════════

const s = {
  page:        { height: "100vh", display: "flex", flexDirection: "column", fontFamily: "system-ui,-apple-system,sans-serif", background: "#f2f2f2", overflow: "hidden" },
  centerScreen:{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: "system-ui,sans-serif" },
  loadingText: { fontSize: 14, color: "#888" },
  spinner:     { width: 32, height: 32, border: "2.5px solid #eee", borderTopColor: "#111", borderRadius: "50%", animation: "spin .8s linear infinite" },
  
// btnOutlineDisabled: {
//   fontSize: 12,
//   color: "#aaa",
//   background: "#fafafa",
//   border: "1px solid #e0e0e0",
//   borderRadius: 7,
//   padding: "6px 12px",
//   cursor: "not-allowed",
//   textDecoration: "none",
//   display: "inline-block",
//   lineHeight: "normal",
// },

  // Topbar
  topbar:      { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", height: 52, background: "#fff", borderBottom: "1px solid #e8e8e8", flexShrink: 0, gap: 12 },
  topLeft:     { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
  topRight:    { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  topLogo:     { display: "flex", alignItems: "center", textDecoration: "none", padding: "4px", borderRadius: 6, flexShrink: 0 },
  topDivider:  { width: 1, height: 20, background: "#e8e8e8" },
  docName:     { fontSize: 14, fontWeight: 600, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 },
  unsavedDot:  { width: 7, height: 7, borderRadius: "50%", background: "#f39c12", flexShrink: 0 },

  btnSave:     { fontSize: 13, fontWeight: 600, background: "#111", color: "#fff", border: "none", borderRadius: 7, padding: "6px 16px", cursor: "pointer" },
  btnSavingDisabled: { fontSize: 13, background: "#888", color: "#fff", border: "none", borderRadius: 7, padding: "6px 16px" },
  btnSaveFull: { width: "100%", fontSize: 13, fontWeight: 600, background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", cursor: "pointer" },
  btnPrimary:  { fontSize: 13, fontWeight: 600, background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer" },
  btnOutline:  { fontSize: 12, color: "#555", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 7, padding: "6px 12px", cursor: "pointer", textDecoration: "none", display: "inline-block", lineHeight: "normal" },
  btnIcon:     { fontSize: 11, color: "#888", background: "none", border: "1px solid #e8e8e8", borderRadius: 6, padding: "5px 8px", cursor: "pointer" },
  savedPill:   { fontSize: 12, color: "#27ae60", fontWeight: 500 },

  // Panels
  panels:      { display: "flex", flex: 1, overflow: "hidden" },

  leftPanel:   { width: 300, display: "flex", flexDirection: "column", background: "#fff", borderRight: "1px solid #e8e8e8", flexShrink: 0, overflow: "hidden" },
  panelHeader: { padding: "14px 16px 10px", borderBottom: "1px solid #f0f0f0", flexShrink: 0 },
  panelTitle:  { fontSize: 12, fontWeight: 700, color: "#111", display: "block", marginBottom: 2 },
  panelSubtitle:{ fontSize: 11, color: "#aaa" },
  panelScroll: { flex: 1, overflowY: "auto", padding: "14px 16px", },
  saveFooter:  { padding: "12px 16px", borderTop: "1px solid #f0f0f0", flexShrink: 0 },

  rightPanel:  { flex: 1, display: "flex", flexDirection: "column", padding: 16, overflow: "hidden" },
  iframeWrap:  { flex: 1, borderRadius: 10, overflow: "hidden", border: "1px solid #e0e0e0", background: "#fff" },
  iframe:      { width: "100%", height: "100%", border: "none", display: "block" },
};

const f = {
  wrap:         { display: "flex", flexDirection: "column", gap: 10 },
  group:        { display: "flex", flexDirection: "column", gap: 4 },
  label:        { fontSize: 11, fontWeight: 600, color: "#888", textTransform: "capitalize" },
  input:        { width: "100%", border: "1px solid #e8e8e8", borderRadius: 6, padding: "7px 9px", fontSize: 12, color: "#333", outline: "none", fontFamily: "inherit", lineHeight: 1.5, background: "#fafafa" },
  textarea:     { width: "100%", border: "1px solid #e8e8e8", borderRadius: 6, padding: "7px 9px", fontSize: 12, color: "#333", outline: "none", fontFamily: "inherit", lineHeight: 1.5, resize: "vertical", background: "#fafafa" },
  sectionLabel: { fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, paddingTop: 8, paddingBottom: 4, borderBottom: "1px solid #f0f0f0", marginBottom: 4 },
  card:         { border: "1px solid #efefef", borderRadius: 8, padding: "10px 12px", background: "#fafafa" },
  cardTitle:    { width: "100%", border: "none", borderBottom: "1px solid #e8e8e8", padding: "3px 0 6px", fontSize: 12, fontWeight: 700, outline: "none", background: "transparent", marginBottom: 8, fontFamily: "inherit" },
  pointRow:     { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 },
  bullet:       { color: "#ccc", fontSize: 8, flexShrink: 0 },
  pointInput:   { flex: 1, border: "none", borderBottom: "1px solid #f0f0f0", fontSize: 12, padding: "2px 0", outline: "none", background: "transparent", color: "#444", fontFamily: "inherit" },
  uvpRow:       { display: "flex", alignItems: "center", gap: 4 },
  addBtn:       { fontSize: 12, color: "#555", background: "none", border: "1.5px dashed #ddd", borderRadius: 6, padding: "7px 12px", cursor: "pointer", textAlign: "left", fontFamily: "inherit" },
  removeBtn:    { fontSize: 11, color: "#c0392b", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" },
};
