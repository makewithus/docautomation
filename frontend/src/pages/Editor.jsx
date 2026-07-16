// // // import React, { useEffect, useState, useRef } from "react";
// // // import { useParams, useNavigate } from "react-router-dom";
// // // import { getDocument, updateDocument, previewUrl,refillDocument} from "../services/api";
// // // // import {
// // // //   getDocument,
// // // //   updateDocument,
// // // //   previewUrl,
// // // //   refillDocument,
// // // //   translateDocument
// // // // } from "../services/api";

// // // // const TYPE_LABELS = {
// // // //   developer_doc: "Developer Doc",
// // // //   client_doc:    "Client Proposal",
// // // //   compliance:    "Compliance Letter",
// // // //   invoice:       "Invoice",
// // // //   timeline:      "Project Timeline",
// // // // };
// // // const TYPE_LABELS = {
// // //   developer_doc: "Developer Doc",
// // //   client_doc:    "Client Proposal",
// // //   compliance:    "Compliance Letter",
// // //   invoice:       "Invoice",
// // //   timeline:      "Project Timeline",
// // // };

// // // // 👇 NAYA — har document type ke liye blank/empty starting structure
// // // function getBlankContent(type) {
// // //   switch (type) {
// // //     case "developer_doc":
// // //       return {
// // //         project_name: "",
// // //         tagline: "",
// // //         overview: "",
// // //         features: [],
// // //         uvp: [],
// // //       };
// // //     case "client_doc":
// // //       return {
// // //         client_name: "",
// // //         client_organisation: "",
// // //         client_place: "",
// // //         date: "",
// // //         sender_name: "",
// // //         sender_designation: "",
// // //         body_paragraphs: [],
// // //         quotation_number: "",
// // //         project_name: "",
// // //         line_items: [],
// // //         gst_percent: 0,
// // //         gst_amount: "0",
// // //         subtotal: "0",
// // //         total: "0",
// // //       };
// // //     case "compliance":
// // //       return {
// // //         letter_type: "",
// // //         date: "",
// // //         recipient_name: "",
// // //         recipient_designation: "",
// // //         recipient_company: "",
// // //         subject: "",
// // //         salutation: "",
// // //         body_paragraphs: [],
// // //         closing: "",
// // //         sender_name: "",
// // //         sender_designation: "",
// // //         sender_contact: "",
// // //       };
// // //     case "invoice":
// // //       return {
// // //         invoice_number: "",
// // //         date: "",
// // //         project_name: "",
// // //         client_name: "",
// // //         client_email: "",
// // //         client_address: "",
// // //         project_description: "",
// // //         line_items: [],
// // //         gst_percent: 0,
// // //         gst_amount: "0",
// // //         subtotal: "0",
// // //         total: "0",
// // //         payment_status: "",
// // //         payment_date: "",
// // //         bank_name: "",
// // //         account_name: "",
// // //         phone_number: "",
// // //         upi_id: "",
// // //         notes: "",
// // //       };
// // //     case "timeline":
// // //       return {
// // //         project_name: "",
// // //         project_description: "",
// // //         client_name: "",
// // //         timeline_items: [],
// // //         total_time: "",
// // //         expected_dev_time: "",
// // //         expected_closure: "",
// // //         closure_date: "",
// // //       };
// // //     default:
// // //       return {};
// // //   }
// // // }

// // // export default function Editor() {
// // //   // const { docId }  = useParams();
// // //   const { id } = useParams();

// // //   const navigate   = useNavigate();
// // //   const [doc, setDoc]         = useState(null);
// // //   const [content, setContent] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [saving, setSaving]   = useState(false);
// // //   const [saved, setSaved]     = useState(false);
// // //   const [dirty, setDirty]     = useState(false);
// // //   const [copied, setCopied]   = useState(false);
// // //   const [iframeKey, setIframeKey] = useState(0);
// // //   const [panelOpen, setPanelOpen] = useState(true);
// // //   const [prompt, setPrompt]       = useState("");
// // //   const [generating, setGenerating] = useState(false);
// // //   const [promptOpen, setPromptOpen] = useState(false);
// // //   const [listening, setListening]   = useState(false);
// // //   const [transcript, setTranscript] = useState("");
// // //   const recognitionRef              = useRef(null);
// // //   const transcriptRef               = useRef("");
// // //   // const [translating, setTranslating]       = useState(false);
// // //   // const [showLangMenu, setShowLangMenu]     = useState(false);
// // //   // const [gstEnabled, setGstEnabled] = useState(true);
// // //   // const [downloading, setDownloading] = useState(false);
// // // useEffect(() => {
// // //     getDocument(id)
// // //       .then(async (res) => {
// // //         setDoc(res.data);
// // //         const blank = getBlankContent(res.data.template_type);
// // //         setContent(blank);

// // //         // Backend me bhi blank content save karo, taaki preview iframe
// // //         // (jo seedha backend se load hota hai) bhi khali dikhe
// // //         try {
// // //           await updateDocument(id, blank);
// // //           setIframeKey(k => k + 1);   // iframe ko force refresh karo
// // //         } catch (err) {
// // //           console.error("Failed to reset backend content:", err);
// // //         }
// // //       })
// // //       .catch(() => setDoc(null))
// // //       .finally(() => setLoading(false));
// // //   }, [id]);
// // //   // useEffect(() => {
// // //   //   getDocument(id)
// // //   //     .then(res => {
// // //   //       setDoc(res.data);
// // //   //       setContent(res.data.content);
// // //   //     })
// // //   //     .catch(() => setDoc(null))
// // //   //     .finally(() => setLoading(false));
// // //   // }, [id]);

// // //   const update = (key, val) => {
// // //     setContent(p => ({ ...p, [key]: val }));
// // //     setDirty(true);
// // //   };
// // //   const startVoice = () => {
// // //     const SpeechRecognition =
// // //       window.SpeechRecognition || window.webkitSpeechRecognition;

// // //     if (!SpeechRecognition) {
// // //       alert("Voice not supported in this browser. Use Chrome.");
// // //       return;
// // //     }

// // //     const recognition          = new SpeechRecognition();
// // //     recognition.lang           = "en-IN"; // Indian English
// // //     recognition.continuous     = true;
// // //     recognition.interimResults = true;

// // //     recognition.onstart = () => {
// // //       setListening(true);
// // //       setTranscript("");
// // //       transcriptRef.current = "";
// // //     };

// // //     recognition.onresult = (e) => {
// // //       const text = Array.from(e.results)
// // //         .map(r => r[0].transcript)
// // //         .join("");
// // //       setTranscript(text);
// // //       transcriptRef.current = text;   // 👈 ref ko bhi sync rakho — onend isi se padhega
// // //     };

// // //     recognition.onend = async () => {
// // //       setListening(false);
// // //       const finalText = transcriptRef.current;   // 👈 stale state nahi, ref se fresh value
// // //       if (finalText.trim()) {
// // //         setGenerating(true);
// // //         try {
// // //           const res = await refillDocument(id, finalText);
// // //           const gc =
// // //             res.data.content ||
// // //             res.data.document?.content ||
// // //             res.data.data?.content ||
// // //             res.data;
// // //           if (!gc || typeof gc !== "object") throw new Error("No content");

// // //           setContent(gc);
// // //           await updateDocument(id, gc);
// // //           setIframeKey(k => k + 1);
// // //           setTranscript("");
// // //           transcriptRef.current = "";
// // //         } catch {
// // //           alert("Voice generation failed.");
// // //         } finally {
// // //           setGenerating(false);
// // //         }
// // //       }
// // //     };

// // //     recognition.onerror = () => setListening(false);

// // //     recognitionRef.current = recognition;
// // //     recognition.start();
// // //   };

// // //   // 👇 NAYA — fallback manual fill button ke liye
// // //   const handleManualFill = async () => {
// // //     const text = transcriptRef.current || transcript;
// // //     if (!text.trim()) return;
// // //     setGenerating(true);
// // //     try {
// // //       const res = await refillDocument(id, text);
// // //       const gc =
// // //         res.data.content ||
// // //         res.data.document?.content ||
// // //         res.data.data?.content ||
// // //         res.data;
// // //       if (!gc || typeof gc !== "object") throw new Error("No content");

// // //       setContent(gc);
// // //       await updateDocument(id, gc);
// // //       setIframeKey(k => k + 1);
// // //     } catch {
// // //       alert("Fill failed. Try again.");
// // //     } finally {
// // //       setGenerating(false);
// // //     }
// // //   };
// // // //   const startVoice = () => {
// // // //   // Web Speech API — no library needed, built into browser
// // // //   const SpeechRecognition =
// // // //     window.SpeechRecognition || window.webkitSpeechRecognition;

// // // //   if (!SpeechRecognition) {
// // // //     alert("Voice not supported in this browser. Use Chrome.");
// // // //     return;
// // // //   }

// // // //   const recognition        = new SpeechRecognition();
// // // //   recognition.lang         = "en-IN"; // Indian English
// // // //   recognition.continuous   = true;
// // // //   recognition.interimResults = true;

// // // //   recognition.onstart = () => setListening(true);

// // // //   recognition.onresult = (e) => {
// // // //     const text = Array.from(e.results)
// // // //       .map(r => r[0].transcript)
// // // //       .join("");
// // // //     setTranscript(text);
// // // //   };

// // // //   recognition.onend = async () => {
// // // //     setListening(false);
// // // //     if (transcript.trim()) {
// // // //       // Reuse existing refill flow
// // // //       setGenerating(true);
// // // //       try {
// // // //         // const res = await refillDocument(id, transcript);
// // // //         // const gc  = res.data.content || res.data.document?.content;
// // // //         // if (!gc) throw new Error("No content");
// // // //         const res = await refillDocument(id, transcript);
// // // // const gc  = res.data.content 
// // // //          || res.data.document?.content 
// // // //          || res.data.data?.content
// // // //          || res.data;
// // // // if (!gc || typeof gc !== "object") throw new Error("No content");
// // // // setContent(gc);
// // // // await updateDocument(id, gc);    // ← yeh line ensure karta hai preview refresh ho
// // // // setIframeKey(k => k + 1);
// // // // setTranscript("");
// // // //         setContent(gc);
// // // //         await updateDocument(id, gc);
// // // //         setIframeKey(k => k + 1);
// // // //         setTranscript("");
// // // //       } catch { alert("Voice generation failed."); }
// // // //       finally { setGenerating(false); }
// // // //     }
// // // //   };

// // // //   recognition.onerror = () => setListening(false);

// // // //   recognitionRef.current = recognition;
// // // //   recognition.start();
// // // // };

// // // const stopVoice = () => {
// // //   recognitionRef.current?.stop();
// // //   setListening(false);
// // // };

// // // const handleTranslate = async (lang) => {
// // //   setShowLangMenu(false);
// // //   setTranslating(true);
// // //   try {
// // //     const res = await translateDocument(id, lang);
// // //     const gc  = res.data.content;
// // //     if (!gc) throw new Error("No content");
// // //     setContent(gc);
// // //     await updateDocument(id, gc);
// // //     setIframeKey(k => k + 1);
// // //     setDirty(false);
// // //   } catch { alert("Translation failed. Try again."); }
// // //   finally { setTranslating(false); }
// // // };

// // //   const handleSave = async () => {
// // //   setSaving(true);
// // //   try {
// // //     await updateDocument(id, content);
// // //     setDirty(false);
// // //     setSaved(true);
// // //     setIframeKey(k => k + 1);
// // //     setTimeout(() => setSaved(false), 2500);
// // //   } catch {
// // //     alert("Save failed. Please try again.");
// // //   } finally {
// // //     setSaving(false);
// // //   }
// // // };
// // // // ── LIVE PREVIEW — auto save on content change ─────────────
// // // useEffect(() => {
// // //   if (!content || !dirty) return;

// // //   const timer = setTimeout(async () => {
// // //     try {
// // //       await updateDocument(id, content);
// // //       setIframeKey(k => k + 1);   // iframe refresh
// // //       setDirty(false);
// // //       setSaved(true);
// // //       setTimeout(() => setSaved(false), 1500);
// // //     } catch {
// // //       // silent fail — user can manually save
// // //     }
// // //   }, 800); // 800ms debounce — user ke type karne ke 800ms baad

// // //   return () => clearTimeout(timer); // cleanup on next keystroke
// // // }, [content]);
// // // // ───────────────────────────────────────────────────────────
 

// // //   // const handleSave = async () => {
// // //   //   if (!dirty) return;
// // //   //   setSaving(true);
// // //   //   try {
// // //   //     await updateDocument(id, content);
// // //   //     setDirty(false);
// // //   //     setSaved(true);
// // //   //     setIframeKey(k => k + 1);
// // //   //     setTimeout(() => setSaved(false), 2500);
// // //   //   } catch {
// // //   //     alert("Save failed. Please try again.");
// // //   //   } finally {
// // //   //     setSaving(false);
// // //   //   }
// // //   // };

// // //   const handleCopyLink = () => {
// // //     navigator.clipboard.writeText(window.location.href);
// // //     setCopied(true);
// // //     setTimeout(() => setCopied(false), 2000);
// // //   };

// // //   // REPLACE the entire handleDownloadPDF function with this:
// // // // const handleDownloadPDF = () => {
// // // //   window.open(
// // // //     `http://localhost:8000/api/doc/${id}/preview?autoprint=1`,
// // // //     "_blank",
// // // //     "width=900,height=700"
// // // //   );
// // // // };
// // // const handleRefill = async () => {
// // //   if (!prompt.trim()) return;
// // //   setGenerating(true);
// // //   try {
// // //     const res = await refillDocument(id, prompt);

// // //     console.log("AI response:", res.data);

// // //     // update frontend state
// // //     const generatedContent =
// // //       res.data.content ||
// // //       res.data.document?.content ||
// // //       res.data.data?.content;

// // //     if (!generatedContent) {
// // //       throw new Error("No content returned");
// // //     }

// // //     // fill form instantly
// // //     setContent(generatedContent);

// // //     // save to backend immediately
// // //     await updateDocument(id, generatedContent);

// // //     // refresh preview iframe
// // //     setIframeKey((k) => k + 1);

// // //     setDirty(false);
// // //     // const res = await refillDocument(id, prompt);
// // //     // setContent(res.data.content);
// // //     // setDirty(true);
// // //     // setIframeKey(k => k + 1);
// // //     // setPrompt("");
// // //     // setPromptOpen(false);
// // //   } catch (err) {
// // //     alert("Generation failed. Try again.");
// // //   } finally {
// // //     setGenerating(false);
// // //   }
// // // };

// // // // const handleDownloadPDF = () => {
// // // //   const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
// // // //   window.open(
// // // //     `${BASE}/api/doc/${id}/preview`,
// // // //     "_blank"
// // // //   );
// // // // };
// // // const handleDownloadPDF = () => {
// // //   const BASE =
// // //     import.meta.env.VITE_API_URL ||
// // //     "http://localhost:8000";

// // //   window.open(
// // //     `${BASE}/api/doc/${id}/preview?autoprint=1`,
// // //     "_blank"
// // //   );
// // // };
// // // //  const handleDownloadPDF = async () => {
// // // //   try {
// // // //     const response = await fetch(previewUrl(id));
// // // //     const html = await response.text();

// // // //     const tempDiv = document.createElement("div");
// // // //     tempDiv.style.position = "absolute";
// // // //     tempDiv.style.left = "-9999px";
// // // //     tempDiv.style.width = "794px"; // A4 width
// // // //     tempDiv.style.background = "#fff";
// // // //     tempDiv.innerHTML = html;

// // // //     document.body.appendChild(tempDiv);

// // // //     // render hone ka wait
// // // //     await new Promise(resolve =>
// // // //       setTimeout(resolve, 500)
// // // //     );

// // // //     const canvas = await html2canvas(tempDiv, {
// // // //       scale: 2,
// // // //       useCORS: true,
// // // //       backgroundColor: "#ffffff",
// // // //     });

// // // //     const imgData = canvas.toDataURL("image/png");

// // // //     const pdf = new jsPDF("p", "mm", "a4");

// // // //     const pdfWidth = 210;
// // // //     const pdfHeight = 297;

// // // //     // Full page fit
// // // //     pdf.addImage(
// // // //       imgData,
// // // //       "PNG",
// // // //       0,
// // // //       0,
// // // //       pdfWidth,
// // // //       pdfHeight
// // // //     );

// // // //     pdf.save(
// // // //       `${doc?.project_name || "invoice"}.pdf`
// // // //     );

// // // //     document.body.removeChild(tempDiv);

// // // //   } catch (err) {
// // // //     console.error(err);
// // // //     alert("PDF download failed");
// // // //   }
// // // // };
 
   

// // // // const handleDownloadPdf = async () => {
// // // //   setDownloading(true);
// // // //   try {
// // // //     const filename = `${doc.project_name || id}.pdf`;
// // // //     await downloadPdf(id, filename);
// // // //   } catch (err) {
// // // //     alert(`PDF download failed: ${err.message}`);
// // // //   } finally {
// // // //     setDownloading(false);
// // // //   }
// // // // };

// // // //   const handleDownloadPDF = () => {
// // // //   const iframe = document.querySelector("iframe");

// // // //   if (!iframe) {
// // // //     alert("Preview not found");
// // // //     return;
// // // //   }

// // // //   const iframeDoc =
// // // //     iframe.contentDocument ||
// // // //     iframe.contentWindow.document;

// // // //   const element = iframeDoc.body;

// // // //   const options = {
// // // //     margin: 0,
// // // //     filename: `${doc.project_name || "document"}.pdf`,
// // // //     image: {
// // // //       type: "jpeg",
// // // //       quality: 1,
// // // //     },
// // // //     html2canvas: {
// // // //       scale: 2,
// // // //       useCORS: true,
// // // //     },
// // // //     jsPDF: {
// // // //       unit: "mm",
// // // //       format: "a4",
// // // //       orientation: "portrait",
// // // //     },
// // // //   };

// // // //   html2pdf().set(options).from(element).save();
// // // // };

// // //   // ── Loading state ──────────────────────────────────────────────────
// // //   if (loading) {
// // //     return (
// // //       <div style={s.centerScreen}>
// // //         <div style={s.spinner} />
// // //         <p style={s.loadingText}>Loading document...</p>
// // //       </div>
// // //     );
// // //   }

// // //   // ── Not found ──────────────────────────────────────────────────────
// // //   if (!doc) {
// // //     return (
// // //       <div style={s.centerScreen}>
// // //         <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
// // //         <p style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 8 }}>
// // //           Document not found
// // //         </p>
// // //         <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>
// // //           This link may have expired or been deleted.
// // //         </p>
// // //         <button style={s.btnPrimary} onClick={() => navigate("/")}>
// // //           ← Back to home
// // //         </button>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div style={s.page}>

// // //       {/* ── Top bar ──────────────────────────────────────────────── */}
// // //       <div style={s.topbar}>
// // //         <div style={s.topLeft}>
// // //           {/* Logo */}
// // //           {/* <a href="/" style={s.topLogo}>
// // //             <AsteriskIcon size={16} />
// // //           </a> */}
// // //           <div style={s.topDivider} />
// // //           {/* Doc info */}
// // //           <span style={s.docName}>{doc.project_name}</span>
// // //           <TypeBadge type={doc.template_type} />
// // //           {dirty && <span style={s.unsavedDot} title="Unsaved changes" />}
// // //         </div>
// // // {/* ── AI Prompt Box ─────────────────────────────────── */}

// // // {/* ── TRANSLATE BUTTON ── */}


// // //         <div style={s.topRight}>
// // //           {/* Save button */}
// // //           {dirty && (
// // //             <button
// // //               style={saving ? s.btnSavingDisabled : s.btnSave}
// // //               onClick={handleSave}
// // //               disabled={saving}
// // //             >
// // //               {saving ? "Saving..." : "Save changes"}
// // //             </button>
// // //           )}
// // //           {saved && !dirty && (
// // //             <span style={s.savedPill}>✓ Saved</span>
// // //           )}

// // //           {/* Toggle panel */}
// // //           <button
// // //             style={s.btnIcon}
// // //             onClick={() => setPanelOpen(p => !p)}
// // //             title={panelOpen ? "Hide editor" : "Show editor"}
// // //           >
// // //             {panelOpen ? "◀" : "▶"}
// // //           </button>

// // //           {/* Share link */}
// // //           <button style={s.btnOutline} onClick={handleCopyLink}>
// // //             {copied ? " Copied!" : "Share link"}
// // //           </button>
// // //           {/* Download PDF */}
        
// // //   <button
// // //   style={s.btnOutline}
// // //   onClick={handleDownloadPDF}
// // // >
// // //   ⬇ Download PDF
// // // </button>
// // // {/* <button
// // //   style={s.btnOutline}
// // //   onClick={() => {
// // //     const win = window.open(previewUrl(id), "_blank");
// // //     setTimeout(() => {
// // //       if (win) win.print();
// // //     }, 1500); // 1.5 sec wait — page load hone do
// // //   }}
// // // >
// // //   ⬇ Download PDF
// // // </button> */}

// // //           {/* Open full page */}
// // //           <a
// // //             href={previewUrl(id)}
// // //             // target="_blank"
// // //             rel="noreferrer"
// // //             style={s.btnOutline}
// // //           >
// // //             Open ↗
// // //           </a>

// // //           {/* Back to all docs */}
// // //           {/* <a href="/documents" style={s.btnOutline}>
// // //             All docs
// // //           </a> */}
// // //         </div>
// // //       </div>

// // //       {/* ── Two-panel layout ──────────────────────────────────────── */}
// // //       <div style={s.panels}>
// // // <div style={s.promptBox}>
// // //   <button
// // //     style={s.promptToggle}
// // //     onClick={() => setPromptOpen(p => !p)}
// // //   >
// // //     ✦ {promptOpen ? "Close AI fill" : "Fill with AI prompt"}
// // //   </button>

// // //   {promptOpen && (
// // //     <div style={s.promptInner}>
// // //       <textarea
// // //         style={s.promptTextarea}
// // //         rows={4}
// // //         placeholder={
// // //           `Example:\n"Client: Rahul Sharma, Project: Ayurvedic app with AI skin analysis, 3 months, budget ₹5L, 40-30-30 payment split"`
// // //         }
// // //         value={prompt}
// // //         onChange={e => setPrompt(e.target.value)}
// // //       />
// // //       <button
// // //         style={generating ? s.btnGeneratingFull : s.btnGenerateFull}
// // //         onClick={handleRefill}
// // //         disabled={generating || !prompt.trim()}
// // //       >
// // //         {generating ? " Generating..." : " Generate & Fill"}
// // //       </button>
// // //     </div>
// // //   )}
// // //   {/* ── VOICE BUTTON ── */}
// // //   {/* ── VOICE FILL ── */}
// // // <div style={voiceWrap}>

// // //   {/* State 1: Not listening, not generating — show Start button */}
// // //   {!listening && !generating && (
// // //     <button style={voiceBtnStart} onClick={startVoice}>
// // //       🎙 Start speaking
// // //     </button>
// // //   )}

// // //   {/* State 2: Listening — show live status + big Stop button */}
// // //   {listening && (
// // //     <>
// // //       <div style={listeningBanner}>
// // //         <div style={pulseDot} />
// // //         <span style={{ fontSize: 12, color: "#e74c3c", fontWeight: 600 }}>
// // //           Listening... speak clearly
// // //         </span>
// // //       </div>

// // //       {transcript && (
// // //         <div style={transcriptBox}>
// // //           <span style={{ fontSize: 10, color: "#aaa", display: "block", marginBottom: 4 }}>
// // //             Heard so far:
// // //           </span>
// // //           {transcript}
// // //         </div>
// // //       )}

// // //       <button style={voiceBtnStop} onClick={stopVoice}>
// // //         ⏹ Stop & fill document
// // //       </button>
// // //     </>
// // //   )}

// // //   {/* State 3: Processing after stop — show progress */}
// // //   {generating && (
// // //     <div style={processingBanner}>
// // //       <div style={spinnerDot} />
// // //       <span style={{ fontSize: 12, color: "#555", fontWeight: 600 }}>
// // //         Filling your document...
// // //       </span>
// // //     </div>
// // //   )}

