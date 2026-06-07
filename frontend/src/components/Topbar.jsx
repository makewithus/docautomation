const TYPE_META = {
  developer_doc: { label: "Developer Doc",   bg: "#EEEDFE", color: "#534AB7" },
  client_doc:    { label: "Client Proposal", bg: "#E1F5EE", color: "#0F6E56" },
  compliance:    { label: "Compliance",       bg: "#FAEEDA", color: "#854F0B" },
  invoice:       { label: "Invoice",          bg: "#FAECE7", color: "#993C1D" },
};

export default function Topbar({
    showBack= false,
    docName="",
    docType="",
    isDirty=false,
    isSaving=false,
    isSaved=false,
    onSave=null,
    onCopyLink=null,
    isCopied=false,
    previewHref="",
    rightContent=null,
    showAllDocs=true,
}){
    const typeMeta = TYPE_META[docType]||null;

    return (
        <header style={s.bar}>
            <div style={s.left}>
                {showBack && (
                    <a href="/" style={s.backBtn} title="Back to home">
                        <AsteriskIcon size={17}/>
                        <span style={s.logoText}>makewithus</span>
                    </a>
                )}

                {showBack && docName && <span style={s.divider}/>}

                {showBack && docName && (
                    <span style={s.docName} title={docName}>{docName}</span>
                )}

                {typeMeta && (
                    <span style={{
                        ...s.typeBadge,
                        background: typeMeta.bg,
                        color: typeMeta.color,
                    }}>
                        {typeMeta.label}
                    </span>
                )}
                {isDirty && <span style={s.unsavedDot} title="Unsaved changes"/>}

            </div>

            <div style={s.right}>
                {rightContent}

                {onSave && isDirty && (
                    <button
                    style={isSaving ? s.btnSaveDisabled : s.btnSave}
                    onClick={onSave}
                    disabled={isSaving}
                    >
                        {isSaving ? "Saving":"Save changes"}

                    </button>
                )}
                {isSaved && !isDirty && (
                    <span style={s.savedPill}>Saved</span>
                )}

                {onCopyLink && (
                    <button style={s.btnOutline} onClick={onCopyLink}>
                        {isCopied ? "Copied":"Share link"}
                    </button>
                )}
                {previewHref && (
                    <a
                    href={previewHref}
                    target="_blank"
                    rel="noreferrer"
                    style={s.btnOutline}
                    >
                        Open
                    </a>
                )}
                {showAllDocs && (
                    <a href="/documents" style={s.btnOutline}>
                        All docs
                    </a>
                )}
            </div>
        </header>
    );
}

function AsteriskIcon({size=18}){
    return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden="true">
            <path
            d="M22 4 L22 40 M4 L40 22 M7.5 7.5 L36.5 36.5 M36.5 7.5 L7.5 36.5"
            stroke="#111"
            strokeWidth="5"
            strokeLinecap="round"/>
        </svg>
    );
}

const s = {
    bar :{
        display:"flex",
        justifyContent:"space-between",
        alignItems: "center",
        padding:"0 20px",
        height:52,
        background: "#fff",
        borderBottom:"1px solid #e8e8e8",
        flexShrink:0,
        position:"sticky",
        top: 0,
        zIndex:100,
        fontFamily: "system-ui, -apple-system, sans-serif",
    },
    left:{
        display:"flex",
        alignItems:"center",
        gap:10,
        minWidth:0,
        flex:1,
    },
    logoLink:{
        display:"flex",
        alignItems:"center",
        gap:8,
        textDecoration:"none",
        flexShrink:0,
    },
    logoText:{
        fontSize: 15,
        fontWeight:700,
        color:"#111",
        letterSpacing:  -0.3,
    },
    backBtn:{
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        padding:6,
        borderRadius:7,
        textDecoration:"none",
        flexShrink:0,
    },
    divider:{
        display:"block",
        width:1,
        height:20,
        background:"#e8e8e8",
        flexShrink:0,
    },
    docName:{
        fontSize:14,
        fontWeight:600,
        color:"#111",
        whiteSpace:"nowrap",
        overflow:"hidden",
        textOverflow:"ellipsis",
        maxWidth:200,
    },
    typeBadge:{
        fontSize: 11,
        padding: "2px 9px",
        borderRadius:20,
        fontWeight:500,
        flexShrink:0,
    },
    unsavedDot:{
        display:"block",
        width:7,
        height:7,
        borderRadius:"50%",
        background:"#f39c12",
        flexShrink:0,
    },
    right:{
        display:"flex",
        alignItems:"center",
        gap:0,
        flexShrink:0,
    },
    btnSave:{
        fontSize:13,
        fontWeight:600,
        background:"#111",
        color:"#fff",
        border:"none",
        borderRadius:7,
        padding:"7px 16px",
        cursor:"pointer",
        fontFamily:"inherit",
    },
    btnSaveDisabled:{
        fontSize:13,
        background:"#999",
        color:"#fff",
        border:"none",
        borderRadius:7,
        padding:"7px 16px",
        cursor:"not-allowed",
        fontFamily:"inherit",
    },
    savedPill:{
        fontSize:12,
        color:"#27ae60",
        fontWeight:500,
    },
    btnOutline:{
        fontSize:12,
        color:"#555",
        background:"#fff",
        border:"1px solid #e0e0e0",
        borderRadius:7,
        padding:"6px 12px",
        cursor:"pointer",
        textDecoration:"none",
        display:"inline-block",
        lineHeight:"normal",
        fontFamily:"inherit",
        whiteSpace:"nowrap",
    },
};