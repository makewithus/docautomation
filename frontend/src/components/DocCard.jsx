import TypeBadge from "./TypeBadge";

export default function DocCard({doc,onDelete,deleting=false}){
    const formatDate = (str)=>{
        if(!str) return "";
        try{
            return new Date(str).toLocaleDateString("en-IN",{
                day:"numeric",
                month:"short",
                year:"numeric",
                
            });
        }
        catch{
            return str;
        }
    };
    const sourceFileName = doc.source_file
    ? doc.source_file.split("/").pop().split("\\").pop()
    : null;
    return(
        <div
        style={s.card}
        onClick={()=>window.location.href = `/doc.${doc.id}`}
        onMouseEnter={e=> {e.currentTarget.style.boxShadow = s.cardHoverShadow;e.currentTarget.style.borderColor = "#d0d0d0";}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow = "none";e.currentTarget.style.borderColor = "#efefef";}}
        >
            <div style={s.topRow}>
                <TypeBadge type = {doc.template_type}/>
                <span style={s.date}>{formatDate(doc.created_at)}</span>
            </div>
            <div style={s.projectName}>{doc.projectName}</div>
            {sourceFileName && (
                <div style={s.sourceFile}>
                    <span style={s.sourceIcon}>📄</span>
                    <span style={s.sourceText}>{sourceFileName}</span>
                    </div>
            )}
            <div style={s.docId}>/doc/{doc.id}</div>
            <div
            style={s.actions}
            onClick={e=>e.stopPropagation()}
            >
                <a href={`/doc/${doc.id}`} style={s.editLink}>
                Open editor </a>
                <button
                style={deleting ? s.deleteBtnDisabled : s.deleteBtn}
                onClick={()=>onDelete && onDelete(doc.id)}
                disabled={deleting}
                >
                    {deleting?"Deleting":"Delete"}
                </button>
            </div>
        </div>
    );
}

const s = {
    card: {
        background:"#fff",
        border:"1 px solid #efefef",
        borderRadius:12,
        padding:"18px 20px",
        cursor:"pointer",
        transition:"box-shadow .15s,border-color .15s",
        fontFamily:"system-ui -apple-system, sans-serif",
        boxShadow:"none",
    },

    cardHoverShadow:"0 4px 16px rgba(0,0,0,0.07)",
    topRow:{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:12,
    },
    date:{
        fontSize:11,
        color:"#bbb",
    },
    projectName:{
        fontSize:17,
        fontWeight:700,
        color:"#111",
        lineHeight:1.3,
        marginBottom:6,
        whiteSpace:"nowrap",
        overflow:"hidden",
        textOverflow:"ellipsis",
    },
    sourceFile:{
        display:"flex",
        alignItems:"center",
        gap:4,
        marginBottom:4,
    },
    sourceIcon:{
        fontSize:11,
    },
    sourceText:{
        fontSize:11,
        color:"#bbb",
        whiteSpace:"nowrap",
        overflow:"hidden",
        textOverflow:"ellipsis",
        maxWidth:180,

    },
    docId:{
        fontSize:11,
        color:"#ccc",
        fontFamily:"monospace",
        marginBottom:16,
    },
    actions:{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        paddingTop:10,
        borderTop:"1px solid #f5f5f5",
    },
    editLink:{
        fontSize:13,
        color:"#111",
        fontWeight:600,
        textDecoration:"none",
    },
    deleteBtn:{
        fontSize:12,
        color:"#c0392b",
        background:"none",
        border:"none",
        cursor:"pointer",
        padding:0,
        fontFamily:"inherit",
    },
    deleteBtnDisabled:{
        fontSize:12,
        color:"#bbb",
        background:"none",
        border:"none",
        cursor:"not-allowed",
        padding:0,
        fontFamily:"inherit",
    },
};