// // //   {/* Fallback: if speech ended but transcript wasn't auto-filled for some reason */}
// // //   {!listening && !generating && transcript && (
// // //     <div style={transcriptBox}>
// // //       <span style={{ fontSize: 10, color: "#aaa", display: "block", marginBottom: 4 }}>
// // //         Last heard:
// // //       </span>
// // //       {transcript}
// // //       <button style={manualFillBtn} onClick={handleManualFill}>
// // //         ✓ Fill from this
// // //       </button>
// // //     </div>
// // //   )}
// // // </div>
// // // {/* <div style={voiceWrap}>
// // //   <button
// // //     style={{
// // //       ...voiceBtn,
// // //       background: listening ? "#e74c3c" : "#111",
// // //       transform:  listening ? "scale(1.1)" : "scale(1)",
// // //     }}
// // //     onClick={listening ? stopVoice : startVoice}
// // //     disabled={generating}
// // //   >
// // //     {listening ? " Listening..." : "🎙 Speak to fill"}
// // //   </button>

// // //   {/* Show live transcript */}
// // //   {/* Show live transcript */}
// // //   {transcript && (
// // //     <div style={transcriptBox}>
// // //       <span style={{ fontSize: 10, color: "#aaa", display: "block", marginBottom: 4 }}>
// // //         Heard:
// // //       </span>
// // //       {transcript}
// // //       <button
// // //         style={{
// // //           marginTop: 8,
// // //           width: "100%",
// // //           fontSize: 12,
// // //           fontWeight: 600,
// // //           background: "#111",
// // //           color: "#fff",
// // //           border: "none",
// // //           borderRadius: 6,
// // //           padding: "8px 0",
// // //           cursor: generating ? "not-allowed" : "pointer",
// // //           opacity: generating ? 0.6 : 1,
// // //         }}
// // //         onClick={handleManualFill}
// // //         disabled={generating}
// // //       >
// // //         {generating ? "Filling..." : "✓ Fill from transcript"}
// // //       </button>
// // //     </div>
// // //   )}

// // //   {listening && (
// // //     <div style={pulseWrap}>
// // //       <div style={pulseDot} />
// // //       <span style={{ fontSize: 11, color: "#e74c3c" }}>Speak now...</span>
// // //     </div>
// // //   )}
// // // </div>
// // // </div> */}

// // //         {/* Left — edit panel */}
// // //         {panelOpen && (
// // //           <div style={s.leftPanel}>
// // //             <div style={s.panelHeader}>
// // //               <span style={s.panelTitle}>Edit content</span>
// // //               <span style={s.panelSubtitle}>{TYPE_LABELS[doc.template_type]}</span>
// // //             </div>
// // //             <div style={s.panelScroll}>
// // //               {doc.template_type === "developer_doc" && (
// // //                 <DevDocFields content={content} update={update} />
// // //               )}
// // //               {doc.template_type === "client_doc" && (
// // //                 <ClientDocFields content={content} update={update} />
// // //               )}
// // //               {doc.template_type === "compliance" && (
// // //                 <ComplianceFields content={content} update={update} />
// // //               )}
// // //               {doc.template_type === "invoice" && (
// // //                 <InvoiceFields content={content} update={update} />
// // //               )}
// // //               {doc.template_type === "timeline" && (     // ← ADD THIS BLOCK
// // //   <TimelineFields content={content} update={update} />
// // // )}
// // // {/* ── AI Prompt Box ─────────────────────────────────── */}
// // //             </div>

// // //             {/* Save footer */}
// // //             {dirty && (
// // //               <div style={s.saveFooter}>
// // //                 <button
// // //                   style={saving ? s.btnSavingDisabled : s.btnSaveFull}
// // //                   onClick={handleSave}
// // //                   disabled={saving}
// // //                 >
// // //                   {saving ? "Saving..." : "Save changes"}
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         )}

// // //         {/* Right — live preview */}
// // //         <div style={s.rightPanel}>
// // //           <div style={s.iframeWrap}>
// // //             <iframe
// // //               key={iframeKey}
// // //               src={previewUrl(id)}
// // //               style={s.iframe}
// // //               title="Document preview"
// // //             />
// // //           </div>
// // //         </div>

// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // ══════════════════════════════════════════════════════════════════════
// // // // FIELD PANELS — one per doc type
// // // // ══════════════════════════════════════════════════════════════════════

// // // // ── 1. Developer Doc ──────────────────────────────────────────────────
// // // function DevDocFields({ content, update }) {
// // //   const updateFeature = (fi, key, val) => {
// // //     const updated = [...content.features];
// // //     updated[fi] = { ...updated[fi], [key]: val };
// // //     update("features", updated);
// // //   };

// // //   const updatePoint = (fi, pi, val) => {
// // //     const updated = [...content.features];
// // //     const pts = [...updated[fi].points];
// // //     pts[pi] = typeof pts[pi] === "object"
// // //       ? { ...pts[pi], text: val }
// // //       : val;
// // //     updated[fi] = { ...updated[fi], points: pts };
// // //     update("features", updated);
// // //   };

// // //   const updateUvp = (i, key, val) => {
// // //     const updated = [...(content.uvp || [])];
// // //     updated[i] = { ...updated[i], [key]: val };
// // //     update("uvp", updated);
// // //   };

// // //   return (
// // //     <div style={f.wrap}>
// // //       <Field label="Project name" value={content.project_name} onChange={v => update("project_name", v)} />
// // //       <Field label="Tagline"      value={content.tagline}      onChange={v => update("tagline", v)} />
// // //       <Field label="Overview"     value={content.overview}     onChange={v => update("overview", v)} multiline />

// // //       <SectionLabel>Features</SectionLabel>
// // //       {content.features?.map((feat, fi) => (
// // //         <div key={fi} style={f.card}>
// // //           <input
// // //             style={f.cardTitle}
// // //             value={feat.title}
// // //             onChange={e => updateFeature(fi, "title", e.target.value)}
// // //             placeholder="Feature title"
// // //           />
// // //           {feat.points?.map((pt, pi) => (
// // //             <div key={pi} style={f.pointRow}>
// // //               <span style={f.bullet}>◆</span>
// // //               <input
// // //                 style={f.pointInput}
// // //                 value={typeof pt === "object" ? pt.text : pt}
// // //                 onChange={e => updatePoint(fi, pi, e.target.value)}
// // //                 placeholder="Point"
// // //               />
// // //             </div>
// // //           ))}
// // //         </div>
// // //       ))}

// // //       {content.uvp?.length > 0 && (
// // //         <>
// // //           <SectionLabel>UVP</SectionLabel>
// // //           {content.uvp.map((u, i) => (
// // //             <div key={i} style={f.uvpRow}>
// // //               <input
// // //                 style={{ ...f.input, fontWeight: 600, width: "44%" }}
// // //                 value={u.keyword}
// // //                 onChange={e => updateUvp(i, "keyword", e.target.value)}
// // //                 placeholder="KEYWORD"
// // //               />
// // //               <span style={{ color: "#ccc", padding: "0 4px", fontSize: 12 }}>→</span>
// // //               <input
// // //                 style={{ ...f.input, flex: 1 }}
// // //                 value={u.description}
// // //                 onChange={e => updateUvp(i, "description", e.target.value)}
// // //                 placeholder="Description"
// // //               />
// // //             </div>
// // //           ))}
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // // ── 2. Client Proposal ────────────────────────────────────────────────
// // // function ClientDocFields({ content, update }) {
// // //   // useEffect(() => {
// // //   //   if (!content.line_items?.length) return;

// // //   //   const parseAmt = (val) => {
// // //   //     if (!val) return 0;
// // //   //     return parseFloat(String(val).replace(/[₹,\s]/g, "")) || 0;
// // //   //   };
// // //     const [gstEnabled, setGstEnabled] = useState(
// // //     parseFloat(content.gst_percent) > 0
// // //   );

// // //   useEffect(() => {
// // //     if (!content.line_items?.length) return;

// // //     const parseAmt = (val) => {
// // //       if (!val) return 0;
// // //       return parseFloat(String(val).replace(/[₹,\s]/g, "")) || 0;
// // //     };
// // //      const subtotal   = content.line_items.reduce((sum, item) => sum + parseAmt(item.amount), 0);
// // //     const gstPercent = gstEnabled ? (parseFloat(content.gst_percent) || 0) : 0;
// // //     const gstAmt     = (subtotal * gstPercent) / 100;
// // //     const total      = subtotal + gstAmt;

// // //     const fmt = (n) => n > 0 ? `₹${n.toLocaleString("en-IN")}` : "0";

// // //     update("subtotal",   fmt(subtotal));
// // //     update("gst_percent", gstEnabled ? gstPercent : 0);
// // //     update("gst_amount", gstEnabled && gstPercent > 0 ? fmt(gstAmt) : "0");
// // //     update("total",      fmt(total));

// // //   }, [content.line_items, content.gst_percent, gstEnabled]);


// // //   //   const subtotal   = content.line_items.reduce((sum, item) => sum + parseAmt(item.amount), 0);
// // //   //   const gstPercent = parseFloat(content.gst_percent) || 0;
// // //   //   const gstAmt     = (subtotal * gstPercent) / 100;
// // //   //   const total      = subtotal + gstAmt;

// // //   //   const fmt = (n) => n > 0 ? `₹${n.toLocaleString("en-IN")}` : "0";

// // //   //   update("subtotal",   fmt(subtotal));
// // //   //   update("gst_amount", gstPercent > 0 ? fmt(gstAmt) : "0");
// // //   //   update("total",      fmt(total));

// // //   // }, [content.line_items, content.gst_percent]);
// // //   const updatePara = (i, val) => {
// // //     const updated = [...content.body_paragraphs];
// // //     updated[i] = val;
// // //     update("body_paragraphs", updated);
// // //   };

// // //   // const updateItem = (i, key, val) => {
// // //   //   const updated = [...content.line_items];
// // //   //   updated[i] = { ...updated[i], [key]: val };
// // //   //   update("line_items", updated);
// // //   // };

// // //   const updateItem = (i, key, val) => {
// // //   const updated = [...content.line_items];

// // //   updated[i] = {
// // //     ...updated[i],
// // //     [key]: val,
// // //   };

// // //   // auto calculate amount
// // //   const hours =
// // //     parseFloat(updated[i].hours || 0);

// // //   const unitPrice =
// // //     parseFloat(updated[i].unit_price || 0);

// // //   updated[i].amount =
// // //     hours * unitPrice;

// // //   update("line_items", updated);
// // // };
// // //   const addItem = () =>
// // //     update("line_items", [...content.line_items, { description: "", hours: "", unit_price: "", amount: "" }]);

// // //   const removeItem = (i) =>
// // //     update("line_items", content.line_items.filter((_, idx) => idx !== i));

// // //   return (
// // //     <div style={f.wrap}>
// // //       <SectionLabel>Page 1 — Letter</SectionLabel>
// // //       <Field label="Client name"       value={content.client_name}         onChange={v => update("client_name", v)} />
// // //       <Field label="Organisation"      value={content.client_organisation} onChange={v => update("client_organisation", v)} />
// // //       <Field label="Place"             value={content.client_place}        onChange={v => update("client_place", v)} />
// // //       <Field label="Date"              value={content.date}                onChange={v => update("date", v)} />
// // //       <Field label="Sender name"       value={content.sender_name}         onChange={v => update("sender_name", v)} />
// // //       <Field label="Sender title"      value={content.sender_designation}  onChange={v => update("sender_designation", v)} />

// // //       <SectionLabel>Letter body</SectionLabel>
// // //       {content.body_paragraphs?.map((p, i) => (
// // //         <div key={i} style={f.group}>
// // //           <div style={f.label}>Paragraph {i + 1}</div>
// // //           <textarea style={f.textarea} value={p} rows={3} onChange={e => updatePara(i, e.target.value)} />
// // //         </div>
// // //       ))}

// // //       <SectionLabel>Page 2 — Quotation</SectionLabel>
// // //       <Field label="Quotation number" value={content.quotation_number} onChange={v => update("quotation_number", v)} />
// // //       <Field label="Project name"     value={content.project_name}     onChange={v => update("project_name", v)} />

// // //       <SectionLabel>Line items</SectionLabel>
// // //       {content.line_items?.map((item, i) => (
// // //         <div key={i} style={f.card}>
// // //           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
// // //             <span style={{ fontSize: 11, color: "#aaa" }}>Item {i + 1}</span>
// // //             <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
// // //           </div>
// // //           <Field label="Description" value={item.description} onChange={v => updateItem(i, "description", v)} />
// // //           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
// // //             {["hours", "unit_price", "amount"].map(key => (
// // //               <div key={key} style={f.group}>
// // //                 <div style={f.label}>{key.replace("_", " ")}</div>
// // //                 <input style={f.input} value={item[key] || ""} onChange={e => updateItem(i, key, e.target.value)} />
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       ))}
// // //       <button style={f.addBtn} onClick={addItem}>+ Add line item</button>
// // //       <div style={gstToggleWrap}>
// // //         <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>GST</span>
// // //         <button
// // //           style={{
// // //             ...gstToggleBtn,
// // //             background: gstEnabled ? "#111" : "#e0e0e0",
// // //             color:      gstEnabled ? "#fff" : "#888",
// // //           }}
// // //           onClick={() => {
// // //             setGstEnabled(p => !p);
// // //             if (gstEnabled) {
// // //               update("gst_percent", 0);
// // //               update("gst_amount",  "0");
// // //             }
// // //           }}
// // //         >
// // //           {gstEnabled ? "ON" : "OFF"}
// // //         </button>
// // //       </div>

// // //       {gstEnabled && (
// // //         <Field
// // //           label="GST %"
// // //           value={String(content.gst_percent || "")}
// // //           onChange={v => update("gst_percent", v)}
// // //         />
// // //       )}

// // //       <SectionLabel>Totals</SectionLabel>
// // //       <Field label="Subtotal"   value={content.subtotal}   onChange={v => update("subtotal", v)} />
// // //       <Field label="GST amount" value={content.gst_amount} onChange={v => update("gst_amount", v)} />
// // //       <Field label="Total"      value={content.total}      onChange={v => update("total", v)} />
// // //     </div>
// // //   );
// // // }

// // // // ── 3. Compliance ─────────────────────────────────────────────────────
// // // function ComplianceFields({ content, update }) {
// // //   const updatePara = (i, val) => {
// // //     const updated = [...content.body_paragraphs];
// // //     updated[i] = val;
// // //     update("body_paragraphs", updated);
// // //   };

// // //   return (
// // //     <div style={f.wrap}>
// // //       <Field label="Letter type"           value={content.letter_type}           onChange={v => update("letter_type", v)} />
// // //       <Field label="Date"                  value={content.date}                  onChange={v => update("date", v)} />
// // //       <Field label="Recipient name"        value={content.recipient_name}        onChange={v => update("recipient_name", v)} />
// // //       <Field label="Recipient designation" value={content.recipient_designation} onChange={v => update("recipient_designation", v)} />
// // //       <Field label="Recipient company"     value={content.recipient_company}     onChange={v => update("recipient_company", v)} />
// // //       <Field label="Subject"               value={content.subject}               onChange={v => update("subject", v)} />
// // //       <Field label="Salutation"            value={content.salutation}            onChange={v => update("salutation", v)} />

// // //       <SectionLabel>Body paragraphs</SectionLabel>
// // //       {content.body_paragraphs?.map((p, i) => (
// // //         <div key={i} style={f.group}>
// // //           <div style={f.label}>Paragraph {i + 1}</div>
// // //           <textarea style={f.textarea} value={p} rows={3} onChange={e => updatePara(i, e.target.value)} />
// // //         </div>
// // //       ))}

// // //       <SectionLabel>Sign-off</SectionLabel>
// // //       <Field label="Closing"              value={content.closing}              onChange={v => update("closing", v)} />
// // //       <Field label="Sender name"          value={content.sender_name}          onChange={v => update("sender_name", v)} />
// // //       <Field label="Sender designation"   value={content.sender_designation}   onChange={v => update("sender_designation", v)} />
// // //       <Field label="Sender contact"       value={content.sender_contact}       onChange={v => update("sender_contact", v)} />
// // //     </div>
// // //   );
// // // }

// // // // ── 4. Invoice ────────────────────────────────────────────────────────
// // // // function InvoiceFields({ content, update }) {
// // // //     const [gstEnabled, setGstEnabled] = useState(
// // // //     parseFloat(content.gst_percent) > 0  // agar pehle se GST set hai toh on
// // // //   );

// // // //   // ── AUTO CALCULATE ───────────────────────────────────────
// // // //   useEffect(() => {
// // // //     if (!content.line_items?.length) return;

// // // //     const parseAmt = (val) => {
// // // //       if (!val) return 0;
// // // //       return parseFloat(String(val).replace(/[₹,\s]/g, "")) || 0;
// // // //     };

// // // //   // ── AUTO CALCULATE ──────────────────────────────────────────
// // // //   // useEffect(() => {
// // // //   //   if (!content.line_items?.length) return;

// // // //   //   // ₹1,20,000 ya 120000 — dono parse karta hai
// // // //   //   const parseAmt = (val) => {
// // // //   //     if (!val) return 0;
// // // //   //     return parseFloat(String(val).replace(/[₹,\s]/g, "")) || 0;
// // // //   //   };

// // // //     const subtotal   = content.line_items.reduce((sum, item) => sum + parseAmt(item.amount), 0);
// // // //     const gstPercent = parseFloat(content.gst_percent) || 0;
// // // //     const gstAmt     = (subtotal * gstPercent) / 100;
// // // //     const total      = subtotal + gstAmt;

// // // //     // Indian format: ₹1,20,000
// // // //     const fmt = (n) => n > 0 ? `₹${n.toLocaleString("en-IN")}` : "0";

// // // //     update("subtotal",   fmt(subtotal));
// // // //     update("gst_amount", gstPercent > 0 ? fmt(gstAmt) : "0");
// // // //     update("total",      fmt(total));

// // // //   }, [content.line_items, content.gst_percent]);
// // // //   // ────────────────────────────────────────────────────────────

// // // //   // ... baaki sab same rehta hai
// // // //   const updateItem = (i, key, val) => {
// // // //     const updated = [...content.line_items];
// // // //     updated[i] = { ...updated[i], [key]: val };
// // // //     update("line_items", updated);
// // // //   };

// // // //   const addItem = () =>
// // // //     update("line_items", [...(content.line_items || []), { description: "", hours: "", unit_price: "", amount: "" }]);

// // // //   const removeItem = (i) =>
// // // //     update("line_items", content.line_items.filter((_, idx) => idx !== i));

// // // //   return (
// // // //     <div style={f.wrap}>
// // // //       <SectionLabel>Invoice info</SectionLabel>
// // // //       <Field label="Invoice number" value={content.invoice_number} onChange={v => update("invoice_number", v)} />
// // // //       <Field label="Date"           value={content.date}           onChange={v => update("date", v)} />
// // // //       <Field label="Project name"   value={content.project_name}   onChange={v => update("project_name", v)} />

// // // //       <SectionLabel>Client info</SectionLabel>
// // // //       <Field label="Client name"    value={content.client_name}    onChange={v => update("client_name", v)} />
// // // //       <Field label="Client email"   value={content.client_email}   onChange={v => update("client_email", v)} />
// // // //       <Field label="Client address" value={content.client_address} onChange={v => update("client_address", v)} />

// // // //       <SectionLabel>Project description</SectionLabel>
// // // //       <Field label="Description"    value={content.project_description} onChange={v => update("project_description", v)} multiline />

// // // //       <SectionLabel>Line items</SectionLabel>
// // // //       {content.line_items?.map((item, i) => (
// // // //         <div key={i} style={f.card}>
// // // //           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
// // // //             <span style={{ fontSize: 11, color: "#aaa" }}>Item {i + 1}</span>
// // // //             <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
// // // //           </div>
// // // //           <Field label="Description" value={item.description} onChange={v => updateItem(i, "description", v)} />
// // // //           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
// // // //             {["hours", "unit_price", "amount"].map(key => (
// // // //               <div key={key} style={f.group}>
// // // //                 <div style={f.label}>{key.replace("_", " ")}</div>
// // // //                 <input style={f.input} value={item[key] || ""} onChange={e => updateItem(i, key, e.target.value)} />
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //         </div>
// // // //       ))}
// // // //       <button style={f.addBtn} onClick={addItem}>+ Add line item</button>
// // // //       <div style={gstToggleWrap}>
// // // //         <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>GST</span>
// // // //         <button
// // // //           style={{
// // // //             ...gstToggleBtn,
// // // //             background: gstEnabled ? "#111" : "#e0e0e0",
// // // //             color:      gstEnabled ? "#fff" : "#888",
// // // //           }}
// // // //           onClick={() => {
// // // //             setGstEnabled(p => !p);
// // // //             if (gstEnabled) {
// // // //               // turning OFF — reset GST fields
// // // //               update("gst_percent", 0);
// // // //               update("gst_amount",  "0");
// // // //             }
// // // //           }}
// // // //         >
// // // //           {gstEnabled ? "ON" : "OFF"}
// // // //         </button>
// // // //       </div>

// // // //       {/* GST % input — sirf tab dikhao jab ON ho */}
// // // //       {gstEnabled && (
// // // //         <Field
// // // //           label="GST %"
// // // //           value={String(content.gst_percent || "")}
// // // //           onChange={v => update("gst_percent", v)}
// // // //         />
// // // //       )}
// // // //       {/* ──────────────────────────────────────────────────── */}


// // // //       <SectionLabel>Totals</SectionLabel>
// // // //       <Field label="Subtotal"    value={content.subtotal}    onChange={v => update("subtotal", v)} />
// // // //       <Field label="GST"         value={content.gst_amount}  onChange={v => update("gst_amount", v)} />
// // // //       <Field label="Total"       value={content.total}       onChange={v => update("total", v)} />

// // // //       <SectionLabel>Payment & status</SectionLabel>
// // // //       <Field label="Payment status" value={content.payment_status} onChange={v => update("payment_status", v)} />
// // // //       <Field label="Payment date"   value={content.payment_date}   onChange={v => update("payment_date", v)} />
// // // //       <Field label="Bank name"      value={content.bank_name}      onChange={v => update("bank_name", v)} />
// // // //       <Field label="Account name"   value={content.account_name}   onChange={v => update("account_name", v)} />
// // // //       <Field label="Phone number"   value={content.phone_number}   onChange={v => update("phone_number", v)} />
// // // //       <Field label="UPI ID"         value={content.upi_id}         onChange={v => update("upi_id", v)} />
// // // //       <Field label="Notes"          value={content.notes}          onChange={v => update("notes", v)} multiline />
// // // //     </div>
// // // //   );
// // // // }

// // // function InvoiceFields({ content, update }) {

// // //   // ── GST TOGGLE STATE ─────────────────────────────────────
// // //   const [gstEnabled, setGstEnabled] = useState(
// // //     parseFloat(content.gst_percent) > 0  // agar pehle se GST set hai toh on
// // //   );

// // //   // ── AUTO CALCULATE ───────────────────────────────────────
// // //   useEffect(() => {
// // //     if (!content.line_items?.length) return;

// // //     const parseAmt = (val) => {
// // //       if (!val) return 0;
// // //       return parseFloat(String(val).replace(/[₹,\s]/g, "")) || 0;
// // //     };

// // //     const subtotal   = content.line_items.reduce((sum, item) => sum + parseAmt(item.amount), 0);
// // //     const gstPercent = gstEnabled ? (parseFloat(content.gst_percent) || 0) : 0;
// // //     const gstAmt     = (subtotal * gstPercent) / 100;
// // //     const total      = subtotal + gstAmt;

// // //     const fmt = (n) => n > 0 ? `₹${n.toLocaleString("en-IN")}` : "0";

// // //     update("subtotal",   fmt(subtotal));
// // //     update("gst_percent", gstEnabled ? gstPercent : 0);
// // //     update("gst_amount", gstEnabled && gstPercent > 0 ? fmt(gstAmt) : "0");
// // //     update("total",      fmt(total));

// // //   }, [content.line_items, content.gst_percent, gstEnabled]);

// // //   const updateItem = (i, key, val) => {
// // //     const updated = [...content.line_items];
// // //     updated[i] = { ...updated[i], [key]: val };
// // //     update("line_items", updated);
// // //   };

// // //   const addItem = () =>
// // //     update("line_items", [...(content.line_items || []), { description: "", hours: "", unit_price: "", amount: "" }]);

// // //   const removeItem = (i) =>
// // //     update("line_items", content.line_items.filter((_, idx) => idx !== i));

