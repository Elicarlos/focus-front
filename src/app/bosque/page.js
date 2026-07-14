"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TreePine } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { TREE_TYPES } from "@/components/TreeTypes";

function getTreePosition(index, total) {
  const cols = Math.ceil(Math.sqrt(total * 1.5));
  const row = Math.floor(index / cols);
  const col = index % cols;
  const offsetX = (row % 2) * 12;
  return {
    x: (col / cols) * 90 + 5 + offsetX,
    y: 55 + row * 30,
    scale: 0.8 + (index % 3) * 0.1,
  };
}

function BosqueTreeSVG({ tree, position }) {
  const treeType = TREE_TYPES.find(t => t.id === tree.typeId) || TREE_TYPES[0];
  const c = treeType.colors;
  const h = tree.health;

  return (
    <div
      style={{
        position: "absolute", left: `${position.x}%`, top: `${position.y}%`,
        transform: `translate(-50%, -100%) scale(${position.scale})`,
        transition: "transform 0.3s",
      }}
      title={`${treeType.name} · ${h}% vida`}
    >
      <svg viewBox="0 0 60 80" width={48} height={64}>
        <ellipse cx="30" cy="76" rx="14" ry="4" fill="rgba(0,0,0,0.25)" />
        <rect x="27" y={h > 50 ? 48 : 52} width="6" height={h > 50 ? 28 : 24} rx="3" fill={c.trunk} />
        {h <= 25 ? (
          <circle cx="30" cy="44" r="12" fill={c.leaves[0]} />
        ) : h <= 50 ? (<>
          <circle cx="30" cy="38" r="16" fill={c.leaves[0]} />
          <circle cx="20" cy="46" r="10" fill={c.leaves[1]} />
          <circle cx="40" cy="45" r="10" fill={c.leaves[1]} />
        </>) : h <= 75 ? (<>
          <circle cx="30" cy="32" r="20" fill={c.leaves[0]} />
          <circle cx="16" cy="42" r="14" fill={c.leaves[1]} />
          <circle cx="44" cy="40" r="14" fill={c.leaves[1]} />
          <circle cx="30" cy="22" r="13" fill={c.leaves[2]} />
        </>) : (<>
          <circle cx="30" cy="28" r="24" fill={c.leaves[0]} />
          <circle cx="12" cy="38" r="18" fill={c.leaves[1]} />
          <circle cx="48" cy="36" r="18" fill={c.leaves[1]} />
          <circle cx="30" cy="16" r="16" fill={c.leaves[2]} />
          <circle cx="18" cy="22" r="9" fill={c.leaves[3]} opacity="0.5" />
          <circle cx="42" cy="20" r="8" fill={c.leaves[3]} opacity="0.4" />
        </>)}
      </svg>
    </div>
  );
}

export default function BosquePage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [trees, setTrees] = useState([]);
  const [totalMinutes, setTotalMinutes] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("pragma_bosque");
    if (saved) { try { setTrees(JSON.parse(saved)); } catch {} }
    const state = localStorage.getItem("pragma_state_minimal");
    if (state) { try { setTotalMinutes(JSON.parse(state).totalFocusMinutes || 0); } catch {} }
  }, []);

  const stats = useMemo(() => {
    const byType = {};
    let totalHealth = 0;
    trees.forEach(t => {
      byType[t.typeId] = (byType[t.typeId] || 0) + 1;
      totalHealth += t.health;
    });
    return { byType, avgHealth: trees.length ? Math.round(totalHealth / trees.length) : 0 };
  }, [trees]);

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "Outfit, sans-serif" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
        padding: "24px 20px 28px", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)", filter: "blur(40px)" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <button onClick={() => router.push("/dashboard")} style={{
            background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10,
            padding: "8px 12px", cursor: "pointer", color: theme.text, display: "flex",
            alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, marginBottom: 16,
            fontFamily: "Outfit, sans-serif"
          }}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: theme.text, margin: "0 0 6px", display: "flex", alignItems: "center", gap: 10 }}>
            <TreePine size={28} color={theme.accentLight} /> Meu Bosque
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0 }}>
            {trees.length} {trees.length === 1 ? "árvore plantada" : "árvores plantadas"} · {totalMinutes} min focando
          </p>
        </div>
      </div>

      {/* Bosque visual */}
      <div style={{
        maxWidth: 700, margin: "0 auto", padding: "20px"
      }}>
        <div style={{
          height: 350, position: "relative", overflow: "hidden", borderRadius: 16,
          background: "linear-gradient(180deg, #0a1628 0%, #0d1f0d 40%, #1a2e1a 100%)",
          border: `1px solid ${theme.border}`
        }}>
          {/* Estrelas */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${5 + Math.random() * 90}%`,
              top: `${3 + Math.random() * 30}%`,
              width: 2, height: 2, borderRadius: "50%",
              background: "rgba(255,255,255,0.4)",
              animationDelay: `${i * 0.3}s`
            }} className="sparkle-float" />
          ))}

          {/* Chão */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 50,
            background: "linear-gradient(180deg, transparent, #1a2e1a)"
          }} />

          {trees.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
              <TreePine size={64} color="#1e3a1e" />
              <p style={{ fontSize: 15, color: "#4a6a4a", margin: 0 }}>Complete sessões para plantar árvores</p>
              <button onClick={() => router.push("/dashboard")} style={{
                padding: "10px 24px", borderRadius: 10, background: theme.accent, color: theme.text,
                border: "none", fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "Outfit, sans-serif"
              }}>
                Começar a focar
              </button>
            </div>
          ) : (
            trees.map((tree, i) => (
              <BosqueTreeSVG key={tree.id} tree={tree} position={getTreePosition(i, trees.length)} />
            ))
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 20 }}>
          {[
            { label: "Árvores", value: trees.length, icon: "🌳", color: theme.accentLight },
            { label: "Vida Média", value: `${stats.avgHealth}%`, icon: "💚", color: theme.accent },
            { label: "Tipos", value: Object.keys(stats.byType).length, icon: "🧬", color: "#fbbf24" },
          ].map(({ label, value, icon, color }) => (
            <div key={label} style={{
              background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 14,
              padding: "16px 12px", textAlign: "center"
            }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tipos plantados */}
        {Object.keys(stats.byType).length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: theme.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
              Tipos plantados
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.entries(stats.byType).map(([typeId, count]) => {
                const type = TREE_TYPES.find(t => t.id === typeId);
                if (!type) return null;
                return (
                  <div key={typeId} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 14px", borderRadius: 12,
                    background: `${type.colors.leaves[0]}12`,
                    border: `1px solid ${type.colors.leaves[0]}30`
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 900, color: type.colors.leaves[2] }}>{type.name}</span>
                    <span style={{ fontSize: 12, color: theme.textDim }}>×{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
