import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Ticket, Users, BarChart3, Bell, Settings, LogOut,
  ChevronRight, SkipForward, RotateCcw, CheckCircle2, PauseCircle, PlayCircle,
  Plus, Search, Trash2, AlertTriangle, Volume2, UserX, Clock,
  TrendingUp, Monitor, X, Check, Menu, ArrowUpDown, Eye, Printer,
  Activity, Zap, ChevronDown
} from "lucide-react";

// ── Design system ─────────────────────────────────────────────────────────────
const T = {
  // Backgrounds
  bg:      "#F8FAFC",
  surface: "#FFFFFF",
  sidebar: "#0F172A",
  sidebarHover: "#1E293B",

  // Text
  h1:    "#0F172A",
  h2:    "#1E293B",
  body:  "#374151",
  muted: "#94A3B8",
  faint: "#CBD5E1",

  // Borders
  border: "#E2E8F0",
  borderStrong: "#CBD5E1",

  // Accent (used sparingly)
  accent:  "#0052FF",
  accentL: "#EEF3FF",

  // Status
  green:  "#10B981",   greenL: "#D1FAE5",
  amber:  "#F59E0B",   amberL: "#FEF3C7",
  red:    "#EF4444",   redL:   "#FEE2E2",
  purple: "#8B5CF6",   purpleL:"#EDE9FE",
};

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED = [
  { id:"B-301", name:"Karim El Mansouri", service:"Consultation",    est:8,  status:"serving",   created:"09:14", counter:"G1" },
  { id:"B-302", name:"Fatima Zahra",      service:"Virement",        est:6,  status:"waiting",   created:"09:17", counter:null },
  { id:"B-303", name:"Youssef Alami",     service:"Crédit",          est:12, status:"waiting",   created:"09:21", counter:null },
  { id:"B-304", name:"Sara Benali",       service:"Carte bancaire",  est:4,  status:"waiting",   created:"09:23", counter:null },
  { id:"B-305", name:"Omar Tazi",         service:"Consultation",    est:8,  status:"waiting",   created:"09:25", counter:null },
  { id:"B-306", name:"Nadia Cherkaoui",   service:"Ouvrir compte",   est:10, status:"skipped",   created:"09:02", counter:null },
  { id:"B-307", name:"Hassan Idrissi",    service:"Réclamation",     est:15, status:"completed", created:"08:45", counter:"G2" },
  { id:"B-308", name:"Lina Moussaoui",    service:"Virement",        est:5,  status:"completed", created:"08:50", counter:"G1" },
  { id:"B-309", name:"Rachid Senhaji",    service:"Crédit",          est:12, status:"cancelled", created:"08:30", counter:null },
  { id:"B-310", name:"Amine Qabli",       service:"Consultation",    est:8,  status:"waiting",   created:"09:28", counter:null },
];

const COUNTERS_SEED = [
  { id:"G1", label:"Guichet 1", staff:"Amina B.",   service:"Banque",         open:true  },
  { id:"G2", label:"Guichet 2", staff:"Yassine M.", service:"Administration", open:true  },
  { id:"G3", label:"Guichet 3", staff:null,          service:"—",              open:false },
];

const STATUS = {
  serving:   { label:"En cours",   textColor:T.accent, bg:T.accentL, dot:T.accent  },
  waiting:   { label:"En attente", textColor:T.amber,  bg:T.amberL,  dot:T.amber   },
  completed: { label:"Terminé",    textColor:T.green,  bg:T.greenL,  dot:T.green   },
  skipped:   { label:"Manquant",   textColor:T.purple, bg:T.purpleL, dot:T.purple  },
  cancelled: { label:"Annulé",     textColor:T.red,    bg:T.redL,    dot:T.red     },
};

const NAV = [
  { id:"dashboard", label:"Dashboard",      icon:LayoutDashboard },
  { id:"queue",     label:"File d'attente", icon:Activity },
  { id:"tickets",   label:"Tickets",        icon:Ticket },
  { id:"counters",  label:"Guichets",       icon:Monitor },
  { id:"analytics", label:"Analytique",     icon:BarChart3 },
  { id:"notifs",    label:"Notifications",  icon:Bell, badge:3 },
  { id:"settings",  label:"Paramètres",     icon:Settings },
];