// // //   return (
// // //     <div style={f.wrap}>
// // //       <SectionLabel>Invoice info</SectionLabel>
// // //       <Field label="Invoice number" value={content.invoice_number} onChange={v => update("invoice_number", v)} />
// // //       <Field label="Date"           value={content.date}           onChange={v => update("date", v)} />
// // //       <Field label="Project name"   value={content.project_name}   onChange={v => update("project_name", v)} />

// // //       <SectionLabel>Client info</SectionLabel>
// // //       <Field label="Client name"    value={content.client_name}    onChange={v => update("client_name", v)} />
// // //       <Field label="Client email"   value={content.client_email}   onChange={v => update("client_email", v)} />
// // //       <Field label="Client address" value={content.client_address} onChange={v => update("client_address", v)} />

// // //       <SectionLabel>Project description</SectionLabel>
// // //       <Field label="Description" value={content.project_description} onChange={v => update("project_description", v)} multiline />

// // //       <SectionLabel>Line items</SectionLabel>
// // //       {content.line_items?.map((item, i) => (
// // //         <div key={i} style={f.card}>
// // //           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
// // //             <span style={{ fontSize: 11, color: "#aaa" }}>Item {i + 1}</span>
// // //             <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
// // //           </div>
// // //           <Field label="Description" value={item.description} onChange={v => updateItem(i, "description", v)} />
// // //           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
// // //             {["hours", "unit_price", "amount"].map(key => (
// // //               <div key={key} style={f.group}>
// // //                 <div style={f.label}>{key.replace("_", " ")}</div>
// // //                 <input style={f.input} value={item[key] || ""} onChange={e => updateItem(i, key, e.target.value)} />
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       ))}
// // //       <button style={f.addBtn} onClick={addItem}>+ Add line item</button>

// // //       {/* ── GST TOGGLE ──────────────────────────────────────── */}
// // //       <div style={gstToggleWrap}>
// // //         <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>GST</span>
// // //         <button
// // //           style={{
// // //             ...gstToggleBtn,
// // //             background: gstEnabled ? "#111" : "#e0e0e0",
// // //             color:      gstEnabled ? "#fff" : "#888",
// // //           }}
// // //           onClick={() => {
// // //             setGstEnabled(p => !p);
// // //             if (gstEnabled) {
// // //               // turning OFF — reset GST fields
// // //               update("gst_percent", 0);
// // //               update("gst_amount",  "0");
// // //             }
// // //           }}
// // //         >
// // //           {gstEnabled ? "ON" : "OFF"}
// // //         </button>
// // //       </div>

// // //       {/* GST % input — sirf tab dikhao jab ON ho */}
// // //       {gstEnabled && (
// // //         <Field
// // //           label="GST %"
// // //           value={String(content.gst_percent || "")}
// // //           onChange={v => update("gst_percent", v)}
// // //         />
// // //       )}
// // //       {/* ──────────────────────────────────────────────────── */}

// // //       <SectionLabel>Totals</SectionLabel>
// // //       <Field label="Subtotal" value={content.subtotal}   onChange={v => update("subtotal", v)} />
// // //       {gstEnabled && (
// // //         <Field label="GST amount" value={content.gst_amount} onChange={v => update("gst_amount", v)} />
// // //       )}
// // //       <Field label="Total"    value={content.total}      onChange={v => update("total", v)} />

// // //       <SectionLabel>Payment & status</SectionLabel>
// // //       <Field label="Payment status" value={content.payment_status} onChange={v => update("payment_status", v)} />
// // //       <Field label="Payment date"   value={content.payment_date}   onChange={v => update("payment_date", v)} />
// // //       <Field label="Bank name"      value={content.bank_name}      onChange={v => update("bank_name", v)} />
// // //       <Field label="Account name"   value={content.account_name}   onChange={v => update("account_name", v)} />
// // //       <Field label="Phone number"   value={content.phone_number}   onChange={v => update("phone_number", v)} />
// // //       <Field label="UPI ID"         value={content.upi_id}         onChange={v => update("upi_id", v)} />
// // //       <Field label="Notes"          value={content.notes}          onChange={v => update("notes", v)} multiline />
// // //     </div>
// // //   );
// // // }
// // // function TimelineFields({ content, update }) {

// // //   const updateItem = (i, key, val) => {
// // //     const updated = [...(content.timeline_items || [])];
// // //     updated[i] = { ...updated[i], [key]: val };
// // //     update("timeline_items", updated);
// // //   };

// // //   const addItem = () =>
// // //     update("timeline_items", [
// // //       ...(content.timeline_items || []),
// // //       { description: "", timeline: "", hours: "" }
// // //     ]);

// // //   const removeItem = (i) =>
// // //     update("timeline_items",
// // //       (content.timeline_items || []).filter((_, idx) => idx !== i)
// // //     );

// // //   return (
// // //     <div style={f.wrap}>

// // //       <SectionLabel>Project Info</SectionLabel>
// // //       <Field label="Project name"        value={content.project_name}        onChange={v => update("project_name", v)} />
// // //       <Field label="Project description" value={content.project_description} onChange={v => update("project_description", v)} />
// // //       <Field label="Client name"         value={content.client_name}         onChange={v => update("client_name", v)} />

// // //       <SectionLabel>Timeline Items</SectionLabel>
// // //       {(content.timeline_items || []).map((item, i) => (
// // //         <div key={i} style={f.card}>
// // //           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
// // //             <span style={{ fontSize: 11, color: "#aaa" }}>Phase {i + 1}</span>
// // //             <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
// // //           </div>
// // //           <Field
// // //             label="Description"
// // //             value={item.description}
// // //             onChange={v => updateItem(i, "description", v)}
// // //           />
// // //           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
// // //             <div style={f.group}>
// // //               <div style={f.label}>Timeline</div>
// // //               <input
// // //                 style={f.input}
// // //                 value={item.timeline || ""}
// // //                 onChange={e => updateItem(i, "timeline", e.target.value)}
// // //                 placeholder="e.g. 5 days"
// // //               />
// // //             </div>
// // //             <div style={f.group}>
// // //               <div style={f.label}>Hours</div>
// // //               <input
// // //                 style={f.input}
// // //                 value={item.hours || ""}
// // //                 onChange={e => updateItem(i, "hours", e.target.value)}
// // //                 placeholder="e.g. 20"
// // //               />
// // //             </div>
// // //           </div>
// // //         </div>
// // //       ))}
// // //       <button style={f.addBtn} onClick={addItem}>+ Add phase</button>

// // //       <SectionLabel>Totals</SectionLabel>
// // //       <Field label="Total time"          value={content.total_time}       onChange={v => update("total_time", v)}       placeholder="e.g. 62 DAYS" />
// // //       <Field label="Expected dev time"   value={content.expected_dev_time} onChange={v => update("expected_dev_time", v)} placeholder="e.g. 58 DAYS" />
// // //       <Field label="Expected closure"    value={content.expected_closure}  onChange={v => update("expected_closure", v)} placeholder="e.g. 90 DAYS" />
// // //       <Field label="Closure date"        value={content.closure_date}      onChange={v => update("closure_date", v)}     placeholder="DD MM YYYY" />

// // //     </div>
// // //   );
// // // }

// // // // ══════════════════════════════════════════════════════════════════════
// // // // SHARED HELPER COMPONENTS
// // // // ══════════════════════════════════════════════════════════════════════

// // // function Field({ label, value, onChange, multiline }) {
// // //   return (
// // //     <div style={f.group}>
// // //       <div style={f.label}>{label}</div>
// // //       {multiline
// // //         ? <textarea style={{ ...f.input, minHeight: 68, resize: "vertical" }} value={value || ""} onChange={e => onChange(e.target.value)} />
// // //         : <input style={f.input} value={value || ""} onChange={e => onChange(e.target.value)} />
// // //       }
// // //     </div>
// // //   );
// // // }

// // // function SectionLabel({ children }) {
// // //   return <div style={f.sectionLabel}>{children}</div>;
// // // }

// // // function TypeBadge({ type }) {
// // //   const colors = {
// // //     developer_doc: { bg: "#EEEDFE", color: "#534AB7" },
// // //     client_doc:    { bg: "#E1F5EE", color: "#0F6E56" },
// // //     compliance:    { bg: "#FAEEDA", color: "#854F0B" },
// // //     invoice:       { bg: "#FAECE7", color: "#993C1D" },
// // //   };
// // //   const labels = {
// // //     developer_doc: "Developer Doc",
// // //     client_doc:    "Client Proposal",
// // //     compliance:    "Compliance",
// // //     invoice:       "Invoice",
// // //   };
// // //   const c = colors[type] || { bg: "#f0f0f0", color: "#666" };
// // //   return (
// // //     <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 20, fontWeight: 500, background: c.bg, color: c.color }}>
// // //       {labels[type] || type}
// // //     </span>
// // //   );
// // // }

// // // // function AsteriskIcon({ size = 18 }) {
// // // //   return (
// // // //     <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
// // // //       <path d="M22 4 L22 40 M4 22 L40 22 M7.5 7.5 L36.5 36.5 M36.5 7.5 L7.5 36.5"
// // // //         stroke="#111" strokeWidth="5" strokeLinecap="round" />
// // // //     </svg>
// // // //   );
// // // // }

// // // // ══════════════════════════════════════════════════════════════════════
// // // // STYLES
// // // // ══════════════════════════════════════════════════════════════════════

// // // const s = {
// // //   promptBox:      { borderBottom: "1px solid #f0f0f0", flexShrink: 0 ,width:"300px"},
// // // promptToggle:   { width: "100%", textAlign: "left", padding: "10px 16px", fontSize: 12, fontWeight: 600, color: "#131415", background: "#f5f3ff", border: "none", cursor: "pointer", borderBottom: "1px solid #fbfbfd" },
// // // promptInner:    { padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8, background: "#fafafa" },
// // // promptTextarea: { width: "100%", border: "1px solid #e8e8e8", borderRadius: 6, padding: "8px 10px", fontSize: 12, color: "#333", outline: "none", fontFamily: "inherit", lineHeight: 1.5, resize: "vertical", background: "#fff" ,height:"300px"},
// // // btnGenerateFull:    { width: "100%", fontSize: 13, fontWeight: 600, background: "#141415", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", cursor: "pointer" },
// // // btnGeneratingFull:  { width: "100%", fontSize: 13, background: "#121314", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", cursor: "not-allowed" },
  
  
// // // // btnOutlineDisabled: {
// // // //   fontSize: 12,
// // // //   color: "#aaa",
// // // //   background: "#fafafa",
// // // //   border: "1px solid #e0e0e0",
// // // //   borderRadius: 7,
// // // //   padding: "6px 12px",
// // // //   cursor: "not-allowed",
// // // //   textDecoration: "none",
// // // //   display: "inline-block",
// // // //   lineHeight: "normal",
// // // // },

// // //   // Topbar
// // //   page: {
// // //   height: "100vh",
// // //   display: "flex",
// // //   flexDirection: "column",
// // //   overflow: "hidden",
// // //   background: "#f7f7f7",
// // // },
// // //   topbar:      { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", height: 52, background: "#fff", borderBottom: "1px solid #e8e8e8", flexShrink: 0, gap: 12 },
// // //   topLeft:     { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
// // //   topRight:    { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
// // //   topLogo:     { display: "flex", alignItems: "center", textDecoration: "none", padding: "4px", borderRadius: 6, flexShrink: 0 },
// // //   topDivider:  { width: 1, height: 20, background: "#e8e8e8" },
// // //   docName:     { fontSize: 14, fontWeight: 600, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 },
// // //   unsavedDot:  { width: 7, height: 7, borderRadius: "50%", background: "#f39c12", flexShrink: 0 },

// // //   btnSave:     { fontSize: 13, fontWeight: 600, background: "#111", color: "#fff", border: "none", borderRadius: 7, padding: "6px 16px", cursor: "pointer" },
// // //   btnSavingDisabled: { fontSize: 13, background: "#888", color: "#fff", border: "none", borderRadius: 7, padding: "6px 16px" },
// // //   btnSaveFull: { width: "100%", fontSize: 13, fontWeight: 600, background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", cursor: "pointer" },
// // //   btnPrimary:  { fontSize: 13, fontWeight: 600, background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer" },
// // //   btnOutline:  { fontSize: 12, color: "#555", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 7, padding: "6px 12px", cursor: "pointer", textDecoration: "none", display: "inline-block", lineHeight: "normal" },
// // //   btnIcon:     { fontSize: 11, color: "#888", background: "none", border: "1px solid #e8e8e8", borderRadius: 6, padding: "5px 8px", cursor: "pointer" },
// // //   savedPill:   { fontSize: 12, color: "#27ae60", fontWeight: 500 },

// // //   // Panels
// // //   // panels:      { display: "flex", flex: 1, overflow: "hidden" },
// // //   panels: {
// // //     display: "flex",
// // //     flex: 1,
// // //     overflow: "hidden",
// // //     minHeight: 0,
// // // },

// // //   leftPanel:   { width: 300, display: "flex", flexDirection: "column", background: "#fff", borderRight: "1px solid #e8e8e8", flexShrink: 0, overflow: "hidden" },
// // //   panelHeader: { padding: "14px 16px 10px", borderBottom: "1px solid #f0f0f0", flexShrink: 0 },
// // //   panelTitle:  { fontSize: 12, fontWeight: 700, color: "#111", display: "block", marginBottom: 2 },
// // //   panelSubtitle:{ fontSize: 11, color: "#aaa" },
// // //   panelScroll: { flex: 1, overflowY: "auto", padding: "14px 16px", },
// // //   saveFooter:  { padding: "12px 16px", borderTop: "1px solid #f0f0f0", flexShrink: 0 },
// // //   rightPanel: {
// // //   flex: 1,
// // //   display: "flex",
// // //   flexDirection: "column",
// // //   padding: 16,
// // //   overflow: "hidden",
// // //   minHeight: 0,
// // // },

// // //   // rightPanel:  { flex: 1, display: "flex", flexDirection: "column", padding: 16, overflow: "hidden" },
// // //   iframeWrap:  { flex: 1, borderRadius: 10, overflow: "hidden", border: "1px solid #e0e0e0", background: "#fff" ,minHeight:0,
// // //     display:"flex"},
// // //   iframe:      { width: "100%", height: "100%", border: "none" },
// // // };

// // // const f = {
// // //   wrap:         { display: "flex", flexDirection: "column", gap: 10 },
// // //   group:        { display: "flex", flexDirection: "column", gap: 4 },
// // //   label:        { fontSize: 11, fontWeight: 600, color: "#888", textTransform: "capitalize" },
// // //   input:        { width: "100%", border: "1px solid #e8e8e8", borderRadius: 6, padding: "7px 9px", fontSize: 12, color: "#333", outline: "none", fontFamily: "inherit", lineHeight: 1.5, background: "#fafafa" },
// // //   textarea:     { width: "100%", border: "1px solid #e8e8e8", borderRadius: 6, padding: "7px 9px", fontSize: 12, color: "#333", outline: "none", fontFamily: "inherit", lineHeight: 1.5, resize: "vertical", background: "#fafafa" },
// // //   sectionLabel: { fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, paddingTop: 8, paddingBottom: 4, borderBottom: "1px solid #f0f0f0", marginBottom: 4 },
// // //   card:         { border: "1px solid #efefef", borderRadius: 8, padding: "10px 12px", background: "#fafafa" },
// // //   cardTitle:    { width: "100%", border: "none", borderBottom: "1px solid #e8e8e8", padding: "3px 0 6px", fontSize: 12, fontWeight: 700, outline: "none", background: "transparent", marginBottom: 8, fontFamily: "inherit" },
// // //   pointRow:     { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 },
// // //   bullet:       { color: "#ccc", fontSize: 8, flexShrink: 0 },
// // //   pointInput:   { flex: 1, border: "none", borderBottom: "1px solid #f0f0f0", fontSize: 12, padding: "2px 0", outline: "none", background: "transparent", color: "#444", fontFamily: "inherit" },
// // //   uvpRow:       { display: "flex", alignItems: "center", gap: 4 },
// // //   addBtn:       { fontSize: 12, color: "#555", background: "none", border: "1.5px dashed #ddd", borderRadius: 6, padding: "7px 12px", cursor: "pointer", textAlign: "left", fontFamily: "inherit" },
// // //   removeBtn:    { fontSize: 11, color: "#c0392b", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" },
// // // };
// // // const gstToggleWrap = {
// // //   display:      "flex",
// // //   alignItems:   "center",
// // //   justifyContent: "space-between",
// // //   padding:      "8px 12px",
// // //   background:   "#f7f7f7",
// // //   borderRadius: 8,
// // //   border:       "1px solid #efefef",
// // //   marginTop:    4,
// // // };

// // // const gstToggleBtn = {
// // //   fontSize:     11,
// // //   fontWeight:   700,
// // //   padding:      "3px 12px",
// // //   borderRadius: 20,
// // //   border:       "none",
// // //   cursor:       "pointer",
// // //   letterSpacing: "0.5px",
// // //   transition:   "background 0.15s",
// // // };
// // // const voiceWrap    = { display: "flex", flexDirection: "column", gap: 8, padding: "12px 0" };
// // // const voiceBtn     = { width: "100%", fontSize: 13, fontWeight: 600, color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", cursor: "pointer", transition: "all 0.2s" };
// // // const transcriptBox = { fontSize: 12, color: "#555", background: "#f0f0f0", borderRadius: 8, padding: "8px 10px", lineHeight: 1.5 };
// // // const pulseWrap    = { display: "flex", alignItems: "center", gap: 8 };
// // // const pulseDot     = { width: 10, height: 10, borderRadius: "50%", background: "#e74c3c", animation: "pulse 1s ease infinite" };

// // // // 👇 NAYE styles — improved voice UI ke liye
// // // const voiceBtnStart = {
// // //   width: "100%", fontSize: 13, fontWeight: 600, color: "#fff",
// // //   background: "#111", border: "none", borderRadius: 8,
// // //   padding: "12px 0", cursor: "pointer", transition: "all 0.2s",
// // // };
// // // const voiceBtnStop = {
// // //   width: "100%", fontSize: 13, fontWeight: 700, color: "#fff",
// // //   background: "#e74c3c", border: "none", borderRadius: 8,
// // //   padding: "12px 0", cursor: "pointer", transition: "all 0.2s",
// // //   boxShadow: "0 2px 8px rgba(231,76,60,0.35)",
// // // };
// // // const listeningBanner = {
// // //   display: "flex", alignItems: "center", gap: 8,
// // //   background: "#fdecea", border: "1px solid #f5c6c0",
// // //   borderRadius: 8, padding: "8px 10px",
// // // };
// // // const processingBanner = {
// // //   display: "flex", alignItems: "center", gap: 8,
// // //   background: "#f0f0f0", border: "1px solid #e0e0e0",
// // //   borderRadius: 8, padding: "8px 10px",
// // // };
// // // const spinnerDot = {
// // //   width: 12, height: 12, borderRadius: "50%",
// // //   border: "2px solid #ccc", borderTopColor: "#555",
// // //   animation: "spin 0.7s linear infinite",
// // // };
// // // const manualFillBtn = {
// // //   marginTop: 8, width: "100%", fontSize: 12, fontWeight: 600,
// // //   background: "#111", color: "#fff", border: "none",
// // //   borderRadius: 6, padding: "8px 0", cursor: "pointer",
// // // };

// // import React, { useEffect, useState, useRef } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { getDocument, updateDocument, previewUrl, refillDocument } from "../services/api";

// // const TYPE_LABELS = {
// //   receipt_template: "Receipt Template",
// //   client_doc:    "Client Proposal",
// //   compliance:    "Compliance Letter",
// //   invoice:       "Invoice",
// //   timeline:      "Project Timeline",
// // };

// // // Blank/empty starting structure per document type — used so refresh always starts fresh
// // function getBlankContent(type) {
// //   switch (type) {
// //     // case "receipt_template":
// //     //   return {
// //     //     project_name: "",
// //     //     tagline: "",
// //     //     overview: "",
// //     //     features: [],
// //     //     uvp: [],
// //     //   };
// //     case "receipt_template":
// //       return {
// //         receipt_number: "",
// //         date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
// //         service_name: "",
// //         payment_mode: "",
// //         client_name: "",
// //         client_phone: "",
// //         amount_received: "",
// //         amount_in_words: "",
// //         balance: "",
// //         line_items: [],
// //         subtotal: "0",
// //         gst_percent: 0,
// //         gst_amount: "0",
// //         total: "0",
// //         payment_status: "",
// //         paid_on: "",
// //         bank_name: "",
// //         upi_phone: "",
// //         upi_id: "",
// //       };
// //     case "client_doc":
// //       return {
// //         client_name: "",
// //         client_organisation: "",
// //         client_place: "",
// //         // date: "",
// //         date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
// //         sender_name: "",
// //         sender_designation: "",
// //         body_paragraphs: [],
// //         quotation_number: "",
// //         project_name: "",
// //         line_items: [],
// //         gst_percent: 0,
// //         gst_amount: "0",
// //         subtotal: "0",
// //         total: "0",
// //       };
// //     case "compliance":
// //       return {
// //         letter_type: "",
// //         // date: "",
// //         date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
// //         recipient_name: "",
// //         recipient_designation: "",
// //         recipient_company: "",
// //         subject: "",
// //         salutation: "",
// //         body_paragraphs: [],
// //         closing: "",
// //         sender_name: "",
// //         sender_designation: "",
// //         sender_contact: "",
// //       };
// //     case "invoice":
// //       return {
// //         invoice_number: "",
// //         // date: "",
// //         date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
// //         project_name: "",
// //         client_name: "",
// //         client_email: "",
// //         client_address: "",
// //         project_description: "",
// //         line_items: [],
// //         gst_percent: 0,
// //         gst_amount: "0",
// //         subtotal: "0",
// //         total: "0",
// //         payment_status: "",
// //         payment_date: "",
// //         bank_name: "",
// //         account_name: "",
// //         phone_number: "",
// //         upi_id: "",
// //         notes: "",
// //       };
// //     case "timeline":
// //       return {
// //         project_name: "",
// //         project_description: "",
// //         client_name: "",
// //         timeline_items: [],
// //         total_time: "",
// //         expected_dev_time: "",
// //         expected_closure: "",
// //         closure_date: "",
// //       };
// //     default:
// //       return {};
// //   }
// // }

// // export default function Editor() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();

// //   const [doc, setDoc]               = useState(null);
// //   const [content, setContent]       = useState(null);
// //   const [loading, setLoading]       = useState(true);
// //   const [saving, setSaving]         = useState(false);
// //   const [saved, setSaved]           = useState(false);
// //   const [dirty, setDirty]           = useState(false);
// //   const [copied, setCopied]         = useState(false);
// //   const [iframeKey, setIframeKey]   = useState(0);
// //   const [panelOpen, setPanelOpen]   = useState(true);
// //   const [prompt, setPrompt]         = useState("");
// //   const [generating, setGenerating] = useState(false);
// //   const [promptOpen, setPromptOpen] = useState(false);
// //   const [listening, setListening]   = useState(false);
// //   const [transcript, setTranscript] = useState("");

// //   const recognitionRef = useRef(null);
// //   const transcriptRef  = useRef("");

// //   // ── Load document, but always start with BLANK content (refresh = fresh start) ──
// //   useEffect(() => {
// //     getDocument(id)
// //       .then(async (res) => {
// //         setDoc(res.data);
// //         const blank = getBlankContent(res.data.template_type);
// //         setContent(blank);

// //         // Reset backend content too, so the preview iframe (which loads
// //         // straight from the backend) also shows blank instead of old data
// //         try {
// //           await updateDocument(id, blank);
// //           setIframeKey(k => k + 1);
// //         } catch (err) {
// //           console.error("Failed to reset backend content:", err);
// //         }
// //       })
// //       .catch(() => setDoc(null))
// //       .finally(() => setLoading(false));
// //   }, [id]);

// //   const update = (key, val) => {
// //     setContent(p => ({ ...p, [key]: val }));
// //     setDirty(true);
// //   };

// //   // ── Voice input ──────────────────────────────────────────────
// //   const startVoice = () => {
// //     const SpeechRecognition =
// //       window.SpeechRecognition || window.webkitSpeechRecognition;

// //     if (!SpeechRecognition) {
// //       alert("Voice not supported in this browser. Use Chrome.");
// //       return;
// //     }

