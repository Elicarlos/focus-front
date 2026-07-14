"use client";

import { useMemo } from "react";
import { Sparkles, Sprout, Lock } from "lucide-react";
import { getCurrentTree, getNextTree, getTreeProgress, TREE_TYPES, isTreeUnlocked } from "./TreeTypes";
import { useTheme } from "@/contexts/ThemeContext";

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

// Partículas animadas (folhas, pétalas, sparkles)
function Particles({ type, color, count, running }) {
  if (!running) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={type === "sparkles" ? "sparkle-float" : "particle-fall"}
          style={{
            position: "absolute",
            left: `${15 + Math.random() * 70}%`,
            top: type === "sparkles" ? `${30 + Math.random() * 40}%` : "0%",
            width: type === "sparkles" ? 6 : 8,
            height: type === "sparkles" ? 6 : 8,
            borderRadius: type === "sparkles" ? "50%" : type === "petals" ? "50% 0 50% 0" : "50%",
            background: color,
            opacity: 0.7,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function MascotTree({ treeHealth, totalFocusMinutes, xpGain, totalSessions = 0, streak = 0 }) {
  const { theme } = useTheme();
  const level = getLevel(totalFocusMinutes);
  const levelXP = getLevelXP(totalFocusMinutes);
  const levelName = getLevelName(level);
  const treeLabel = getTreeLabel(treeHealth);

  const stats = useMemo(() => ({ totalSessions, streak, totalXP: totalFocusMinutes }), [totalSessions, streak, totalFocusMinutes]);
  const currentTree = getCurrentTree(stats);
  const nextTree = getNextTree(stats);
  const progress = getTreeProgress(stats);

  const treeBarColor = treeHealth === 0
    ? "linear-gradient(to right,#374151,#4b5563)"
    : treeHealth <= 50
    ? `linear-gradient(to right,${currentTree.colors.leaves[0]},${currentTree.colors.leaves[1]})`
    : `linear-gradient(to right,${currentTree.colors.leaves[2]},${currentTree.colors.leaves[3]})`;

  return (
    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 12, position: "relative", overflow: "hidden", transition: "background 0.3s, border-color 0.3s" }}>

      {/* +XP flutuante */}
      {xpGain && (
        <div className="xp-float" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 20, pointerEvents: "none" }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: theme.accent, display: "flex", alignItems: "center", gap: 6 }}>+25 XP <Sparkles size={20} color={theme.accent} fill={theme.accent} /></span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.textDim, marginBottom: 2 }}>Mascote</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: theme.accent }}>{treeLabel}</div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 99, background: treeHealth === 0 ? theme.border : `${currentTree.colors.leaves[0]}20`, color: treeHealth === 0 ? theme.textDim : currentTree.colors.leaves[2], border: treeHealth === 0 ? `1px solid ${theme.borderLight}` : `1px solid ${currentTree.colors.leaves[0]}40` }}>
          {treeHealth === 0 ? <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Sprout size={12} /> Plantada</span> : `Nív. ${level}`}
        </div>
      </div>

      {/* Árvore SVG */}
      <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
        {currentTree.glow && treeHealth > 0 && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 100, height: 100, borderRadius: "50%", background: "rgba(251,191,36,0.15)", filter: "blur(20px)" }} />
        )}
        <Particles {...currentTree.particles} running={treeHealth > 25} />
        <TreeSVG treeHealth={treeHealth} colors={currentTree.colors} shape={currentTree.shape} />
      </div>

      {/* Barras */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* XP */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>
            <span style={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>XP Nível</span>
            <span style={{ color: currentTree.colors.leaves[2], fontWeight: 900 }}>{levelXP}/100</span>
          </div>
          <div style={{ height: 6, background: "#21262d", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${levelXP}%`, background: `linear-gradient(to right,${currentTree.colors.leaves[2]},${currentTree.colors.leaves[3]})`, borderRadius: 99, transition: "width 0.7s", boxShadow: `0 0 6px ${currentTree.colors.leaves[2]}60` }} />
          </div>
        </div>
        {/* Vida */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>
            <span style={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Vida</span>
            <span style={{ color: currentTree.colors.leaves[2], fontWeight: 900 }}>{treeHealth}%</span>
          </div>
          <div style={{ height: 6, background: "#21262d", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${treeHealth}%`, background: treeBarColor, borderRadius: 99, transition: "width 0.7s" }} />
          </div>
        </div>
        {/* Próxima árvore */}
        {nextTree && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>
              <span style={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Próxima</span>
              <span style={{ color: "#f59e0b", fontWeight: 900, display: "flex", alignItems: "center", gap: 4 }}>
                <Lock size={9} /> {nextTree.name}
              </span>
            </div>
            <div style={{ height: 6, background: "#21262d", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(to right,#f59e0b,#fbbf24)", borderRadius: 99, transition: "width 0.7s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { label: "Total", value: totalFocusMinutes, unit: "min", color: "white" },
          { label: "Árvore", value: currentTree.name, unit: "", color: currentTree.colors.leaves[2] },
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

// SVG da árvore — cada forma tem um estilo diferente
function TreeSVG({ treeHealth, colors, shape }) {
  if (treeHealth === 0) {
    return (
      <svg viewBox="0 0 120 140" width={120} height={120} style={{ overflow: "visible" }}>
        <ellipse cx="60" cy="132" rx="22" ry="5" fill="#21262d" />
        <circle cx="60" cy="128" r="5" fill={colors.leaves[0]} opacity="0.6" />
        <circle cx="60" cy="128" r="3" fill={colors.leaves[3]} />
        <line x1="60" y1="123" x2="60" y2="115" stroke={colors.leaves[0]} strokeWidth="2" strokeLinecap="round" />
        <path d="M60,118 Q55,112 50,113" stroke={colors.leaves[2]} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  const sway = treeHealth > 0 ? "tree-sway" : "";

  if (shape === "pine") {
    return (
      <svg viewBox="0 0 120 140" width={120} height={120} className={sway} style={{ overflow: "visible" }}>
        <ellipse cx="60" cy="132" rx="22" ry="5" fill="#21262d" />
        <rect x="57" y="100" width="6" height="32" rx="3" fill={colors.trunk} />
        {treeHealth <= 25 ? (<>
          <polygon points="60,60 40,100 80,100" fill={colors.leaves[0]} />
          <polygon points="60,70 45,100 75,100" fill={colors.leaves[2]} opacity="0.5" />
        </>) : treeHealth <= 50 ? (<>
          <polygon points="60,50 35,100 85,100" fill={colors.leaves[0]} />
          <polygon points="60,65 40,100 80,100" fill={colors.leaves[1]} />
          <polygon points="60,75 45,100 75,100" fill={colors.leaves[2]} opacity="0.5" />
        </>) : treeHealth <= 75 ? (<>
          <polygon points="60,40 30,100 90,100" fill={colors.leaves[0]} />
          <polygon points="60,55 35,100 85,100" fill={colors.leaves[1]} />
          <polygon points="60,68 40,100 80,100" fill={colors.leaves[2]} />
          <polygon points="60,78 45,100 75,100" fill={colors.leaves[3]} opacity="0.6" />
        </>) : (<>
          <polygon points="60,30 25,100 95,100" fill={colors.leaves[0]} />
          <polygon points="60,45 30,100 90,100" fill={colors.leaves[1]} />
          <polygon points="60,58 35,100 85,100" fill={colors.leaves[2]} />
          <polygon points="60,70 40,100 80,100" fill={colors.leaves[3]} opacity="0.7" />
          <circle cx="60" cy="50" r="4" fill={colors.highlight} />
        </>)}
      </svg>
    );
  }

  if (shape === "bamboo") {
    const stalks = treeHealth > 50 ? 3 : treeHealth > 25 ? 2 : 1;
    return (
      <svg viewBox="0 0 120 140" width={120} height={120} className={sway} style={{ overflow: "visible" }}>
        <ellipse cx="60" cy="132" rx="22" ry="5" fill="#21262d" />
        {stalks >= 1 && <>
          <rect x="56" y="40" width="8" height="92" rx="4" fill={colors.trunk} />
          <line x1="56" y1="70" x2="64" y2="70" stroke={colors.leaves[0]} strokeWidth="2" />
          <line x1="56" y1="95" x2="64" y2="95" stroke={colors.leaves[0]} strokeWidth="2" />
          <path d="M64,55 Q75,50 80,55" stroke={colors.leaves[2]} strokeWidth="2" fill="none" />
          <path d="M64,80 Q78,75 85,80" stroke={colors.leaves[2]} strokeWidth="1.5" fill="none" />
          <ellipse cx="82" cy="53" rx="8" ry="4" fill={colors.leaves[1]} opacity="0.7" transform="rotate(-20 82 53)" />
          <ellipse cx="88" cy="78" rx="10" ry="4" fill={colors.leaves[2]} opacity="0.6" transform="rotate(-15 88 78)" />
        </>}
        {stalks >= 2 && <>
          <rect x="40" y="55" width="7" height="77" rx="3.5" fill={colors.trunk} opacity="0.8" />
          <path d="M47,65 Q35,60 30,65" stroke={colors.leaves[2]} strokeWidth="1.5" fill="none" />
          <ellipse cx="28" cy="63" rx="7" ry="3.5" fill={colors.leaves[1]} opacity="0.6" transform="rotate(20 28 63)" />
        </>}
        {stalks >= 3 && <>
          <rect x="73" y="60" width="6" height="72" rx="3" fill={colors.trunk} opacity="0.7" />
          <path d="M79,70 Q88,65 93,70" stroke={colors.leaves[2]} strokeWidth="1.5" fill="none" />
          <ellipse cx="95" cy="68" rx="7" ry="3" fill={colors.leaves[1]} opacity="0.5" transform="rotate(-25 95 68)" />
        </>}
      </svg>
    );
  }

  // Forma padrão (redonda - carvalho, cerejeira, ipê, dourada)
  if (treeHealth <= 25) {
    return (
      <svg viewBox="0 0 120 140" width={120} height={120} className={sway} style={{ overflow: "visible" }}>
        <ellipse cx="60" cy="132" rx="22" ry="5" fill="#21262d" />
        <rect x="57" y="105" width="6" height="27" rx="3" fill={colors.trunk} />
        <circle cx="60" cy="100" r="12" fill={colors.leaves[0]} />
        <circle cx="52" cy="107" r="8" fill={colors.leaves[1]} />
        <circle cx="68" cy="106" r="8" fill={colors.leaves[1]} />
      </svg>
    );
  }
  if (treeHealth <= 50) {
    return (
      <svg viewBox="0 0 120 140" width={120} height={120} className={sway} style={{ overflow: "visible" }}>
        <ellipse cx="60" cy="132" rx="22" ry="5" fill="#21262d" />
        <rect x="55" y="95" width="10" height="37" rx="5" fill={colors.trunk} />
        <circle cx="60" cy="85" r="20" fill={colors.leaves[0]} />
        <circle cx="44" cy="96" r="13" fill={colors.leaves[1]} />
        <circle cx="76" cy="94" r="13" fill={colors.leaves[1]} />
        <circle cx="60" cy="73" r="12" fill={colors.leaves[2]} />
      </svg>
    );
  }
  if (treeHealth <= 75) {
    return (
      <svg viewBox="0 0 120 140" width={120} height={120} className={sway} style={{ overflow: "visible" }}>
        <ellipse cx="60" cy="132" rx="22" ry="5" fill="#21262d" />
        <rect x="54" y="92" width="12" height="40" rx="6" fill={colors.trunk} />
        <circle cx="60" cy="74" r="26" fill={colors.leaves[0]} />
        <circle cx="40" cy="85" r="18" fill={colors.leaves[1]} />
        <circle cx="80" cy="83" r="18" fill={colors.leaves[1]} />
        <circle cx="60" cy="60" r="17" fill={colors.leaves[2]} />
        <circle cx="48" cy="68" r="10" fill={colors.leaves[3]} opacity="0.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 140" width={120} height={120} className={sway} style={{ overflow: "visible" }}>
      <ellipse cx="60" cy="132" rx="22" ry="5" fill="#21262d" />
      <rect x="54" y="90" width="12" height="42" rx="6" fill={colors.trunk} />
      <circle cx="60" cy="60" r="32" fill={colors.leaves[0]} />
      <circle cx="38" cy="74" r="22" fill={colors.leaves[1]} />
      <circle cx="82" cy="72" r="22" fill={colors.leaves[1]} />
      <circle cx="60" cy="46" r="20" fill={colors.leaves[2]} />
      <circle cx="47" cy="55" r="13" fill={colors.leaves[3]} opacity="0.6" />
      <circle cx="73" cy="53" r="11" fill={colors.leaves[3]} opacity="0.5" />
      <circle cx="46" cy="40" r="6" fill={colors.highlight} />
    </svg>
  );
}
