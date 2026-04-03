import { useState, useEffect, useCallback } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  blue: "#3B5BFF",
  blueD: "#2D4FE0",
  blueL: "#EEF2FF",
  green: "#22c55e",
  greenD: "#16a34a",
  amber: "#f59e0b",
  red: "#ef4444",
  slate9: "#0F172A",
  slate8: "#1E293B",
  slate7: "#334155",
  slate6: "#475569",
  slate5: "#64748b",
  slate4: "#94a3b8",
  slate3: "#cbd5e1",
  slate2: "#e2e8f0",
  slate1: "#f1f5f9",
  bg: "#F0F2FA",
  white: "#ffffff",
  purple: "#8B5CF6",
};

// ── Icons (from lucide-react) ────────────────────────────────────────────────
import {
  Landmark,
  CreditCard,
  UserPlus,
  FileText,
  Phone,
  Lock,
  BookOpen,
  Car,
  Bell,
  Clock,
  Check,
  X,
  ChevronLeft,
  Users,
  Ticket,
  Home,
  MessageCircle,
  PlusCircle,
  ArrowRightLeft,
  Home as HomeIcon,
  RefreshCw,
  IdCard,
  ClipboardList,
  Wrench,
  FileSignature,
  DollarSign,
  Scale,
  MapPin,
  Navigation,
  Bus,
  Footprints,
  ChevronRight as ChevronRightIcon,
  ExternalLink
} from "lucide-react";

const Ic = {
  Bank: Landmark,
  CreditCard: CreditCard,
  UserPlus: UserPlus,
  FileText: FileText,
  Phone: Phone,
  Lock: Lock,
  Passport: BookOpen,
  Cars: Car,
  Bell: Bell,
  Clock: Clock,
  Check: Check,
  X: X,
  Back: ChevronLeft,
  Users: Users,
  Ticket: Ticket,
  Home: Home,
};

// ── Bank branches (Tanger) ────────────────────────────────────────────────────
const BANK_BRANCHES = [
  {
    id: "cih",
    name: "CIH Bank — Tanger Centre",
    address: "12 Avenue des FAR, Tanger Ville",
    distanceKm: 0.8,
    walk: 10,
    car: 3,
    bus: 14,
    color: C.blue,
    bgLight: "#EEF2FF",
  },
  {
    id: "attijariwafa",
    name: "Attijariwafa Bank — Malabata",
    address: "Boulevard Malabata, Tanger",
    distanceKm: 2.3,
    walk: 28,
    car: 7,
    bus: 19,
    color: C.blue,
    bgLight: "#EEF2FF",
  },
];

const SERVICES = [
  {
    id: "bank",
    label: "Banque",
    icon: Landmark,
    color: C.blue,
    bgLight: "#EEF2FF",
    queue: 14,
    waitPerPerson: 3,
    location: {
      name: "Agence CIH Bank – Centre-ville",
      address: "23 Av. Mohammed V, Tanger",
      distanceKm: 1.2,
      walk: 14,
      car: 4,
      bus: 18,
    },
    subServices: [
      { id: "consult", label: "Consultation", icon: MessageCircle, desc: "Parlez à un conseiller" },
      { id: "account", label: "Ouvrir un compte", icon: PlusCircle, desc: "Création de compte bancaire" },
      { id: "transfer", label: "Virement / Dépôt", icon: ArrowRightLeft, desc: "Opérations financières" },
      { id: "card", label: "Carte bancaire", icon: CreditCard, desc: "Demande ou remplacement" },
      { id: "loan", label: "Crédit", icon: HomeIcon, desc: "Demande de prêt" },
    ],
  },
  {
    id: "passport",
    label: "Passeport & ID",
    icon: BookOpen,
    color: C.purple,
    bgLight: "#F5F3FF",
    queue: 8,
    waitPerPerson: 5,
    location: {
      name: "Direction Régionale – CIN & Passeports",
      address: "12 Rue Ibn Battouta, Hay Hassani",
      distanceKm: 2.8,
      walk: 33,
      car: 8,
      bus: 22,
    },
    subServices: [
      { id: "new", label: "Nouveau passeport", icon: BookOpen, desc: "Première demande" },
      { id: "renew", label: "Renouvellement", icon: RefreshCw, desc: "Passeport expiré" },
      { id: "id", label: "Carte nationale", icon: IdCard, desc: "CIN / Carte d'identité" },
    ],
  },
  {
    id: "auto",
    label: "Permis & Auto",
    icon: Car,
    color: "#f59e0b",
    bgLight: "#FFFBEB",
    queue: 22,
    waitPerPerson: 4,
    location: {
      name: "Centre de Contrôle Routier – Sidi Bernoussi",
      address: "Route de Mediouna, Zone Industrielle",
      distanceKm: 5.4,
      walk: 65,
      car: 12,
      bus: 35,
    },
    subServices: [
      { id: "license", label: "Permis de conduire", icon: ClipboardList, desc: "Demande ou renouvellement" },
      { id: "plate", label: "Immatriculation", icon: Car, desc: "Carte grise / plaques" },
      { id: "visit", label: "Visite technique", icon: Wrench, desc: "Contrôle technique" },
    ],
  },
  {
    id: "tax",
    label: "Impôts & Taxes",
    icon: FileText,
    color: "#10b981",
    bgLight: "#ECFDF5",
    queue: 6,
    waitPerPerson: 6,
    location: {
      name: "Direction Générale des Impôts – Maarif",
      address: "7 Rue Colbert, Casablanca",
      distanceKm: 0.7,
      walk: 8,
      car: 2,
      bus: 11,
    },
    subServices: [
      { id: "decl", label: "Déclaration", icon: FileSignature, desc: "Déclaration fiscale" },
      { id: "refund", label: "Remboursement", icon: DollarSign, desc: "Demande de remboursement" },
      { id: "dispute", label: "Litige / Réclamation", icon: Scale, desc: "Contester un avis" },
    ],
  },
];

