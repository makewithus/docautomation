import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listDocuments, deleteDocument } from "../services/api";

const TYPE_META = {
  developer_doc: { label: "Developer Doc",    icon: "⚙️", bg: "#EEEDFE", color: "#534AB7" },
  client_doc:    { label: "Client Proposal",  icon: "📋", bg: "#E1F5EE", color: "#0F6E56" },
  compliance:    { label: "Compliance",        icon: "📄", bg: "#FAEEDA", color: "#854F0B" },
  invoice:       { label: "Invoice",           icon: "🧾", bg: "#FAECE7", color: "#993C1D" },
};

export default function Documents() {
  const [docs, setDocs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  // const load = () => {
  //   setLoading(true);
  //   listDocuments()
  //     .then(r => setDocs(r.data.documents || []))
  //     .catch(() => setDocs([]))
  //     .finally(() => setLoading(false));
  // };
  const load = () => {
  setLoading(true);

  listDocuments()
    .then(r => {
      console.log("API Response:", r.data);

      setDocs(
        r.data.documents ||
        r.data ||
        []
      );
    })
    .catch(err => {
      console.error(err);
      setDocs([]);
    })
    .finally(() => setLoading(false));
};

  useEffect(() => { load(); }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm("Delete this document permanently?")) return;
    setDeleting(id);
    try {
      await deleteDocument(id);
      setDocs(prev => prev.filter(d => d.id !== id));
    } catch {
      alert("Delete failed. Try again.");
    } finally {
      setDeleting(null);
    }
  };

  // Filter + search
const filtered = docs.filter(d => {
  const matchType =
    filter === "all" ||
    d.template_type === filter;

  const matchSearch =
    (d.project_name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

  return matchType && matchSearch;
});

  const formatDate = (str) => {
    if (!str) return "";
    try {
      return new Date(str).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
      });
    } catch { return str; }
  };

  
  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <a href="/" style={s.logoLink}>
            <AsteriskIcon size={18} />
            <span style={s.logoText}>MakeWithUs</span>
          </a>
        </div>
        <a href="/" style={s.newBtn}>+ New document</a>
      </div>

      <div style={s.wrap}>

        {/* ── Page title ──
        <div style={s.titleRow}>
          <div>
            <h1 style={s.h1}>All documents</h1>
            <p style={s.h1Sub}>
              {docs.length} document{docs.length !== 1 ? "s" : ""} generated
            </p>
          </div>
        </div> */}

        {/* ── Filters + search ── */}
       

        {/* ── Loading ── */}
        {loading && (
          <div style={s.centerBox}>
            <div style={s.spinner} />
            <p style={{ fontSize: 14, color: "#888", marginTop: 12 }}>Loading documents...</p>
          </div>
        )}

        {/* ── Empty state ──
        {!loading && filtered.length === 0 && (
          <div style={s.centerBox}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>
              {search || filter !== "all" ? "🔍" : "📄"}
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 8 }}>
              {search || filter !== "all" ? "No documents match" : "No documents yet"}
            </p>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>
              {search || filter !== "all"
                ? "Try a different search or filter"
                : "Upload a PDF to generate your first document"}
            </p>
            {!search && filter === "all" && (
              <a href="/" style={s.emptyBtn}>Upload a PDF →</a>
            )}
          </div>
        )} */}

        {/* ── Documents grid ── */}
        {!loading && filtered.length > 0 && (
          <div style={s.grid}>
            {filtered.map(doc => {
              const meta = TYPE_META[doc.template_type] || { label: doc.template_type, icon: "📄", bg: "#f0f0f0", color: "#666" };
              return (
                <div
                  key={doc.id}
                  style={s.card}
                  onClick={() => navigate(`/doc/${doc.id}`)}
                >
                  {/* Card top row */}
                  <div style={s.cardTop}>
                    <span style={{
                      ...s.typeBadge,
                      background: meta.bg,
                      color: meta.color,
                    }}>
                      {meta.icon} {meta.label}
                    </span>
                    <span style={s.cardDate}>{formatDate(doc.created_at)}</span>
                  </div>

                  {/* Project name */}
                  {/* <div style={s.cardName}>{doc.project_name}</div> */
                  }
                  <div style={s.cardName}>
  {doc.project_name || "Untitled Document"}
</div>

                  {/* Doc ID */}
                  <div style={s.cardId}>/doc/{doc.id}</div>

                  {/* Source file if exists */}
                  {doc.source_file && (
                    <div style={s.cardSource}>
                      📄 {doc.source_file.split("/").pop().split("\\").pop()}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={s.cardActions} onClick={e => e.stopPropagation()}>
                    <a
                      href={`/doc/${doc.id}`}
                      style={s.editLink}
                      onClick={e => e.stopPropagation()}
                    >
                      Open editor →
                    </a>
                    <button
                      style={deleting === doc.id ? s.deleteBtnDisabled : s.deleteBtn}
                      onClick={e => handleDelete(e, doc.id)}
                      disabled={deleting === doc.id}
                    >
                      {deleting === doc.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
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

const s = {
  page:    { minHeight: "100vh", background: "#fafafa", fontFamily: "system-ui,-apple-system,sans-serif" },

  // Header
  header:      { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", height: 56, background: "#fff", borderBottom: "1px solid #e8e8e8", position: "sticky", top: 0, zIndex: 10 },
  headerLeft:  { display: "flex", alignItems: "center" },
  logoLink:    { display: "flex", alignItems: "center", gap: 8, textDecoration: "none" },
  logoText:    { fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: -0.3 },
  newBtn:      { fontSize: 13, fontWeight: 600, background: "#111", color: "#fff", padding: "8px 18px", borderRadius: 8, textDecoration: "none" },

  // Content
  wrap:        { maxWidth: 1100, margin: "0 auto", padding: "36px 24px 80px" },
  titleRow:    { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 },
  h1:          { fontSize: 28, fontWeight: 800, color: "#111", letterSpacing: -0.5, marginBottom: 4 },
  h1Sub:       { fontSize: 13, color: "#999" },

  // Toolbar
  toolbar:     { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 12, flexWrap: "wrap" },
  filters:     { display: "flex", gap: 6, flexWrap: "wrap" },
  filterBtn: {
    fontSize: 12,
    color: "#666",
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: 20,
    padding: "5px 12px",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all .15s",
  },
  filterBtnActive: {
    background: "#111",
    color: "#fff",
    border: "1px solid #111",
  },
  searchInput: {
    fontSize: 13,
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    padding: "7px 12px",
    outline: "none",
    width: 220,
    fontFamily: "inherit",
    background: "#fff",
  },

  // States
  centerBox:   { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", textAlign: "center" },
  spinner:     { width: 28, height: 28, border: "2.5px solid #eee", borderTopColor: "#111", borderRadius: "50%", animation: "spin .8s linear infinite" },
  emptyBtn:    { fontSize: 14, fontWeight: 600, color: "#fff", background: "#111", padding: "10px 22px", borderRadius: 8, textDecoration: "none" },

  // Grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 14,
  },
  card: {
    background: "#fff",
    border: "1px solid #efefef",
    borderRadius: 12,
    padding: "18px 20px",
    cursor: "pointer",
    transition: "box-shadow .15s, border-color .15s",
  },
  cardTop:     { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  typeBadge:   { fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500 },
  cardDate:    { fontSize: 11, color: "#bbb" },
  cardName:    { fontSize: 17, fontWeight: 700, color: "#111", lineHeight: 1.3, marginBottom: 5 },
  cardId:      { fontSize: 11, color: "#ccc", fontFamily: "monospace", marginBottom: 6 },
  cardSource:  { fontSize: 11, color: "#bbb", marginBottom: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  cardActions: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #f5f5f5", marginTop: 4 },
  editLink:    { fontSize: 13, color: "#111", fontWeight: 600, textDecoration: "none" },
  deleteBtn:   { fontSize: 12, color: "#c0392b", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" },
  deleteBtnDisabled: { fontSize: 12, color: "#bbb", background: "none", border: "none", padding: 0 },
};
