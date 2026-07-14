// ── api.js ────────────────────────────────────────────────────────────────
// All axios calls to the FastAPI backend.
// Base URL is read from .env → REACT_APP_API_URL
// Falls back to http://localhost:8000 in development.
//
// Usage in any component:
//   import { uploadPDF, generateDoc, getDocument } from "../services/api";

import axios from "axios";

// ── Base config ───────────────────────────────────────────────────────────
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";
const API      = `${BASE_URL}/api`;

// Axios instance with default headers + timeout
const client = axios.create({
  baseURL: API,
  timeout: 60000, // 60s — AI generation can take time
  headers: {
    "Content-Type": "application/json",
  },
});
// services/api.js mein add karo
export const createDocument = (templateType) =>
  client.post("/doc/create", { template_type: templateType });

// ── Request interceptor — log in development ──────────────────────────────
client.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — normalize errors ───────────────────────────────
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    // Attach a clean message to the error
    error.friendlyMessage = message;
    return Promise.reject(error);
  }
);

// ══════════════════════════════════════════════════════════════════════════
// UPLOAD
// ══════════════════════════════════════════════════════════════════════════

/**
 * Upload a PDF or image file.
 * Backend runs OCR / PDF text extraction.
 *
 * @param {File} file — the file object from <input type="file">
 * @returns {{ filename, extracted_text, detected_type, char_count }}
 *
 * Usage:
 *   const res = await uploadPDF(file);
 *   const text = res.data.extracted_text;
 *   const type = res.data.detected_type; // "developer_doc" | "client_doc" | "compliance" | "invoice"
 */
export const uploadPDF = (file) => {
  const form = new FormData();
  form.append("file", file);
  return client.post("/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 30000, // 30s for file upload
  });
};

// ══════════════════════════════════════════════════════════════════════════
// GENERATE
// ══════════════════════════════════════════════════════════════════════════

/**
 * Generate a document from raw extracted text.
 * AI auto-detects doc type, generates content, fills template.
 * Returns an editable link (doc_id).
 *
 * @param {string} rawInput   — text extracted from uploaded PDF
 * @param {string} filePath   — optional: saved upload path from uploadPDF
 * @returns {{ success, doc_id, edit_url, template_type, project_name, content }}
 *
 * Usage:
 *   const res = await generateDoc(extractedText);
 *   navigate(`/doc/${res.data.doc_id}`);
 */
// export const generateDoc = (rawInput, filePath = null) =>
//   client.post("/generate", {
//     raw_input:  rawInput,
//     file_path:  filePath,
//   });

// export const generateDoc = async (rawText) => {
//   return axios.post("http://localhost:8000/api/generate", {
//     raw_input: rawText,
//   });
// };
export const generateDoc = async (rawText) => {
  return client.post("/generate", {
    raw_input: rawText,
  });
};
/**
 * List all available document types with labels and descriptions.
 * @returns {{ types: [{ id, label, description }] }}
 */
export const listTemplateTypes = () =>
  client.get("/templates");

// ══════════════════════════════════════════════════════════════════════════
// DOCUMENTS — CRUD
// ══════════════════════════════════════════════════════════════════════════

/**
 * Get a single document by ID.
 * Called when the user opens their editable link /doc/:id
 *
 * @param {string} docId
 * @returns {{ id, project_name, template_type, content, html_content, source_file, created_at }}
 *
 * Usage:
 *   const res = await getDocument(docId);
 *   setContent(res.data.content);
 */
export const getDocument = (docId) =>
  client.get(`/doc/${docId}`);

/**
 * Update a document's content after the user edits fields.
 * Backend refills the HTML template with the new content.
 *
 * @param {string} docId
 * @param {object} content — the updated content JSON
 * @returns {{ success, doc_id }}
 *
 * Usage:
 *   await updateDocument(docId, content);
 */
export const updateDocument = (docId, content) =>
  client.put(`/doc/${docId}`, { content });

/**
 * List all generated documents, newest first.
 * @returns {{ documents: [{ id, project_name, template_type, edit_url, source_file, created_at }] }}
 *
 * Usage:
 *   const res = await listDocuments();
 *   setDocs(res.data.documents);
 */
export const listDocuments = () =>
  client.get("/documents");

/**
 * Delete a document permanently.
 * @param {string} docId
 * @returns {{ success, deleted }}
 *
 * Usage:
 *   await deleteDocument(docId);
 */
export const deleteDocument = (docId) =>
  client.delete(`/doc/${docId}`);

// ══════════════════════════════════════════════════════════════════════════
// PREVIEW URL — not an axios call, just a URL builder
// ══════════════════════════════════════════════════════════════════════════

/**
 * Returns the URL for the raw HTML preview of a document.
 * Used as the src of the <iframe> in Editor.jsx.
 *
 * @param {string} docId
 * @returns {string} full URL
 *
 * Usage:
 *   <iframe src={previewUrl(docId)} />
 */
export const previewUrl = (docId) =>
  `${API}/doc/${docId}/preview`;

/**
 * Returns the full editable link URL for sharing.
 * @param {string} docId
 * @returns {string}
 *
 * Usage:
 *   navigator.clipboard.writeText(editUrl(docId));
 */
export const editUrl = (docId) =>
  `${window.location.origin}/doc/${docId}`;

// services/api.js mein add karo
export const refillDocument = (docId, prompt) =>
  client.post(`/doc/${docId}/refill`, { prompt });
// export const refillDocument = (id, prompt) =>
//   client.post(`/doc/${id}/refill`, { prompt }, { timeout: 60000 });

// export const downloadPdfUrl = (id) => `${API}/doc/${id}/pdf`;

// ── PDF Download ──────────────────────────────────────────────────────────
// export const downloadPdf = async (id, projectName) => {
//   try {
//     const response = await client.get(`/documents/${id}/pdf`, {
//       responseType: "blob",
//       timeout: 60000,
//     });

//     const blob  = new Blob([response.data], { type: "application/pdf" });
//     const url   = window.URL.createObjectURL(blob);
//     const link  = document.createElement("a");
//     link.href     = url;
//     link.download = `${projectName || "document"}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   } catch (err) {
//     throw new Error(err.friendlyMessage || "PDF download failed");
//   }
// };

// export const downloadPdfUrl = (id) => `${API}/doc/${id}/pdf`;

// export const triggerPdfDownload = async (id, projectName) => {
//   try {
//       const response = await client.get(`/doc/${id}/pdf`, {
//             responseType: "blob",
//                   timeout: 60000,
//                       });
                      
//     // Create a blob URL and trigger download
//     const blob      = new Blob([response.data], { type: "application/pdf" });
//     const url        = window.URL.createObjectURL(blob);
//     const link       = document.createElement("a");
//     link.href        = url;
//     link.download    = `${projectName || "document"}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   } catch (err) {
//     throw new Error(err.friendlyMessage || "PDF download failed");
//   }
// };
// ══════════════════════════════════════════════════════════════════════════
// HEALTH CHECK
// ══════════════════════════════════════════════════════════════════════════

/**
 * Ping the backend to check if it is running.
 * @returns {{ status: "running" }}
 *
 * Usage:
 *   const ok = await checkHealth();
 */
export const checkHealth = () =>
  axios.get(`${BASE_URL}/`, { timeout: 5000 });
export const translateDocument = (docId, language) =>
  client.post(`/doc/${docId}/translate`, { language });


