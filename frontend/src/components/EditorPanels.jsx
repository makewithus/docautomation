// ── EditorPanels.jsx ─────────────────────────────────────────────────────
// Field panels for all 5 document types used in Editor.jsx left panel.
//
// Usage in Editor.jsx:
//   import { DevDocFields, ClientDocFields, ComplianceFields,
//            InvoiceFields, TimelineFields } from "../components/EditorPanels";
//
//   {doc.template_type === "developer_doc" && <DevDocFields content={content} update={update} />}
//   {doc.template_type === "client_doc"    && <ClientDocFields content={content} update={update} />}
//   {doc.template_type === "compliance"    && <ComplianceFields content={content} update={update} />}
//   {doc.template_type === "invoice"       && <InvoiceFields content={content} update={update} />}
//   {doc.template_type === "timeline"      && <TimelineFields content={content} update={update} />}

import Field, { SectionLabel, FieldRow } from "./Field";

// ══════════════════════════════════════════════════════════════════════════
// 1. DEVELOPER DOC
// ══════════════════════════════════════════════════════════════════════════
export function DevDocFields({ content, update }) {

  const updateFeatureTitle = (fi, val) => {
    const updated = [...content.features];
    updated[fi] = { ...updated[fi], title: val };
    update("features", updated);
  };

  const updateFeaturePoint = (fi, pi, val) => {
    const updated = [...content.features];
    const pts = [...updated[fi].points];
    pts[pi] = typeof pts[pi] === "object" ? { ...pts[pi], text: val } : val;
    updated[fi] = { ...updated[fi], points: pts };
    update("features", updated);
  };

  const updateUvp = (i, key, val) => {
    const updated = [...(content.uvp || [])];
    updated[i] = { ...updated[i], [key]: val };
    update("uvp", updated);
  };

  return (
    <div style={w.wrap}>

      <SectionLabel>Project info</SectionLabel>
      <Field label="Project name" value={content.project_name} onChange={v => update("project_name", v)} />
      <Field label="Tagline"      value={content.tagline}      onChange={v => update("tagline", v)} />
      <Field label="Overview"     value={content.overview}     onChange={v => update("overview", v)} multiline rows={4} />

      <SectionLabel>Features</SectionLabel>
      {content.features?.map((feat, fi) => (
        <div key={fi} style={w.card}>
          <input
            style={w.cardTitleInput}
            value={feat.title}
            onChange={e => updateFeatureTitle(fi, e.target.value)}
            placeholder="Feature section title"
          />
          {feat.points?.map((pt, pi) => (
            <div key={pi} style={w.pointRow}>
              <span style={w.pointBullet}>◆</span>
              <input
                style={w.pointInput}
                value={typeof pt === "object" ? pt.text : pt}
                onChange={e => updateFeaturePoint(fi, pi, e.target.value)}
                placeholder="Feature point"
              />
            </div>
          ))}
        </div>
      ))}

      {content.uvp?.length > 0 && (
        <>
          <SectionLabel>Unique Value Proposition</SectionLabel>
          {content.uvp.map((u, i) => (
            <div key={i} style={w.uvpRow}>
              <input
                style={{ ...w.input, fontWeight: 600, width: "44%" }}
                value={u.keyword}
                onChange={e => updateUvp(i, "keyword", e.target.value)}
                placeholder="KEYWORD"
              />
              <span style={{ color: "#ccc", padding: "0 4px", fontSize: 13 }}>→</span>
              <input
                style={{ ...w.input, flex: 1 }}
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

// ══════════════════════════════════════════════════════════════════════════
// 2. CLIENT DOC (Project Proposal)
// ══════════════════════════════════════════════════════════════════════════
export function ClientDocFields({ content, update }) {

  const updatePara = (i, val) => {
    const updated = [...(content.body_paragraphs || [])];
    updated[i] = val;
    update("body_paragraphs", updated);
  };

  const updateItem = (i, key, val) => {
    const updated = [...(content.line_items || [])];
    updated[i] = { ...updated[i], [key]: val };
    update("line_items", updated);
  };

  const addItem = () =>
    update("line_items", [...(content.line_items || []),
      { description: "", hours: "", unit_price: "", amount: "" }]);

  const removeItem = (i) =>
    update("line_items", content.line_items.filter((_, idx) => idx !== i));

  return (
    <div style={w.wrap}>

      <SectionLabel>Page 1 — Letter</SectionLabel>
      <Field label="Client name"      value={content.client_name}         onChange={v => update("client_name", v)} />
      <Field label="Organisation"     value={content.client_organisation} onChange={v => update("client_organisation", v)} />
      <Field label="Place"            value={content.client_place}        onChange={v => update("client_place", v)} />
      <Field label="Date"             value={content.date}                onChange={v => update("date", v)} />
      <Field label="Sender name"      value={content.sender_name}         onChange={v => update("sender_name", v)} />
      <Field label="Sender title"     value={content.sender_designation}  onChange={v => update("sender_designation", v)} />

      <SectionLabel>Letter body paragraphs</SectionLabel>
      {content.body_paragraphs?.map((p, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <div style={w.smallLabel}>Paragraph {i + 1}</div>
          <textarea
            style={{ ...w.input, minHeight: 64, resize: "vertical", width: "100%" }}
            value={p}
            rows={3}
            onChange={e => updatePara(i, e.target.value)}
          />
        </div>
      ))}

      <SectionLabel>Page 2 — Quotation</SectionLabel>
      <Field label="Quotation number" value={content.quotation_number} onChange={v => update("quotation_number", v)} />
      <Field label="Project name"     value={content.project_name}     onChange={v => update("project_name", v)} />

      <SectionLabel>Line items</SectionLabel>
      {content.line_items?.map((item, i) => (
        <div key={i} style={w.card}>
          <div style={w.cardHeaderRow}>
            <span style={w.cardIndexLabel}>Item {i + 1}</span>
            <button style={w.removeBtnSmall} onClick={() => removeItem(i)}>✕</button>
          </div>
          <Field label="Description" value={item.description} onChange={v => updateItem(i, "description", v)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
            {[["hours", "Hours"], ["unit_price", "Unit price"], ["amount", "Amount"]].map(([key, lbl]) => (
              <div key={key}>
                <div style={w.smallLabel}>{lbl}</div>
                <input style={w.input} value={item[key] || ""} onChange={e => updateItem(i, key, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button style={w.addBtn} onClick={addItem}>+ Add line item</button>

      <SectionLabel>Totals</SectionLabel>
      <Field label="Subtotal"   value={content.subtotal}   onChange={v => update("subtotal", v)} />
      <Field label="GST amount" value={content.gst_amount} onChange={v => update("gst_amount", v)} />
      <Field label="Total"      value={content.total}      onChange={v => update("total", v)} />

    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 3. COMPLIANCE (Service Provision Agreement / Letters)
// ══════════════════════════════════════════════════════════════════════════
export function ComplianceFields({ content, update }) {

  const updatePara = (i, val) => {
    const updated = [...(content.body_paragraphs || [])];
    updated[i] = val;
    update("body_paragraphs", updated);
  };

  const updateList = (field, i, val) => {
    const updated = [...(content[field] || [])];
    updated[i] = val;
    update(field, updated);
  };

  const updatePhase = (i, key, val) => {
    const updated = [...(content.payment_phases || [])];
    updated[i] = { ...updated[i], [key]: val };
    update("payment_phases", updated);
  };

  return (
    <div style={w.wrap}>

      <Field label="Client name"  value={content.client_name} onChange={v => update("client_name", v)} />

      {/* Agreement type */}
      {content.letter_type !== undefined && (
        <Field label="Letter type" value={content.letter_type} onChange={v => update("letter_type", v)} />
      )}

      <SectionLabel>Provider obligations</SectionLabel>
      {content.provider_obligations?.map((item, i) => (
        <div key={i} style={w.pointRow}>
          <span style={w.pointBullet}>•</span>
          <input
            style={w.pointInput}
            value={item}
            onChange={e => updateList("provider_obligations", i, e.target.value)}
          />
        </div>
      ))}

      <SectionLabel>Client obligations</SectionLabel>
      {content.client_obligations?.map((item, i) => (
        <div key={i} style={w.pointRow}>
          <span style={w.pointBullet}>•</span>
          <input
            style={w.pointInput}
            value={item}
            onChange={e => updateList("client_obligations", i, e.target.value)}
          />
        </div>
      ))}

      <SectionLabel>Payment phases</SectionLabel>
      {content.payment_phases?.map((phase, i) => (
        <div key={i} style={w.card}>
          <Field label="Phase name" value={phase.name}     onChange={v => updatePhase(i, "name", v)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
            <div>
              <div style={w.smallLabel}>Timeline</div>
              <input style={w.input} value={phase.timeline || ""} onChange={e => updatePhase(i, "timeline", e.target.value)} />
            </div>
            <div>
              <div style={w.smallLabel}>Amount</div>
              <input style={w.input} value={phase.amount || ""} onChange={e => updatePhase(i, "amount", e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <SectionLabel>Legal sections</SectionLabel>
      <Field label="Confidentiality" value={content.confidentiality_text} onChange={v => update("confidentiality_text", v)} multiline rows={3} />
      <Field label="Modifications"   value={content.modifications_text}   onChange={v => update("modifications_text", v)} multiline rows={2} />
      <Field label="Acceptance"      value={content.acceptance_text}      onChange={v => update("acceptance_text", v)} multiline rows={2} />

    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 4. INVOICE
// ══════════════════════════════════════════════════════════════════════════
export function InvoiceFields({ content, update }) {

  const updateItem = (i, key, val) => {
    const updated = [...(content.line_items || [])];
    updated[i] = { ...updated[i], [key]: val };
    update("line_items", updated);
  };

  const addItem = () =>
    update("line_items", [...(content.line_items || []),
      { description: "", hours: "", unit_price: "", amount: "" }]);

  const removeItem = (i) =>
    update("line_items", content.line_items.filter((_, idx) => idx !== i));

  return (
    <div style={w.wrap}>

      <SectionLabel>Invoice info</SectionLabel>
      <Field label="Invoice number" value={content.invoice_number} onChange={v => update("invoice_number", v)} />
      <Field label="Date"           value={content.date}           onChange={v => update("date", v)} />
      <Field label="Project name"   value={content.project_name}   onChange={v => update("project_name", v)} />

      <SectionLabel>Client info</SectionLabel>
      <Field label="Client name"    value={content.client_name}    onChange={v => update("client_name", v)} />
      <Field label="Client email"   value={content.client_email}   onChange={v => update("client_email", v)} />
      <Field label="Client address" value={content.client_address} onChange={v => update("client_address", v)} />

      <SectionLabel>Project description</SectionLabel>
      <Field label="Description" value={content.project_description} onChange={v => update("project_description", v)} multiline rows={3} />

      <SectionLabel>Line items</SectionLabel>
      {content.line_items?.map((item, i) => (
        <div key={i} style={w.card}>
          <div style={w.cardHeaderRow}>
            <span style={w.cardIndexLabel}>Item {i + 1}</span>
            <button style={w.removeBtnSmall} onClick={() => removeItem(i)}>✕</button>
          </div>
          <Field label="Description" value={item.description} onChange={v => updateItem(i, "description", v)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
            {[["hours", "Hours"], ["unit_price", "Unit price"], ["amount", "Amount"]].map(([key, lbl]) => (
              <div key={key}>
                <div style={w.smallLabel}>{lbl}</div>
                <input style={w.input} value={item[key] || ""} onChange={e => updateItem(i, key, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button style={w.addBtn} onClick={addItem}>+ Add line item</button>

      <SectionLabel>Totals</SectionLabel>
      <Field label="Subtotal"   value={content.subtotal}   onChange={v => update("subtotal", v)} />
      <Field label="GST"        value={content.gst_amount} onChange={v => update("gst_amount", v)} />
      <Field label="Total"      value={content.total}      onChange={v => update("total", v)} />

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

// ══════════════════════════════════════════════════════════════════════════
// 5. TIMELINE (Project Timeline & Onboarding)
// ══════════════════════════════════════════════════════════════════════════
export function TimelineFields({ content, update }) {

  const updatePhase = (i, key, val) => {
    const updated = [...(content.phases || [])];
    updated[i] = { ...updated[i], [key]: val };
    update("phases", updated);
  };

  const addPhase = () =>
    update("phases", [...(content.phases || []),
      { description: "", timeline: "XX", hours: "XX" }]);

  const removePhase = (i) =>
    update("phases", content.phases.filter((_, idx) => idx !== i));

  return (
    <div style={w.wrap}>

      <SectionLabel>Project info</SectionLabel>
      <Field label="Client name"        value={content.client_name}        onChange={v => update("client_name", v)} />
      <Field label="Project name"       value={content.project_name}       onChange={v => update("project_name", v)} />
      <Field label="Short description"  value={content.project_short_desc} onChange={v => update("project_short_desc", v)}
             hint="e.g. AYURVEDIC ECOM APP WITH AI" />

      <SectionLabel>Timeline phases</SectionLabel>
      {content.phases?.map((phase, i) => (
        <div key={i} style={w.card}>
          <div style={w.cardHeaderRow}>
            <span style={w.cardIndexLabel}>Phase {i + 1}</span>
            <button style={w.removeBtnSmall} onClick={() => removePhase(i)}>✕</button>
          </div>
          <Field
            label="Description"
            value={phase.description}
            onChange={v => updatePhase(i, "description", v)}
            placeholder="e.g. PROJECT FRONTEND DEVELOPMENT"
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
            <div>
              <div style={w.smallLabel}>Timeline</div>
              <input
                style={w.input}
                value={phase.timeline || ""}
                onChange={e => updatePhase(i, "timeline", e.target.value)}
                placeholder="e.g. 2 WEEKS"
              />
            </div>
            <div>
              <div style={w.smallLabel}>Hours</div>
              <input
                style={w.input}
                value={phase.hours || ""}
                onChange={e => updatePhase(i, "hours", e.target.value)}
                placeholder="e.g. 40"
              />
            </div>
          </div>
        </div>
      ))}
      <button style={w.addBtn} onClick={addPhase}>+ Add phase</button>

      <SectionLabel>Summary</SectionLabel>
      <Field label="Total time"          value={content.total_time}        onChange={v => update("total_time", v)}
             hint="e.g. 12 WEEKS" />
      <Field label="Expected dev time"   value={content.expected_dev_time} onChange={v => update("expected_dev_time", v)}
             hint="e.g. 10 WEEKS" />
      <Field label="Expected closure"    value={content.expected_closure}  onChange={v => update("expected_closure", v)}
             hint="e.g. 90 DAYS" />
      <Field label="Closure date"        value={content.closure_date}      onChange={v => update("closure_date", v)}
             hint="e.g. DATE 15 08 2025" />

    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SHARED STYLES
// ══════════════════════════════════════════════════════════════════════════
const w = {
  wrap: {
    display:       "flex",
    flexDirection: "column",
    gap:           10,
  },

  input: {
    width:       "100%",
    border:      "1px solid #e8e8e8",
    borderRadius: 6,
    padding:     "7px 9px",
    fontSize:    12,
    color:       "#333",
    outline:     "none",
    fontFamily:  "inherit",
    lineHeight:  1.5,
    background:  "#fafafa",
  },

  smallLabel: {
    fontSize:      11,
    fontWeight:    600,
    color:         "#888",
    textTransform: "capitalize",
    marginBottom:  3,
  },

  card: {
    border:       "1px solid #efefef",
    borderRadius: 8,
    padding:      "10px 12px",
    background:   "#fafafa",
    marginBottom: 4,
  },

  cardHeaderRow: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   8,
  },

  cardIndexLabel: {
    fontSize:  11,
    color:     "#aaa",
    fontWeight: 500,
  },

  cardTitleInput: {
    width:        "100%",
    border:       "none",
    borderBottom: "1px solid #e8e8e8",
    padding:      "3px 0 6px",
    fontSize:     12,
    fontWeight:   700,
    outline:      "none",
    background:   "transparent",
    marginBottom: 8,
    fontFamily:   "inherit",
  },

  pointRow: {
    display:    "flex",
    alignItems: "center",
    gap:        6,
    marginBottom: 4,
  },

  pointBullet: {
    color:     "#ccc",
    fontSize:  9,
    flexShrink: 0,
  },

  pointInput: {
    flex:         1,
    border:       "none",
    borderBottom: "1px solid #f0f0f0",
    fontSize:     12,
    padding:      "3px 0",
    outline:      "none",
    background:   "transparent",
    color:        "#444",
    fontFamily:   "inherit",
  },

  uvpRow: {
    display:    "flex",
    alignItems: "center",
    gap:        4,
  },

  addBtn: {
    fontSize:     12,
    color:        "#555",
    background:   "none",
    border:       "1.5px dashed #ddd",
    borderRadius: 6,
    padding:      "7px 12px",
    cursor:       "pointer",
    textAlign:    "left",
    fontFamily:   "inherit",
    width:        "100%",
  },

  removeBtnSmall: {
    fontSize:   11,
    color:      "#c0392b",
    background: "none",
    border:     "none",
    cursor:     "pointer",
    padding:    0,
    fontFamily: "inherit",
  },
};
