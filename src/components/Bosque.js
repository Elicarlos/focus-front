"use client";

import { useMemo } from "react";
import { X, TreePine } from "lucide-react";
import { TREE_TYPES } from "./TreeTypes";
import { useTheme } from "@/contexts/ThemeContext";

function getTreePosition(index, total) {
  if (total === 1) return { x: 50, y: 55, scale: 1.1 };
  const cols = Math.max(2, Math.ceil(Math.sqrt(total)));
  const row = Math.floor(index / cols);
  const col = index % cols;
  return {
    x: 15 + (col / (cols - 1)) * 70,
    y: 35 + row * 30,
    scale: 0.85 + (index % 3) * 0.08,
  };
}

function BosqueTreeSVG({ tree }) {
  const treeType = TREE_TYPES.find(t => t.id === tree.typeId) || TREE_TYPES[0];
  const c = treeType.colors;
  const h = tree.health;

  return (
    <svg viewBox="0 0 60 80" width={80} height={106} className="tree-sway" style={{ overflow: "visible" }}>
      <ellipse cx="30" cy="76" rx="14" ry="4" fill="rgba(0,0,0,0.15)" />
      <rect x="27" y={h > 50 ? 48 : 52} width="6" height={h > 50 ? 28 : 24} rx="3" fill={c.trunk} />
      {h <= 25 ? (
        <circle cx="30" cy="44" r="14" fill={c.leaves[0]} />
      ) : h <= 50 ? (<>
        <circle cx="30" cy="36" r="18" fill={c.leaves[0]} />
        <circle cx="20" cy="44" r="12" fill={c.leaves[1]} />
        <circle cx="40" cy="43" r="12" fill={c.leaves[1]} />
      </>) : h <= 75 ? (<>
        <circle cx="30" cy="30" r="22" fill={c.leaves[0]} />
        <circle cx="16" cy="40" r="16" fill={c.leaves[1]} />
        <circle cx="44" cy="38" r="16" fill={c.leaves[1]} />
        <circle cx="30" cy="20" r="14" fill={c.leaves[2]} />
      </>) : (<>
        <circle cx="30" cy="26" r="26" fill={c.leaves[0]} />
        <circle cx="12" cy="38" r="20" fill={c.leaves[1]} />
        <circle cx="48" cy="36" r="20" fill={c.leaves[1]} />
        <circle cx="30" cy="14" r="18" fill={c.leaves[2]} />
        <circle cx="18" cy="22" r="10" fill={c.leaves[3]} opacity="0.5" />
        <circle cx="42" cy="20" r="9" fill={c.leaves[3]} opacity="0.4" />
      </>)}
    </svg>
  );
}

export default function Bosque({ active, onClose, trees, totalMinutes }) {
  const { theme } = useTheme();

  const stats = useMemo(() => {
    if (!trees || trees.length === 0) return { byType: {}, totalHealth: 0, avgHealth: 0 };
    const byType = {};
    let totalHealth = 0;
    trees.forEach(t => {
      byType[t.typeId] = (byType[t.typeId] || 0) + 1;
      totalHealth += t.health;
    });
    return { byType, totalHealth, avgHealth: Math.round(totalHealth / trees.length) };
  }, [trees]);

  const recentTrees = useMemo(() => (trees || []).slice(-12), [trees]);

  if (!active) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
    }}>
      <div style={{
        background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 20,
        width: "95%", maxWidth: 440, maxHeight: "90vh", overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
      }}>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #065f46, #059669)",
          padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 8, fontFamily: "Outfit, sans-serif" }}>
              <TreePine size={20} /> Meu Bosque
            </h3>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", margin: "4px 0 0", fontFamily: "Outfit, sans-serif" }}>
              {trees.length} {trees.length === 1 ? "árvore" : "árvores"} · {totalMinutes} min focando
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.15)",
            border: "none", display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", cursor: "pointer"
          }}><X size={16} /></button>
        </div>

        {/* Bosque visual */}
        <div style={{
          height: 260, position: "relative", overflow: "hidden",
          background: "linear-gradient(180deg, #0f172a 0%, #1a2e1a 60%, #2d4a2d 100%)"
        }}>
          {/* Chão com grama */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 50,
            background: "linear-gradient(180deg, transparent, #1a3a1a 40%, #2d5a2d)"
          }} />

          {recentTrees.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 10 }}>
              <TreePine size={56} color="#2d5a2d" />
              <p style={{ fontSize: 13, color: "#4a7a4a", margin: 0, fontFamily: "Outfit, sans-serif" }}>
                Complete sessões para plantar árvores
              </p>
            </div>
          ) : (
            recentTrees.map((tree, i) => {
              const pos = getTreePosition(i, recentTrees.length);
              return (
                <div key={tree.id} style={{
                  position: "absolute",
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, -100%) scale(${pos.scale})`,
                  transition: "transform 0.3s",
                }} title={`${TREE_TYPES.find(t => t.id === tree.typeId)?.name || "Árvore"} — ${tree.health}% vida`}>
                  <BosqueTreeSVG tree={tree} />
                </div>
              );
            })
          )}
        </div>

        {/* Stats + Tipos */}
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
            {[
              { label: "Árvores", value: trees.length, icon: "🌳" },
              { label: "Vida Média", value: `${stats.avgHealth}%`, icon: "💚" },
              { label: "Tipos", value: Object.keys(stats.byType).length, icon: "🧬" },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{
                background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10,
                padding: "10px 8px", textAlign: "center"
              }}>
                <div style={{ fontSize: 16, marginBottom: 2 }}>{icon}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: theme.text, fontFamily: "Outfit, sans-serif" }}>{value}</div>
                <div style={{ fontSize: 8, fontWeight: 700, color: theme.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
              </div>
            ))}
          </div>

          {Object.keys(stats.byType).length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.entries(stats.byType).map(([typeId, count]) => {
                const type = TREE_TYPES.find(t => t.id === typeId);
                if (!type) return null;
                return (
                  <div key={typeId} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "4px 10px", borderRadius: 99,
                    background: `${type.colors.leaves[0]}15`,
                    border: `1px solid ${type.colors.leaves[0]}30`
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: type.colors.leaves[2], fontFamily: "Outfit, sans-serif" }}>
                      {type.name}
                    </span>
                    <span style={{ fontSize: 10, color: theme.textDim, fontFamily: "Outfit, sans-serif" }}>
                      ×{count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