const SERVICES = ["Consultation","Virement","Crédit","Carte bancaire","Ouvrir compte","Réclamation"];

// ── Utilities ─────────────────────────────────────────────────────────────────
function useClock() {
  const [d, setD] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setD(new Date()), 1000); return () => clearInterval(t); }, []);
  return d;
}

// ── Atoms ─────────────────────────────────────────────────────────────────────
function Badge({ status }) {
  const s = STATUS[status] || STATUS.waiting;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"3px 10px", borderRadius:6,
      fontSize:11, fontWeight:600, letterSpacing:0.2,
      color:s.textColor, background:s.bg,
    }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot, flexShrink:0 }} />
      {s.label}
    </span>
  );
}

function StatCard({ label, value, sub, icon:Icon, iconColor, trend }) {
  return (
    <div style={{
      background:T.surface, borderRadius:12, padding:"18px 20px",
      border:`1px solid ${T.border}`,
      boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <span style={{ fontSize:11, fontWeight:600, color:T.muted, letterSpacing:0.5, textTransform:"uppercase" }}>{label}</span>
        <div style={{ width:30, height:30, borderRadius:8, background:T.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon size={15} color={iconColor || T.muted} />
        </div>
      </div>
      <div style={{ fontSize:28, fontWeight:800, color:T.h1, lineHeight:1, marginBottom:4 }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:T.muted }}>{sub}</div>}
      {trend !== undefined && (
        <div style={{ fontSize:11, fontWeight:600, color:trend >= 0 ? T.green : T.red, marginTop:4 }}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% vs hier
        </div>
      )}
    </div>
  );
}

function Btn({ label, icon:Icon, onClick, variant="default", disabled, size="md" }) {
  const v = {
    primary: { bg:T.accent, color:"#FFF", border:"none", shadow:`0 2px 8px ${T.accent}33` },
    ghost:   { bg:"transparent", color:T.body, border:`1px solid ${T.border}`, shadow:"none" },
    danger:  { bg:T.redL, color:T.red, border:`1px solid ${T.red}33`, shadow:"none" },
    warning: { bg:T.amberL, color:"#92400E", border:`1px solid ${T.amber}44`, shadow:"none" },
    success: { bg:T.greenL, color:"#065F46", border:`1px solid ${T.green}44`, shadow:"none" },
    dark:    { bg:T.h1, color:"#FFF", border:"none", shadow:"0 2px 8px rgba(0,0,0,0.15)" },
  }[variant] || { bg:T.bg, color:T.body, border:`1px solid ${T.border}`, shadow:"none" };

  const pad = size === "lg" ? "13px 22px" : "9px 14px";
  const fz  = size === "lg" ? 14 : 12;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display:"inline-flex", alignItems:"center", gap:6,
        padding:pad, borderRadius:8,
        background:v.bg, color:v.color, border:v.border,
        boxShadow:v.shadow,
        fontWeight:600, fontSize:fz, cursor:disabled ? "not-allowed" : "pointer",
        opacity:disabled ? 0.4 : 1, fontFamily:"inherit",
        transition:"all 0.12s", whiteSpace:"nowrap",
      }}
      onMouseEnter={e => { if(!disabled) e.currentTarget.style.filter="brightness(0.95)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter=""; }}
    >
      {Icon && <Icon size={fz === 14 ? 15 : 13} />}
      {label}
    </button>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, backdropFilter:"blur(4px)" }}>
      <div style={{ background:T.surface, borderRadius:16, padding:28, maxWidth:380, width:"90%", border:`1px solid ${T.border}`, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ width:40, height:40, borderRadius:12, background:T.redL, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
          <AlertTriangle size={20} color={T.red} />
        </div>
        <div style={{ fontSize:16, fontWeight:700, color:T.h1, marginBottom:8 }}>Confirmer l'action</div>
        <div style={{ fontSize:14, color:T.muted, marginBottom:24, lineHeight:1.6 }}>{message}</div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={onConfirm} style={{ flex:1, padding:"10px", background:T.red, border:"none", borderRadius:8, color:"#fff", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Confirmer</button>
          <button onClick={onCancel}  style={{ flex:1, padding:"10px", background:T.bg, border:`1px solid ${T.border}`, borderRadius:8, color:T.body, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

function ToastStack({ toasts, remove }) {
  const icons = { success:<Check size={14}/>, error:<X size={14}/>, warning:<AlertTriangle size={14}/> };
  const colors = { success:T.green, error:T.red, warning:T.amber };
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:999, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background:T.surface, border:`1px solid ${colors[t.type] || T.border}22`,
          borderLeft:`3px solid ${colors[t.type] || T.accent}`,
          borderRadius:10, padding:"12px 16px",
          display:"flex", alignItems:"center", gap:10,
          boxShadow:"0 4px 24px rgba(0,0,0,0.10)",
          animation:"toastIn 0.25s ease", minWidth:280,
        }}>
          <span style={{ color:colors[t.type] }}>{icons[t.type]}</span>
          <span style={{ flex:1, fontSize:13, fontWeight:500, color:T.h2 }}>{t.message}</span>
          <button onClick={() => remove(t.id)} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted, display:"flex", padding:0 }}><X size={13}/></button>
        </div>
      ))}
    </div>
  );
}

function AddModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [svc, setSvc]   = useState("Consultation");
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, backdropFilter:"blur(4px)" }}>
      <div style={{ background:T.surface, borderRadius:16, padding:28, width:380, border:`1px solid ${T.border}`, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div style={{ fontSize:16, fontWeight:700, color:T.h1 }}>Nouveau ticket</div>
          <button onClick={onClose} style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:8, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:T.muted }}><X size={14}/></button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={{ display:"block", fontSize:12, fontWeight:600, color:T.muted, marginBottom:6 }}>NOM DU CLIENT</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex: Mohammed Alami"
              style={{ width:"100%", padding:"10px 12px", border:`1px solid ${T.border}`, borderRadius:8, fontSize:13, color:T.h2, outline:"none", background:T.bg, fontFamily:"inherit" }}
              onFocus={e=>e.target.style.borderColor=T.accent}
              onBlur={e=>e.target.style.borderColor=T.border}
            />
          </div>
          <div>
            <label style={{ display:"block", fontSize:12, fontWeight:600, color:T.muted, marginBottom:6 }}>SERVICE</label>
            <div style={{ position:"relative" }}>
              <select value={svc} onChange={e=>setSvc(e.target.value)}
                style={{ width:"100%", padding:"10px 12px", border:`1px solid ${T.border}`, borderRadius:8, fontSize:13, color:T.h2, outline:"none", background:T.bg, fontFamily:"inherit", appearance:"none", cursor:"pointer" }}>
                {SERVICES.map(s=><option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} color={T.muted} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, marginTop:22 }}>
          <button onClick={()=>onAdd(name,svc)} style={{ flex:1, padding:"11px", background:T.accent, border:"none", borderRadius:8, color:"#fff", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
            <Plus size={14}/> Ajouter
          </button>
          <button onClick={onClose} style={{ padding:"11px 18px", background:T.bg, border:`1px solid ${T.border}`, borderRadius:8, color:T.body, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const clock = useClock();
  const [nav, setNav]               = useState("dashboard");
  const [queue, setQueue]           = useState(SEED);
  const [counters, setCounters]     = useState(COUNTERS_SEED);
  const [paused, setPaused]         = useState(false);
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilter]   = useState("all");
  const [modal, setModal]           = useState(null);
  const [toasts, setToasts]         = useState([]);
  const [collapsed, setCollapsed]   = useState(false);
  const [showAdd, setShowAdd]       = useState(false);

  // Derived
  const serving   = queue.find(q => q.status === "serving");
  const waiting   = queue.filter(q => q.status === "waiting");
  const completed = queue.filter(q => q.status === "completed");
  const skipped   = queue.filter(q => q.status === "skipped");
  const cancelled = queue.filter(q => q.status === "cancelled");
  const load      = waiting.length > 10 ? "overloaded" : waiting.length > 5 ? "busy" : "normal";
  const loadStyle = {
    normal:    { color:T.green,  bg:T.greenL,  label:"Normal"     },
    busy:      { color:T.amber,  bg:T.amberL,  label:"Chargé"     },
    overloaded:{ color:T.red,    bg:T.redL,    label:"Surchargé"  },
  }[load];

  const toast = useCallback((msg, type="success") => {
    const id = Date.now();
    setToasts(t => [...t,{ id, message:msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x=>x.id!==id)), 3500);
  },[]);

  const confirm2 = (msg, fn) => setModal({ message:msg, onConfirm:()=>{ fn(); setModal(null); } });

  // Queue ops
  const callNext = () => {
    if(paused || !waiting.length) return;
    setQueue(q => q.map(x =>
      x.id === waiting[0].id    ? {...x, status:"serving", counter:"G1"} :
      x.id === serving?.id      ? {...x, status:"completed"} : x
    ));
    toast(`Numéro ${waiting[0].id} appelé`, "success");
  };

  const recall   = () => { if(serving) toast(`Numéro ${serving.id} re-appelé`, "success"); };
  const skip     = () => { if(!serving) return; confirm2(`Marquer ${serving.id} comme absent ?`, () => { setQueue(q=>q.map(x=>x.id===serving.id?{...x,status:"skipped"}:x)); toast(`${serving.id} marqué absent`, "warning"); }); };
  const complete = () => { if(!serving) return; setQueue(q=>q.map(x=>x.id===serving.id?{...x,status:"completed"}:x)); toast(`${serving.id} terminé`, "success"); };
  const delTicket = id => confirm2(`Supprimer le ticket ${id} ?`, () => { setQueue(q=>q.filter(x=>x.id!==id)); toast(`Ticket ${id} supprimé`, "error"); });
  const setStatus = (id,s) => { setQueue(q=>q.map(x=>x.id===id?{...x,status:s}:x)); toast("Statut mis à jour","success"); };
  const toggleCtr = id => { setCounters(c=>c.map(x=>x.id===id?{...x,open:!x.open}:x)); const ctr=counters.find(x=>x.id===id); toast(`${ctr.label} ${ctr.open?"fermé":"ouvert"}`, ctr.open?"warning":"success"); };

  const handleAdd = (name, svc) => {
    const n = Math.max(...queue.map(q=>parseInt(q.id.split("-")[1])))+1;
    const id = `B-${n}`;
    setQueue(q=>[...q,{ id, name:name||"—", service:svc, est:8, status:"waiting", created:clock.toLocaleTimeString("fr-MA",{hour:"2-digit",minute:"2-digit"}), counter:null }]);
    setShowAdd(false);
    toast(`Ticket ${id} ajouté`,"success");
  };

  const filtered = queue.filter(q => {
    const q2 = search.toLowerCase();
    return (q.id.toLowerCase().includes(q2)||q.name.toLowerCase().includes(q2)) &&
           (filterStatus==="all"||q.status===filterStatus);
  });

  const sideW = collapsed ? 60 : 220;

  const timeStr  = clock.toLocaleTimeString("fr-MA",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const dateStr  = clock.toLocaleDateString("fr-MA",{weekday:"long",day:"numeric",month:"long"});

  return (
    <div style={{ display:"flex", height:"100vh", background:T.bg, fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", color:T.body, overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:4px;}
        button,input,select{font-family:inherit;}
        @keyframes toastIn{from{opacity:0;transform:translateX(12px);}to{opacity:1;transform:none;}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{
        width:sideW, background:T.sidebar, flexShrink:0,
        display:"flex", flexDirection:"column",
        transition:"width 0.2s ease", overflow:"hidden",
      }}>
        {/* Brand */}
        <div style={{ padding:"20px 16px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width:32, height:32, borderRadius:9, background:T.accent, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:14, color:"#fff", flexShrink:0 }}>W</div>
          {!collapsed && <div><div style={{ fontWeight:700, fontSize:14, color:"#fff" }}>Wa9ti</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:1 }}>Admin Panel</div></div>}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
          {NAV.map(item => {
            const active = nav===item.id;
            return (
              <button key={item.id} onClick={()=>setNav(item.id)} title={collapsed?item.label:undefined} style={{
                width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"9px 10px", borderRadius:8, border:"none", cursor:"pointer",
                background: active ? "rgba(255,255,255,0.10)" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.45)",
                fontWeight: active ? 600 : 400, fontSize:13,
                marginBottom:2, transition:"all 0.12s",
              }}
                onMouseEnter={e=>{if(!active)e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.color="rgba(255,255,255,0.8)";}}
                onMouseLeave={e=>{e.currentTarget.style.background=active?"rgba(255,255,255,0.10)":"transparent";e.currentTarget.style.color=active?"#fff":"rgba(255,255,255,0.45)";}}
              >
                <item.icon size={16} style={{ flexShrink:0 }}/>
                {!collapsed && <span style={{ flex:1, textAlign:"left" }}>{item.label}</span>}
                {!collapsed && item.badge && <span style={{ background:T.red, color:"#fff", borderRadius:20, fontSize:10, fontWeight:700, padding:"1px 6px", lineHeight:"16px" }}>{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding:"10px 8px 16px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <button style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:8, border:"none", cursor:"pointer", background:"transparent", color:"rgba(255,255,255,0.35)", fontSize:13, fontWeight:400 }}
            onMouseEnter={e=>{e.currentTarget.style.color="rgba(255,255,255,0.7)";}}
            onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.35)";}}>
            <LogOut size={16} style={{flexShrink:0}}/>
            {!collapsed && "Déconnexion"}
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* ── Topbar ── */}
        <header style={{
          background:T.surface, borderBottom:`1px solid ${T.border}`,
          padding:"0 24px", height:56,
          display:"flex", alignItems:"center", gap:12, flexShrink:0,
        }}>
          <button onClick={()=>setCollapsed(c=>!c)} style={{ width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", background:"none", border:"none", cursor:"pointer", borderRadius:6, color:T.muted }}
            onMouseEnter={e=>{e.currentTarget.style.background=T.bg;}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";}}>
            <Menu size={18}/>
          </button>

          <div style={{ flex:1 }}>
            <span style={{ fontSize:14, fontWeight:700, color:T.h1 }}>Dashboard</span>
            <span style={{ fontSize:12, color:T.muted, marginLeft:8 }}>Gestion des files · Wa9ti</span>
          </div>

          {/* Clock */}
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:14, fontWeight:700, color:T.h1, fontVariantNumeric:"tabular-nums" }}>{timeStr}</div>
            <div style={{ fontSize:10, color:T.muted }}>{dateStr}</div>
          </div>

          {/* Load badge */}
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px", borderRadius:20, background:loadStyle.bg, color:loadStyle.color, fontSize:12, fontWeight:600 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:loadStyle.color }}/>
            {loadStyle.label}
          </div>

          {/* Divider */}
          <div style={{ width:1, height:24, background:T.border }}/>

          {/* Avatar */}
          <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:T.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff", flexShrink:0 }}>AB</div>
            {!collapsed && <div style={{ display:"flex", flexDirection:"column" }}>
              <span style={{ fontSize:12, fontWeight:600, color:T.h2 }}>Amina Benali</span>
              <span style={{ fontSize:10, color:T.muted }}>Agent · Guichet 1</span>
            </div>}
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:18 }}>

          {/* Alerts */}
          {waiting.length > 8 && (
            <div style={{ background:T.redL, border:`1px solid ${T.red}33`, borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:8 }}>
              <AlertTriangle size={15} color={T.red}/>
              <span style={{ fontSize:13, fontWeight:500, color:T.red }}>File surchargée — {waiting.length} personnes en attente. Envisagez d'ouvrir un guichet supplémentaire.</span>
            </div>
          )}

          {/* KPI row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
            <StatCard label="En Service"          value={serving?.id||"—"} sub={serving?.name}           icon={Zap}         iconColor={T.accent}  />
            <StatCard label="En Attente"          value={waiting.length}   sub={`~${waiting.length*4}min`} icon={Users}       iconColor={T.amber} trend={-8} />
            <StatCard label="Traités Aujourd'hui" value={completed.length} sub="depuis 08:00"             icon={CheckCircle2} iconColor={T.green}  trend={12} />
            <StatCard label="Temps Moyen"         value="7 min"            sub="par client"               icon={Clock}        iconColor={T.muted}   />
            <StatCard label="Manquants"           value={skipped.length}   sub="aujourd'hui"              icon={UserX}        iconColor={T.red}     />
            <StatCard label="Heure de pointe"     value="10h–11h"          sub="prévision"                icon={TrendingUp}   iconColor={T.purple}  />
          </div>

          {/* Main panel row */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:16 }}>

            {/* Current number + actions */}
            <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
              {/* Accent top strip */}
              <div style={{ height:3, background:`linear-gradient(90deg, ${T.accent}, #7B61FF)` }}/>
              <div style={{ padding:"24px 28px" }}>

                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  {/* Left: current */}
                  <div>
                    <div style={{ fontSize:11, fontWeight:600, color:T.muted, letterSpacing:0.6, textTransform:"uppercase", marginBottom:6 }}>Numéro en cours</div>
                    <div style={{ fontSize:64, fontWeight:900, color:T.h1, lineHeight:1, letterSpacing:-2, marginBottom:4 }}>
                      {serving?.id || <span style={{ color:T.faint }}>—</span>}
                    </div>
                    {serving
                      ? <div style={{ fontSize:13, color:T.muted }}>{serving.name} · {serving.service} · <span style={{ color:T.accent, fontWeight:600 }}>{serving.counter}</span></div>
                      : <div style={{ fontSize:13, color:T.faint }}>Aucun client en service</div>
                    }
                  </div>

                  {/* Right: next 3 */}
                  <div style={{ minWidth:160 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:T.muted, letterSpacing:0.6, textTransform:"uppercase", marginBottom:8 }}>Prochains</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {waiting.length === 0
                        ? <div style={{ fontSize:12, color:T.faint, padding:"8px 0" }}>File vide</div>
                        : waiting.slice(0,3).map((t,i) => (
                          <div key={t.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 12px", borderRadius:8, background:i===0?T.accentL:T.bg, border:`1px solid ${i===0?T.accent+"33":T.border}` }}>
                            <span style={{ fontWeight:700, fontSize:13, color:i===0?T.accent:T.h2 }}>{t.id}</span>
                            <span style={{ fontSize:11, color:T.muted }}>{t.est}m</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height:1, background:T.border, margin:"20px 0" }}/>

                {/* Action buttons */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  <Btn label="Numéro Suivant" icon={ChevronRight} onClick={callNext}  variant="dark"    size="lg" disabled={paused||!waiting.length} />
                  <Btn label="Re-appeler"     icon={RotateCcw}    onClick={recall}    variant="ghost"   size="lg" disabled={!serving} />
                  <Btn label="Passer"         icon={SkipForward}  onClick={skip}      variant="warning" size="lg" disabled={!serving} />
                  <Btn label="Terminer"       icon={CheckCircle2} onClick={complete}   variant="success" size="lg" disabled={!serving} />
                  <Btn label={paused?"Reprendre":"Pause"} icon={paused?PlayCircle:PauseCircle} onClick={()=>{setPaused(p=>!p);toast(paused?"File reprise":"File en pause",paused?"success":"warning");}} variant="ghost" size="lg" />
                  <Btn label="Annoncer"       icon={Volume2}      onClick={()=>toast("Annonce diffusée","success")} variant="ghost" size="lg" />
                </div>
              </div>
            </div>

            {/* Counters */}
            <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, padding:20, boxShadow:"0 1px 3px rgba(0,0,0,0.04)", display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.h2, marginBottom:4, display:"flex", alignItems:"center", gap:6 }}>
                <Monitor size={14} color={T.muted}/> Guichets
              </div>
              {counters.map(c => (
                <div key={c.id} style={{ borderRadius:10, padding:"12px 14px", border:`1px solid ${c.open?T.accent+"33":T.border}`, background:c.open?T.accentL:T.bg }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <span style={{ fontWeight:700, fontSize:13, color:T.h1 }}>{c.label}</span>
                    <span style={{ background:c.open?T.greenL:T.redL, color:c.open?T.green:T.red, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>
                      {c.open?"Ouvert":"Fermé"}
                    </span>
                  </div>
                  <div style={{ fontSize:11, color:T.muted, marginBottom:10 }}>{c.staff||"Non assigné"} · {c.service}</div>
                  <button onClick={()=>toggleCtr(c.id)} style={{
                    fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:6, cursor:"pointer", fontFamily:"inherit",
                    background:c.open?T.redL:T.greenL, color:c.open?T.red:T.green,
                    border:`1px solid ${c.open?T.red+"33":T.green+"33"}`,
                  }}>{c.open?"Fermer":"Ouvrir"}</button>
                </div>
              ))}
            </div>
          </div>

          {/* Queue table */}
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
            {/* Table topbar */}
            <div style={{ padding:"14px 20px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${T.border}`, flexWrap:"wrap" }}>
              <span style={{ fontWeight:700, fontSize:14, color:T.h1, flex:1 }}>File d'attente</span>

              {/* Search */}
              <div style={{ display:"flex", alignItems:"center", gap:8, background:T.bg, border:`1px solid ${T.border}`, borderRadius:8, padding:"7px 12px" }}>
                <Search size={13} color={T.muted}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Chercher par nom ou ticket…"
                  style={{ background:"none", border:"none", outline:"none", fontSize:12, color:T.h2, width:200 }}/>
              </div>

              {/* Filter */}
              <div style={{ position:"relative" }}>
                <select value={filterStatus} onChange={e=>setFilter(e.target.value)}
                  style={{ padding:"7px 30px 7px 12px", border:`1px solid ${T.border}`, borderRadius:8, fontSize:12, color:T.h2, background:T.bg, outline:"none", appearance:"none", cursor:"pointer", fontFamily:"inherit" }}>
                  <option value="all">Tous</option>
                  {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </select>
                <ChevronDown size={12} color={T.muted} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
              </div>

              <Btn label="Ajouter" icon={Plus} onClick={()=>setShowAdd(true)} variant="primary"/>
            </div>

            {/* Table */}
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:T.bg }}>
                    {[["Ticket",true],["Nom",false],["Service",false],["Attente",false],["Statut",false],["Créé",false],["Actions",false]].map(([h,sort])=>(
                      <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:10, fontWeight:700, color:T.muted, letterSpacing:0.7, textTransform:"uppercase", whiteSpace:"nowrap", borderBottom:`1px solid ${T.border}` }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:4 }}>{h} {sort&&<ArrowUpDown size={10} color={T.faint}/>}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} style={{ padding:"32px", textAlign:"center", color:T.muted, fontSize:13 }}>
                      <Search size={20} color={T.faint} style={{ display:"block", margin:"0 auto 8px" }}/>
                      Aucun ticket trouvé
                    </td></tr>
                  )}
                  {filtered.map((row, i) => (
                    <tr key={row.id} style={{ borderBottom:`1px solid ${T.border}`, background:row.status==="serving"?T.accentL:"transparent" }}
                      onMouseEnter={e=>{ if(row.status!=="serving") e.currentTarget.style.background=T.bg; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background=row.status==="serving"?T.accentL:"transparent"; }}>
                      <td style={{ padding:"12px 16px", fontWeight:800, fontSize:13, color:row.status==="serving"?T.accent:T.h1 }}>{row.id}</td>
                      <td style={{ padding:"12px 16px", fontSize:13, color:T.h2 }}>{row.name}</td>
                      <td style={{ padding:"12px 16px", fontSize:12, color:T.muted }}>{row.service}</td>
                      <td style={{ padding:"12px 16px", fontSize:12, color:T.muted }}>{row.est} min</td>
                      <td style={{ padding:"12px 16px" }}><Badge status={row.status}/></td>
                      <td style={{ padding:"12px 16px", fontSize:12, color:T.muted, fontVariantNumeric:"tabular-nums" }}>{row.created}</td>
                      <td style={{ padding:"12px 16px" }}>
                        <div style={{ display:"flex", gap:4 }}>
                          {row.status==="waiting"&&<button onClick={()=>setStatus(row.id,"serving")} title="Servir"    style={{ padding:"4px 8px", borderRadius:6, background:T.accentL, border:`1px solid ${T.accent}22`, color:T.accent, cursor:"pointer", display:"flex", fontSize:11 }}><Eye size={13}/></button>}
                          {(row.status==="waiting"||row.status==="serving")&&<button onClick={()=>setStatus(row.id,"skipped")} title="Absent" style={{ padding:"4px 8px", borderRadius:6, background:T.amberL, border:`1px solid ${T.amber}33`, color:T.amber, cursor:"pointer", display:"flex", fontSize:11 }}><UserX size={13}/></button>}
                          {row.status!=="completed"&&row.status!=="cancelled"&&<button onClick={()=>setStatus(row.id,"completed")} title="Terminer" style={{ padding:"4px 8px", borderRadius:6, background:T.greenL, border:`1px solid ${T.green}33`, color:T.green, cursor:"pointer", display:"flex" }}><Check size={13}/></button>}
                          <button onClick={()=>window.print()} title="Imprimer" style={{ padding:"4px 8px", borderRadius:6, background:T.bg, border:`1px solid ${T.border}`, color:T.muted, cursor:"pointer", display:"flex" }}><Printer size={13}/></button>
                          <button onClick={()=>confirm2(`Supprimer le ticket ${row.id} ?`,()=>delTicket(row.id))} title="Supprimer" style={{ padding:"4px 8px", borderRadius:6, background:T.redL, border:`1px solid ${T.red}22`, color:T.red, cursor:"pointer", display:"flex" }}><Trash2 size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding:"10px 20px", borderTop:`1px solid ${T.border}`, display:"flex", gap:16 }}>
              {[["total",filtered.length,"Tickets"],["waiting",waiting.length,"En attente"],["completed",completed.length,"Traités"],["skipped",skipped.length,"Manquants"]].map(([k,v,l])=>(
                <span key={k} style={{ fontSize:11, color:T.muted }}><strong style={{ color:T.h2 }}>{v}</strong> {l}</span>
              ))}
            </div>
          </div>

          {/* Analytics */}
          <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, padding:20, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontWeight:700, fontSize:14, color:T.h1, marginBottom:16, display:"flex", alignItems:"center", gap:6 }}>
              <BarChart3 size={15} color={T.muted}/> Analytique du Jour
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, marginBottom:20 }}>
              {[
                { label:"Clients traités",    value:completed.length, color:T.green  },
                { label:"Durée moy. service", value:"7 min",          color:T.accent },
                { label:"Heure de pointe",    value:"10h–11h",        color:T.amber  },
                { label:"Manquants",          value:skipped.length,   color:T.purple },
                { label:"Annulations",        value:cancelled.length, color:T.red    },
                { label:"Taux de service",    value:`${Math.round((completed.length/Math.max(queue.length,1))*100)}%`, color:T.green },
              ].map((s,i)=>(
                <div key={i} style={{ padding:"14px 16px", borderRadius:10, border:`1px solid ${T.border}`, background:T.bg, textAlign:"center" }}>
                  <div style={{ fontSize:22, fontWeight:800, color:s.color, marginBottom:4 }}>{s.value}</div>
                  <div style={{ fontSize:11, color:T.muted, fontWeight:500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div style={{ fontSize:11, fontWeight:700, color:T.muted, letterSpacing:0.6, textTransform:"uppercase", marginBottom:10 }}>Distribution horaire</div>
            <div style={{ display:"flex", gap:4, alignItems:"flex-end", height:56 }}>
              {[2,4,6,3,9,12,10,7,5,4,3,2].map((v,i)=>(
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div style={{ width:"100%", height:`${(v/12)*100}%`, background:i===4?T.accent:`${T.accent}30`, borderRadius:"3px 3px 0 0", minHeight:3, transition:"height 0.3s" }}/>
                  <span style={{ fontSize:9, color:T.faint }}>{8+i}h</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      {showAdd && <AddModal onAdd={handleAdd} onClose={()=>setShowAdd(false)}/>}
      {modal && <ConfirmModal message={modal.message} onConfirm={modal.onConfirm} onCancel={()=>setModal(null)}/>}
      <ToastStack toasts={toasts} remove={id=>setToasts(t=>t.filter(x=>x.id!==id))}/>
    </div>
  );
}