const REMINDER_OPTIONS = [
  { mins: 10, label: "10 min avant", desc: "Préviens-moi 10 min à l'avance" },
  { mins: 15, label: "15 min avant", desc: "Préviens-moi 15 min à l'avance" },
  { mins: 20, label: "20 min avant", desc: "Préviens-moi 20 min à l'avance" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function ticketNum() {
  return "B-" + (Math.floor(Math.random() * 80) + 300);
}

// ── Phone Shell ───────────────────────────────────────────────────────────────
function Shell({ children, statusDark }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", minHeight: "100vh", padding: "24px 0" }}>
      <div style={{
        width: 390, minHeight: 844,
        background: C.bg,
        borderRadius: 44,
        boxShadow: "0 30px 80px rgba(0,0,0,0.3), 0 0 0 2px #d1d5db, 0 0 0 8px #fff",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Status bar */}
        <div style={{
          background: "transparent", padding: "16px 28px 0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 50,
          color: statusDark ? C.slate9 : C.white,
        }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>9:41</span>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <svg width="16" height="12" viewBox="0 0 16 12"><rect x="0" y="3" width="3" height="9" rx="1" fill="currentColor" opacity="0.35" /><rect x="4.5" y="2" width="3" height="10" rx="1" fill="currentColor" opacity="0.6" /><rect x="9" y="0" width="3" height="12" rx="1" fill="currentColor" /><rect x="13.5" y="1" width="2" height="10" rx="1" fill="currentColor" opacity="0.3" /></svg>
            <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0" y="1" width="22" height="10" rx="3" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" /><rect x="1.5" y="2.5" width="18" height="7" rx="2" fill="currentColor" /></svg>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── STEP 1: Service Selection ─────────────────────────────────────────────────
function ServiceSelect({ onSelect }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <Shell statusDark={false}>
      {/* Gradient header */}
      <div style={{
        background: "linear-gradient(145deg, #1a2f9e 0%, #3B5BFF 55%, #6378ff 100%)",
        padding: "60px 22px 32px",
        color: C.white,
      }}>
        <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 4 }}>{greeting} 👋</div>
        <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2, marginBottom: 6 }}>
          Quel service<br />recherchez-vous ?
        </div>
        <div style={{ fontSize: 13, opacity: 0.65 }}>Sélectionnez pour rejoindre la file</div>
      </div>

      {/* Wave */}
      <div style={{ height: 24, background: "linear-gradient(145deg, #1a2f9e 0%, #3B5BFF 55%, #6378ff 100%)" }}>
        <div style={{ height: "100%", background: C.bg, borderRadius: "50% 50% 0 0 / 24px 24px 0 0" }} />
      </div>

      {/* Service grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {SERVICES.map((svc) => {
            const estWait = svc.queue * svc.waitPerPerson;
            return (
              <button
                key={svc.id}
                onClick={() => onSelect(svc)}
                style={{
                  background: C.white,
                  border: "none",
                  borderRadius: 20,
                  padding: "20px 16px",
                  cursor: "pointer",
                  textAlign: "left",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: svc.bgLight,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 12, color: svc.color
                }}>
                  <svc.icon size={26} strokeWidth={2} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.slate8, marginBottom: 4 }}>{svc.label}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />
                  <span style={{ fontSize: 11, color: C.slate5 }}>~{estWait} min</span>
                </div>
                <div style={{ fontSize: 10, color: C.slate4, marginTop: 2 }}>{svc.queue} personnes</div>
              </button>
            );
          })}
        </div>

        {/* Info tip */}
        <div style={{
          marginTop: 20, background: C.blueL,
          borderRadius: 14, padding: "12px 16px",
          display: "flex", gap: 10, alignItems: "center",
        }}>
          <span style={{ fontSize: 18 }}>💡</span>
          <span style={{ fontSize: 12, color: C.blue, lineHeight: 1.5 }}>
            Prenez un ticket virtuel et attendez confortablement où vous voulez.
          </span>
        </div>
      </div>
    </Shell>
  );
}

