"use client";

import { Sparkles, Sprout } from "lucide-react";

function getLevel(min) { return Math.floor(min / 100) + 1; }
function getLevelXP(min) { return min % 100; }
function getLevelName(lvl) {
  return ["Semente","Broto","Muda","Arbusto","Árvore Jovem","Carvalho","Sequóia","Lenda"][Math.min(lvl - 1, 7)];
}
function getTreeLabel(h) {
  if (h === 0) return "Semente";
  if (h <= 25) return "Broto";
  if (h <= 50) return "Muda";
  if (h <= 75) return "Jovem";
  return "Exuberante";
}

export default function MascotTree({ treeHealth, totalFocusMinutes, xpGain }) {
  const level = getLevel(totalFocusMinutes);
  const levelXP = getLevelXP(totalFocusMinutes);
  const levelName = getLevelName(level);
  const treeLabel = getTreeLabel(treeHealth);

  const treeBarColor = treeHealth === 0
    ? "linear-gradient(to right,#374151,#4b5563)"
    : treeHealth <= 50
    ? "linear-gradient(to right,#16a34a,#4ade80)"
    : "linear-gradient(to right,#4ade80,#bbf7d0)";

  return (
    <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 12, position: "relative", overflow: "hidden" }}>

      {/* +XP flutuante */}
      {xpGain && (
        <div className="xp-float" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 20, pointerEvents: "none" }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#4ade80", display: "flex", alignItems: "center", gap: 6 }}>+25 XP <Sparkles size={20} color="#4ade80" fill="#4ade80" /></span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "#4b5563", marginBottom: 2 }}>Mascote</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "white" }}>{treeLabel}</div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 99, background: treeHealth === 0 ? "rgba(31,41,55,0.5)" : "rgba(20,83,45,0.4)", color: treeHealth === 0 ? "#6b7280" : "#4ade80", border: treeHealth === 0 ? "1px solid #374151" : "1px solid rgba(20,83,45,0.5)" }}>
          {treeHealth === 0 ? <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Sprout size={12} /> Plantada</span> : `Nív. ${level}`}
        </div>
      </div>

      {/* Árvore SVG */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg viewBox="0 0 120 140" width={120} height={120} className={treeHealth > 0 ? "tree-sway" : ""} style={{ overflow: "visible" }}>
          <ellipse cx="60" cy="132" rx="22" ry="5" fill="#21262d" />
          {treeHealth === 0 ? (<>
            <circle cx="60" cy="128" r="5" fill="#4ade80" opacity="0.6" />
            <circle cx="60" cy="128" r="3" fill="#86efac" />
            <line x1="60" y1="123" x2="60" y2="115" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
            <path d="M60,118 Q55,112 50,113" stroke="#4ade80" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>) : treeHealth <= 25 ? (<>
            <rect x="57" y="105" width="6" height="27" rx="3" fill="#6b4c1e" />
            <circle cx="60" cy="100" r="12" fill="#16a34a" />
            <circle cx="52" cy="107" r="8" fill="#15803d" />
            <circle cx="68" cy="106" r="8" fill="#15803d" />
          </>) : treeHealth <= 50 ? (<>
            <rect x="55" y="95" width="10" height="37" rx="5" fill="#6b4c1e" />
            <circle cx="60" cy="85" r="20" fill="#16a34a" />
            <circle cx="44" cy="96" r="13" fill="#15803d" />
            <circle cx="76" cy="94" r="13" fill="#15803d" />
            <circle cx="60" cy="73" r="12" fill="#22c55e" />
          </>) : treeHealth <= 75 ? (<>
            <rect x="54" y="92" width="12" height="40" rx="6" fill="#6b4c1e" />
            <circle cx="60" cy="74" r="26" fill="#16a34a" />
            <circle cx="40" cy="85" r="18" fill="#15803d" />
            <circle cx="80" cy="83" r="18" fill="#15803d" />
            <circle cx="60" cy="60" r="17" fill="#22c55e" />
            <circle cx="48" cy="68" r="10" fill="#4ade80" opacity="0.5" />
          </>) : (<>
            <rect x="54" y="90" width="12" height="42" rx="6" fill="#6b4c1e" />
            <circle cx="60" cy="60" r="32" fill="#16a34a" />
            <circle cx="38" cy="74" r="22" fill="#15803d" />
            <circle cx="82" cy="72" r="22" fill="#15803d" />
            <circle cx="60" cy="46" r="20" fill="#22c55e" />
            <circle cx="47" cy="55" r="13" fill="#4ade80" opacity="0.6" />
            <circle cx="73" cy="53" r="11" fill="#4ade80" opacity="0.5" />
            <circle cx="46" cy="40" r="6" fill="rgba(255,255,255,0.18)" />
          </>)}
        </svg>
      </div>

      {/* Barras */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* XP */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>
            <span style={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>XP Nível</span>
            <span style={{ color: "#4ade80", fontWeight: 900 }}>{levelXP}/100</span>
          </div>
          <div style={{ height: 6, background: "#21262d", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${levelXP}%`, background: "linear-gradient(to right,#4ade80,#86efac)", borderRadius: 99, transition: "width 0.7s", boxShadow: "0 0 6px rgba(74,222,128,0.4)" }} />
          </div>
        </div>
        {/* Vida */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>
            <span style={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Vida</span>
            <span style={{ color: "#4ade80", fontWeight: 900 }}>{treeHealth}%</span>
          </div>
          <div style={{ height: 6, background: "#21262d", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${treeHealth}%`, background: treeBarColor, borderRadius: 99, transition: "width 0.7s" }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { label: "Total", value: totalFocusMinutes, unit: "min", color: "white" },
          { label: "Nível", value: `${level} · ${levelName}`, unit: "", color: "#4ade80" },
        ].map(({ label, value, unit, color }) => (
          <div key={label} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 15, fontWeight: 900, color, lineHeight: 1 }}>{value}<span style={{ fontSize: 10, color: "#6b7280", marginLeft: 2 }}>{unit}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