// //     const recognition          = new SpeechRecognition();
// //     recognition.lang           = "en-IN";
// //     recognition.continuous     = true;
// //     recognition.interimResults = true;

// //     recognition.onstart = () => {
// //       setListening(true);
// //       setTranscript("");
// //       transcriptRef.current = "";
// //     };

// //     recognition.onresult = (e) => {
// //       const text = Array.from(e.results)
// //         .map(r => r[0].transcript)
// //         .join("");
// //       setTranscript(text);
// //       transcriptRef.current = text; // ref stays fresh — onend reads from here
// //     };

// //     recognition.onend = async () => {
// //       setListening(false);
// //       const finalText = transcriptRef.current;
// //       if (finalText.trim()) {
// //         setGenerating(true);
// //         try {
// //           const res = await refillDocument(id, finalText);
// //           const gc =
// //             res.data.content ||
// //             res.data.document?.content ||
// //             res.data.data?.content ||
// //             res.data;
// //           if (!gc || typeof gc !== "object") throw new Error("No content");

// //           setContent(gc);
// //           await updateDocument(id, gc);
// //           setIframeKey(k => k + 1);
// //           setTranscript("");
// //           transcriptRef.current = "";
// //         } catch {
// //           alert("Voice generation failed.");
// //         } finally {
// //           setGenerating(false);
// //         }
// //       }
// //     };

// //     recognition.onerror = () => setListening(false);

// //     recognitionRef.current = recognition;
// //     recognition.start();
// //   };

// //   const stopVoice = () => {
// //     recognitionRef.current?.stop();
// //     setListening(false);
// //   };

// //   // Fallback manual fill — used if auto-fill didn't trigger after speech ended
// //   const handleManualFill = async () => {
// //     const text = transcriptRef.current || transcript;
// //     if (!text.trim()) return;
// //     setGenerating(true);
// //     try {
// //       const res = await refillDocument(id, text);
// //       const gc =
// //         res.data.content ||
// //         res.data.document?.content ||
// //         res.data.data?.content ||
// //         res.data;
// //       if (!gc || typeof gc !== "object") throw new Error("No content");

// //       setContent(gc);
// //       await updateDocument(id, gc);
// //       setIframeKey(k => k + 1);
// //       setTranscript("");
// //       transcriptRef.current = "";
// //     } catch {
// //       alert("Fill failed. Try again.");
// //     } finally {
// //       setGenerating(false);
// //     }
// //   };

// //   // ── Manual save ─────────────────────────────────────────────
// //   const handleSave = async () => {
// //     setSaving(true);
// //     try {
// //       await updateDocument(id, content);
// //       setDirty(false);
// //       setSaved(true);
// //       setIframeKey(k => k + 1);
// //       setTimeout(() => setSaved(false), 2500);
// //     } catch {
// //       alert("Save failed. Please try again.");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   // ── Auto-save on content change (debounced) ─────────────────
// //   useEffect(() => {
// //     if (!content || !dirty) return;

// //     const timer = setTimeout(async () => {
// //       try {
// //         await updateDocument(id, content);
// //         setIframeKey(k => k + 1);
// //         setDirty(false);
// //         setSaved(true);
// //         setTimeout(() => setSaved(false), 1500);
// //       } catch {
// //         // silent fail — user can manually save
// //       }
// //     }, 800);

// //     return () => clearTimeout(timer);
// //   }, [content]);

// //   const handleCopyLink = () => {
// //     navigator.clipboard.writeText(window.location.href);
// //     setCopied(true);
// //     setTimeout(() => setCopied(false), 2000);
// //   };

// //   // ── AI prompt fill ───────────────────────────────────────────
// //   const handleRefill = async () => {
// //     if (!prompt.trim()) return;
// //     setGenerating(true);
// //     try {
// //       const res = await refillDocument(id, prompt);

// //       const generatedContent =
// //         res.data.content ||
// //         res.data.document?.content ||
// //         res.data.data?.content;

// //       if (!generatedContent) {
// //         throw new Error("No content returned");
// //       }

// //       setContent(generatedContent);
// //       await updateDocument(id, generatedContent);
// //       setIframeKey((k) => k + 1);
// //       setDirty(false);
// //       setPrompt(""); // clear textarea after successful submit
// //     } catch (err) {
// //       alert("Generation failed. Try again.");
// //     } finally {
// //       setGenerating(false);
// //     }
// //   };

// //   const handleDownloadPDF = () => {
// //     const BASE =
// //       import.meta.env.VITE_API_URL ||
// //       "http://localhost:8000";

// //     window.open(
// //       `${BASE}/api/doc/${id}/preview?autoprint=1`,
// //       "_blank"
// //     );
// //   };

// //   // ── Loading state ──────────────────────────────────────────
// //   if (loading) {
// //     return (
// //       <div style={s.centerScreen}>
// //         <div style={s.spinner} />
// //         <p style={s.loadingText}>Loading document...</p>
// //       </div>
// //     );
// //   }

// //   // ── Not found ─────────────────────────────────────────────
// //   if (!doc) {
// //     return (
// //       <div style={s.centerScreen}>
// //         <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
// //         <p style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 8 }}>
// //           Document not found
// //         </p>
// //         <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>
// //           This link may have expired or been deleted.
// //         </p>
// //         <button style={s.btnPrimary} onClick={() => navigate("/")}>
// //           ← Back to home
// //         </button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div style={s.page}>

// //       {/* ── Top bar ──────────────────────────────────────────── */}
// //       <div style={s.topbar}>
// //         <div style={s.topLeft}>
// //           <div style={s.topDivider} />
// //           <span style={s.docName}>{doc.project_name}</span>
// //           <TypeBadge type={doc.template_type} />
// //           {dirty && <span style={s.unsavedDot} title="Unsaved changes" />}
// //         </div>

// //         <div style={s.topRight}>
// //           {dirty && (
// //             <button
// //               style={saving ? s.btnSavingDisabled : s.btnSave}
// //               onClick={handleSave}
// //               disabled={saving}
// //             >
// //               {saving ? "Saving..." : "Save changes"}
// //             </button>
// //           )}
// //           {saved && !dirty && (
// //             <span style={s.savedPill}>✓ Saved</span>
// //           )}

// //           <button
// //             style={s.btnIcon}
// //             onClick={() => setPanelOpen(p => !p)}
// //             title={panelOpen ? "Hide editor" : "Show editor"}
// //           >
// //             {panelOpen ? "◀" : "▶"}
// //           </button>

// //           <button style={s.btnOutline} onClick={handleCopyLink}>
// //             {copied ? " Copied!" : "Share link"}
// //           </button>

// //           <button style={s.btnOutline} onClick={handleDownloadPDF}>
// //             ⬇ Download PDF
// //           </button>

// //           <a
// //             href={previewUrl(id)}
// //             rel="noreferrer"
// //             style={s.btnOutline}
// //           >
// //             Open ↗
// //           </a>
// //         </div>
// //       </div>

// //       {/* ── Two-panel layout ────────────────────────────────── */}
// //       <div style={s.panels}>
// //         <div style={s.promptBox}>
// //           <button
// //             style={s.promptToggle}
// //             onClick={() => setPromptOpen(p => !p)}
// //           >
// //             ✦ {promptOpen ? "Close AI fill" : "Fill with AI prompt"}
// //           </button>

// //           {promptOpen && (
// //             <div style={s.promptInner}>
// //               <textarea
// //                 style={s.promptTextarea}
// //                 rows={4}
// //                 placeholder={
// //                   `Example:\n"Client: Rahul Sharma, Project: Ayurvedic app with AI skin analysis, 3 months, budget ₹5L, 40-30-30 payment split"`
// //                 }
// //                 value={prompt}
// //                 onChange={e => setPrompt(e.target.value)}
// //               />
// //               <button
// //                 style={generating ? s.btnGeneratingFull : s.btnGenerateFull}
// //                 onClick={handleRefill}
// //                 disabled={generating || !prompt.trim()}
// //               >
// //                 {generating ? " Generating..." : " Generate & Fill"}
// //               </button>
// //             </div>
// //           )}

// //           {/* ── VOICE FILL ── */}
// //           <div style={voiceWrap}>

// //             {/* State 1: Idle — show Start button */}
// //             {!listening && !generating && (
// //               <button style={voiceBtnStart} onClick={startVoice}>
// //                 🎙 Start speaking
// //               </button>
// //             )}

// //             {/* State 2: Listening — live status + big Stop button */}
// //             {listening && (
// //               <>
// //                 <div style={listeningBanner}>
// //                   <div style={pulseDot} />
// //                   <span style={{ fontSize: 12, color: "#e74c3c", fontWeight: 600 }}>
// //                     Listening... speak clearly
// //                   </span>
// //                 </div>

// //                 {transcript && (
// //                   <div style={transcriptBox}>
// //                     <span style={{ fontSize: 10, color: "#aaa", display: "block", marginBottom: 4 }}>
// //                       Heard so far:
// //                     </span>
// //                     {transcript}
// //                   </div>
// //                 )}

// //                 <button style={voiceBtnStop} onClick={stopVoice}>
// //                   ⏹ Stop & fill document
// //                 </button>
// //               </>
// //             )}

// //             {/* State 3: Processing after stop */}
// //             {generating && (
// //               <div style={processingBanner}>
// //                 <div style={spinnerDot} />
// //                 <span style={{ fontSize: 12, color: "#555", fontWeight: 600 }}>
// //                   Filling your document...
// //                 </span>
// //               </div>
// //             )}

// //             {/* Fallback: speech ended but wasn't auto-filled */}
// //             {!listening && !generating && transcript && (
// //               <div style={transcriptBox}>
// //                 <span style={{ fontSize: 10, color: "#aaa", display: "block", marginBottom: 4 }}>
// //                   Last heard:
// //                 </span>
// //                 {transcript}
// //                 <button style={manualFillBtn} onClick={handleManualFill}>
// //                   ✓ Fill from this
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Left — edit panel */}
// //         {panelOpen && (
// //           <div style={s.leftPanel}>
// //             <div style={s.panelHeader}>
// //               <span style={s.panelTitle}>Edit content</span>
// //               <span style={s.panelSubtitle}>{TYPE_LABELS[doc.template_type]}</span>
// //             </div>
// //             <div style={s.panelScroll}>
// //               {doc.template_type === "receipt_template" && (
// //   <DevDocFields content={content} update={update} />
// // )}
// //               {doc.template_type === "client_doc" && (
// //                 <ClientDocFields content={content} update={update} />
// //               )}
// //               {doc.template_type === "compliance" && (
// //                 <ComplianceFields content={content} update={update} />
// //               )}
// //               {doc.template_type === "invoice" && (
// //                 <InvoiceFields content={content} update={update} />
// //               )}
// //               {doc.template_type === "timeline" && (
// //                 <TimelineFields content={content} update={update} />
// //               )}
// //             </div>

// //             {dirty && (
// //               <div style={s.saveFooter}>
// //                 <button
// //                   style={saving ? s.btnSavingDisabled : s.btnSaveFull}
// //                   onClick={handleSave}
// //                   disabled={saving}
// //                 >
// //                   {saving ? "Saving..." : "Save changes"}
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* Right — live preview */}
// //         <div style={s.rightPanel}>
// //           <div style={s.iframeWrap}>
// //             <iframe
// //               key={iframeKey}
// //               src={previewUrl(id)}
// //               style={s.iframe}
// //               title="Document preview"
// //             />
// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }

// // // ══════════════════════════════════════════════════════════════════════
// // // FIELD PANELS — one per doc type
// // // ══════════════════════════════════════════════════════════════════════

// // function DevDocFields({ content, update }) {
// //   const updateFeature = (fi, key, val) => {
// //     const updated = [...content.features];
// //     updated[fi] = { ...updated[fi], [key]: val };
// //     update("features", updated);
// //   };

// //   const updatePoint = (fi, pi, val) => {
// //     const updated = [...content.features];
// //     const pts = [...updated[fi].points];
// //     pts[pi] = typeof pts[pi] === "object"
// //       ? { ...pts[pi], text: val }
// //       : val;
// //     updated[fi] = { ...updated[fi], points: pts };
// //     update("features", updated);
// //   };

// //   const updateUvp = (i, key, val) => {
// //     const updated = [...(content.uvp || [])];
// //     updated[i] = { ...updated[i], [key]: val };
// //     update("uvp", updated);
// //   };

// //   return (
// //     <div style={f.wrap}>
// //       <Field label="Project name" value={content.project_name} onChange={v => update("project_name", v)} />
// //       <Field label="Tagline"      value={content.tagline}      onChange={v => update("tagline", v)} />
// //       <Field label="Overview"     value={content.overview}     onChange={v => update("overview", v)} multiline />

// //       <SectionLabel>Features</SectionLabel>
// //       {content.features?.map((feat, fi) => (
// //         <div key={fi} style={f.card}>
// //           <input
// //             style={f.cardTitle}
// //             value={feat.title}
// //             onChange={e => updateFeature(fi, "title", e.target.value)}
// //             placeholder="Feature title"
// //           />
// //           {feat.points?.map((pt, pi) => (
// //             <div key={pi} style={f.pointRow}>
// //               <span style={f.bullet}>◆</span>
// //               <input
// //                 style={f.pointInput}
// //                 value={typeof pt === "object" ? pt.text : pt}
// //                 onChange={e => updatePoint(fi, pi, e.target.value)}
// //                 placeholder="Point"
// //               />
// //             </div>
// //           ))}
// //         </div>
// //       ))}

// //       {content.uvp?.length > 0 && (
// //         <>
// //           <SectionLabel>UVP</SectionLabel>
// //           {content.uvp.map((u, i) => (
// //             <div key={i} style={f.uvpRow}>
// //               <input
// //                 style={{ ...f.input, fontWeight: 600, width: "44%" }}
// //                 value={u.keyword}
// //                 onChange={e => updateUvp(i, "keyword", e.target.value)}
// //                 placeholder="KEYWORD"
// //               />
// //               <span style={{ color: "#ccc", padding: "0 4px", fontSize: 12 }}>→</span>
// //               <input
// //                 style={{ ...f.input, flex: 1 }}
// //                 value={u.description}
// //                 onChange={e => updateUvp(i, "description", e.target.value)}
// //                 placeholder="Description"
// //               />
// //             </div>
// //           ))}
// //         </>
// //       )}
// //     </div>
// //   );
// // }

// // function ClientDocFields({ content, update }) {
// //   const [gstEnabled, setGstEnabled] = useState(
// //     parseFloat(content.gst_percent) > 0
// //   );

// //   useEffect(() => {
// //     if (!content.line_items?.length) return;

// //     const parseAmt = (val) => {
// //       if (!val) return 0;
// //       return parseFloat(String(val).replace(/[₹,\s]/g, "")) || 0;
// //     };
// //     const subtotal   = content.line_items.reduce((sum, item) => sum + parseAmt(item.amount), 0);
// //     const gstPercent = gstEnabled ? (parseFloat(content.gst_percent) || 0) : 0;
// //     const gstAmt     = (subtotal * gstPercent) / 100;
// //     const total      = subtotal + gstAmt;

// //     const fmt = (n) => n > 0 ? `₹${n.toLocaleString("en-IN")}` : "0";

// //     update("subtotal",   fmt(subtotal));
// //     update("gst_percent", gstEnabled ? gstPercent : 0);
// //     update("gst_amount", gstEnabled && gstPercent > 0 ? fmt(gstAmt) : "0");
// //     update("total",      fmt(total));
// //   }, [content.line_items, content.gst_percent, gstEnabled]);

// //   const updatePara = (i, val) => {
// //     const updated = [...content.body_paragraphs];
// //     updated[i] = val;
// //     update("body_paragraphs", updated);
// //   };

// //   const updateItem = (i, key, val) => {
// //     const updated = [...content.line_items];
// //     updated[i] = { ...updated[i], [key]: val };

// //     const hours     = parseFloat(updated[i].hours || 0);
// //     const unitPrice = parseFloat(updated[i].unit_price || 0);
// //     updated[i].amount = hours * unitPrice;

// //     update("line_items", updated);
// //   };

// //   const addItem = () =>
// //     update("line_items", [...content.line_items, { description: "", hours: "", unit_price: "", amount: "" }]);

// //   const removeItem = (i) =>
// //     update("line_items", content.line_items.filter((_, idx) => idx !== i));

// //   return (
// //     <div style={f.wrap}>
// //       <SectionLabel>Page 1 — Letter</SectionLabel>
// //       <Field label="Client name"       value={content.client_name}         onChange={v => update("client_name", v)} />
// //       <Field label="Organisation"      value={content.client_organisation} onChange={v => update("client_organisation", v)} />
// //       <Field label="Place"             value={content.client_place}        onChange={v => update("client_place", v)} />
// //       <Field label="Date"              value={content.date}                onChange={v => update("date", v)} />
// //       <Field label="Sender name"       value={content.sender_name}         onChange={v => update("sender_name", v)} />
// //       <Field label="Sender title"      value={content.sender_designation}  onChange={v => update("sender_designation", v)} />

// //       <SectionLabel>Letter body</SectionLabel>
// //       {content.body_paragraphs?.map((p, i) => (
// //         <div key={i} style={f.group}>
// //           <div style={f.label}>Paragraph {i + 1}</div>
// //           <textarea style={f.textarea} value={p} rows={3} onChange={e => updatePara(i, e.target.value)} />
// //         </div>
// //       ))}

// //       <SectionLabel>Page 2 — Quotation</SectionLabel>
// //       <Field label="Quotation number" value={content.quotation_number} onChange={v => update("quotation_number", v)} />
// //       <Field label="Project name"     value={content.project_name}     onChange={v => update("project_name", v)} />

// //       <SectionLabel>Line items</SectionLabel>
// //       {content.line_items?.map((item, i) => (
// //         <div key={i} style={f.card}>
// //           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
// //             <span style={{ fontSize: 11, color: "#aaa" }}>Item {i + 1}</span>
// //             <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
// //           </div>
// //           <Field label="Description" value={item.description} onChange={v => updateItem(i, "description", v)} />
// //           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
// //             {["hours", "unit_price", "amount"].map(key => (
// //               <div key={key} style={f.group}>
// //                 <div style={f.label}>{key.replace("_", " ")}</div>
// //                 <input style={f.input} value={item[key] || ""} onChange={e => updateItem(i, key, e.target.value)} />
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       ))}
// //       <button style={f.addBtn} onClick={addItem}>+ Add line item</button>

// //       <div style={gstToggleWrap}>
// //         <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>GST</span>
// //         <button
// //           style={{
// //             ...gstToggleBtn,
// //             background: gstEnabled ? "#111" : "#e0e0e0",
// //             color:      gstEnabled ? "#fff" : "#888",
// //           }}
// //           onClick={() => {
// //             setGstEnabled(p => !p);
// //             if (gstEnabled) {
// //               update("gst_percent", 0);
// //               update("gst_amount",  "0");
// //             }
// //           }}
// //         >
// //           {gstEnabled ? "ON" : "OFF"}
// //         </button>
// //       </div>

// //       {gstEnabled && (
// //         <Field
// //           label="GST %"
// //           value={String(content.gst_percent || "")}
// //           onChange={v => update("gst_percent", v)}
// //         />
// //       )}

// //       <SectionLabel>Totals</SectionLabel>
// //       <Field label="Subtotal"   value={content.subtotal}   onChange={v => update("subtotal", v)} />
// //       <Field label="GST amount" value={content.gst_amount} onChange={v => update("gst_amount", v)} />
// //       <Field label="Total"      value={content.total}      onChange={v => update("total", v)} />
// //     </div>
// //   );
// // }

// // function ComplianceFields({ content, update }) {
// //   const updatePara = (i, val) => {
// //     const updated = [...content.body_paragraphs];
// //     updated[i] = val;
// //     update("body_paragraphs", updated);
// //   };

// //   return (
// //     <div style={f.wrap}>
// //       <Field label="Letter type"           value={content.letter_type}           onChange={v => update("letter_type", v)} />
// //       <Field label="Date"                  value={content.date}                  onChange={v => update("date", v)} />
// //       <Field label="Recipient name"        value={content.recipient_name}        onChange={v => update("recipient_name", v)} />
// //       <Field label="Recipient designation" value={content.recipient_designation} onChange={v => update("recipient_designation", v)} />
// //       <Field label="Recipient company"     value={content.recipient_company}     onChange={v => update("recipient_company", v)} />
// //       <Field label="Subject"               value={content.subject}               onChange={v => update("subject", v)} />
// //       <Field label="Salutation"            value={content.salutation}            onChange={v => update("salutation", v)} />

// //       <SectionLabel>Body paragraphs</SectionLabel>
// //       {content.body_paragraphs?.map((p, i) => (
// //         <div key={i} style={f.group}>
// //           <div style={f.label}>Paragraph {i + 1}</div>
// //           <textarea style={f.textarea} value={p} rows={3} onChange={e => updatePara(i, e.target.value)} />
// //         </div>
// //       ))}

// //       <SectionLabel>Sign-off</SectionLabel>
// //       <Field label="Closing"              value={content.closing}              onChange={v => update("closing", v)} />
// //       <Field label="Sender name"          value={content.sender_name}          onChange={v => update("sender_name", v)} />
// //       <Field label="Sender designation"   value={content.sender_designation}   onChange={v => update("sender_designation", v)} />
// //       <Field label="Sender contact"       value={content.sender_contact}       onChange={v => update("sender_contact", v)} />
// //     </div>
// //   );
// // }

// // function InvoiceFields({ content, update }) {
// //   const [gstEnabled, setGstEnabled] = useState(
// //     parseFloat(content.gst_percent) > 0
// //   );

// //   useEffect(() => {
// //     if (!content.line_items?.length) return;

// //     const parseAmt = (val) => {
// //       if (!val) return 0;
// //       return parseFloat(String(val).replace(/[₹,\s]/g, "")) || 0;
// //     };

// //     const subtotal   = content.line_items.reduce((sum, item) => sum + parseAmt(item.amount), 0);
// //     const gstPercent = gstEnabled ? (parseFloat(content.gst_percent) || 0) : 0;
// //     const gstAmt     = (subtotal * gstPercent) / 100;
// //     const total      = subtotal + gstAmt;

// //     const fmt = (n) => n > 0 ? `₹${n.toLocaleString("en-IN")}` : "0";

// //     update("subtotal",   fmt(subtotal));
// //     update("gst_percent", gstEnabled ? gstPercent : 0);
// //     update("gst_amount", gstEnabled && gstPercent > 0 ? fmt(gstAmt) : "0");
// //     update("total",      fmt(total));
// //   }, [content.line_items, content.gst_percent, gstEnabled]);

// //   const updateItem = (i, key, val) => {
// //     const updated = [...content.line_items];
// //     updated[i] = { ...updated[i], [key]: val };
// //     update("line_items", updated);
// //   };

// //   const addItem = () =>
// //     update("line_items", [...(content.line_items || []), { description: "", hours: "", unit_price: "", amount: "" }]);

// //   const removeItem = (i) =>
// //     update("line_items", content.line_items.filter((_, idx) => idx !== i));

// //   return (
// //     <div style={f.wrap}>
// //       <SectionLabel>Invoice info</SectionLabel>
// //       <Field label="Invoice number" value={content.invoice_number} onChange={v => update("invoice_number", v)} />
// //       <Field label="Date"           value={content.date}           onChange={v => update("date", v)} />
// //       <Field label="Project name"   value={content.project_name}   onChange={v => update("project_name", v)} />

// //       <SectionLabel>Client info</SectionLabel>
// //       <Field label="Client name"    value={content.client_name}    onChange={v => update("client_name", v)} />
// //       <Field label="Client email"   value={content.client_email}   onChange={v => update("client_email", v)} />
// //       <Field label="Client address" value={content.client_address} onChange={v => update("client_address", v)} />

// //       <SectionLabel>Project description</SectionLabel>
// //       <Field label="Description" value={content.project_description} onChange={v => update("project_description", v)} multiline />

// //       <SectionLabel>Line items</SectionLabel>
// //       {content.line_items?.map((item, i) => (
// //         <div key={i} style={f.card}>
// //           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
// //             <span style={{ fontSize: 11, color: "#aaa" }}>Item {i + 1}</span>
// //             <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
// //           </div>
// //           <Field label="Description" value={item.description} onChange={v => updateItem(i, "description", v)} />
// //           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
// //             {["hours", "unit_price", "amount"].map(key => (
// //               <div key={key} style={f.group}>
// //                 <div style={f.label}>{key.replace("_", " ")}</div>
// //                 <input style={f.input} value={item[key] || ""} onChange={e => updateItem(i, key, e.target.value)} />
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       ))}
// //       <button style={f.addBtn} onClick={addItem}>+ Add line item</button>