// ── Travel time pill helper ────────────────────────────────────────────────────
function TravelPill({ icon: Icon, label, value, color }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={16} color={color} strokeWidth={2} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: C.slate8 }}>{value} min</div>
      <div style={{ fontSize: 10, color: C.slate5, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

// ── STEP 2: Sub-service Selection ─────────────────────────────────────────────
function SubServiceSelect({ service, onSelect, onBack }) {
  const estWait = service.queue * service.waitPerPerson;
  const loc = service.location;

  // Smart travel recommendation
  const fastest = loc.car <= loc.walk && loc.car <= loc.bus ? "voiture" : loc.bus < loc.walk ? "bus" : "pied";
  const isClose = loc.distanceKm < 1;

  return (
    <Shell statusDark={false}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${service.color}dd, ${service.color})`,
        padding: "54px 20px 24px",
        color: C.white,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button
            onClick={onBack}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "7px 9px", color: C.white, cursor: "pointer", display: "flex" }}
          >
            <Ic.Back style={{ width: 18, height: 18 }} />
          </button>
          <div style={{ fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <service.icon size={20} strokeWidth={2.5} /> {service.label}
          </div>
        </div>

        {/* Queue pill */}
        <div style={{
          background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
          borderRadius: 16, padding: "14px 18px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 2 }}>ATTENTE ACTUELLE</div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>~{estWait} min</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 2 }}>EN FILE</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{service.queue}</div>
          </div>
        </div>
      </div>

      {/* Wave */}
      <div style={{ height: 20, background: `linear-gradient(135deg, ${service.color}dd, ${service.color})` }}>
        <div style={{ height: "100%", background: C.bg, borderRadius: "50% 50% 0 0 / 20px 20px 0 0" }} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 32px" }}>

        {/* ── Location & Travel card ── */}
        <div style={{ background: C.white, borderRadius: 18, padding: 16, marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
          {/* Location row */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: service.bgLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MapPin size={18} color={service.color} strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.slate8, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{loc.name}</div>
              <div style={{ fontSize: 11, color: C.slate5, display: "flex", alignItems: "center", gap: 4 }}>
                <Navigation size={10} color={C.slate4} />
                {loc.address}
              </div>
            </div>
            <div style={{ background: service.bgLight, borderRadius: 8, padding: "4px 8px", flexShrink: 0, textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: service.color }}>{loc.distanceKm} km</div>
              <div style={{ fontSize: 9, color: C.slate5, fontWeight: 500 }}>de vous</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: C.slate1, marginBottom: 14 }} />

          {/* Travel modes */}
          <div style={{ fontSize: 10, color: C.slate4, fontWeight: 700, letterSpacing: 0.6, marginBottom: 10 }}>TEMPS DE TRAJET ESTIMÉ</div>
          <div style={{ display: "flex", gap: 8 }}>
            <TravelPill icon={Footprints} label="À pied" value={loc.walk} color="#10b981" />
            <div style={{ width: 1, background: C.slate1, flexShrink: 0, alignSelf: "stretch" }} />
            <TravelPill icon={Car} label="En voiture" value={loc.car} color={service.color} />
            <div style={{ width: 1, background: C.slate1, flexShrink: 0, alignSelf: "stretch" }} />
            <TravelPill icon={Bus} label="En bus" value={loc.bus} color="#f59e0b" />
          </div>

          {/* Smart tip */}
          <div style={{
            marginTop: 14, borderRadius: 10,
            background: isClose ? `${C.green}15` : `${service.color}10`,
            padding: "9px 12px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 6, background: isClose ? `${C.green}25` : `${service.color}20` }}>
              {isClose
                ? <Footprints size={13} color={C.green} strokeWidth={2} />
                : fastest === "bus"
                  ? <Bus size={13} color={service.color} strokeWidth={2} />
                  : fastest === "voiture"
                    ? <Car size={13} color={service.color} strokeWidth={2} />
                    : <Footprints size={13} color={C.green} strokeWidth={2} />
              }
            </div>
            <span style={{ fontSize: 11, color: C.slate7, lineHeight: 1.4 }}>
              {isClose
                ? `À seulement ${loc.distanceKm} km — à pied en ${loc.walk} min !`
                : `Trajet le plus rapide en ${fastest} (~${Math.min(loc.car, loc.walk, loc.bus)} min)`
              }
            </span>
          </div>
        </div>

        {/* Sub-services list */}
        <div style={{ fontSize: 11, color: C.slate5, fontWeight: 700, marginBottom: 12, letterSpacing: 0.7 }}>
          CHOISISSEZ VOTRE BESOIN
        </div>
        {service.subServices.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onSelect(sub)}
            style={{
              width: "100%", background: C.white, border: "2px solid transparent",
              borderRadius: 16, padding: "15px 16px", marginBottom: 10,
              cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", gap: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = service.color; e.currentTarget.style.boxShadow = `0 4px 16px ${service.color}22`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: service.bgLight, color: service.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <sub.icon size={22} strokeWidth={2} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.slate8, marginBottom: 2 }}>{sub.label}</div>
              <div style={{ fontSize: 12, color: C.slate5 }}>{sub.desc}</div>
            </div>
            <ChevronRightIcon size={16} color={C.slate4} />
          </button>
        ))}
      </div>
    </Shell>
  );
}

// ── STEP 3: Ticket Confirmation ───────────────────────────────────────────────
function TicketConfirm({ service, subService, ticketId, onTake, onCancel }) {
  const estWait = service.queue * service.waitPerPerson;
  const [cancelling, setCancelling] = useState(false);

  return (
    <Shell statusDark={false}>
      {/* Dark header */}
      <div style={{ background: C.slate9, padding: "54px 20px 40px", color: C.white, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <button
            onClick={onCancel}
            style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: "7px 9px", color: C.white, cursor: "pointer", display: "flex" }}
          >
            <Ic.Back style={{ width: 18, height: 18 }} />
          </button>
          <div style={{ flex: 1, textAlign: "center", fontWeight: 700, fontSize: 16, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
            <service.icon size={20} strokeWidth={2.5} /> {service.label}
          </div>
          <div style={{ width: 34 }} />
        </div>

        {/* Big ticket number */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.slate4, letterSpacing: 1.5, fontWeight: 600, marginBottom: 12 }}>VOTRE NUMÉRO</div>
          <div style={{
            width: 140, height: 140, background: C.white, borderRadius: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px",
            boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
          }}>
            <span style={{ fontSize: 52, fontWeight: 900, color: C.slate9 }}>{ticketId}</span>
          </div>
          <div style={{ fontSize: 15, color: C.slate4, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
            <subService.icon size={18} strokeWidth={2.5} /> {subService.label}
          </div>
        </div>

        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 28, background: C.bg, borderRadius: "50% 50% 0 0 / 28px 28px 0 0" }} />
      </div>

      {/* Info cards */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>
        {/* Queue status */}
        <div style={{ background: C.white, borderRadius: 20, padding: 18, marginBottom: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            <div style={{ borderRight: `1px solid ${C.slate1}`, paddingRight: 16 }}>
              <div style={{ fontSize: 11, color: C.slate5, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>EN FILE</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: C.slate8 }}>{service.queue}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <Ic.Users style={{ width: 12, height: 12, color: C.slate4 }} />
                <span style={{ fontSize: 11, color: C.slate5 }}>personnes avant vous</span>
              </div>
            </div>
            <div style={{ paddingLeft: 16 }}>
              <div style={{ fontSize: 11, color: C.slate5, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>ATTENTE EST.</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: service.color }}>~{estWait} min</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <Ic.Clock style={{ width: 12, height: 12, color: C.slate4 }} />
                <span style={{ fontSize: 11, color: C.slate5 }}>temps estimé</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 16, height: 6, background: C.slate2, borderRadius: 10, overflow: "hidden" }}>
            <div style={{
              width: "33%", height: "100%",
              background: `linear-gradient(90deg, ${service.color}, ${service.color}88)`,
              borderRadius: 10,
            }} />
          </div>
          <div style={{ fontSize: 11, color: C.slate5, marginTop: 6, textAlign: "center" }}>
            Vous êtes dans la première moitié de la file
          </div>
        </div>

        {/* CTA buttons */}
        {!cancelling ? (
          <>
            <button
              onClick={onTake}
              style={{
                width: "100%", background: `linear-gradient(135deg, ${C.blueD}, ${C.blue})`,
                border: "none", borderRadius: 16, padding: "17px 20px",
                color: C.white, fontWeight: 800, fontSize: 17,
                cursor: "pointer", marginBottom: 10,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: `0 8px 24px ${C.blue}44`,
              }}
            >
              <Ic.Ticket style={{ width: 20, height: 20 }} />
              Prendre un numéro
            </button>
            <button
              onClick={() => setCancelling(true)}
              style={{
                width: "100%", background: "transparent",
                border: `2px solid ${C.slate2}`, borderRadius: 16, padding: "15px 20px",
                color: C.slate6, fontWeight: 700, fontSize: 16,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <Ic.X style={{ width: 18, height: 18, color: C.red }} />
              Annuler
            </button>
          </>
        ) : (
          <div style={{ background: "#FEF2F2", borderRadius: 16, padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.red, marginBottom: 6 }}>Annuler la file ?</div>
            <div style={{ fontSize: 13, color: C.slate6, marginBottom: 16 }}>Vous perdrez votre numéro et devrez recommencer.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onCancel}
                style={{ flex: 1, background: C.red, border: "none", borderRadius: 12, padding: "12px", color: C.white, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
              >
                Oui, annuler
              </button>
              <button
                onClick={() => setCancelling(false)}
                style={{ flex: 1, background: C.slate1, border: "none", borderRadius: 12, padding: "12px", color: C.slate7, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
              >
                Rester
              </button>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

// ── STEP 4: Reminder Setup ────────────────────────────────────────────────────
function ReminderSetup({ service, subService, ticketId, onConfirm }) {
  const [selected, setSelected] = useState(null);
  const [customTime, setCustomTime] = useState("");
  const [skipReminder, setSkipReminder] = useState(false);
  const estWait = service.queue * service.waitPerPerson;

  useEffect(() => {
    if (customTime) {
      setSelected(null);
      setSkipReminder(false);
    }
  }, [customTime]);

  return (
    <Shell statusDark={true}>
      <div style={{ flex: 1, overflowY: "auto", color: C.slate8, padding: "60px 0 0" }}>
        {/* Header */}
        <div style={{ padding: "0 20px 24px" }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>🔔 Rappel de notification</div>
          <div style={{ fontSize: 14, color: C.slate5, lineHeight: 1.5 }}>
            Vous n'avez pas besoin de rester ici ! On vous avertit quand c'est bientôt votre tour.
          </div>
        </div>

        {/* Ticket summary */}
        <div style={{ margin: "0 16px 20px", background: `linear-gradient(135deg, ${service.color}18, ${service.color}08)`, borderRadius: 18, padding: 16, border: `1.5px solid ${service.color}30` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: service.color, fontWeight: 700, letterSpacing: 0.5, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <service.icon size={14} strokeWidth={2.5} /> {service.label}
              </div>
              <div style={{ fontWeight: 800, fontSize: 24, color: C.slate8 }}>{ticketId}</div>
              <div style={{ fontSize: 12, color: C.slate5, display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <subService.icon size={14} strokeWidth={2.5} /> {subService.label}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: C.slate5, marginBottom: 2 }}>Attente</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: service.color }}>~{estWait}m</div>
            </div>
          </div>
        </div>

        {/* Reminder options */}
        <div style={{ padding: "0 16px" }}>
          <div style={{ fontSize: 12, color: C.slate5, fontWeight: 600, letterSpacing: 0.5, marginBottom: 12 }}>
            QUAND VOUS AVERTIR ?
          </div>
          {REMINDER_OPTIONS.map((opt) => {
            const active = selected === opt.mins && !skipReminder;
            return (
              <button
                key={opt.mins}
                onClick={() => { setSelected(opt.mins); setSkipReminder(false); setCustomTime(""); }}
                style={{
                  width: "100%", background: active ? C.blueL : C.white,
                  border: `2px solid ${active ? C.blue : C.slate2}`,
                  borderRadius: 16, padding: "16px", marginBottom: 10,
                  cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 14,
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: active ? C.blue : C.slate1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "background 0.15s",
                }}>
                  <Ic.Bell style={{ width: 20, height: 20, color: active ? C.white : C.slate5 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: active ? C.blue : C.slate8, marginBottom: 2 }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 12, color: C.slate5 }}>{opt.desc}</div>
                </div>
                {active && <Ic.Check style={{ width: 20, height: 20, color: C.blue }} />}
              </button>
            );
          })}

          {/* Custom Time */}
          <div
            style={{
              width: "100%", background: customTime ? C.blueL : C.white,
              border: `2px solid ${customTime ? C.blue : C.slate2}`,
              borderRadius: 16, padding: "16px", marginBottom: 10,
              display: "flex", alignItems: "center", gap: 14,
              transition: "all 0.15s",
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: customTime ? C.blue : C.slate1,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "background 0.15s",
            }}>
              <Ic.Clock style={{ width: 20, height: 20, color: customTime ? C.white : C.slate5 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: customTime ? C.blue : C.slate8, marginBottom: 2 }}>
                Temps personnalisé
              </div>
              <div style={{ fontSize: 12, color: C.slate5, display: "flex", alignItems: "center", gap: 4 }}>
                Préviens-moi
                <input
                  type="number"
                  placeholder="ex: 5"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  style={{
                    width: "40px",
                    padding: "2px 4px",
                    borderRadius: "4px",
                    border: `1px solid ${C.slate3}`,
                    textAlign: "center",
                    fontFamily: "inherit",
                    fontSize: "12px",
                    color: C.slate8,
                    outline: "none"
                  }}
                />
                min à l'avance
              </div>
            </div>
            {customTime && <Ic.Check style={{ width: 20, height: 20, color: C.blue }} />}
          </div>

          {/* Skip reminder */}
          <button
            onClick={() => { setSkipReminder(true); setSelected(null); setCustomTime(""); }}
            style={{
              width: "100%", background: skipReminder ? "#FEF2F2" : C.white,
              border: `2px solid ${skipReminder ? C.red : C.slate2}`,
              borderRadius: 16, padding: "14px 16px", marginBottom: 20,
              cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", gap: 12,
              transition: "all 0.15s",
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: skipReminder ? "#FEE2E2" : C.slate1, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Ic.X style={{ width: 20, height: 20, color: skipReminder ? C.red : C.slate5 }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: skipReminder ? C.red : C.slate7 }}>Sans rappel</div>
              <div style={{ fontSize: 12, color: C.slate5 }}>Je vais surveiller moi-même</div>
            </div>
            {skipReminder && <Ic.Check style={{ width: 20, height: 20, color: C.red }} />}
          </button>

          <button
            disabled={selected === null && !skipReminder && !customTime}
            onClick={() => {
              if (skipReminder) onConfirm(null);
              else if (customTime) onConfirm(parseInt(customTime, 10));
              else onConfirm(selected);
            }}
            style={{
              width: "100%",
              background: (selected !== null || skipReminder || customTime)
                ? `linear-gradient(135deg, ${C.blueD}, ${C.blue})`
                : C.slate2,
              border: "none", borderRadius: 16, padding: "17px",
              color: (selected !== null || skipReminder || customTime) ? C.white : C.slate4,
              fontWeight: 800, fontSize: 17,
              cursor: (selected !== null || skipReminder || customTime) ? "pointer" : "default",
              boxShadow: (selected !== null || skipReminder || customTime) ? `0 8px 24px ${C.blue}44` : "none",
              transition: "all 0.2s",
            }}
          >
            Confirmer et patienter →
          </button>
        </div>
        <div style={{ height: 32 }} />
      </div>
    </Shell>
  );
}

// ── STEP 5: Waiting / Timer Screen ────────────────────────────────────────────
function WaitingScreen({ service, subService, ticketId, reminderMins, onReset }) {
  const estWait = service.queue * service.waitPerPerson;
  const [elapsed, setElapsed] = useState(0);
  const [notified, setNotified] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const totalSecs = estWait * 60;

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(e => {
        if (e + 1 >= totalSecs) { clearInterval(id); return totalSecs; }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [totalSecs]);

  const remaining = totalSecs - elapsed;
  const remainingMins = Math.ceil(remaining / 60);
  const progress = elapsed / totalSecs;

  // Trigger notification
  useEffect(() => {
    if (reminderMins && !notified) {
      if (remainingMins <= reminderMins) setNotified(true);
    }
  }, [remainingMins, reminderMins, notified]);

  const done = remaining <= 0;

  // Circular progress helpers
  const R = 66;
  const CIRC = 2 * Math.PI * R;
  const dash = CIRC * (1 - progress);

  return (
    <Shell statusDark={false}>
      {/* Dark header with circular timer */}
      <div style={{
        background: done
          ? `linear-gradient(135deg, ${C.greenD}, ${C.green})`
          : "linear-gradient(160deg, #0d1f6e, #1a3099 50%, #2D4FE0)",
        padding: "50px 20px 44px",
        color: C.white,
        position: "relative",
      }}>
        {/* Ticket & service info */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.65, marginBottom: 2, display: "flex", alignItems: "center", gap: 6 }}>
              <service.icon size={12} strokeWidth={2.5} /> {service.label}
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <subService.icon size={16} strokeWidth={2.5} /> {subService.label}
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: 0.5 }}>N° TICKET</div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>{ticketId}</div>
          </div>
        </div>

        {/* Circular timer */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ position: "relative", width: 160, height: 160 }}>
            <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
              <circle
                cx="80" cy="80" r={R}
                fill="none" stroke="white" strokeWidth="8"
                strokeDasharray={CIRC}
                strokeDashoffset={done ? 0 : dash}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              {done ? (
                <>
                  <Ic.Check style={{ width: 36, height: 36, color: C.white }} />
                  <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>C'est votre tour!</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 36, fontWeight: 900 }}>{fmtTime(remaining)}</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>restant</div>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          {done
            ? <div style={{ fontWeight: 800, fontSize: 18 }}>Rendez-vous au guichet maintenant !</div>
            : <div style={{ opacity: 0.75, fontSize: 13 }}>Vous pouvez patienter ailleurs — on vous prévient !</div>
          }
        </div>

        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 28, background: C.bg, borderRadius: "50% 50% 0 0 / 28px 28px 0 0" }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>
        {/* Notification banner */}
        {notified && !dismissed && (
          <div style={{
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
            borderRadius: 16, padding: 16, marginBottom: 12,
            display: "flex", gap: 12, alignItems: "flex-start",
            animation: "slideIn 0.4s ease",
          }}>
            <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 10, padding: 8, flexShrink: 0 }}>
              <Ic.Bell style={{ width: 20, height: 20, color: C.white }} />
            </div>
            <div style={{ flex: 1, color: C.white }}>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>
                🚨 Plus que {remainingMins} minutes !
              </div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>Dirigez-vous vers le guichet maintenant.</div>
            </div>
            <button onClick={() => setDismissed(true)} style={{ background: "none", border: "none", color: C.white, cursor: "pointer", padding: 4 }}>
              <Ic.X style={{ width: 16, height: 16 }} />
            </button>
          </div>
        )}

        {/* Live stats */}
        <div style={{ background: C.white, borderRadius: 20, padding: 18, marginBottom: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 12, color: C.slate5, fontWeight: 600, letterSpacing: 0.5, marginBottom: 14 }}>STATUT EN DIRECT</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Position", value: Math.max(1, service.queue - Math.floor(elapsed / 60 / service.waitPerPerson)), sub: "dans la file", color: C.blue },
              { label: "Temps passé", value: fmtTime(elapsed), sub: "écoulé", color: C.slate7 },
              { label: "Rappel", value: reminderMins ? `${reminderMins}m` : "—", sub: "configuré", color: reminderMins ? C.amber : C.slate4 },
            ].map((stat, i) => (
              <div key={i} style={{ background: C.slate1, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: C.slate5, fontWeight: 600, marginTop: 2 }}>{stat.label}</div>
                <div style={{ fontSize: 9, color: C.slate4, marginTop: 1 }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 16, height: 6, background: C.slate2, borderRadius: 10, overflow: "hidden" }}>
            <div style={{
              width: `${progress * 100}%`, height: "100%",
              background: `linear-gradient(90deg, ${service.color}88, ${service.color})`,
              borderRadius: 10, transition: "width 1s linear",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 10, color: C.slate4 }}>Début</span>
            <span style={{ fontSize: 10, color: C.slate5, fontWeight: 600 }}>{Math.round(progress * 100)}% de l'attente écoulée</span>
            <span style={{ fontSize: 10, color: C.slate4 }}>Votre tour</span>
          </div>
        </div>

        {/* Reminder info */}
        {reminderMins && !notified && (
          <div style={{ background: C.blueL, borderRadius: 16, padding: 14, marginBottom: 12, display: "flex", gap: 10, alignItems: "center" }}>
            <Ic.Bell style={{ width: 20, height: 20, color: C.blue, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>Rappel configuré</div>
              <div style={{ fontSize: 12, color: C.slate5 }}>Vous serez notifié {reminderMins} min avant votre tour.</div>
            </div>
          </div>
        )}

        {/* QR Code Section */}
        <div style={{ background: C.white, borderRadius: 20, padding: 20, marginBottom: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.slate8, marginBottom: 4 }}>Votre QR Code Numérique</div>
          <div style={{ fontSize: 11, color: C.slate5, marginBottom: 16, lineHeight: 1.4 }}>Scannez ce code à la borne pour valider votre arrivée et imprimer votre ticket.</div>
          <div style={{ background: C.white, padding: 12, borderRadius: 16, border: `2px dashed ${C.slate3}`, display: "inline-block" }}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(ticketId)}`} alt={`QR Code pour le ticket ${ticketId}`} width={120} height={120} style={{ display: "block" }} />
          </div>
        </div>

        {/* Cancel button */}
        <button
          onClick={onReset}
          style={{
            width: "100%", background: "transparent",
            border: `2px solid ${C.slate2}`, borderRadius: 14, padding: "14px",
            color: C.red, fontWeight: 700, fontSize: 15,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <Ic.X style={{ width: 16, height: 16 }} />
          {done ? "Terminer et revenir à l'accueil" : "Annuler mon ticket"}
        </button>
      </div>
    </Shell>
  );
}

// ── Branch Select component ────────────────────────────────────────────────────
function BranchSelect({ service, onSelect, onBack }) {
  return (
    <Shell statusDark={false}>
      <div style={{
        background: `linear-gradient(135deg, ${service.color}dd, ${service.color})`,
        padding: "54px 20px 28px",
        color: C.white,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "7px 9px", color: C.white, cursor: "pointer", display: "flex" }}>
            <Ic.Back style={{ width: 18, height: 18 }} />
          </button>
          <div style={{ fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <service.icon size={20} strokeWidth={2.5} /> {service.label}
          </div>
        </div>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Choisissez votre agence</div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>2 agences disponibles</div>
        <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>Tanger, Maroc</div>
      </div>

      <div style={{ height: 20, background: `linear-gradient(135deg, ${service.color}dd, ${service.color})` }}>
        <div style={{ height: "100%", background: C.bg, borderRadius: "50% 50% 0 0 / 20px 20px 0 0" }} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 32px" }}>
        <div style={{ fontSize: 11, color: C.slate5, fontWeight: 700, letterSpacing: 0.7, marginBottom: 14 }}>SÉLECTIONNEZ UNE AGENCE</div>

        {BANK_BRANCHES.map((branch, idx) => (
          <button
            key={branch.id}
            onClick={() => onSelect(branch)}
            style={{
              width: "100%", background: C.white, border: "2px solid transparent",
              borderRadius: 18, padding: "18px 16px", marginBottom: 12,
              cursor: "pointer", textAlign: "left",
              boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = service.color; e.currentTarget.style.boxShadow = `0 6px 20px ${service.color}22`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.07)"; }}
          >
            {/* Branch header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: service.bgLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Landmark size={20} color={service.color} strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: C.slate8, marginBottom: 3 }}>{branch.name}</div>
                <div style={{ fontSize: 11, color: C.slate5, display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={10} color={C.slate4} />
                  {branch.address}
                </div>
              </div>
              <div style={{ background: service.bgLight, borderRadius: 8, padding: "4px 10px", flexShrink: 0, textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: service.color }}>{branch.distanceKm} km</div>
                <div style={{ fontSize: 9, color: C.slate5, fontWeight: 500 }}>de vous</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: C.slate1, marginBottom: 12 }} />

            {/* Travel times */}
            <div style={{ display: "flex", gap: 0 }}>
              {[
                { icon: Footprints, label: "À pied",    value: branch.walk, color: C.green },
                { icon: Car,        label: "En voiture", value: branch.car,  color: service.color },
                { icon: Bus,        label: "En bus",     value: branch.bus,  color: "#f59e0b" },
              ].map((m, i, arr) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, borderRight: i < arr.length - 1 ? `1px solid ${C.slate1}` : "none" }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <m.icon size={14} color={m.color} strokeWidth={2} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: C.slate8 }}>{m.value} min</div>
                  <div style={{ fontSize: 10, color: C.slate5, fontWeight: 500 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Best mode badge */}
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6, background: `${service.color}0d`, borderRadius: 8, padding: "7px 10px" }}>
              <Navigation size={12} color={service.color} strokeWidth={2} />
              <span style={{ fontSize: 11, color: C.slate7, fontWeight: 500 }}>
                {branch.distanceKm < 1
                  ? `Très proche — à pied en ${branch.walk} min`
                  : `Trajet optimal en voiture — ${branch.car} min`
                }
              </span>
              <ChevronRightIcon size={14} color={C.slate4} style={{ marginLeft: "auto" }} />
            </div>
          </button>
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 4px" }}>
          <div style={{ flex: 1, height: 1, background: C.slate2 }} />
          <span style={{ fontSize: 11, color: C.slate4, fontWeight: 500 }}>Tanger · Maroc</span>
          <div style={{ flex: 1, height: 1, background: C.slate2 }} />
        </div>
      </div>
    </Shell>
  );
}

// ── FLOW ORCHESTRATOR ─────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState("service-select");  // service-select | branch-select | sub-select | confirm | reminder | waiting
  const [service, setService] = useState(null);
  const [branch, setBranch] = useState(null);
  const [subService, setSubService] = useState(null);
  const [myTicket] = useState(() => ticketNum());
  const [reminderMins, setReminderMins] = useState(null);

  const reset = useCallback(() => {
    setStep("service-select");
    setService(null);
    setBranch(null);
    setSubService(null);
    setReminderMins(null);
  }, []);

  const handleServiceSelect = (svc) => {
    setService(svc);
    // Only banks have a branch selector
    if (svc.id === "bank") setStep("branch-select");
    else setStep("sub-select");
  };
  const handleBranchSelect = (br) => {
    // Merge the branch location into the active service so SubServiceSelect shows it
    setService(svc => ({ ...svc, location: br }));
    setBranch(br);
    setStep("sub-select");
  };
  const handleSubSelect = (sub) => { setSubService(sub); setStep("confirm"); };
  const handleTake = () => setStep("reminder");
  const handleReminder = (mins) => { setReminderMins(mins); setStep("waiting"); };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #dde1f0 0%, #e8ecf8 100%)",
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 0; }
        button { font-family: inherit; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>

      {step === "service-select" && (
        <ServiceSelect onSelect={handleServiceSelect} />
      )}
      {step === "branch-select" && service && (
        <BranchSelect
          service={service}
          onSelect={handleBranchSelect}
          onBack={() => setStep("service-select")}
        />
      )}
      {step === "sub-select" && service && (
        <SubServiceSelect
          service={service}
          onSelect={handleSubSelect}
          onBack={() => service.id === "bank" ? setStep("branch-select") : setStep("service-select")}
        />
      )}
      {step === "confirm" && service && subService && (
        <TicketConfirm
          service={service}
          subService={subService}
          ticketId={myTicket}
          onTake={handleTake}
          onCancel={reset}
        />
      )}
      {step === "reminder" && service && subService && (
        <ReminderSetup
          service={service}
          subService={subService}
          ticketId={myTicket}
          onConfirm={handleReminder}
        />
      )}
      {step === "waiting" && service && subService && (
        <WaitingScreen
          service={service}
          subService={subService}
          ticketId={myTicket}
          reminderMins={reminderMins}
          onReset={reset}
        />
      )}
    </div>
  );
}
