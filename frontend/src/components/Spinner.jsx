// ── Spinner.jsx ───────────────────────────────────────────────────────────
// Reusable loading spinner component
// Usage:
//   <Spinner />                    — default medium size
//   <Spinner size={16} />          — small
//   <Spinner size={48} />          — large
//   <Spinner fullScreen />         — centered in full viewport
//   <Spinner fullScreen label="Generating document..." />

export default function Spinner({ size = 28, fullScreen = false, label = "" }) {
  if (fullScreen) {
    return (
      <div style={s.fullScreen}>
        <div style={{ ...s.ring, width: size, height: size }} />
        {label && <p style={s.label}>{label}</p>}
      </div>
    );
  }

  return (
    <div style={s.inline}>
      <div style={{ ...s.ring, width: size, height: size }} />
      {label && <span style={s.inlineLabel}>{label}</span>}
    </div>
  );
}

const s = {
  // Full screen centered
  fullScreen: {
    position: "fixed",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.9)",
    zIndex: 999,
    gap: 14,
  },

  // Inline (default)
  inline: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },

  // The spinning ring
  ring: {
    border: "2.5px solid #eee",
    borderTopColor: "#111",
    borderRadius: "50%",
    animation: "spin 0.75s linear infinite",
    flexShrink: 0,
  },

  label: {
    fontSize: 14,
    color: "#666",
    margin: 0,
    fontFamily: "system-ui, sans-serif",
  },

  inlineLabel: {
    fontSize: 13,
    color: "#888",
    fontFamily: "system-ui, sans-serif",
  },
};