// //       <div style={gstToggleWrap}>
// //         <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>GST</span>
// //         <button
// //           style={{
// //             ...gstToggleBtn,
// //             background: gstEnabled ? "#111" : "#e0e0e0",
// //             color:      gstEnabled ? "#fff" : "#888",
// //           }}
// //           onClick={() => {
// //             setGstEnabled(p => !p);
// //             if (gstEnabled) {
// //               update("gst_percent", 0);
// //               update("gst_amount",  "0");
// //             }
// //           }}
// //         >
// //           {gstEnabled ? "ON" : "OFF"}
// //         </button>
// //       </div>

// //       {gstEnabled && (
// //         <Field
// //           label="GST %"
// //           value={String(content.gst_percent || "")}
// //           onChange={v => update("gst_percent", v)}
// //         />
// //       )}

// //       <SectionLabel>Totals</SectionLabel>
// //       <Field label="Subtotal" value={content.subtotal}   onChange={v => update("subtotal", v)} />
// //       {gstEnabled && (
// //         <Field label="GST amount" value={content.gst_amount} onChange={v => update("gst_amount", v)} />
// //       )}
// //       <Field label="Total"    value={content.total}      onChange={v => update("total", v)} />

// //       <SectionLabel>Payment & status</SectionLabel>
// //       <Field label="Payment status" value={content.payment_status} onChange={v => update("payment_status", v)} />
// //       <Field label="Payment date"   value={content.payment_date}   onChange={v => update("payment_date", v)} />
// //       <Field label="Bank name"      value={content.bank_name}      onChange={v => update("bank_name", v)} />
// //       <Field label="Account name"   value={content.account_name}   onChange={v => update("account_name", v)} />
// //       <Field label="Phone number"   value={content.phone_number}   onChange={v => update("phone_number", v)} />
// //       <Field label="UPI ID"         value={content.upi_id}         onChange={v => update("upi_id", v)} />
// //       <Field label="Notes"          value={content.notes}          onChange={v => update("notes", v)} multiline />
// //     </div>
// //   );
// // }

// // function TimelineFields({ content, update }) {
// //   const updateItem = (i, key, val) => {
// //     const updated = [...(content.timeline_items || [])];
// //     updated[i] = { ...updated[i], [key]: val };
// //     update("timeline_items", updated);
// //   };

// //   const addItem = () =>
// //     update("timeline_items", [
// //       ...(content.timeline_items || []),
// //       { description: "", timeline: "", hours: "" }
// //     ]);

// //   const removeItem = (i) =>
// //     update("timeline_items",
// //       (content.timeline_items || []).filter((_, idx) => idx !== i)
// //     );

// //   return (
// //     <div style={f.wrap}>
// //       <SectionLabel>Project Info</SectionLabel>
// //       <Field label="Project name"        value={content.project_name}        onChange={v => update("project_name", v)} />
// //       <Field label="Project description" value={content.project_description} onChange={v => update("project_description", v)} />
// //       <Field label="Client name"         value={content.client_name}         onChange={v => update("client_name", v)} />

// //       <SectionLabel>Timeline Items</SectionLabel>
// //       {(content.timeline_items || []).map((item, i) => (
// //         <div key={i} style={f.card}>
// //           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
// //             <span style={{ fontSize: 11, color: "#aaa" }}>Phase {i + 1}</span>
// //             <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
// //           </div>
// //           <Field
// //             label="Description"
// //             value={item.description}
// //             onChange={v => updateItem(i, "description", v)}
// //           />
// //           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
// //             <div style={f.group}>
// //               <div style={f.label}>Timeline</div>
// //               <input
// //                 style={f.input}
// //                 value={item.timeline || ""}
// //                 onChange={e => updateItem(i, "timeline", e.target.value)}
// //                 placeholder="e.g. 5 days"
// //               />
// //             </div>
// //             <div style={f.group}>
// //               <div style={f.label}>Hours</div>
// //               <input
// //                 style={f.input}
// //                 value={item.hours || ""}
// //                 onChange={e => updateItem(i, "hours", e.target.value)}
// //                 placeholder="e.g. 20"
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       ))}
// //       <button style={f.addBtn} onClick={addItem}>+ Add phase</button>

// //       <SectionLabel>Totals</SectionLabel>
// //       <Field label="Total time"        value={content.total_time}        onChange={v => update("total_time", v)} />
// //       <Field label="Expected dev time" value={content.expected_dev_time} onChange={v => update("expected_dev_time", v)} />
// //       <Field label="Expected closure"  value={content.expected_closure}  onChange={v => update("expected_closure", v)} />
// //       <Field label="Closure date"      value={content.closure_date}      onChange={v => update("closure_date", v)} />
// //     </div>
// //   );
// // }

// // // ══════════════════════════════════════════════════════════════════════
// // // SHARED HELPER COMPONENTS
// // // ══════════════════════════════════════════════════════════════════════

// // function Field({ label, value, onChange, multiline }) {
// //   return (
// //     <div style={f.group}>
// //       <div style={f.label}>{label}</div>
// //       {multiline
// //         ? <textarea style={{ ...f.input, minHeight: 68, resize: "vertical" }} value={value || ""} onChange={e => onChange(e.target.value)} />
// //         : <input style={f.input} value={value || ""} onChange={e => onChange(e.target.value)} />
// //       }
// //     </div>
// //   );
// // }

// // function SectionLabel({ children }) {
// //   return <div style={f.sectionLabel}>{children}</div>;
// // }

// // function TypeBadge({ type }) {
// //   const colors = {
// //     receipt_template: { bg: "#EEEDFE", color: "#534AB7" },
// //     client_doc:    { bg: "#E1F5EE", color: "#0F6E56" },
// //     compliance:    { bg: "#FAEEDA", color: "#854F0B" },
// //     invoice:       { bg: "#FAECE7", color: "#993C1D" },
// //     timeline:       { bg: "#FAECE7", color: "#993C1D" },
// //   };
// //   const labels = {
// //     receipt_template: "Receipt Template",
// //     client_doc:    "Client Proposal",
// //     compliance:    "Compliance",
// //     invoice:       "Invoice",
// //     timeline: "Timeline",
// //   };
// //   const c = colors[type] || { bg: "#f0f0f0", color: "#666" };
// //   return (
// //     <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 20, fontWeight: 500, background: c.bg, color: c.color }}>
// //       {labels[type] || type}
// //     </span>
// //   );
// // }

// // // ══════════════════════════════════════════════════════════════════════
// // // STYLES
// // // ══════════════════════════════════════════════════════════════════════

// // const s = {
// //   centerScreen: {
// //     height: "100vh", display: "flex", flexDirection: "column",
// //     alignItems: "center", justifyContent: "center", background: "#f7f7f7",
// //   },
// //   spinner: {
// //     width: 32, height: 32, borderRadius: "50%",
// //     border: "3px solid #e0e0e0", borderTopColor: "#111",
// //     animation: "spin 0.8s linear infinite", marginBottom: 12,
// //   },
// //   loadingText: { fontSize: 13, color: "#888" },

// //   promptBox:      { borderBottom: "1px solid #f0f0f0", flexShrink: 0, width: "300px" },
// //   promptToggle:   { width: "100%", textAlign: "left", padding: "10px 16px", fontSize: 12, fontWeight: 600, color: "#131415", background: "#f5f3ff", border: "none", cursor: "pointer", borderBottom: "1px solid #fbfbfd" },
// //   promptInner:    { padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8, background: "#fafafa" },
// //   promptTextarea: { width: "100%", border: "1px solid #e8e8e8", borderRadius: 6, padding: "8px 10px", fontSize: 12, color: "#333", outline: "none", fontFamily: "inherit", lineHeight: 1.5, resize: "vertical", background: "#fff", height: "300px" },
// //   btnGenerateFull:    { width: "100%", fontSize: 13, fontWeight: 600, background: "#141415", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", cursor: "pointer" },
// //   btnGeneratingFull:  { width: "100%", fontSize: 13, background: "#121314", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", cursor: "not-allowed" },

// //   page: {
// //     height: "100vh", display: "flex", flexDirection: "column",
// //     overflow: "hidden", background: "#f7f7f7",
// //   },
// //   topbar:      { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", height: 52, background: "#fff", borderBottom: "1px solid #e8e8e8", flexShrink: 0, gap: 12 },
// //   topLeft:     { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
// //   topRight:    { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
// //   topDivider:  { width: 1, height: 20, background: "#e8e8e8" },
// //   docName:     { fontSize: 14, fontWeight: 600, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 },
// //   unsavedDot:  { width: 7, height: 7, borderRadius: "50%", background: "#f39c12", flexShrink: 0 },

// //   btnSave:     { fontSize: 13, fontWeight: 600, background: "#111", color: "#fff", border: "none", borderRadius: 7, padding: "6px 16px", cursor: "pointer" },
// //   btnSavingDisabled: { fontSize: 13, background: "#888", color: "#fff", border: "none", borderRadius: 7, padding: "6px 16px" },
// //   btnSaveFull: { width: "100%", fontSize: 13, fontWeight: 600, background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", cursor: "pointer" },
// //   btnPrimary:  { fontSize: 13, fontWeight: 600, background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer" },
// //   btnOutline:  { fontSize: 12, color: "#555", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 7, padding: "6px 12px", cursor: "pointer", textDecoration: "none", display: "inline-block", lineHeight: "normal" },
// //   btnIcon:     { fontSize: 11, color: "#888", background: "none", border: "1px solid #e8e8e8", borderRadius: 6, padding: "5px 8px", cursor: "pointer" },
// //   savedPill:   { fontSize: 12, color: "#27ae60", fontWeight: 500 },

// //   panels: { display: "flex", flex: 1, overflow: "hidden", minHeight: 0 },

// //   leftPanel:   { width: 300, display: "flex", flexDirection: "column", background: "#fff", borderRight: "1px solid #e8e8e8", flexShrink: 0, overflow: "hidden" },
// //   panelHeader: { padding: "14px 16px 10px", borderBottom: "1px solid #f0f0f0", flexShrink: 0 },
// //   panelTitle:  { fontSize: 12, fontWeight: 700, color: "#111", display: "block", marginBottom: 2 },
// //   panelSubtitle:{ fontSize: 11, color: "#aaa" },
// //   panelScroll: { flex: 1, overflowY: "auto", padding: "14px 16px" },
// //   saveFooter:  { padding: "12px 16px", borderTop: "1px solid #f0f0f0", flexShrink: 0 },
// //   rightPanel: {
// //     flex: 1, display: "flex", flexDirection: "column",
// //     padding: 16, overflow: "hidden", minHeight: 0,
// //   },
// //   iframeWrap:  { flex: 1, borderRadius: 10, overflow: "hidden", border: "1px solid #e0e0e0", background: "#fff", minHeight: 0, display: "flex" },
// //   iframe:      { width: "100%", height: "100%", border: "none" },
// // };

// // const f = {
// //   wrap:         { display: "flex", flexDirection: "column", gap: 10 },
// //   group:        { display: "flex", flexDirection: "column", gap: 4 },
// //   label:        { fontSize: 11, fontWeight: 600, color: "#888", textTransform: "capitalize" },
// //   input:        { width: "100%", border: "1px solid #e8e8e8", borderRadius: 6, padding: "7px 9px", fontSize: 12, color: "#333", outline: "none", fontFamily: "inherit", lineHeight: 1.5, background: "#fafafa" },
// //   textarea:     { width: "100%", border: "1px solid #e8e8e8", borderRadius: 6, padding: "7px 9px", fontSize: 12, color: "#333", outline: "none", fontFamily: "inherit", lineHeight: 1.5, resize: "vertical", background: "#fafafa" },
// //   sectionLabel: { fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, paddingTop: 8, paddingBottom: 4, borderBottom: "1px solid #f0f0f0", marginBottom: 4 },
// //   card:         { border: "1px solid #efefef", borderRadius: 8, padding: "10px 12px", background: "#fafafa" },
// //   cardTitle:    { width: "100%", border: "none", borderBottom: "1px solid #e8e8e8", padding: "3px 0 6px", fontSize: 12, fontWeight: 700, outline: "none", background: "transparent", marginBottom: 8, fontFamily: "inherit" },
// //   pointRow:     { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 },
// //   bullet:       { color: "#ccc", fontSize: 8, flexShrink: 0 },
// //   pointInput:   { flex: 1, border: "none", borderBottom: "1px solid #f0f0f0", fontSize: 12, padding: "2px 0", outline: "none", background: "transparent", color: "#444", fontFamily: "inherit" },
// //   uvpRow:       { display: "flex", alignItems: "center", gap: 4 },
// //   addBtn:       { fontSize: 12, color: "#555", background: "none", border: "1.5px dashed #ddd", borderRadius: 6, padding: "7px 12px", cursor: "pointer", textAlign: "left", fontFamily: "inherit" },
// //   removeBtn:    { fontSize: 11, color: "#c0392b", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" },
// // };

// // const gstToggleWrap = {
// //   display: "flex", alignItems: "center", justifyContent: "space-between",
// //   padding: "8px 12px", background: "#f7f7f7", borderRadius: 8,
// //   border: "1px solid #efefef", marginTop: 4,
// // };

// // const gstToggleBtn = {
// //   fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20,
// //   border: "none", cursor: "pointer", letterSpacing: "0.5px", transition: "background 0.15s",
// // };

// // const voiceWrap    = { display: "flex", flexDirection: "column", gap: 8, padding: "12px 0" };
// // const transcriptBox = { fontSize: 12, color: "#555", background: "#f0f0f0", borderRadius: 8, padding: "8px 10px", lineHeight: 1.5 };
// // const pulseDot     = { width: 10, height: 10, borderRadius: "50%", background: "#e74c3c", animation: "pulse 1s ease infinite" };

// // const voiceBtnStart = {
// //   width: "100%", fontSize: 13, fontWeight: 600, color: "#fff",
// //   background: "#111", border: "none", borderRadius: 8,
// //   padding: "12px 0", cursor: "pointer", transition: "all 0.2s",
// // };
// // const voiceBtnStop = {
// //   width: "100%", fontSize: 13, fontWeight: 700, color: "#fff",
// //   background: "#e74c3c", border: "none", borderRadius: 8,
// //   padding: "12px 0", cursor: "pointer", transition: "all 0.2s",
// //   boxShadow: "0 2px 8px rgba(231,76,60,0.35)",
// // };
// // const listeningBanner = {
// //   display: "flex", alignItems: "center", gap: 8,
// //   background: "#fdecea", border: "1px solid #f5c6c0",
// //   borderRadius: 8, padding: "8px 10px",
// // };
// // const processingBanner = {
// //   display: "flex", alignItems: "center", gap: 8,
// //   background: "#f0f0f0", border: "1px solid #e0e0e0",
// //   borderRadius: 8, padding: "8px 10px",
// // };
// // const spinnerDot = {
// //   width: 12, height: 12, borderRadius: "50%",
// //   border: "2px solid #ccc", borderTopColor: "#555",
// //   animation: "spin 0.7s linear infinite",
// // };
// // const manualFillBtn = {
// //   marginTop: 8, width: "100%", fontSize: 12, fontWeight: 600,
// //   background: "#111", color: "#fff", border: "none",
// //   borderRadius: 6, padding: "8px 0", cursor: "pointer",
// // };
// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getDocument, updateDocument, previewUrl, refillDocument } from "../services/api";

// const TYPE_LABELS = {
//   receipt_template: "Receipt Template",
//   client_doc:    "Client Proposal",
//   compliance:    "Compliance Letter",
//   invoice:       "Invoice",
//   timeline:      "Project Timeline",
// };

// // Blank/empty starting structure per document type — used so refresh always starts fresh
// function getBlankContent(type) {
//   switch (type) {
//     case "receipt_template":
//       return {
//         receipt_number: "",
//         date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
//         service_name: "",
//         payment_mode: "",
//         client_name: "",
//         client_phone: "",
//         amount_received: "",
//         amount_in_words: "",
//         balance: "",
//         line_items: [],
//         subtotal: "0",
//         gst_percent: 0,
//         gst_amount: "0",
//         total: "0",
//         payment_status: "",
//         paid_on: "",
//         bank_name: "",
//         upi_phone: "",
//         upi_id: "",
//       };
//     case "client_doc":
//       return {
//         client_name: "",
//         client_organisation: "",
//         client_place: "",
//         date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
//         sender_name: "",
//         sender_designation: "",
//         body_paragraphs: [],
//         quotation_number: "",
//         project_name: "",
//         line_items: [],
//         gst_percent: 0,
//         gst_amount: "0",
//         subtotal: "0",
//         total: "0",
//       };
//     case "compliance":
//       return {
//         letter_type: "",
//         date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
//         recipient_name: "",
//         recipient_designation: "",
//         recipient_company: "",
//         subject: "",
//         salutation: "",
//         body_paragraphs: [],
//         closing: "",
//         sender_name: "",
//         sender_designation: "",
//         sender_contact: "",
//       };
//     case "invoice":
//       return {
//         invoice_number: "",
//         date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
//         project_name: "",
//         client_name: "",
//         client_email: "",
//         client_address: "",
//         project_description: "",
//         line_items: [],
//         gst_percent: 0,
//         gst_amount: "0",
//         subtotal: "0",
//         total: "0",
//         payment_status: "",
//         payment_date: "",
//         bank_name: "",
//         account_name: "",
//         phone_number: "",
//         upi_id: "",
//         notes: "",
//       };
//     case "timeline":
//       return {
//         project_name: "",
//         project_description: "",
//         client_name: "",
//         timeline_items: [],
//         total_time: "",
//         expected_dev_time: "",
//         expected_closure: "",
//         closure_date: "",
//       };
//     default:
//       return {};
//   }
// }

// export default function Editor() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [doc, setDoc]               = useState(null);
//   const [content, setContent]       = useState(null);
//   const [loading, setLoading]       = useState(true);
//   const [saving, setSaving]         = useState(false);
//   const [saved, setSaved]           = useState(false);
//   const [dirty, setDirty]           = useState(false);
//   const [copied, setCopied]         = useState(false);
//   const [iframeKey, setIframeKey]   = useState(0);
//   const [panelOpen, setPanelOpen]   = useState(true);
//   const [prompt, setPrompt]         = useState("");
//   const [generating, setGenerating] = useState(false);
//   const [promptOpen, setPromptOpen] = useState(false);
//   const [listening, setListening]   = useState(false);
//   const [transcript, setTranscript] = useState("");

//   const recognitionRef = useRef(null);
//   const transcriptRef  = useRef("");

//   // ── Load document, but always start with BLANK content (refresh = fresh start) ──
//   useEffect(() => {
//     getDocument(id)
//       .then(async (res) => {
//         setDoc(res.data);
//         const blank = getBlankContent(res.data.template_type);
//         setContent(blank);

//         // Reset backend content too, so the preview iframe (which loads
//         // straight from the backend) also shows blank instead of old data
//         try {
//           await updateDocument(id, blank);
//           setIframeKey(k => k + 1);
//         } catch (err) {
//           console.error("Failed to reset backend content:", err);
//         }
//       })
//       .catch(() => setDoc(null))
//       .finally(() => setLoading(false));
//   }, [id]);

//   const update = (key, val) => {
//     setContent(p => ({ ...p, [key]: val }));
//     setDirty(true);
//   };

//   // ── Voice input ──────────────────────────────────────────────
//   const startVoice = () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Voice not supported in this browser. Use Chrome.");
//       return;
//     }

//     const recognition          = new SpeechRecognition();
//     recognition.lang           = "en-IN";
//     recognition.continuous     = true;
//     recognition.interimResults = true;

//     recognition.onstart = () => {
//       setListening(true);
//       setTranscript("");
//       transcriptRef.current = "";
//     };

//     recognition.onresult = (e) => {
//       const text = Array.from(e.results)
//         .map(r => r[0].transcript)
//         .join("");
//       setTranscript(text);
//       transcriptRef.current = text; // ref stays fresh — onend reads from here
//     };

//     recognition.onend = async () => {
//       setListening(false);
//       const finalText = transcriptRef.current;
//       if (finalText.trim()) {
//         setGenerating(true);
//         try {
//           const res = await refillDocument(id, finalText);
//           const gc =
//             res.data.content ||
//             res.data.document?.content ||
//             res.data.data?.content ||
//             res.data;
//           if (!gc || typeof gc !== "object") throw new Error("No content");

//           setContent(gc);
//           await updateDocument(id, gc);
//           setIframeKey(k => k + 1);
//           setTranscript("");
//           transcriptRef.current = "";
//         } catch {
//           alert("Voice generation failed.");
//         } finally {
//           setGenerating(false);
//         }
//       }
//     };

//     recognition.onerror = () => setListening(false);

//     recognitionRef.current = recognition;
//     recognition.start();
//   };

//   const stopVoice = () => {
//     recognitionRef.current?.stop();
//     setListening(false);
//   };

//   // Fallback manual fill — used if auto-fill didn't trigger after speech ended
//   const handleManualFill = async () => {
//     const text = transcriptRef.current || transcript;
//     if (!text.trim()) return;
//     setGenerating(true);
//     try {
//       const res = await refillDocument(id, text);
//       const gc =
//         res.data.content ||
//         res.data.document?.content ||
//         res.data.data?.content ||
//         res.data;
//       if (!gc || typeof gc !== "object") throw new Error("No content");

//       setContent(gc);
//       await updateDocument(id, gc);
//       setIframeKey(k => k + 1);
//       setTranscript("");
//       transcriptRef.current = "";
//     } catch {
//       alert("Fill failed. Try again.");
//     } finally {
//       setGenerating(false);
//     }
//   };

//   // ── Manual save ─────────────────────────────────────────────
//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       await updateDocument(id, content);
//       setDirty(false);
//       setSaved(true);
//       setIframeKey(k => k + 1);
//       setTimeout(() => setSaved(false), 2500);
//     } catch {
//       alert("Save failed. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Auto-save on content change (debounced) ─────────────────
//   useEffect(() => {
//     if (!content || !dirty) return;

//     const timer = setTimeout(async () => {
//       try {
//         await updateDocument(id, content);
//         setIframeKey(k => k + 1);
//         setDirty(false);
//         setSaved(true);
//         setTimeout(() => setSaved(false), 1500);
//       } catch {
//         // silent fail — user can manually save
//       }
//     }, 800);

//     return () => clearTimeout(timer);
//   }, [content]);

//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(window.location.href);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   // ── AI prompt fill ───────────────────────────────────────────
//   const handleRefill = async () => {
//     if (!prompt.trim()) return;
//     setGenerating(true);
//     try {
//       const res = await refillDocument(id, prompt);

//       const generatedContent =
//         res.data.content ||
//         res.data.document?.content ||
//         res.data.data?.content;

//       if (!generatedContent) {
//         throw new Error("No content returned");
//       }

