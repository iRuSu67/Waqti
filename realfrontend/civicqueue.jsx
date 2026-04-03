import { useState, useEffect, useRef } from "react";

// ── Icons (inline SVGs to avoid import issues) ──────────────────────────────
const Icon = {
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Ticket: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
  Map: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  Profile: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Bell: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  QR: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="6" y="6" width="1" height="1"/><rect x="17" y="6" width="1" height="1"/><rect x="6" y="17" width="1" height="1"/><path d="M14 14h3v3"/><path d="M17 21h3v-3"/><path d="M14 21h3"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Navigation: () => <svg viewBox="0 0 24 24" fill="none" stroke="#3B5BFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>,
  History: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5"/></svg>,
  Cancel: () => <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Queue: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Counter: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Analytics: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M20 12h2M2 12h2M12 20v2M12 2v2"/></svg>,
  Support: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Torch: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4a6 6 0 0 1 12 0"/><line x1="6" y1="10" x2="18" y2="10"/></svg>,
  Services: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Chevron: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>,
  Back: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="15 18 9 12 15 6"/></svg>,
  Dots: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>,
  Lightning: () => <svg viewBox="0 0 24 24" fill="#22c55e" stroke="#22c55e" strokeWidth={1} className="w-3 h-3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  TrendDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  Info: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth={1} className="w-4 h-4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Recall: () => <svg viewBox="0 0 24 24" fill="none" stroke="#3B5BFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="#3B5BFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Building: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M3 9h6"/><path d="M3 15h6"/><path d="M3 12h6"/><path d="M15 3h6"/><rect x="12" y="12" width="9" height="9"/></svg>,
};

