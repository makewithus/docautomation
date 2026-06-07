// ── Field.jsx ─────────────────────────────────────────────────────────────
// Reusable form field component used across all editor panels
//
// Usage examples:
//
//   Basic input:
//   <Field label="Project name" value={content.project_name} onChange={v => update("project_name", v)} />
//
//   Multiline textarea:
//   <Field label="Overview" value={content.overview} onChange={v => update("overview", v)} multiline />
//
//   With placeholder:
//   <Field label="Client email" value={content.email} onChange={v => update("email", v)} placeholder="client@example.com" />
//
//   Disabled / read-only:
//   <Field label="Invoice ID" value={content.id} disabled />
//
//   With hint text below:
//   <Field label="GST %" value={content.gst} onChange={v => update("gst", v)} hint="Enter 0 if not applicable" />
//
//   Number input:
//   <Field label="Hours" value={content.hours} onChange={v => update("hours", v)} type="number" />

export default function Field({
  label,
  value,
  onChange,
  multiline    = false,
  placeholder  = "",
  disabled     = false,
  hint         = "",
  type         = "text",
  rows         = 3,
  monospace    = false,
  required     = false,
}) {
  const inputStyle = {
    ...s.input,
    ...(disabled   ? s.inputDisabled  : {}),
    ...(monospace  ? s.inputMonospace : {}),
  };

  return (
    <div style={s.group}>

      {/* Label */}
      <label style={s.label}>
        {label}
        {required && <span style={s.required}> *</span>}
      </label>

      {/* Input or Textarea */}
      {multiline ? (
        <textarea
          style={{ ...inputStyle, minHeight: rows * 22, resize: "vertical" }}
          value={value || ""}
          placeholder={placeholder}
          disabled={disabled}
          onChange={e => onChange && onChange(e.target.value)}
          rows={rows}
        />
      ) : (
        <input
          style={inputStyle}
          type={type}
          value={value || ""}
          placeholder={placeholder}
          disabled={disabled}
          onChange={e => onChange && onChange(e.target.value)}
        />
      )}

      {/* Hint */}
      {hint && <span style={s.hint}>{hint}</span>}

    </div>
  );
}

// ── SectionLabel — used to group fields inside editor panels ──────────────
// Usage: <SectionLabel>Payment info</SectionLabel>
export function SectionLabel({ children }) {
  return <div style={sl.wrap}>{children}</div>;
}

// ── FieldRow — puts two fields side by side ───────────────────────────────
// Usage:
//   <FieldRow>
//     <Field label="Hours" value={...} onChange={...} />
//     <Field label="Rate"  value={...} onChange={...} />
//   </FieldRow>
export function FieldRow({ children, gap = 8 }) {
  return (
    <div style={{ display: "flex", gap, alignItems: "flex-start" }}>
      {children}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const s = {
  group: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },

  label: {
    fontSize: 11,
    fontWeight: 600,
    color: "#888",
    textTransform: "capitalize",
    userSelect: "none",
    fontFamily: "system-ui, sans-serif",
  },

  required: {
    color: "#e74c3c",
    fontWeight: 700,
  },

  input: {
    width: "100%",
    border: "1px solid #e8e8e8",
    borderRadius: 6,
    padding: "7px 10px",
    fontSize: 12,
    color: "#333",
    outline: "none",
    fontFamily: "system-ui, sans-serif",
    lineHeight: 1.55,
    background: "#fafafa",
    transition: "border-color .15s, background .15s",
  },

  inputDisabled: {
    background: "#f5f5f5",
    color: "#aaa",
    cursor: "not-allowed",
    borderColor: "#f0f0f0",
  },

  inputMonospace: {
    fontFamily: "monospace",
    fontSize: 12,
    letterSpacing: 0.3,
  },

  hint: {
    fontSize: 11,
    color: "#bbb",
    lineHeight: 1.4,
    fontFamily: "system-ui, sans-serif",
  },
};

const sl = {
  wrap: {
    fontSize: 10,
    fontWeight: 700,
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingTop: 10,
    paddingBottom: 6,
    borderBottom: "1px solid #f0f0f0",
    marginBottom: 2,
    fontFamily: "system-ui, sans-serif",
  },
};