//       setContent(generatedContent);
//       await updateDocument(id, generatedContent);
//       setIframeKey((k) => k + 1);
//       setDirty(false);
//       setPrompt(""); // clear textarea after successful submit
//     } catch (err) {
//       alert("Generation failed. Try again.");
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const handleDownloadPDF = () => {
//     const BASE =
//       import.meta.env.VITE_API_URL ||
//       "http://localhost:8000";

//     window.open(
//       `${BASE}/api/doc/${id}/preview?autoprint=1`,
//       "_blank"
//     );
//   };

//   // ── Loading state ──────────────────────────────────────────
//   if (loading) {
//     return (
//       <div style={s.centerScreen}>
//         <div style={s.spinner} />
//         <p style={s.loadingText}>Loading document...</p>
//       </div>
//     );
//   }

//   // ── Not found ─────────────────────────────────────────────
//   if (!doc) {
//     return (
//       <div style={s.centerScreen}>
//         <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
//         <p style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 8 }}>
//           Document not found
//         </p>
//         <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>
//           This link may have expired or been deleted.
//         </p>
//         <button style={s.btnPrimary} onClick={() => navigate("/")}>
//           ← Back to home
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div style={s.page}>

//       {/* ── Top bar ──────────────────────────────────────────── */}
//       <div style={s.topbar}>
//         <div style={s.topLeft}>
//           <div style={s.topDivider} />
//           <span style={s.docName}>{doc.project_name}</span>
//           <TypeBadge type={doc.template_type} />
//           {dirty && <span style={s.unsavedDot} title="Unsaved changes" />}
//         </div>

//         <div style={s.topRight}>
//           {dirty && (
//             <button
//               style={saving ? s.btnSavingDisabled : s.btnSave}
//               onClick={handleSave}
//               disabled={saving}
//             >
//               {saving ? "Saving..." : "Save changes"}
//             </button>
//           )}
//           {saved && !dirty && (
//             <span style={s.savedPill}>✓ Saved</span>
//           )}

//           <button
//             style={s.btnIcon}
//             onClick={() => setPanelOpen(p => !p)}
//             title={panelOpen ? "Hide editor" : "Show editor"}
//           >
//             {panelOpen ? "◀" : "▶"}
//           </button>

//           <button style={s.btnOutline} onClick={handleCopyLink}>
//             {copied ? " Copied!" : "Share link"}
//           </button>

//           <button style={s.btnOutline} onClick={handleDownloadPDF}>
//             ⬇ Download PDF
//           </button>

//           <a
//             href={previewUrl(id)}
//             rel="noreferrer"
//             style={s.btnOutline}
//           >
//             Open ↗
//           </a>
//         </div>
//       </div>

//       {/* ── Two-panel layout ────────────────────────────────── */}
//       <div style={s.panels}>
//         <div style={s.promptBox}>
//           <button
//             style={s.promptToggle}
//             onClick={() => setPromptOpen(p => !p)}
//           >
//             ✦ {promptOpen ? "Close AI fill" : "Fill with AI prompt"}
//           </button>

//           {promptOpen && (
//             <div style={s.promptInner}>
//               <textarea
//                 style={s.promptTextarea}
//                 rows={4}
//                 placeholder={
//                   `Example:\n"Client: Rahul Sharma, Project: Ayurvedic app with AI skin analysis, 3 months, budget ₹5L, 40-30-30 payment split"`
//                 }
//                 value={prompt}
//                 onChange={e => setPrompt(e.target.value)}
//               />
//               <button
//                 style={generating ? s.btnGeneratingFull : s.btnGenerateFull}
//                 onClick={handleRefill}
//                 disabled={generating || !prompt.trim()}
//               >
//                 {generating ? " Generating..." : " Generate & Fill"}
//               </button>
//             </div>
//           )}

//           {/* ── VOICE FILL ── */}
//           <div style={voiceWrap}>

//             {/* State 1: Idle — show Start button */}
//             {!listening && !generating && (
//               <button style={voiceBtnStart} onClick={startVoice}>
//                 🎙 Start speaking
//               </button>
//             )}

//             {/* State 2: Listening — live status + big Stop button */}
//             {listening && (
//               <>
//                 <div style={listeningBanner}>
//                   <div style={pulseDot} />
//                   <span style={{ fontSize: 12, color: "#e74c3c", fontWeight: 600 }}>
//                     Listening... speak clearly
//                   </span>
//                 </div>

//                 {transcript && (
//                   <div style={transcriptBox}>
//                     <span style={{ fontSize: 10, color: "#aaa", display: "block", marginBottom: 4 }}>
//                       Heard so far:
//                     </span>
//                     {transcript}
//                   </div>
//                 )}

//                 <button style={voiceBtnStop} onClick={stopVoice}>
//                   ⏹ Stop & fill document
//                 </button>
//               </>
//             )}

//             {/* State 3: Processing after stop */}
//             {generating && (
//               <div style={processingBanner}>
//                 <div style={spinnerDot} />
//                 <span style={{ fontSize: 12, color: "#555", fontWeight: 600 }}>
//                   Filling your document...
//                 </span>
//               </div>
//             )}

//             {/* Fallback: speech ended but wasn't auto-filled */}
//             {!listening && !generating && transcript && (
//               <div style={transcriptBox}>
//                 <span style={{ fontSize: 10, color: "#aaa", display: "block", marginBottom: 4 }}>
//                   Last heard:
//                 </span>
//                 {transcript}
//                 <button style={manualFillBtn} onClick={handleManualFill}>
//                   ✓ Fill from this
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Left — edit panel */}
//         {panelOpen && (
//           <div style={s.leftPanel}>
//             <div style={s.panelHeader}>
//               <span style={s.panelTitle}>Edit content</span>
//               <span style={s.panelSubtitle}>{TYPE_LABELS[doc.template_type]}</span>
//             </div>
//             <div style={s.panelScroll}>
//               {doc.template_type === "receipt_template" && (
//                 <ReceiptFields content={content} update={update} />
//               )}
//               {doc.template_type === "client_doc" && (
//                 <ClientDocFields content={content} update={update} />
//               )}
//               {doc.template_type === "compliance" && (
//                 <ComplianceFields content={content} update={update} />
//               )}
//               {doc.template_type === "invoice" && (
//                 <InvoiceFields content={content} update={update} />
//               )}
//               {doc.template_type === "timeline" && (
//                 <TimelineFields content={content} update={update} />
//               )}
//             </div>

//             {dirty && (
//               <div style={s.saveFooter}>
//                 <button
//                   style={saving ? s.btnSavingDisabled : s.btnSaveFull}
//                   onClick={handleSave}
//                   disabled={saving}
//                 >
//                   {saving ? "Saving..." : "Save changes"}
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Right — live preview */}
//         <div style={s.rightPanel}>
//           <div style={s.iframeWrap}>
//             <iframe
//               key={iframeKey}
//               src={previewUrl(id)}
//               style={s.iframe}
//               title="Document preview"
//             />
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════
// // FIELD PANELS — one per doc type
// // ══════════════════════════════════════════════════════════════════════

// function ReceiptFields({ content, update }) {

//   const updateItem = (i, key, val) => {
//     const updated = [...(content.line_items || [])];
//     updated[i] = { ...updated[i], [key]: val };

//     const hours     = parseFloat(updated[i].hours || 0);
//     const unitPrice = parseFloat(updated[i].unit_price || 0);
//     if (hours && unitPrice) {
//       updated[i].amount = hours * unitPrice;
//     }

//     update("line_items", updated);
//   };

//   const addItem = () =>
//     update("line_items", [
//       ...(content.line_items || []),
//       { description: "Payment Receipt", hours: "-", unit_price: "-", amount: "" }
//     ]);

//   const removeItem = (i) =>
//     update("line_items", (content.line_items || []).filter((_, idx) => idx !== i));

//   return (
//     <div style={f.wrap}>

//       <SectionLabel>Receipt Info</SectionLabel>
//       <Field label="Receipt number" value={content.receipt_number} onChange={v => update("receipt_number", v)} />
//       <Field label="Date"           value={content.date}           onChange={v => update("date", v)} />
//       <Field label="For service"    value={content.service_name}   onChange={v => update("service_name", v)} />
//       <Field label="Payment mode"   value={content.payment_mode}   onChange={v => update("payment_mode", v)} />

//       <SectionLabel>Received From</SectionLabel>
//       <Field label="Client name"    value={content.client_name}    onChange={v => update("client_name", v)} />
//       <Field label="Client phone"   value={content.client_phone}   onChange={v => update("client_phone", v)} />

//       <SectionLabel>Payment</SectionLabel>
//       <Field label="Amount received"  value={content.amount_received}  onChange={v => update("amount_received", v)} />
//       <Field label="Amount in words"  value={content.amount_in_words}  onChange={v => update("amount_in_words", v)} />
//       <Field label="Balance"          value={content.balance}          onChange={v => update("balance", v)} />

//       <SectionLabel>Line items</SectionLabel>
//       {(content.line_items || []).map((item, i) => (
//         <div key={i} style={f.card}>
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
//             <span style={{ fontSize: 11, color: "#aaa" }}>Item {i + 1}</span>
//             <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
//           </div>
//           <Field label="Description" value={item.description} onChange={v => updateItem(i, "description", v)} />
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
//             {["hours", "unit_price", "amount"].map(key => (
//               <div key={key} style={f.group}>
//                 <div style={f.label}>{key.replace("_", " ")}</div>
//                 <input style={f.input} value={item[key] || ""} onChange={e => updateItem(i, key, e.target.value)} />
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//       <button style={f.addBtn} onClick={addItem}>+ Add line item</button>

//       <SectionLabel>Totals</SectionLabel>
//       <Field label="Subtotal"   value={content.subtotal}   onChange={v => update("subtotal", v)} />
//       <Field label="GST %"      value={String(content.gst_percent || "")} onChange={v => update("gst_percent", v)} />
//       <Field label="GST amount" value={content.gst_amount} onChange={v => update("gst_amount", v)} />
//       <Field label="Total"      value={content.total}      onChange={v => update("total", v)} />

//       <SectionLabel>Status</SectionLabel>
//       <Field label="Payment status" value={content.payment_status} onChange={v => update("payment_status", v)} />
//       <Field label="Paid on"        value={content.paid_on}        onChange={v => update("paid_on", v)} />

//       <SectionLabel>Bank / UPI</SectionLabel>
//       <Field label="Bank name"  value={content.bank_name}  onChange={v => update("bank_name", v)} />
//       <Field label="UPI phone"  value={content.upi_phone}  onChange={v => update("upi_phone", v)} />
//       <Field label="UPI ID"     value={content.upi_id}     onChange={v => update("upi_id", v)} />

//     </div>
//   );
// }

// function ClientDocFields({ content, update }) {
//   const [gstEnabled, setGstEnabled] = useState(
//     parseFloat(content.gst_percent) > 0
//   );

//   useEffect(() => {
//     if (!content.line_items?.length) return;

//     const parseAmt = (val) => {
//       if (!val) return 0;
//       return parseFloat(String(val).replace(/[₹,\s]/g, "")) || 0;
//     };
//     const subtotal   = content.line_items.reduce((sum, item) => sum + parseAmt(item.amount), 0);
//     const gstPercent = gstEnabled ? (parseFloat(content.gst_percent) || 0) : 0;
//     const gstAmt     = (subtotal * gstPercent) / 100;
//     const total      = subtotal + gstAmt;

//     const fmt = (n) => n > 0 ? `₹${n.toLocaleString("en-IN")}` : "0";

//     update("subtotal",   fmt(subtotal));
//     update("gst_percent", gstEnabled ? gstPercent : 0);
//     update("gst_amount", gstEnabled && gstPercent > 0 ? fmt(gstAmt) : "0");
//     update("total",      fmt(total));
//   }, [content.line_items, content.gst_percent, gstEnabled]);

//   const updatePara = (i, val) => {
//     const updated = [...content.body_paragraphs];
//     updated[i] = val;
//     update("body_paragraphs", updated);
//   };

//   const updateItem = (i, key, val) => {
//     const updated = [...content.line_items];
//     updated[i] = { ...updated[i], [key]: val };

//     const hours     = parseFloat(updated[i].hours || 0);
//     const unitPrice = parseFloat(updated[i].unit_price || 0);
//     updated[i].amount = hours * unitPrice;

//     update("line_items", updated);
//   };

//   const addItem = () =>
//     update("line_items", [...content.line_items, { description: "", hours: "", unit_price: "", amount: "" }]);

//   const removeItem = (i) =>
//     update("line_items", content.line_items.filter((_, idx) => idx !== i));

//   return (
//     <div style={f.wrap}>
//       <SectionLabel>Page 1 — Letter</SectionLabel>
//       <Field label="Client name"       value={content.client_name}         onChange={v => update("client_name", v)} />
//       <Field label="Organisation"      value={content.client_organisation} onChange={v => update("client_organisation", v)} />
//       <Field label="Place"             value={content.client_place}        onChange={v => update("client_place", v)} />
//       <Field label="Date"              value={content.date}                onChange={v => update("date", v)} />
//       <Field label="Sender name"       value={content.sender_name}         onChange={v => update("sender_name", v)} />
//       <Field label="Sender title"      value={content.sender_designation}  onChange={v => update("sender_designation", v)} />

//       <SectionLabel>Letter body</SectionLabel>
//       {content.body_paragraphs?.map((p, i) => (
//         <div key={i} style={f.group}>
//           <div style={f.label}>Paragraph {i + 1}</div>
//           <textarea style={f.textarea} value={p} rows={3} onChange={e => updatePara(i, e.target.value)} />
//         </div>
//       ))}

//       <SectionLabel>Page 2 — Quotation</SectionLabel>
//       <Field label="Quotation number" value={content.quotation_number} onChange={v => update("quotation_number", v)} />
//       <Field label="Project name"     value={content.project_name}     onChange={v => update("project_name", v)} />

//       <SectionLabel>Line items</SectionLabel>
//       {content.line_items?.map((item, i) => (
//         <div key={i} style={f.card}>
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
//             <span style={{ fontSize: 11, color: "#aaa" }}>Item {i + 1}</span>
//             <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
//           </div>
//           <Field label="Description" value={item.description} onChange={v => updateItem(i, "description", v)} />
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
//             {["hours", "unit_price", "amount"].map(key => (
//               <div key={key} style={f.group}>
//                 <div style={f.label}>{key.replace("_", " ")}</div>
//                 <input style={f.input} value={item[key] || ""} onChange={e => updateItem(i, key, e.target.value)} />
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//       <button style={f.addBtn} onClick={addItem}>+ Add line item</button>

//       <div style={gstToggleWrap}>
//         <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>GST</span>
//         <button
//           style={{
//             ...gstToggleBtn,
//             background: gstEnabled ? "#111" : "#e0e0e0",
//             color:      gstEnabled ? "#fff" : "#888",
//           }}
//           onClick={() => {
//             setGstEnabled(p => !p);
//             if (gstEnabled) {
//               update("gst_percent", 0);
//               update("gst_amount",  "0");
//             }
//           }}
//         >
//           {gstEnabled ? "ON" : "OFF"}
//         </button>
//       </div>

//       {gstEnabled && (
//         <Field
//           label="GST %"
//           value={String(content.gst_percent || "")}
//           onChange={v => update("gst_percent", v)}
//         />
//       )}

//       <SectionLabel>Totals</SectionLabel>
//       <Field label="Subtotal"   value={content.subtotal}   onChange={v => update("subtotal", v)} />
//       <Field label="GST amount" value={content.gst_amount} onChange={v => update("gst_amount", v)} />
//       <Field label="Total"      value={content.total}      onChange={v => update("total", v)} />
//     </div>
//   );
// }

// function ComplianceFields({ content, update }) {
//   const updatePara = (i, val) => {
//     const updated = [...content.body_paragraphs];
//     updated[i] = val;
//     update("body_paragraphs", updated);
//   };

//   return (
//     <div style={f.wrap}>
//       <Field label="Letter type"           value={content.letter_type}           onChange={v => update("letter_type", v)} />
//       <Field label="Date"                  value={content.date}                  onChange={v => update("date", v)} />
//       <Field label="Recipient name"        value={content.recipient_name}        onChange={v => update("recipient_name", v)} />
//       <Field label="Recipient designation" value={content.recipient_designation} onChange={v => update("recipient_designation", v)} />
//       <Field label="Recipient company"     value={content.recipient_company}     onChange={v => update("recipient_company", v)} />
//       <Field label="Subject"               value={content.subject}               onChange={v => update("subject", v)} />
//       <Field label="Salutation"            value={content.salutation}            onChange={v => update("salutation", v)} />

//       <SectionLabel>Body paragraphs</SectionLabel>
//       {content.body_paragraphs?.map((p, i) => (
//         <div key={i} style={f.group}>
//           <div style={f.label}>Paragraph {i + 1}</div>
//           <textarea style={f.textarea} value={p} rows={3} onChange={e => updatePara(i, e.target.value)} />
//         </div>
//       ))}

//       <SectionLabel>Sign-off</SectionLabel>
//       <Field label="Closing"              value={content.closing}              onChange={v => update("closing", v)} />
//       <Field label="Sender name"          value={content.sender_name}          onChange={v => update("sender_name", v)} />
//       <Field label="Sender designation"   value={content.sender_designation}   onChange={v => update("sender_designation", v)} />
//       <Field label="Sender contact"       value={content.sender_contact}       onChange={v => update("sender_contact", v)} />
//     </div>
//   );
// }

// function InvoiceFields({ content, update }) {
//   const [gstEnabled, setGstEnabled] = useState(
//     parseFloat(content.gst_percent) > 0
//   );

//   useEffect(() => {
//     if (!content.line_items?.length) return;

//     const parseAmt = (val) => {
//       if (!val) return 0;
//       return parseFloat(String(val).replace(/[₹,\s]/g, "")) || 0;
//     };

//     const subtotal   = content.line_items.reduce((sum, item) => sum + parseAmt(item.amount), 0);
//     const gstPercent = gstEnabled ? (parseFloat(content.gst_percent) || 0) : 0;
//     const gstAmt     = (subtotal * gstPercent) / 100;
//     const total      = subtotal + gstAmt;

//     const fmt = (n) => n > 0 ? `₹${n.toLocaleString("en-IN")}` : "0";

//     update("subtotal",   fmt(subtotal));
//     update("gst_percent", gstEnabled ? gstPercent : 0);
//     update("gst_amount", gstEnabled && gstPercent > 0 ? fmt(gstAmt) : "0");
//     update("total",      fmt(total));
//   }, [content.line_items, content.gst_percent, gstEnabled]);

//   const updateItem = (i, key, val) => {
//     const updated = [...content.line_items];
//     updated[i] = { ...updated[i], [key]: val };
//     update("line_items", updated);
//   };

//   const addItem = () =>
//     update("line_items", [...(content.line_items || []), { description: "", hours: "", unit_price: "", amount: "" }]);

//   const removeItem = (i) =>
//     update("line_items", content.line_items.filter((_, idx) => idx !== i));

//   return (
//     <div style={f.wrap}>
//       <SectionLabel>Invoice info</SectionLabel>
//       <Field label="Invoice number" value={content.invoice_number} onChange={v => update("invoice_number", v)} />
//       <Field label="Date"           value={content.date}           onChange={v => update("date", v)} />
//       <Field label="Project name"   value={content.project_name}   onChange={v => update("project_name", v)} />

//       <SectionLabel>Client info</SectionLabel>
//       <Field label="Client name"    value={content.client_name}    onChange={v => update("client_name", v)} />
//       <Field label="Client email"   value={content.client_email}   onChange={v => update("client_email", v)} />
//       <Field label="Client address" value={content.client_address} onChange={v => update("client_address", v)} />

//       <SectionLabel>Project description</SectionLabel>
//       <Field label="Description" value={content.project_description} onChange={v => update("project_description", v)} multiline />

//       <SectionLabel>Line items</SectionLabel>
//       {content.line_items?.map((item, i) => (
//         <div key={i} style={f.card}>
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
//             <span style={{ fontSize: 11, color: "#aaa" }}>Item {i + 1}</span>
//             <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
//           </div>
//           <Field label="Description" value={item.description} onChange={v => updateItem(i, "description", v)} />
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
//             {["hours", "unit_price", "amount"].map(key => (
//               <div key={key} style={f.group}>
//                 <div style={f.label}>{key.replace("_", " ")}</div>
//                 <input style={f.input} value={item[key] || ""} onChange={e => updateItem(i, key, e.target.value)} />
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//       <button style={f.addBtn} onClick={addItem}>+ Add line item</button>

//       <div style={gstToggleWrap}>
//         <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>GST</span>
//         <button
//           style={{
//             ...gstToggleBtn,
//             background: gstEnabled ? "#111" : "#e0e0e0",
//             color:      gstEnabled ? "#fff" : "#888",
//           }}
//           onClick={() => {
//             setGstEnabled(p => !p);
//             if (gstEnabled) {
//               update("gst_percent", 0);
//               update("gst_amount",  "0");
//             }
//           }}
//         >
//           {gstEnabled ? "ON" : "OFF"}
//         </button>
//       </div>

//       {gstEnabled && (
//         <Field
//           label="GST %"
//           value={String(content.gst_percent || "")}
//           onChange={v => update("gst_percent", v)}
//         />
//       )}

//       <SectionLabel>Totals</SectionLabel>
//       <Field label="Subtotal" value={content.subtotal}   onChange={v => update("subtotal", v)} />
//       {gstEnabled && (
//         <Field label="GST amount" value={content.gst_amount} onChange={v => update("gst_amount", v)} />
//       )}
//       <Field label="Total"    value={content.total}      onChange={v => update("total", v)} />

//       <SectionLabel>Payment & status</SectionLabel>
//       <Field label="Payment status" value={content.payment_status} onChange={v => update("payment_status", v)} />
//       <Field label="Payment date"   value={content.payment_date}   onChange={v => update("payment_date", v)} />
//       <Field label="Bank name"      value={content.bank_name}      onChange={v => update("bank_name", v)} />
//       <Field label="Account name"   value={content.account_name}   onChange={v => update("account_name", v)} />
//       <Field label="Phone number"   value={content.phone_number}   onChange={v => update("phone_number", v)} />
//       <Field label="UPI ID"         value={content.upi_id}         onChange={v => update("upi_id", v)} />
//       <Field label="Notes"          value={content.notes}          onChange={v => update("notes", v)} multiline />
//     </div>
//   );
// }

// function TimelineFields({ content, update }) {
//   const updateItem = (i, key, val) => {
//     const updated = [...(content.timeline_items || [])];
//     updated[i] = { ...updated[i], [key]: val };
//     update("timeline_items", updated);
//   };

//   const addItem = () =>
//     update("timeline_items", [
//       ...(content.timeline_items || []),
//       { description: "", timeline: "", hours: "" }
//     ]);

//   const removeItem = (i) =>
//     update("timeline_items",
//       (content.timeline_items || []).filter((_, idx) => idx !== i)
//     );

//   return (
//     <div style={f.wrap}>
//       <SectionLabel>Project Info</SectionLabel>
//       <Field label="Project name"        value={content.project_name}        onChange={v => update("project_name", v)} />
//       <Field label="Project description" value={content.project_description} onChange={v => update("project_description", v)} />
//       <Field label="Client name"         value={content.client_name}         onChange={v => update("client_name", v)} />

//       <SectionLabel>Timeline Items</SectionLabel>
//       {(content.timeline_items || []).map((item, i) => (
//         <div key={i} style={f.card}>
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
//             <span style={{ fontSize: 11, color: "#aaa" }}>Phase {i + 1}</span>
//             <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
//           </div>
//           <Field
//             label="Description"
//             value={item.description}
//             onChange={v => updateItem(i, "description", v)}
//           />
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
//             <div style={f.group}>
//               <div style={f.label}>Timeline</div>
//               <input
//                 style={f.input}
//                 value={item.timeline || ""}
//                 onChange={e => updateItem(i, "timeline", e.target.value)}
//                 placeholder="e.g. 5 days"
//               />
//             </div>
//             <div style={f.group}>
//               <div style={f.label}>Hours</div>
//               <input
//                 style={f.input}
//                 value={item.hours || ""}
//                 onChange={e => updateItem(i, "hours", e.target.value)}
//                 placeholder="e.g. 20"
//               />
//             </div>
//           </div>
//         </div>
//       ))}
//       <button style={f.addBtn} onClick={addItem}>+ Add phase</button>

//       <SectionLabel>Totals</SectionLabel>
//       <Field label="Total time"        value={content.total_time}        onChange={v => update("total_time", v)} />
//       <Field label="Expected dev time" value={content.expected_dev_time} onChange={v => update("expected_dev_time", v)} />
//       <Field label="Expected closure"  value={content.expected_closure}  onChange={v => update("expected_closure", v)} />
//       <Field label="Closure date"      value={content.closure_date}      onChange={v => update("closure_date", v)} />
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════
// // SHARED HELPER COMPONENTS
// // ══════════════════════════════════════════════════════════════════════

// function Field({ label, value, onChange, multiline }) {
//   return (
//     <div style={f.group}>
//       <div style={f.label}>{label}</div>
//       {multiline
//         ? <textarea style={{ ...f.input, minHeight: 68, resize: "vertical" }} value={value || ""} onChange={e => onChange(e.target.value)} />
//         : <input style={f.input} value={value || ""} onChange={e => onChange(e.target.value)} />
//       }
//     </div>
//   );
// }

// function SectionLabel({ children }) {
//   return <div style={f.sectionLabel}>{children}</div>;
// }