// ── Sparkline Chart ──────────────────────────────────────────────────────────
function SparklineChart({ data, color = "#3B5BFF", height = 80 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 300, h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 10) - 5;
    return `${x},${y}`;
  }).join(" ");
  const areaPath = `M0,${h} L${pts.split(" ").map(p => p).join(" L")} L${w},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={`M0,${h} L${pts.split(" ").map(p => p).join(" L")} L${w},${h} Z`} fill="url(#sparkGrad)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => {
        if (v === max) {
          const x = (i / (data.length - 1)) * w;
          const y = h - ((v - min) / (max - min || 1)) * (h - 10) - 5;
          return <circle key={i} cx={x} cy={y} r="4" fill={color} />;
        }
      })}
    </svg>
  );
}

// ── Phone Shell ──────────────────────────────────────────────────────────────
function PhoneShell({ children }) {
  return (
    <div className="flex items-start justify-center" style={{ minHeight: "100vh", padding: "24px 0" }}>
      <div style={{
        width: 375,
        minHeight: 812,
        background: "#F0F2FA",
        borderRadius: 44,
        boxShadow: "0 30px 80px rgba(0,0,0,0.35), 0 0 0 2px #d1d5db",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Status bar */}
        <div style={{ background: "transparent", padding: "14px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "inherit" }}>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <svg width="16" height="12" viewBox="0 0 16 12"><rect x="0" y="3" width="3" height="9" rx="1" fill="currentColor" opacity="0.4"/><rect x="4.5" y="2" width="3" height="10" rx="1" fill="currentColor" opacity="0.6"/><rect x="9" y="0" width="3" height="12" rx="1" fill="currentColor"/><rect x="13.5" y="1" width="2" height="10" rx="1" fill="currentColor" opacity="0.3"/></svg>
            <svg width="16" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 8.5a13 13 0 0 1 21 0M5 12a10 10 0 0 1 14 0M8.5 15.5a6 6 0 0 1 7 0M12 19h.01"/></svg>
            <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0" y="1" width="22" height="10" rx="3" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4"/><rect x="1.5" y="2.5" width="18" height="7" rx="2" fill="currentColor"/><path d="M23 4v4a2 2 0 0 0 0-4z" fill="currentColor" opacity="0.5"/></svg>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 1: Citizen Home
// ══════════════════════════════════════════════════════════════════════════════
function CitizenHome({ onNav }) {
  const nearbyServices = [
    { name: "City Hall", type: "Public Records", dist: "0.8 miles away", wait: "5 min wait", queue: 12, status: "OPEN", color: "#22c55e", icon: "🏛️" },
    { name: "Licensing Bureau", type: "Driver Services", dist: "1.2 miles away", wait: "15 min wait", queue: 28, status: "OPEN", color: "#22c55e", icon: "🪪" },
    { name: "Postal Center", type: "Shipping", dist: "2.5 miles away", wait: "Opens at 8:00 AM Tomorrow", queue: null, status: "CLOSED", color: "#ef4444", icon: "📮" },
  ];

  return (
    <PhoneShell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", color: "#1e293b" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #2D4FE0 0%, #3B5BFF 100%)", padding: "56px 20px 28px", color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
              <div>
                <div style={{ fontSize: 11, opacity: 0.75, letterSpacing: 0.3 }}>Welcome back</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>Good Morning, Alex</div>
              </div>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon.Search />
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon.Search />
            <span style={{ opacity: 0.7, fontSize: 14 }}>Search for services...</span>
            <div style={{ marginLeft: "auto", opacity: 0.7 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 16px 0" }}>
          {/* Active Ticket */}
          <div style={{ background: "white", borderRadius: 16, padding: 16, marginBottom: 20, borderLeft: "4px solid #8B5CF6", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 10, letterSpacing: 1, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>CURRENT ACTIVE TICKET</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>Licensing Bureau</div>
                <div style={{ color: "#3B5BFF", fontWeight: 600, fontSize: 13 }}>#A-492 • In Progress</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", animation: "pulse 1.5s infinite" }} />
                  <span style={{ fontSize: 12, color: "#475569" }}>Estimated wait: 2 mins</span>
                </div>
              </div>
              <div style={{ background: "#EEF2FF", borderRadius: 12, padding: "10px 12px" }}>
                <Icon.Ticket />
              </div>
            </div>
          </div>

          {/* Nearby Services */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Nearby Services</div>
            <div style={{ color: "#3B5BFF", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>See all</div>
          </div>

          {nearbyServices.map((svc, i) => (
            <div key={i} style={{ background: "white", borderRadius: 16, padding: 14, marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", opacity: svc.status === "CLOSED" ? 0.65 : 1 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: svc.status === "CLOSED" ? "#f1f5f9" : "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {svc.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{svc.name}</div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: svc.status === "OPEN" ? "#22c55e" : "#ef4444", border: `1px solid ${svc.status === "OPEN" ? "#bbf7d0" : "#fecaca"}`, borderRadius: 6, padding: "2px 7px", background: svc.status === "OPEN" ? "#f0fdf4" : "#fff1f2" }}>{svc.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{svc.dist} • {svc.type}</div>
                  {svc.queue !== null ? (
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth={2} className="w-3 h-3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{svc.wait}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth={2} className="w-3 h-3"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{svc.queue} in queue</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: "#64748b" }}>{svc.wait}</div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Bottom Shortcuts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 6, marginBottom: 24 }}>
            <div style={{ background: "white", borderRadius: 16, padding: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", cursor: "pointer" }}>
              <Icon.Calendar />
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>Schedule Appointment</div>
            </div>
            <div style={{ background: "white", borderRadius: 16, padding: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", cursor: "pointer" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5"/></svg>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>Recent Activity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ background: "white", borderTop: "1px solid #f1f5f9", padding: "10px 0 20px", display: "flex", justifyContent: "space-around" }}>
        {[
          { label: "Home", icon: <Icon.Home />, active: true, screen: "citizen-home" },
          { label: "Services", icon: <Icon.Services />, active: false, screen: "scanner" },
          { label: "Profile", icon: <Icon.Profile />, active: false, screen: "citizen-home" },
        ].map((item, i) => (
          <button key={i} onClick={() => onNav(item.screen)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", color: item.active ? "#3B5BFF" : "#94a3b8", padding: "4px 16px" }}>
            {item.icon}
            <span style={{ fontSize: 10, fontWeight: item.active ? 700 : 400 }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* QR FAB */}
      <div onClick={() => onNav("scanner")} style={{ position: "absolute", bottom: 68, right: 20, width: 52, height: 52, borderRadius: 16, background: "#3B5BFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 8px 24px rgba(59,91,255,0.4)", color: "white", zIndex: 20 }}>
        <Icon.QR />
      </div>
    </PhoneShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 2: Citizen Ticket View (Civic Services)
// ══════════════════════════════════════════════════════════════════════════════
function CitizenTicket({ onNav }) {
  const [cancelled, setCancelled] = useState(false);
  const progress = (4 / 12) * 100;

  return (
    <PhoneShell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* Dark header */}
        <div style={{ background: "#0F172A", padding: "52px 20px 48px", color: "white", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <button onClick={() => onNav("citizen-home")} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: "6px 8px", color: "white", cursor: "pointer" }}><Icon.Back /></button>
            <span style={{ fontWeight: 700, fontSize: 17 }}>Civic Services</span>
            <button style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Icon.Dots /></button>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: 1.5, fontWeight: 600, marginBottom: 14 }}>CURRENT TICKET</div>
            <div style={{
              width: 140, height: 140, background: "white", borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}>
              <span style={{ fontSize: 64, fontWeight: 900, color: "#0F172A", fontFamily: "'SF Pro Display', system-ui" }}>59</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "white" }}>Mon ticket</div>
          </div>
          {/* Wave */}
          <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 30, background: "#F0F2FA", borderRadius: "50% 50% 0 0 / 30px 30px 0 0" }} />
        </div>

        <div style={{ padding: "8px 16px 16px" }}>
          {/* Queue Status Card */}
          <div style={{ background: "white", borderRadius: 20, padding: 18, marginBottom: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 2 }}>Queue Status</div>
                <div style={{ fontWeight: 800, fontSize: 20 }}>4th of 12</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "4px 10px" }}>
                <Icon.Lightning />
                <span style={{ color: "#16a34a", fontWeight: 700, fontSize: 12 }}>ACTIVE</span>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height: 8, background: "#e2e8f0", borderRadius: 10, marginTop: 12, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #3B5BFF, #60a5fa)", borderRadius: 10, transition: "width 1s ease" }} />
            </div>

            {/* AI Wait */}
            <div style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)", borderRadius: 14, padding: "14px 18px", marginTop: 14, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: 8 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-6 h-6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>AI EST. WAIT</div>
                <div style={{ color: "white", fontWeight: 900, fontSize: 28 }}>18 mins</div>
              </div>
              <div style={{ marginLeft: "auto", color: "white", opacity: 0.8 }}>✦</div>
            </div>
          </div>

          {/* Service info */}
          <div style={{ background: "white", borderRadius: 20, padding: 18, marginBottom: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ width: 40, height: 40, background: "#EEF2FF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#3B5BFF" strokeWidth={2} className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>SERVICE</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Passport Renewal</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0 0" }}>
              <div style={{ width: 40, height: 40, background: "#FEF3C7", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth={2} className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M3 9h6"/><path d="M3 15h6"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>LOCATION</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Central Bureau</div>
              </div>
            </div>
          </div>

          {/* Live Update */}
          <div style={{ background: "white", borderRadius: 20, padding: 18, marginBottom: 14, borderLeft: "4px solid #8B5CF6", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 11, color: "#8B5CF6", fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>LIVE UPDATE</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#334155" }}>
              Wait time is decreasing faster than usual.
              <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" style={{ flexShrink: 0 }}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
            </div>
          </div>

          {/* Cancel */}
          {!cancelled ? (
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <button onClick={() => setCancelled(true)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontWeight: 700, fontSize: 16 }}>
                <Icon.Cancel /> Cancel Ticket
              </button>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>By cancelling, you will lose your position in the current queue.</div>
            </div>
          ) : (
            <div style={{ textAlign: "center", background: "#fef2f2", borderRadius: 14, padding: 16, marginBottom: 20, color: "#ef4444" }}>
              <div style={{ fontWeight: 700 }}>Ticket Cancelled</div>
              <div style={{ fontSize: 12, marginTop: 4, color: "#64748b" }}>You have been removed from the queue.</div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ background: "white", borderTop: "1px solid #f1f5f9", padding: "10px 0 20px", display: "flex", justifyContent: "space-around" }}>
        {[
          { label: "Home", icon: <Icon.Home />, active: false, screen: "citizen-home" },
          { label: "Tickets", icon: <Icon.Ticket />, active: true, screen: "citizen-ticket" },
          { label: "Map", icon: <Icon.Map />, active: false, screen: "citizen-ticket" },
          { label: "Profile", icon: <Icon.Profile />, active: false, screen: "citizen-ticket" },
        ].map((item, i) => (
          <button key={i} onClick={() => onNav(item.screen)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", color: item.active ? "#3B5BFF" : "#94a3b8", padding: "4px 12px" }}>
            {item.icon}
            <span style={{ fontSize: 10, fontWeight: item.active ? 700 : 400 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </PhoneShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 3: CivicQueue Citizen Status
// ══════════════════════════════════════════════════════════════════════════════
function CitizenQueue({ onNav }) {
  return (
    <PhoneShell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", color: "#1e293b" }}>
        {/* Header */}
        <div style={{ padding: "54px 20px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>😊</div>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#1e293b" }}>CivicQueue</span>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ width: 10, height: 10, background: "#ef4444", borderRadius: "50%", position: "absolute", top: -2, right: -2, border: "2px solid #F0F2FA", zIndex: 1 }} />
            <Icon.Bell />
          </div>
        </div>

        <div style={{ padding: "0 16px 24px" }}>
          {/* Urgent Alert */}
          <div style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", borderRadius: 18, padding: 16, marginBottom: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 12, padding: 8, flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth={1.5} className="w-6 h-6"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <div style={{ color: "white" }}>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4, lineHeight: 1.3 }}>Your turn is in 15 minutes! Please head to the main desk</div>
              <div style={{ background: "rgba(255,255,255,0.25)", display: "inline-block", borderRadius: 6, padding: "3px 10px", fontSize: 10, fontWeight: 700, letterSpacing: 0.8 }}>URGENT ACTION</div>
            </div>
          </div>

          {/* Queue Status Card */}
          <div style={{ background: "#1E293B", borderRadius: 24, padding: 24, marginBottom: 16, color: "white", backgroundImage: "radial-gradient(circle at 80% 20%, rgba(59,91,255,0.15) 0%, transparent 60%)" }}>
            <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: 1.5, fontWeight: 600, marginBottom: 16, textAlign: "center" }}>CURRENT QUEUE STATUS</div>
            <div style={{ fontSize: 100, fontWeight: 900, textAlign: "center", lineHeight: 1, marginBottom: 8, fontFamily: "'SF Pro Display', system-ui" }}>59</div>
            <div style={{ fontSize: 14, color: "#94a3b8", textAlign: "center", marginBottom: 24 }}>Your Ticket Number</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 1, fontWeight: 600, marginBottom: 6 }}>QUEUE SIZE</div>
                <div style={{ fontWeight: 800, fontSize: 22 }}>12 People</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 1, fontWeight: 600, marginBottom: 6 }}>EST. WAIT</div>
                <div style={{ fontWeight: 800, fontSize: 22 }}>~ 14m</div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div style={{ background: "white", borderRadius: 16, padding: 16, marginBottom: 14, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: "4px solid #8B5CF6" }}>
            <div style={{ width: 38, height: 38, background: "#F5F3FF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth={2} className="w-5 h-5"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Main Desk Location</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>East Wing, Floor 2, Counter 4</div>
            </div>
            <Icon.Navigation />
          </div>

          {/* Actions */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div style={{ background: "white", borderRadius: 16, padding: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", cursor: "pointer" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5"/></svg>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>Queue Log</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>View past visits</div>
            </div>
            <div onClick={() => onNav("scanner")} style={{ background: "#3B5BFF", borderRadius: 16, padding: 18, cursor: "pointer" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="6" y="6" width="1" height="1"/><rect x="17" y="6" width="1" height="1"/><rect x="6" y="17" width="1" height="1"/></svg>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10, color: "white" }}>Check-in</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Scan at counter</div>
            </div>
          </div>

          {/* Help Text */}
          <div style={{ background: "white", borderRadius: 14, padding: 14, display: "flex", gap: 10, alignItems: "flex-start", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-5 h-5" style={{ flexShrink: 0, marginTop: 1 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>Need assistance finding the counter? Tap the navigation icon or speak to a queue marshal at the entrance.</div>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ background: "white", borderTop: "1px solid #f1f5f9", padding: "10px 0 20px", display: "flex", justifyContent: "space-around" }}>
        {[
          { label: "Home", icon: <Icon.Home />, active: false, screen: "citizen-home" },
          { label: "My Queue", icon: <Icon.Queue />, active: true, screen: "citizen-queue" },
          { label: "History", icon: <Icon.History />, active: false, screen: "citizen-queue" },
          { label: "Profile", icon: <Icon.Profile />, active: false, screen: "citizen-queue" },
        ].map((item, i) => (
          <button key={i} onClick={() => onNav(item.screen)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", color: item.active ? "#3B5BFF" : "#94a3b8", padding: "4px 8px" }}>
            <div style={{ background: item.active ? "#EEF2FF" : "transparent", borderRadius: 20, padding: item.active ? "6px 16px" : "4px 12px" }}>
              {item.icon}
            </div>
            <span style={{ fontSize: 10, fontWeight: item.active ? 700 : 400 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </PhoneShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 4: QR Scanner
// ══════════════════════════════════════════════════════════════════════════════
function QRScanner({ onNav }) {
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setScanLine(p => (p + 2) % 100), 20);
    return () => clearInterval(id);
  }, []);

  return (
    <PhoneShell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "50px 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#3B5BFF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#1e293b" }}>QueueMa</span>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>👩‍💼</div>
        </div>

        {/* Camera View */}
        <div style={{ flex: 1, background: "linear-gradient(160deg, #1a2744 0%, #2d3f6b 50%, #1a2744 100%)", position: "relative", overflow: "hidden" }}>
          {/* Scan overlay */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Dimmed overlay */}
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />

            {/* Scanner frame */}
            <div style={{ position: "relative", width: 240, height: 240, zIndex: 2 }}>
              {/* Clear area */}
              <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.04)", borderRadius: 20 }} />

              {/* Corner brackets */}
              {[
                { top: 0, left: 0, borderTop: "3px solid #2DCFBE", borderLeft: "3px solid #2DCFBE", borderRadius: "20px 0 0 0" },
                { top: 0, right: 0, borderTop: "3px solid #2DCFBE", borderRight: "3px solid #2DCFBE", borderRadius: "0 20px 0 0" },
                { bottom: 0, left: 0, borderBottom: "3px solid #2DCFBE", borderLeft: "3px solid #2DCFBE", borderRadius: "0 0 0 20px" },
                { bottom: 0, right: 0, borderBottom: "3px solid #2DCFBE", borderRight: "3px solid #2DCFBE", borderRadius: "0 0 20px 0" },
              ].map((style, i) => (
                <div key={i} style={{ position: "absolute", width: 32, height: 32, ...style }} />
              ))}

              {/* Scanning line */}
              <div style={{
                position: "absolute",
                left: 10,
                right: 10,
                height: 2,
                background: "linear-gradient(90deg, transparent, #2DCFBE, transparent)",
                top: `${scanLine}%`,
                boxShadow: "0 0 8px #2DCFBE",
              }} />

              {/* QR placeholder */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2 }}>
                <svg viewBox="0 0 100 100" className="w-20 h-20" fill="white">
                  <rect x="5" y="5" width="35" height="35" rx="4" stroke="white" strokeWidth="4" fill="none"/>
                  <rect x="12" y="12" width="21" height="21" fill="white"/>
                  <rect x="60" y="5" width="35" height="35" rx="4" stroke="white" strokeWidth="4" fill="none"/>
                  <rect x="67" y="12" width="21" height="21" fill="white"/>
                  <rect x="5" y="60" width="35" height="35" rx="4" stroke="white" strokeWidth="4" fill="none"/>
                  <rect x="12" y="67" width="21" height="21" fill="white"/>
                  <rect x="60" y="60" width="8" height="8" fill="white"/>
                  <rect x="72" y="60" width="8" height="8" fill="white"/>
                  <rect x="84" y="60" width="11" height="8" fill="white"/>
                  <rect x="60" y="72" width="8" height="8" fill="white"/>
                  <rect x="72" y="72" width="8" height="8" fill="white"/>
                  <rect x="60" y="84" width="8" height="11" fill="white"/>
                  <rect x="72" y="84" width="23" height="11" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sheet */}
        <div style={{ background: "white", borderRadius: "28px 28px 0 0", padding: "8px 24px 0", marginTop: -24, position: "relative", zIndex: 10 }}>
          <div style={{ width: 40, height: 4, background: "#e2e8f0", borderRadius: 10, margin: "8px auto 20px" }} />
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, lineHeight: 1.3 }}>Scan the service desk code to take your ticket.</div>
            <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>Align the QR code within the frame to automatically check-in to your appointment.</div>
          </div>
          <button
            onClick={() => setTorchOn(!torchOn)}
            style={{
              width: "100%",
              background: torchOn ? "#FEF3C7" : "linear-gradient(135deg, #3B5BFF, #60a5fa)",
              color: torchOn ? "#d97706" : "white",
              border: "none",
              borderRadius: 14,
              padding: "15px 20px",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 8,
            }}>
            <Icon.Torch /> {torchOn ? "Turn off light" : "Turn on light"}
          </button>
        </div>

        {/* Bottom Nav */}
        <div style={{ background: "white", padding: "10px 0 20px", display: "flex", justifyContent: "space-around" }}>
          {[
            { label: "HOME", icon: <Icon.Home />, active: false, screen: "citizen-home" },
            { label: "SERVICES", icon: <Icon.Services />, active: false, screen: "citizen-home" },
            { label: "SCANNER", icon: <Icon.QR />, active: true, screen: "scanner" },
            { label: "PROFILE", icon: <Icon.Profile />, active: false, screen: "citizen-home" },
          ].map((item, i) => (
            <button key={i} onClick={() => onNav(item.screen)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: item.active ? "#3B5BFF" : "none", border: "none", cursor: "pointer", color: item.active ? "white" : "#94a3b8", padding: item.active ? "8px 20px" : "4px 12px", borderRadius: item.active ? 16 : 0 }}>
              {item.icon}
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.5 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 5: Staff Mobile (CivicLink Utility)
// ══════════════════════════════════════════════════════════════════════════════
function StaffMobile({ onNav }) {
  const [currentTicket, setCurrentTicket] = useState("A-204");
  const [tickets] = useState([
    { id: "A-205", service: "Passport Renewal", queue: "Express", wait: "02:15" },
    { id: "B-092", service: "Residency Permit", queue: "General", wait: "04:40" },
    { id: "A-206", service: "Visa Verification", queue: "Express", wait: "06:12" },
    { id: "C-114", service: "Notary Services", queue: "Business", wait: "12:35" },
  ]);

  const ticketColors = { A: "#3B5BFF", B: "#8B5CF6", C: "#f59e0b" };

  return (
    <PhoneShell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ padding: "50px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#3B5BFF" strokeWidth={2} className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M3 9h6"/></svg>
            <span style={{ fontWeight: 800, fontSize: 19, color: "#1e293b" }}>CivicLink Utility</span>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
        </div>

        <div style={{ padding: "0 16px 24px" }}>
          {/* Priority Card */}
          <div style={{
            background: "linear-gradient(135deg, #2D4FE0 0%, #4F6EFF 60%, #6B84FF 100%)",
            borderRadius: 22,
            padding: "24px 22px",
            color: "white",
            marginBottom: 16,
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
            <div style={{ position: "absolute", bottom: -30, left: 40, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.75, fontWeight: 600, marginBottom: 6 }}>CURRENT PRIORITY</div>
            <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: -2, marginBottom: 16, fontFamily: "'SF Pro Display', system-ui" }}>{currentTicket}</div>
            <button
              onClick={() => setCurrentTicket("A-205")}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1.5px solid rgba(255,255,255,0.35)",
                borderRadius: 12,
                padding: "10px 20px",
                color: "white",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                backdropFilter: "blur(10px)",
              }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2"/><path d="M19 13v6"/></svg>
              Call Next Number
            </button>
          </div>

          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>AVG WAIT</div>
              <div style={{ fontWeight: 800, fontSize: 26 }}>3.7 <span style={{ fontSize: 14, fontWeight: 500, color: "#64748b" }}>min</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                <Icon.TrendDown />
                <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>12%</span>
              </div>
            </div>
            <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>TOTAL SERVED</div>
              <div style={{ fontWeight: 800, fontSize: 26 }}>1,162</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Today's Performance</div>
            </div>
          </div>

          {/* Active Tickets */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Active Tickets</div>
            <div style={{ background: "#EEF2FF", color: "#3B5BFF", fontWeight: 700, fontSize: 11, borderRadius: 20, padding: "4px 12px" }}>12 Waiting</div>
          </div>

          {tickets.map((ticket, i) => (
            <div key={i} style={{ background: "white", borderRadius: 16, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ background: `${ticketColors[ticket.id[0]]}15`, borderRadius: 10, padding: "8px 10px", minWidth: 56, textAlign: "center" }}>
                <span style={{ color: ticketColors[ticket.id[0]], fontWeight: 800, fontSize: 13 }}>{ticket.id}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{ticket.service}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Queue: {ticket.queue}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{ticket.wait}</div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>Wait Time</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ background: "white", borderTop: "1px solid #f1f5f9", padding: "10px 0 20px", display: "flex", justifyContent: "space-around" }}>
        {[
          { label: "Dashboard", icon: <Icon.Dashboard />, active: false, screen: "admin" },
          { label: "Live Queues", icon: <Icon.Queue />, active: true },
          { label: "Reports", icon: <Icon.Analytics />, active: false },
          { label: "Settings", icon: <Icon.Settings />, active: false },
        ].map((item, i) => (
          <button key={i} onClick={() => item.screen && onNav(item.screen)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", color: item.active ? "#3B5BFF" : "#94a3b8", padding: "4px 10px" }}>
            {item.icon}
            <span style={{ fontSize: 9, fontWeight: item.active ? 700 : 400 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </PhoneShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 6: Admin Web Dashboard
// ══════════════════════════════════════════════════════════════════════════════
function AdminDashboard({ onNav }) {
  const [serving, setServing] = useState("A-204");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(false);

  const trafficData = [42, 65, 88, 72, 95, 110, 142, 130, 118, 105, 95, 88];

  const queueItems = [
    { ticket: "A-205", service: "Identity Services", wait: "12 min" },
    { ticket: "B-112", service: "Business Permit", wait: "08 min" },
    { ticket: "A-206", service: "Identity Services", wait: "05 min" },
    { ticket: "C-409", service: "Tax Consultation", wait: "02 min" },
    { ticket: "A-207", service: "Identity Services", wait: "Just Now" },
    { ticket: "B-113", service: "Business Permit", wait: "Just Now" },
  ];

  const ticketColor = (t) => ({ A: "#3B5BFF", B: "#8B5CF6", C: "#f59e0b" }[t[0]] || "#64748b");

  const bg = darkMode ? "#0f172a" : "#F0F4FF";
  const card = darkMode ? "#1e293b" : "white";
  const text = darkMode ? "#e2e8f0" : "#1e293b";
  const sub = darkMode ? "#64748b" : "#94a3b8";
  const border = darkMode ? "#334155" : "#f1f5f9";

  return (
    <div style={{ display: "flex", height: "100vh", background: bg, fontFamily: "'SF Pro Display', 'Segoe UI', system-ui, sans-serif", transition: "background 0.3s" }}>
      {/* Sidebar */}
      <div style={{ width: 200, background: card, borderRight: `1px solid ${border}`, display: "flex", flexDirection: "column", padding: "28px 0", transition: "background 0.3s" }}>
        <div style={{ padding: "0 20px 28px" }}>
          <div style={{ fontWeight: 900, fontSize: 18, color: "#3B5BFF" }}>CivicQueue</div>
          <div style={{ fontSize: 11, color: sub, marginTop: 2 }}>District Hub 04</div>
        </div>

        <div style={{ flex: 1, padding: "0 10px" }}>
          {[
            { label: "Dashboard", icon: <Icon.Dashboard /> },
            { label: "Live Queues", icon: <Icon.Queue /> },
            { label: "Counters", icon: <Icon.Counter /> },
            { label: "Analytics", icon: <Icon.Analytics /> },
            { label: "Settings", icon: <Icon.Settings /> },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                marginBottom: 4,
                background: activeNav === item.label ? "#EEF2FF" : "transparent",
                color: activeNav === item.label ? "#3B5BFF" : sub,
                fontWeight: activeNav === item.label ? 700 : 400,
                fontSize: 14,
                transition: "all 0.15s",
                textAlign: "left",
              }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "0 10px" }}>
          {[
            { label: "Support", icon: <Icon.Support /> },
            { label: "Logout", icon: <Icon.Logout /> },
          ].map((item) => (
            <button key={item.label} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 4, background: "transparent", color: sub, fontSize: 14, textAlign: "left" }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{ background: card, borderBottom: `1px solid ${border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, transition: "background 0.3s" }}>
          <div style={{ flex: 1, background: bg, borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, color: sub }}>
            <Icon.Search />
            <span style={{ fontSize: 13 }}>Search queues or citizens...</span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: sub }}><Icon.Bell /></button>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: sub }}><Icon.History /></button>
            <button onClick={() => setDarkMode(!darkMode)} style={{ background: "none", border: "none", cursor: "pointer", color: sub }}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: text }}>Admin Smith</span>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#3B5BFF", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 700 }}>AS</div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, marginBottom: 20 }}>

            {/* Left Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Call Next Number */}
              <div style={{
                background: "linear-gradient(135deg, #2D4FE0 0%, #4F6EFF 60%, #6B84FF 100%)",
                borderRadius: 20,
                padding: "28px 32px",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ position: "absolute", right: -30, top: -30, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
                <div>
                  <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: -0.5 }}>Call Next Number</div>
                  <div style={{ marginTop: 8, opacity: 0.8, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    Currently Serving:
                    <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "3px 12px", fontWeight: 700 }}>{serving}</span>
                  </div>
                </div>
                <button
                  onClick={() => setServing("A-205")}
                  style={{ background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 14, padding: "12px 24px", color: "white", fontWeight: 700, cursor: "pointer", fontSize: 15, backdropFilter: "blur(10px)", flexShrink: 0 }}>
                  → Call Next
                </button>
              </div>

              {/* Queue Table */}
              <div style={{ background: card, borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "background 0.3s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ fontWeight: 800, fontSize: 17, color: text }}>Active Queue List</div>
                  <div style={{ background: "#EEF2FF", color: "#3B5BFF", fontWeight: 700, fontSize: 12, borderRadius: 20, padding: "4px 14px" }}>42 WAITING</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 100px 80px", gap: 0, borderBottom: `1px solid ${border}`, paddingBottom: 10, marginBottom: 4 }}>
                  {["TICKET", "SERVICE TYPE", "WAIT TIME", "ACTION"].map((h, i) => (
                    <div key={i} style={{ fontSize: 11, color: sub, fontWeight: 700, letterSpacing: 0.8, padding: "0 12px" }}>{h}</div>
                  ))}
                </div>

                {queueItems.map((item, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 1fr 100px 80px", borderBottom: `1px solid ${border}`, padding: "12px 0" }}>
                    <div style={{ padding: "0 12px" }}>
                      <span style={{ color: ticketColor(item.ticket), fontWeight: 700, fontSize: 14 }}>{item.ticket}</span>
                    </div>
                    <div style={{ padding: "0 12px", fontSize: 14, color: text }}>{item.service}</div>
                    <div style={{ padding: "0 12px", fontSize: 14, color: text }}>{item.wait}</div>
                    <div style={{ padding: "0 12px" }}>
                      <button style={{ background: "none", border: "none", color: "#3B5BFF", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <Icon.Recall /> RECALL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Performance */}
              <div style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderRadius: 20, padding: 22, color: "white" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 11, letterSpacing: 1.5, fontWeight: 700, opacity: 0.8 }}>PERFORMANCE INDEX</div>
                  <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                </div>
                <div style={{ fontWeight: 900, fontSize: 40, marginBottom: 4 }}>3.7 min</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>Average Wait: Under Threshold</div>
              </div>

              {/* Traffic Chart */}
              <div style={{ background: card, borderRadius: 20, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "background 0.3s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: text }}>Daily Visitor Traffic</div>
                    <div style={{ fontSize: 11, color: sub }}>Last 12 Working Hours</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 7, height: 7, background: "#ef4444", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
                    <span style={{ fontSize: 11, color: sub, fontWeight: 600 }}>LIVE</span>
                  </div>
                </div>
                <div style={{ position: "relative" }}>
                  <SparklineChart data={trafficData} color="#3B5BFF" height={90} />
                  <div style={{
                    position: "absolute", top: 8, right: 40, background: darkMode ? "#334155" : "#1e293b", color: "white",
                    borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 600, textAlign: "center"
                  }}>
                    Peak:<br />142<br />visitors
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { label: "TOTAL", value: "1,204", color: text },
                  { label: "SERVED", value: "1,162", color: text },
                  { label: "URGENT", value: "14", color: "#ef4444", bg: "#fff1f2" },
                ].map((stat, i) => (
                  <div key={i} style={{ background: stat.bg || card, borderRadius: 14, padding: "14px 12px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "background 0.3s" }}>
                    <div style={{ fontSize: 10, color: sub, fontWeight: 700, letterSpacing: 0.8, marginBottom: 6 }}>{stat.label}</div>
                    <div style={{ fontWeight: 900, fontSize: 22, color: stat.color }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Bottom Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: card, borderRadius: 14, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "background 0.3s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#3B5BFF" strokeWidth={2} className="w-5 h-5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    <span style={{ fontSize: 12, color: sub, fontWeight: 600 }}>Active Counters</span>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 24, color: text }}>18 / 24</div>
                </div>
                <div style={{ background: card, borderRadius: 14, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "background 0.3s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <Icon.Star />
                    <span style={{ fontSize: 12, color: sub, fontWeight: 600 }}>Satisfaction</span>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 24, color: text }}>4.8 / 5.0</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tip bar */}
          <div style={{ textAlign: "center", fontSize: 12, color: sub, borderTop: `1px solid ${border}`, paddingTop: 16 }}>
            💡 Tip: Ctrl+K to open the command panel
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP + VIEW SWITCHER
// ══════════════════════════════════════════════════════════════════════════════
const screens = [
  { id: "citizen-home", label: "🏠 Citizen Home", emoji: "🏠" },
  { id: "citizen-ticket", label: "🎫 My Ticket", emoji: "🎫" },
  { id: "citizen-queue", label: "🔢 Queue Status", emoji: "🔢" },
  { id: "scanner", label: "📷 QR Scanner", emoji: "📷" },
  { id: "staff", label: "📱 Staff Mobile", emoji: "📱" },
  { id: "admin", label: "🖥️ Admin Dashboard", emoji: "🖥️" },
];

export default function App() {
  const [current, setCurrent] = useState("citizen-home");
  const isAdmin = current === "admin";

  return (
    <div style={{ minHeight: "100vh", background: isAdmin ? "#F0F4FF" : "#E8EAF6", position: "relative" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'SF Pro Display', 'Segoe UI', system-ui, -apple-system, sans-serif; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      {/* Screen Switcher */}
      {!isAdmin && (
        <div style={{
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 100,
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderRadius: 50,
          padding: "6px 8px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          display: "flex", gap: 4,
          border: "1px solid rgba(255,255,255,0.8)",
        }}>
          {screens.map((s) => (
            <button
              key={s.id}
              onClick={() => setCurrent(s.id)}
              title={s.label}
              style={{
                background: current === s.id ? "#3B5BFF" : "transparent",
                border: "none",
                borderRadius: 40,
                padding: current === s.id ? "6px 14px" : "6px 10px",
                cursor: "pointer",
                fontSize: current === s.id ? 12 : 14,
                fontWeight: 700,
                color: current === s.id ? "white" : "#64748b",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}>
              <span>{s.emoji}</span>
              {current === s.id && <span>{s.label.replace(/^.+ /, "")}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Admin has its own close button */}
      {isAdmin && (
        <button
          onClick={() => setCurrent("staff")}
          style={{
            position: "fixed", top: 20, right: 20, zIndex: 200,
            background: "white", border: "1px solid #e2e8f0", borderRadius: 12,
            padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer",
            color: "#64748b", boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
          📱 Mobile Views
        </button>
      )}

      {/* Render current screen */}
      <div style={isAdmin ? { height: "100vh" } : { paddingTop: 72 }}>
        {current === "citizen-home" && <CitizenHome onNav={setCurrent} />}
        {current === "citizen-ticket" && <CitizenTicket onNav={setCurrent} />}
        {current === "citizen-queue" && <CitizenQueue onNav={setCurrent} />}
        {current === "scanner" && <QRScanner onNav={setCurrent} />}
        {current === "staff" && <StaffMobile onNav={setCurrent} />}
        {current === "admin" && <AdminDashboard onNav={setCurrent} />}
      </div>
    </div>
  );
}