// function TypeBadge({ type }) {
//   const colors = {
//     receipt_template: { bg: "#EEEDFE", color: "#534AB7" },
//     client_doc:    { bg: "#E1F5EE", color: "#0F6E56" },
//     compliance:    { bg: "#FAEEDA", color: "#854F0B" },
//     invoice:       { bg: "#FAECE7", color: "#993C1D" },
//     timeline:       { bg: "#FAECE7", color: "#993C1D" },
//   };
//   const labels = {
//     receipt_template: "Receipt Template",
//     client_doc:    "Client Proposal",
//     compliance:    "Compliance",
//     invoice:       "Invoice",
//     timeline: "Timeline",
//   };
//   const c = colors[type] || { bg: "#f0f0f0", color: "#666" };
//   return (
//     <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 20, fontWeight: 500, background: c.bg, color: c.color }}>
//       {labels[type] || type}
//     </span>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════
// // STYLES
// // ══════════════════════════════════════════════════════════════════════

// const s = {
//   centerScreen: {
//     height: "100vh", display: "flex", flexDirection: "column",
//     alignItems: "center", justifyContent: "center", background: "#f7f7f7",
//   },
//   spinner: {
//     width: 32, height: 32, borderRadius: "50%",
//     border: "3px solid #e0e0e0", borderTopColor: "#111",
//     animation: "spin 0.8s linear infinite", marginBottom: 12,
//   },
//   loadingText: { fontSize: 13, color: "#888" },

//   promptBox:      { borderBottom: "1px solid #f0f0f0", flexShrink: 0, width: "300px" },
//   promptToggle:   { width: "100%", textAlign: "left", padding: "10px 16px", fontSize: 12, fontWeight: 600, color: "#131415", background: "#f5f3ff", border: "none", cursor: "pointer", borderBottom: "1px solid #fbfbfd" },
//   promptInner:    { padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8, background: "#fafafa" },
//   promptTextarea: { width: "100%", border: "1px solid #e8e8e8", borderRadius: 6, padding: "8px 10px", fontSize: 12, color: "#333", outline: "none", fontFamily: "inherit", lineHeight: 1.5, resize: "vertical", background: "#fff", height: "300px" },
//   btnGenerateFull:    { width: "100%", fontSize: 13, fontWeight: 600, background: "#141415", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", cursor: "pointer" },
//   btnGeneratingFull:  { width: "100%", fontSize: 13, background: "#121314", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", cursor: "not-allowed" },

//   page: {
//     height: "100vh", display: "flex", flexDirection: "column",
//     overflow: "hidden", background: "#f7f7f7",
//   },
//   topbar:      { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", height: 52, background: "#fff", borderBottom: "1px solid #e8e8e8", flexShrink: 0, gap: 12 },
//   topLeft:     { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
//   topRight:    { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
//   topDivider:  { width: 1, height: 20, background: "#e8e8e8" },
//   docName:     { fontSize: 14, fontWeight: 600, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 },
//   unsavedDot:  { width: 7, height: 7, borderRadius: "50%", background: "#f39c12", flexShrink: 0 },

//   btnSave:     { fontSize: 13, fontWeight: 600, background: "#111", color: "#fff", border: "none", borderRadius: 7, padding: "6px 16px", cursor: "pointer" },
//   btnSavingDisabled: { fontSize: 13, background: "#888", color: "#fff", border: "none", borderRadius: 7, padding: "6px 16px" },
//   btnSaveFull: { width: "100%", fontSize: 13, fontWeight: 600, background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", cursor: "pointer" },
//   btnPrimary:  { fontSize: 13, fontWeight: 600, background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer" },
//   btnOutline:  { fontSize: 12, color: "#555", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 7, padding: "6px 12px", cursor: "pointer", textDecoration: "none", display: "inline-block", lineHeight: "normal" },
//   btnIcon:     { fontSize: 11, color: "#888", background: "none", border: "1px solid #e8e8e8", borderRadius: 6, padding: "5px 8px", cursor: "pointer" },
//   savedPill:   { fontSize: 12, color: "#27ae60", fontWeight: 500 },

//   panels: { display: "flex", flex: 1, overflow: "hidden", minHeight: 0 },

//   leftPanel:   { width: 300, display: "flex", flexDirection: "column", background: "#fff", borderRight: "1px solid #e8e8e8", flexShrink: 0, overflow: "hidden" },
//   panelHeader: { padding: "14px 16px 10px", borderBottom: "1px solid #f0f0f0", flexShrink: 0 },
//   panelTitle:  { fontSize: 12, fontWeight: 700, color: "#111", display: "block", marginBottom: 2 },
//   panelSubtitle:{ fontSize: 11, color: "#aaa" },
//   panelScroll: { flex: 1, overflowY: "auto", padding: "14px 16px" },
//   saveFooter:  { padding: "12px 16px", borderTop: "1px solid #f0f0f0", flexShrink: 0 },
//   rightPanel: {
//     flex: 1, display: "flex", flexDirection: "column",
//     padding: 16, overflow: "hidden", minHeight: 0,
//   },
//   iframeWrap:  { flex: 1, borderRadius: 10, overflow: "hidden", border: "1px solid #e0e0e0", background: "#fff", minHeight: 0, display: "flex" },
//   iframe:      { width: "100%", height: "100%", border: "none" },
// };

// const f = {
//   wrap:         { display: "flex", flexDirection: "column", gap: 10 },
//   group:        { display: "flex", flexDirection: "column", gap: 4 },
//   label:        { fontSize: 11, fontWeight: 600, color: "#888", textTransform: "capitalize" },
//   input:        { width: "100%", border: "1px solid #e8e8e8", borderRadius: 6, padding: "7px 9px", fontSize: 12, color: "#333", outline: "none", fontFamily: "inherit", lineHeight: 1.5, background: "#fafafa" },
//   textarea:     { width: "100%", border: "1px solid #e8e8e8", borderRadius: 6, padding: "7px 9px", fontSize: 12, color: "#333", outline: "none", fontFamily: "inherit", lineHeight: 1.5, resize: "vertical", background: "#fafafa" },
//   sectionLabel: { fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, paddingTop: 8, paddingBottom: 4, borderBottom: "1px solid #f0f0f0", marginBottom: 4 },
//   card:         { border: "1px solid #efefef", borderRadius: 8, padding: "10px 12px", background: "#fafafa" },
//   cardTitle:    { width: "100%", border: "none", borderBottom: "1px solid #e8e8e8", padding: "3px 0 6px", fontSize: 12, fontWeight: 700, outline: "none", background: "transparent", marginBottom: 8, fontFamily: "inherit" },
//   pointRow:     { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 },
//   bullet:       { color: "#ccc", fontSize: 8, flexShrink: 0 },
//   pointInput:   { flex: 1, border: "none", borderBottom: "1px solid #f0f0f0", fontSize: 12, padding: "2px 0", outline: "none", background: "transparent", color: "#444", fontFamily: "inherit" },
//   uvpRow:       { display: "flex", alignItems: "center", gap: 4 },
//   addBtn:       { fontSize: 12, color: "#555", background: "none", border: "1.5px dashed #ddd", borderRadius: 6, padding: "7px 12px", cursor: "pointer", textAlign: "left", fontFamily: "inherit" },
//   removeBtn:    { fontSize: 11, color: "#c0392b", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" },
// };

// const gstToggleWrap = {
//   display: "flex", alignItems: "center", justifyContent: "space-between",
//   padding: "8px 12px", background: "#f7f7f7", borderRadius: 8,
//   border: "1px solid #efefef", marginTop: 4,
// };

// const gstToggleBtn = {
//   fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20,
//   border: "none", cursor: "pointer", letterSpacing: "0.5px", transition: "background 0.15s",
// };

// const voiceWrap    = { display: "flex", flexDirection: "column", gap: 8, padding: "12px 0" };
// const transcriptBox = { fontSize: 12, color: "#555", background: "#f0f0f0", borderRadius: 8, padding: "8px 10px", lineHeight: 1.5 };
// const pulseDot     = { width: 10, height: 10, borderRadius: "50%", background: "#e74c3c", animation: "pulse 1s ease infinite" };

// const voiceBtnStart = {
//   width: "100%", fontSize: 13, fontWeight: 600, color: "#fff",
//   background: "#111", border: "none", borderRadius: 8,
//   padding: "12px 0", cursor: "pointer", transition: "all 0.2s",
// };
// const voiceBtnStop = {
//   width: "100%", fontSize: 13, fontWeight: 700, color: "#fff",
//   background: "#e74c3c", border: "none", borderRadius: 8,
//   padding: "12px 0", cursor: "pointer", transition: "all 0.2s",
//   boxShadow: "0 2px 8px rgba(231,76,60,0.35)",
// };
// const listeningBanner = {
//   display: "flex", alignItems: "center", gap: 8,
//   background: "#fdecea", border: "1px solid #f5c6c0",
//   borderRadius: 8, padding: "8px 10px",
// };
// const processingBanner = {
//   display: "flex", alignItems: "center", gap: 8,
//   background: "#f0f0f0", border: "1px solid #e0e0e0",
//   borderRadius: 8, padding: "8px 10px",
// };
// const spinnerDot = {
//   width: 12, height: 12, borderRadius: "50%",
//   border: "2px solid #ccc", borderTopColor: "#555",
//   animation: "spin 0.7s linear infinite",
// };
// const manualFillBtn = {
//   marginTop: 8, width: "100%", fontSize: 12, fontWeight: 600,
//   background: "#111", color: "#fff", border: "none",
//   borderRadius: 6, padding: "8px 0", cursor: "pointer",
// };

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocument, updateDocument, previewUrl, refillDocument } from "../services/api";

const TYPE_LABELS = {
  receipt_template: "Receipt Template",
  client_doc:    "Client Proposal",
  compliance:    "Compliance Letter",
  invoice:       "Invoice",
  timeline:      "Project Timeline",
};

// Blank/empty starting structure per document type — used so refresh always starts fresh
function getBlankContent(type) {
  switch (type) {
    case "receipt_template":
      return {
        receipt_number: "",
        date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        service_name: "",
        payment_mode: "",
        client_name: "",
        client_phone: "",
        amount_received: "",
        amount_in_words: "",
        balance: "",
        line_items: [],
        subtotal: "0",
        gst_percent: 0,
        gst_amount: "0",
        total: "0",
        payment_status: "",
        paid_on: "",
        bank_name: "",
        upi_phone: "",
        upi_id: "",
      };
    case "client_doc":
      return {
        client_name: "",
        client_organisation: "",
        client_place: "",
        date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        sender_name: "",
        sender_designation: "",
        body_paragraphs: [],
        quotation_number: "",
        project_name: "",
        line_items: [],
        gst_percent: 0,
        gst_amount: "0",
        subtotal: "0",
        total: "0",
      };
    case "compliance":
      return {
        letter_type: "",
        date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        recipient_name: "",
        recipient_designation: "",
        recipient_company: "",
        subject: "",
        salutation: "",
        body_paragraphs: [],
        closing: "",
        sender_name: "",
        sender_designation: "",
        sender_contact: "",
      };
    case "invoice":
      return {
        invoice_number: "",
        date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        project_name: "",
        client_name: "",
        client_email: "",
        client_address: "",
        project_description: "",
        line_items: [],
        gst_percent: 0,
        gst_amount: "0",
        subtotal: "0",
        total: "0",
        payment_status: "",
        payment_date: "",
        bank_name: "",
        account_name: "",
        phone_number: "",
        upi_id: "",
        notes: "",
      };
    case "timeline":
      return {
        project_name: "",
        project_description: "",
        client_name: "",
        timeline_items: [],
        total_time: "",
        expected_dev_time: "",
        expected_closure: "",
        closure_date: "",
      };
    default:
      return {};
  }
}

// ── Number to words (Indian numbering: lakh, crore) ──────────────────
function numberToWordsIndian(num) {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const twoDigits = (n) => {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  };

  const threeDigits = (n) => {
    if (n > 99) {
      return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + twoDigits(n % 100) : "");
    }
    return twoDigits(n);
  };

  num = Math.floor(Number(num) || 0);
  if (num <= 0) return "";

  const crore    = Math.floor(num / 10000000); num %= 10000000;
  const lakh     = Math.floor(num / 100000);   num %= 100000;
  const thousand = Math.floor(num / 1000);     num %= 1000;
  const hundred  = num;

  let str = "";
  if (crore)    str += threeDigits(crore) + " Crore ";
  if (lakh)     str += threeDigits(lakh) + " Lakh ";
  if (thousand) str += threeDigits(thousand) + " Thousand ";
  if (hundred)  str += threeDigits(hundred);

  return str.trim();
}

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doc, setDoc]               = useState(null);
  const [content, setContent]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [dirty, setDirty]           = useState(false);
  const [copied, setCopied]         = useState(false);
  const [iframeKey, setIframeKey]   = useState(0);
  const [panelOpen, setPanelOpen]   = useState(true);
  const [prompt, setPrompt]         = useState("");
  const [generating, setGenerating] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [listening, setListening]   = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef(null);
  const transcriptRef  = useRef("");
  useEffect(() => {
    getDocument(id)
      .then(async (res) => {
        setDoc(res.data);

        const blank = getBlankContent(res.data.template_type);
        const backendContent = res.data.content || {};

        // Backend-generated fields ko preserve karo — yeh user-typed nahi hain,
        // isliye inhe blank karna galat hai
        if (res.data.template_type === "invoice") {
          blank.invoice_number = backendContent.invoice_number || "";
          blank.date = backendContent.date || blank.date;
        }
        if (res.data.template_type === "receipt_template") {
          blank.receipt_number = backendContent.receipt_number || "";
          blank.date = backendContent.date || blank.date;
        }

        setContent(blank);

        try {
          await updateDocument(id, blank);
          setIframeKey(k => k + 1);
        } catch (err) {
          console.error("Failed to reset backend content:", err);
        }
      })
      .catch(() => setDoc(null))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Load document, but always start with BLANK content (refresh = fresh start) ──
  // useEffect(() => {
  //   getDocument(id)
  //     .then(async (res) => {
  //       setDoc(res.data);
  //       const blank = getBlankContent(res.data.template_type);
  //       setContent(blank);

  //       // Reset backend content too, so the preview iframe (which loads
  //       // straight from the backend) also shows blank instead of old data
  //       try {
  //         await updateDocument(id, blank);
  //         setIframeKey(k => k + 1);
  //       } catch (err) {
  //         console.error("Failed to reset backend content:", err);
  //       }
  //     })
  //     .catch(() => setDoc(null))
  //     .finally(() => setLoading(false));
  // }, [id]);

  const update = (key, val) => {
    setContent(p => ({ ...p, [key]: val }));
    setDirty(true);
  };

  // ── Voice input ──────────────────────────────────────────────
  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported in this browser. Use Chrome.");
      return;
    }

    const recognition          = new SpeechRecognition();
    recognition.lang           = "en-IN";
    recognition.continuous     = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
      setTranscript("");
      transcriptRef.current = "";
    };

    recognition.onresult = (e) => {
      const text = Array.from(e.results)
        .map(r => r[0].transcript)
        .join("");
      setTranscript(text);
      transcriptRef.current = text; // ref stays fresh — onend reads from here
    };

    recognition.onend = async () => {
      setListening(false);
      const finalText = transcriptRef.current;
      if (finalText.trim()) {
        setGenerating(true);
        try {
          const res = await refillDocument(id, finalText);
          const gc =
            res.data.content ||
            res.data.document?.content ||
            res.data.data?.content ||
            res.data;
          if (!gc || typeof gc !== "object") throw new Error("No content");

          setContent(gc);
          await updateDocument(id, gc);
          setIframeKey(k => k + 1);
          setTranscript("");
          transcriptRef.current = "";
        } catch {
          alert("Voice generation failed.");
        } finally {
          setGenerating(false);
        }
      }
    };

    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  // Fallback manual fill — used if auto-fill didn't trigger after speech ended
  const handleManualFill = async () => {
    const text = transcriptRef.current || transcript;
    if (!text.trim()) return;
    setGenerating(true);
    try {
      const res = await refillDocument(id, text);
      const gc =
        res.data.content ||
        res.data.document?.content ||
        res.data.data?.content ||
        res.data;
      if (!gc || typeof gc !== "object") throw new Error("No content");

      setContent(gc);
      await updateDocument(id, gc);
      setIframeKey(k => k + 1);
      setTranscript("");
      transcriptRef.current = "";
    } catch {
      alert("Fill failed. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  // ── Manual save ─────────────────────────────────────────────
  const handleSave = async () => {
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

  // ── Auto-save on content change (debounced) ─────────────────
  useEffect(() => {
    if (!content || !dirty) return;

    const timer = setTimeout(async () => {
      try {
        await updateDocument(id, content);
        setIframeKey(k => k + 1);
        setDirty(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      } catch {
        // silent fail — user can manually save
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [content]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── AI prompt fill ───────────────────────────────────────────
  const handleRefill = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    try {
      const res = await refillDocument(id, prompt);

      const generatedContent =
        res.data.content ||
        res.data.document?.content ||
        res.data.data?.content;

      if (!generatedContent) {
        throw new Error("No content returned");
      }

      setContent(generatedContent);
      await updateDocument(id, generatedContent);
      setIframeKey((k) => k + 1);
      setDirty(false);
      setPrompt(""); // clear textarea after successful submit
    } catch (err) {
      alert("Generation failed. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    const BASE =
      import.meta.env.VITE_API_URL ||
      "http://localhost:8000";

    window.open(
      `${BASE}/api/doc/${id}/preview?autoprint=1`,
      "_blank"
    );
  };

  // ── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <div style={s.centerScreen}>
        <div style={s.spinner} />
        <p style={s.loadingText}>Loading document...</p>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────
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

      {/* ── Top bar ──────────────────────────────────────────── */}
      <div style={s.topbar}>
        <div style={s.topLeft}>
          <div style={s.topDivider} />
          <span style={s.docName}>{doc.project_name}</span>
          <TypeBadge type={doc.template_type} />
          {dirty && <span style={s.unsavedDot} title="Unsaved changes" />}
        </div>

        <div style={s.topRight}>
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

          <button
            style={s.btnIcon}
            onClick={() => setPanelOpen(p => !p)}
            title={panelOpen ? "Hide editor" : "Show editor"}
          >
            {panelOpen ? "◀" : "▶"}
          </button>

          <button style={s.btnOutline} onClick={handleCopyLink}>
            {copied ? " Copied!" : "Share link"}
          </button>

          <button style={s.btnOutline} onClick={handleDownloadPDF}>
            ⬇ Download PDF
          </button>

          <a
            href={previewUrl(id)}
            rel="noreferrer"
            style={s.btnOutline}
          >
            Open ↗
          </a>
        </div>
      </div>

      {/* ── Two-panel layout ────────────────────────────────── */}
      <div style={s.panels}>
        <div style={s.promptBox}>
          <button
            style={s.promptToggle}
            onClick={() => setPromptOpen(p => !p)}
          >
            ✦ {promptOpen ? "Close AI fill" : "Fill with AI prompt"}
          </button>

          {promptOpen && (
            <div style={s.promptInner}>
              <textarea
                style={s.promptTextarea}
                rows={4}
                placeholder={
                  `Example:\n"Client: Rahul Sharma, Project: Ayurvedic app with AI skin analysis, 3 months, budget ₹5L, 40-30-30 payment split"`
                }
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
              <button
                style={generating ? s.btnGeneratingFull : s.btnGenerateFull}
                onClick={handleRefill}
                disabled={generating || !prompt.trim()}
              >
                {generating ? " Generating..." : " Generate & Fill"}
              </button>
            </div>
          )}

          {/* ── VOICE FILL ── */}
          <div style={voiceWrap}>

            {/* State 1: Idle — show Start button */}
            {!listening && !generating && (
              <button style={voiceBtnStart} onClick={startVoice}>
                🎙 Start speaking
              </button>
            )}

            {/* State 2: Listening — live status + big Stop button */}
            {listening && (
              <>
                <div style={listeningBanner}>
                  <div style={pulseDot} />
                  <span style={{ fontSize: 12, color: "#e74c3c", fontWeight: 600 }}>
                    Listening... speak clearly
                  </span>
                </div>

                {transcript && (
                  <div style={transcriptBox}>
                    <span style={{ fontSize: 10, color: "#aaa", display: "block", marginBottom: 4 }}>
                      Heard so far:
                    </span>
                    {transcript}
                  </div>
                )}

                <button style={voiceBtnStop} onClick={stopVoice}>
                  ⏹ Stop & fill document
                </button>
              </>
            )}

            {/* State 3: Processing after stop */}
            {generating && (
              <div style={processingBanner}>
                <div style={spinnerDot} />
                <span style={{ fontSize: 12, color: "#555", fontWeight: 600 }}>
                  Filling your document...
                </span>
              </div>
            )}

            {/* Fallback: speech ended but wasn't auto-filled */}
            {!listening && !generating && transcript && (
              <div style={transcriptBox}>
                <span style={{ fontSize: 10, color: "#aaa", display: "block", marginBottom: 4 }}>
                  Last heard:
                </span>
                {transcript}
                <button style={manualFillBtn} onClick={handleManualFill}>
                  ✓ Fill from this
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Left — edit panel */}
        {panelOpen && (
          <div style={s.leftPanel}>
            <div style={s.panelHeader}>
              <span style={s.panelTitle}>Edit content</span>
              <span style={s.panelSubtitle}>{TYPE_LABELS[doc.template_type]}</span>
            </div>
            <div style={s.panelScroll}>
              {doc.template_type === "receipt_template" && (
                <ReceiptFields content={content} update={update} />
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
              {doc.template_type === "timeline" && (
                <TimelineFields content={content} update={update} />
              )}
            </div>

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


function ReceiptFields({ content, update }) {

  // ── GST TOGGLE STATE ─────────────────────────────────────
  const [gstEnabled, setGstEnabled] = useState(
    parseFloat(content.gst_percent) > 0
  );

  // ── Auto-generate "amount in words" whenever amount_received changes ──
  useEffect(() => {
    const raw = String(content.amount_received || "").replace(/[₹,\s]/g, "");
    const amt = parseFloat(raw);

    if (amt > 0) {
      const words = numberToWordsIndian(amt);
      update("amount_in_words", `${words} only`);
    } else {
      update("amount_in_words", "");
    }
  }, [content.amount_received]);

  // ── AUTO CALCULATE subtotal / gst / total (same pattern as Invoice) ──
  useEffect(() => {
    const parseAmt = (val) => {
      if (!val) return 0;
      return parseFloat(String(val).replace(/[₹,\s]/g, "")) || 0;
    };

    let baseAmount = 0;

    if (content.line_items && content.line_items.length > 0) {
      // Same as InvoiceFields: sum up each item's amount
      baseAmount = content.line_items.reduce(
        (sum, item) => sum + parseAmt(item.amount),
        0
      );
    } else {
      // Fallback: no line items yet, use Amount Received field
      baseAmount = parseAmt(content.amount_received);
    }

    const gstPercentNum = gstEnabled ? parseAmt(content.gst_percent) : 0;
    const gstAmt        = (baseAmount * gstPercentNum) / 100;
    const total          = baseAmount + gstAmt;

    const fmt = (n) => n > 0 ? `₹${n.toLocaleString("en-IN")}` : "0";

    update("subtotal",   fmt(baseAmount));
    update("gst_amount", gstEnabled && gstPercentNum > 0 ? fmt(gstAmt) : "0");
    update("total",      fmt(total));

  }, [content.line_items, content.amount_received, content.gst_percent, gstEnabled]);

  // ── Same as InvoiceFields: hours × unit_price = amount, live ──
  const updateItem = (i, key, val) => {
    const updated = [...(content.line_items || [])];
    updated[i] = { ...updated[i], [key]: val };

    const hours     = parseFloat(updated[i].hours || 0);
    const unitPrice = parseFloat(updated[i].unit_price || 0);
    updated[i].amount = hours * unitPrice;

    update("line_items", updated);
  };

  const addItem = () =>
    update("line_items", [
      ...(content.line_items || []),
      { description: "", hours: "", unit_price: "", amount: "" }
    ]);

  const removeItem = (i) =>
    update("line_items", (content.line_items || []).filter((_, idx) => idx !== i));

  return (
    <div style={f.wrap}>

      <SectionLabel>Receipt Info</SectionLabel>
      <Field label="Receipt number" value={content.receipt_number} onChange={v => update("receipt_number", v)} />
      <Field label="Date"           value={content.date}           onChange={v => update("date", v)} />
      <Field label="For service"    value={content.service_name}   onChange={v => update("service_name", v)} />
      <Field label="Payment mode"   value={content.payment_mode}   onChange={v => update("payment_mode", v)} />
        <Field
  label="Balance"
  value={content.balance || ""}
  onChange={(v) => update("balance", v)}
/>

      <SectionLabel>Received From</SectionLabel>
      <Field label="Client name"    value={content.client_name}    onChange={v => update("client_name", v)} />
      <Field label="Client phone"   value={content.client_phone}   onChange={v => update("client_phone", v)} />

      <SectionLabel>Payment</SectionLabel>
      <Field label="Amount received"  value={content.amount_received}  onChange={v => update("amount_received", v)} />
      <Field label="Amount in words"  value={content.amount_in_words}  onChange={v => update("amount_in_words", v)} />
      <Field label="Balance"          value={content.balance}          onChange={v => update("balance", v)} />

      <SectionLabel>Line items</SectionLabel>
      {(content.line_items || []).map((item, i) => (
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
                <input
                  style={f.input}
                  value={item[key] || ""}
                  onChange={e => updateItem(i, key, e.target.value)}
                  // Amount field auto-computed — read-only, like invoice's behavior
                  readOnly={key === "amount"}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button style={f.addBtn} onClick={addItem}>+ Add line item</button>

      {/* ── GST TOGGLE ──────────────────────────────────────── */}
      <div style={gstToggleWrap}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>GST</span>
        <button
          style={{
            ...gstToggleBtn,
            background: gstEnabled ? "#111" : "#e0e0e0",
            color:      gstEnabled ? "#fff" : "#888",
          }}
          onClick={() => {
            setGstEnabled(p => !p);
            if (gstEnabled) {
              update("gst_percent", 0);
              update("gst_amount",  "0");
            }
          }}
        >
          {gstEnabled ? "ON" : "OFF"}
        </button>
      </div>

      {gstEnabled && (
        <Field
          label="GST %"
          value={String(content.gst_percent ?? "")}
          onChange={v => update("gst_percent", v)}
        />
      )}
      {/* ──────────────────────────────────────────────────── */}

      <SectionLabel>Totals (auto-calculated)</SectionLabel>

      <Field
  label="Subtotal"
  value={content.subtotal || ""}
  onChange={(v) => update("subtotal", v)}
/>

<Field
  label="GST Amount"
  value={content.gst_amount || ""}
  onChange={(v) => update("gst_amount", v)}
/>

<Field
  label="Total"
  value={content.total || ""}
  onChange={(v) => update("total", v)}
/>

      <SectionLabel>Status</SectionLabel>
      <Field label="Payment status" value={content.payment_status} onChange={v => update("payment_status", v)} />
      <Field label="Paid on"        value={content.paid_on}        onChange={v => update("paid_on", v)} />

      <SectionLabel>Bank / UPI</SectionLabel>
      <Field label="Bank name"  value={content.bank_name}  onChange={v => update("bank_name", v)} />
      <Field label="UPI phone"  value={content.upi_phone}  onChange={v => update("upi_phone", v)} />
      <Field label="UPI ID"     value={content.upi_id}     onChange={v => update("upi_id", v)} />

    </div>
  );
}

// function ReceiptFields({ content, update }) {

//   // ── GST TOGGLE STATE ─────────────────────────────────────
//   const [gstEnabled, setGstEnabled] = useState(
//     parseFloat(content.gst_percent) > 0
//   );

//   // ── Auto-generate "amount in words" whenever amount_received changes ──
//   useEffect(() => {
//     const raw = String(content.amount_received || "").replace(/[₹,\s]/g, "");
//     const amt = parseFloat(raw);

//     if (amt > 0) {
//       const words = numberToWordsIndian(amt);
//       update("amount_in_words", `${words} only`);
//     } else {
//       update("amount_in_words", "");
//     }
//   }, [content.amount_received]);

//   // ── AUTO CALCULATE subtotal / gst / total from line items ─────────
//   useEffect(() => {
//     if (!content.line_items?.length) return;

//     const parseAmt = (val) => {
//       if (!val) return 0;
//       return parseFloat(String(val).replace(/[₹,\s]/g, "")) || 0;
//     };

//     const subtotal   = content.line_items.reduce((sum, item) => sum + parseAmt(item.amount), 0);
//     const gstPercent = gstEnabled ? (parseFloat(content.gst_percent) || 0) : 0;
//     const gstAmt     = (subtotal * gstPercent) / 100;
//     const total      = subtotal + gstAmt;

//     const fmt = (n) => n > 0 ? `₹${n.toLocaleString("en-IN")}` : "0";

//     update("subtotal",   fmt(subtotal));
//     update("gst_percent", gstEnabled ? gstPercent : 0);
//     update("gst_amount", gstEnabled && gstPercent > 0 ? fmt(gstAmt) : "0");
//     update("total",      fmt(total));
//   }, [content.line_items, content.gst_percent, gstEnabled]);

//   const updateItem = (i, key, val) => {
//     const updated = [...(content.line_items || [])];
//     updated[i] = { ...updated[i], [key]: val };

//     const hours     = parseFloat(updated[i].hours || 0);
//     const unitPrice = parseFloat(updated[i].unit_price || 0);
//     if (hours && unitPrice) {
//       updated[i].amount = hours * unitPrice;
//     }

//     update("line_items", updated);
//   };

//   const addItem = () =>
//     update("line_items", [
//       ...(content.line_items || []),
//       { description: "Payment Receipt", hours: "-", unit_price: "-", amount: "" }
//     ]);

//   const removeItem = (i) =>
//     update("line_items", (content.line_items || []).filter((_, idx) => idx !== i));

//   return (
//     <div style={f.wrap}>

//       <SectionLabel>Receipt Info</SectionLabel>
//       <Field label="Receipt number" value={content.receipt_number} onChange={v => update("receipt_number", v)} />
//       <Field label="Date"           value={content.date}           onChange={v => update("date", v)} />
//       <Field label="For service"    value={content.service_name}   onChange={v => update("service_name", v)} />
//       <Field label="Payment mode"   value={content.payment_mode}   onChange={v => update("payment_mode", v)} />

//       <SectionLabel>Received From</SectionLabel>
//       <Field label="Client name"    value={content.client_name}    onChange={v => update("client_name", v)} />
//       <Field label="Client phone"   value={content.client_phone}   onChange={v => update("client_phone", v)} />

//       <SectionLabel>Payment</SectionLabel>
//       <Field label="Amount received"  value={content.amount_received}  onChange={v => update("amount_received", v)} />
//       <Field label="Amount in words"  value={content.amount_in_words}  onChange={v => update("amount_in_words", v)} />
//       <Field label="Balance"          value={content.balance}          onChange={v => update("balance", v)} />

//       <SectionLabel>Line items</SectionLabel>
//       {(content.line_items || []).map((item, i) => (
//         <div key={i} style={f.card}>
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
//             <span style={{ fontSize: 11, color: "#aaa" }}>Item {i + 1}</span>
//             <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
//           </div>
//           <Field label="Description" value={item.description} onChange={v => updateItem(i, "description", v)} />
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
//             {["hours", "unit_price", "amount"].map(key => (
//               <div key={key} style={f.group}>
//                 <div style={f.label}>{key.replace("_", " ")}</div>
//                 <input style={f.input} value={item[key] || ""} onChange={e => updateItem(i, key, e.target.value)} />
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//       <button style={f.addBtn} onClick={addItem}>+ Add line item</button>

//       {/* ── GST TOGGLE ──────────────────────────────────────── */}
//       <div style={gstToggleWrap}>
//         <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>GST</span>
//         <button
//           style={{
//             ...gstToggleBtn,
//             background: gstEnabled ? "#111" : "#e0e0e0",
//             color:      gstEnabled ? "#fff" : "#888",
//           }}
//           onClick={() => {
//             setGstEnabled(p => !p);
//             if (gstEnabled) {
//               update("gst_percent", 0);
//               update("gst_amount",  "0");
//             }
//           }}
//         >
//           {gstEnabled ? "ON" : "OFF"}
//         </button>
//       </div>

//       {gstEnabled && (
//         <Field
//           label="GST %"
//           value={String(content.gst_percent || "")}
//           onChange={v => update("gst_percent", v)}
//         />
//       )}
//       {/* ──────────────────────────────────────────────────── */}

//       <SectionLabel>Totals</SectionLabel>
//       <Field label="Subtotal" value={content.subtotal} onChange={v => update("subtotal", v)} />
//       {gstEnabled && (
//         <Field label="GST amount" value={content.gst_amount} onChange={v => update("gst_amount", v)} />
//       )}
//       <Field label="Total" value={content.total} onChange={v => update("total", v)} />

//       <SectionLabel>Status</SectionLabel>
//       <Field label="Payment status" value={content.payment_status} onChange={v => update("payment_status", v)} />
//       <Field label="Paid on"        value={content.paid_on}        onChange={v => update("paid_on", v)} />

//       <SectionLabel>Bank / UPI</SectionLabel>
//       <Field label="Bank name"  value={content.bank_name}  onChange={v => update("bank_name", v)} />
//       <Field label="UPI phone"  value={content.upi_phone}  onChange={v => update("upi_phone", v)} />
//       <Field label="UPI ID"     value={content.upi_id}     onChange={v => update("upi_id", v)} />

//     </div>
//   );
// }

// function ReceiptFields({ content, update }) {

//   // ── Auto-generate "amount in words" whenever amount_received changes ──
//   useEffect(() => {
//     const raw = String(content.amount_received || "").replace(/[₹,\s]/g, "");
//     const amt = parseFloat(raw);

//     if (amt > 0) {
//       const words = numberToWordsIndian(amt);
//       update("amount_in_words", `${words} only`);
//     } else {
//       update("amount_in_words", "");
//     }
//   }, [content.amount_received]);

//   const updateItem = (i, key, val) => {
//     const updated = [...(content.line_items || [])];
//     updated[i] = { ...updated[i], [key]: val };

//     const hours     = parseFloat(updated[i].hours || 0);
//     const unitPrice = parseFloat(updated[i].unit_price || 0);
//     if (hours && unitPrice) {
//       updated[i].amount = hours * unitPrice;
//     }

//     update("line_items", updated);
//   };

//   const addItem = () =>
//     update("line_items", [
//       ...(content.line_items || []),
//       { description: "Payment Receipt", hours: "-", unit_price: "-", amount: "" }
//     ]);

//   const removeItem = (i) =>
//     update("line_items", (content.line_items || []).filter((_, idx) => idx !== i));

//   return (
//     <div style={f.wrap}>

//       <SectionLabel>Receipt Info</SectionLabel>
//       <Field label="Receipt number" value={content.receipt_number} onChange={v => update("receipt_number", v)} />
//       <Field label="Date"           value={content.date}           onChange={v => update("date", v)} />
//       <Field label="For service"    value={content.service_name}   onChange={v => update("service_name", v)} />
//       <Field label="Payment mode"   value={content.payment_mode}   onChange={v => update("payment_mode", v)} />

//       <SectionLabel>Received From</SectionLabel>
//       <Field label="Client name"    value={content.client_name}    onChange={v => update("client_name", v)} />
//       <Field label="Client phone"   value={content.client_phone}   onChange={v => update("client_phone", v)} />

//       <SectionLabel>Payment</SectionLabel>
//       <Field label="Amount received"  value={content.amount_received}  onChange={v => update("amount_received", v)} />
//       <Field label="Amount in words"  value={content.amount_in_words}  onChange={v => update("amount_in_words", v)} />
//       <Field label="Balance"          value={content.balance}          onChange={v => update("balance", v)} />

//       <SectionLabel>Line items</SectionLabel>
//       {(content.line_items || []).map((item, i) => (
//         <div key={i} style={f.card}>
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
//             <span style={{ fontSize: 11, color: "#aaa" }}>Item {i + 1}</span>
//             <button style={f.removeBtn} onClick={() => removeItem(i)}>✕ Remove</button>
//           </div>
//           <Field label="Description" value={item.description} onChange={v => updateItem(i, "description", v)} />
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
//             {["hours", "unit_price", "amount"].map(key => (
//               <div key={key} style={f.group}>
//                 <div style={f.label}>{key.replace("_", " ")}</div>
//                 <input style={f.input} value={item[key] || ""} onChange={e => updateItem(i, key, e.target.value)} />
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//       <button style={f.addBtn} onClick={addItem}>+ Add line item</button>

//       <SectionLabel>Totals</SectionLabel>
//       <Field label="Subtotal"   value={content.subtotal}   onChange={v => update("subtotal", v)} />
//       <Field label="GST %"      value={String(content.gst_percent || "")} onChange={v => update("gst_percent", v)} />
//       <Field label="GST amount" value={content.gst_amount} onChange={v => update("gst_amount", v)} />
//       <Field label="Total"      value={content.total}      onChange={v => update("total", v)} />

//       <SectionLabel>Status</SectionLabel>
//       <Field label="Payment status" value={content.payment_status} onChange={v => update("payment_status", v)} />
//       <Field label="Paid on"        value={content.paid_on}        onChange={v => update("paid_on", v)} />

//       <SectionLabel>Bank / UPI</SectionLabel>
//       <Field label="Bank name"  value={content.bank_name}  onChange={v => update("bank_name", v)} />
//       <Field label="UPI phone"  value={content.upi_phone}  onChange={v => update("upi_phone", v)} />
//       <Field label="UPI ID"     value={content.upi_id}     onChange={v => update("upi_id", v)} />

//     </div>
//   );
// }

function ClientDocFields({ content, update }) {
  const [gstEnabled, setGstEnabled] = useState(
    parseFloat(content.gst_percent) > 0
  );

  useEffect(() => {
    if (!content.line_items?.length) return;

    const parseAmt = (val) => {
      if (!val) return 0;
      return parseFloat(String(val).replace(/[₹,\s]/g, "")) || 0;
    };
    const subtotal   = content.line_items.reduce((sum, item) => sum + parseAmt(item.amount), 0);
    const gstPercent = gstEnabled ? (parseFloat(content.gst_percent) || 0) : 0;
    const gstAmt     = (subtotal * gstPercent) / 100;
    const total      = subtotal + gstAmt;

    const fmt = (n) => n > 0 ? `₹${n.toLocaleString("en-IN")}` : "0";

    update("subtotal",   fmt(subtotal));
    update("gst_percent", gstEnabled ? gstPercent : 0);
    update("gst_amount", gstEnabled && gstPercent > 0 ? fmt(gstAmt) : "0");
    update("total",      fmt(total));
  }, [content.line_items, content.gst_percent, gstEnabled]);

  const updatePara = (i, val) => {
    const updated = [...content.body_paragraphs];
    updated[i] = val;
    update("body_paragraphs", updated);
  };

  const updateItem = (i, key, val) => {
    const updated = [...content.line_items];
    updated[i] = { ...updated[i], [key]: val };

    const hours     = parseFloat(updated[i].hours || 0);
    const unitPrice = parseFloat(updated[i].unit_price || 0);
    updated[i].amount = hours * unitPrice;

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

      <div style={gstToggleWrap}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>GST</span>
        <button
          style={{
            ...gstToggleBtn,
            background: gstEnabled ? "#111" : "#e0e0e0",
            color:      gstEnabled ? "#fff" : "#888",
          }}
          onClick={() => {
            setGstEnabled(p => !p);
            if (gstEnabled) {
              update("gst_percent", 0);
              update("gst_amount",  "0");
            }
          }}
        >
          {gstEnabled ? "ON" : "OFF"}
        </button>
      </div>

      {gstEnabled && (
        <Field
          label="GST %"
          value={String(content.gst_percent || "")}
          onChange={v => update("gst_percent", v)}
        />
      )}

      <SectionLabel>Totals</SectionLabel>
      <Field label="Subtotal"   value={content.subtotal}   onChange={v => update("subtotal", v)} />
      <Field label="GST amount" value={content.gst_amount} onChange={v => update("gst_amount", v)} />
      <Field label="Total"      value={content.total}      onChange={v => update("total", v)} />
    </div>
  );
}

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

function InvoiceFields({ content, update }) {
  const [gstEnabled, setGstEnabled] = useState(
    parseFloat(content.gst_percent) > 0
  );

  useEffect(() => {
    if (!content.line_items?.length) return;

    const parseAmt = (val) => {
      if (!val) return 0;
      return parseFloat(String(val).replace(/[₹,\s]/g, "")) || 0;
    };

    const subtotal   = content.line_items.reduce((sum, item) => sum + parseAmt(item.amount), 0);
    const gstPercent = gstEnabled ? (parseFloat(content.gst_percent) || 0) : 0;
    const gstAmt     = (subtotal * gstPercent) / 100;
    const total      = subtotal + gstAmt;

    const fmt = (n) => n > 0 ? `₹${n.toLocaleString("en-IN")}` : "0";

    update("subtotal",   fmt(subtotal));
    update("gst_percent", gstEnabled ? gstPercent : 0);
    update("gst_amount", gstEnabled && gstPercent > 0 ? fmt(gstAmt) : "0");
    update("total",      fmt(total));
  }, [content.line_items, content.gst_percent, gstEnabled]);

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
      <Field label="Description" value={content.project_description} onChange={v => update("project_description", v)} multiline />

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

      <div style={gstToggleWrap}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>GST</span>
        <button
          style={{
            ...gstToggleBtn,
            background: gstEnabled ? "#111" : "#e0e0e0",
            color:      gstEnabled ? "#fff" : "#888",
          }}
          onClick={() => {
            setGstEnabled(p => !p);
            if (gstEnabled) {
              update("gst_percent", 0);
              update("gst_amount",  "0");
            }
          }}
        >
          {gstEnabled ? "ON" : "OFF"}
        </button>
      </div>

      {gstEnabled && (
        <Field
          label="GST %"
          value={String(content.gst_percent || "")}
          onChange={v => update("gst_percent", v)}
        />
      )}

      <SectionLabel>Totals</SectionLabel>
      <Field label="Subtotal" value={content.subtotal}   onChange={v => update("subtotal", v)} />
      {gstEnabled && (
        <Field label="GST amount" value={content.gst_amount} onChange={v => update("gst_amount", v)} />
      )}
      <Field label="Total"    value={content.total}      onChange={v => update("total", v)} />

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
      <Field label="Total time"        value={content.total_time}        onChange={v => update("total_time", v)} />
      <Field label="Expected dev time" value={content.expected_dev_time} onChange={v => update("expected_dev_time", v)} />
      <Field label="Expected closure"  value={content.expected_closure}  onChange={v => update("expected_closure", v)} />
      <Field label="Closure date"      value={content.closure_date}      onChange={v => update("closure_date", v)} />
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
    receipt_template: { bg: "#EEEDFE", color: "#534AB7" },
    client_doc:    { bg: "#E1F5EE", color: "#0F6E56" },
    compliance:    { bg: "#FAEEDA", color: "#854F0B" },
    invoice:       { bg: "#FAECE7", color: "#993C1D" },
    timeline:       { bg: "#FAECE7", color: "#993C1D" },
  };
  const labels = {
    receipt_template: "Receipt Template",
    client_doc:    "Client Proposal",
    compliance:    "Compliance",
    invoice:       "Invoice",
    timeline: "Timeline",
  };
  const c = colors[type] || { bg: "#f0f0f0", color: "#666" };
  return (
    <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 20, fontWeight: 500, background: c.bg, color: c.color }}>
      {labels[type] || type}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════════

const s = {
  centerScreen: {
    height: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", background: "#f7f7f7",
  },
  spinner: {
    width: 32, height: 32, borderRadius: "50%",
    border: "3px solid #e0e0e0", borderTopColor: "#111",
    animation: "spin 0.8s linear infinite", marginBottom: 12,
  },
  loadingText: { fontSize: 13, color: "#888" },

  promptBox:      { borderBottom: "1px solid #f0f0f0", flexShrink: 0, width: "300px" },
  promptToggle:   { width: "100%", textAlign: "left", padding: "10px 16px", fontSize: 12, fontWeight: 600, color: "#131415", background: "#f5f3ff", border: "none", cursor: "pointer", borderBottom: "1px solid #fbfbfd" },
  promptInner:    { padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8, background: "#fafafa" },
  promptTextarea: { width: "100%", border: "1px solid #e8e8e8", borderRadius: 6, padding: "8px 10px", fontSize: 12, color: "#333", outline: "none", fontFamily: "inherit", lineHeight: 1.5, resize: "vertical", background: "#fff", height: "300px" },
  btnGenerateFull:    { width: "100%", fontSize: 13, fontWeight: 600, background: "#141415", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", cursor: "pointer" },
  btnGeneratingFull:  { width: "100%", fontSize: 13, background: "#121314", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", cursor: "not-allowed" },

  page: {
    height: "100vh", display: "flex", flexDirection: "column",
    overflow: "hidden", background: "#f7f7f7",
  },
  topbar:      { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", height: 52, background: "#fff", borderBottom: "1px solid #e8e8e8", flexShrink: 0, gap: 12 },
  topLeft:     { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
  topRight:    { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
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

  panels: { display: "flex", flex: 1, overflow: "hidden", minHeight: 0 },

  leftPanel:   { width: 300, display: "flex", flexDirection: "column", background: "#fff", borderRight: "1px solid #e8e8e8", flexShrink: 0, overflow: "hidden" },
  panelHeader: { padding: "14px 16px 10px", borderBottom: "1px solid #f0f0f0", flexShrink: 0 },
  panelTitle:  { fontSize: 12, fontWeight: 700, color: "#111", display: "block", marginBottom: 2 },
  panelSubtitle:{ fontSize: 11, color: "#aaa" },
  panelScroll: { flex: 1, overflowY: "auto", padding: "14px 16px" },
  saveFooter:  { padding: "12px 16px", borderTop: "1px solid #f0f0f0", flexShrink: 0 },
  rightPanel: {
    flex: 1, display: "flex", flexDirection: "column",
    padding: 16, overflow: "hidden", minHeight: 0,
  },
  iframeWrap:  { flex: 1, borderRadius: 10, overflow: "hidden", border: "1px solid #e0e0e0", background: "#fff", minHeight: 0, display: "flex" },
  iframe:      { width: "100%", height: "100%", border: "none" },
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

const gstToggleWrap = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "8px 12px", background: "#f7f7f7", borderRadius: 8,
  border: "1px solid #efefef", marginTop: 4,
};

const gstToggleBtn = {
  fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20,
  border: "none", cursor: "pointer", letterSpacing: "0.5px", transition: "background 0.15s",
};

const voiceWrap    = { display: "flex", flexDirection: "column", gap: 8, padding: "12px 0" };
const transcriptBox = { fontSize: 12, color: "#555", background: "#f0f0f0", borderRadius: 8, padding: "8px 10px", lineHeight: 1.5 };
const pulseDot     = { width: 10, height: 10, borderRadius: "50%", background: "#e74c3c", animation: "pulse 1s ease infinite" };

const voiceBtnStart = {
  width: "100%", fontSize: 13, fontWeight: 600, color: "#fff",
  background: "#111", border: "none", borderRadius: 8,
  padding: "12px 0", cursor: "pointer", transition: "all 0.2s",
};
const voiceBtnStop = {
  width: "100%", fontSize: 13, fontWeight: 700, color: "#fff",
  background: "#e74c3c", border: "none", borderRadius: 8,
  padding: "12px 0", cursor: "pointer", transition: "all 0.2s",
  boxShadow: "0 2px 8px rgba(231,76,60,0.35)",
};
const listeningBanner = {
  display: "flex", alignItems: "center", gap: 8,
  background: "#fdecea", border: "1px solid #f5c6c0",
  borderRadius: 8, padding: "8px 10px",
};
const processingBanner = {
  display: "flex", alignItems: "center", gap: 8,
  background: "#f0f0f0", border: "1px solid #e0e0e0",
  borderRadius: 8, padding: "8px 10px",
};
const spinnerDot = {
  width: 12, height: 12, borderRadius: "50%",
  border: "2px solid #ccc", borderTopColor: "#555",
  animation: "spin 0.7s linear infinite",
};
const manualFillBtn = {
  marginTop: 8, width: "100%", fontSize: 12, fontWeight: 600,
  background: "#111", color: "#fff", border: "none",
  borderRadius: 6, padding: "8px 0", cursor: "pointer",
};