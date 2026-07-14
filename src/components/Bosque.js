"use client";

import { useMemo } from "react";
import { X, TreePine, Calendar, Clock } from "lucide-react";
import { TREE_TYPES, getCurrentTree } from "./TreeTypes";

// Gera uma posição pseudo-aleatória mas consistente para cada árvore
function getTreePosition(index, total) {
  const cols = Math.max(1, Math.ceil(Math.sqrt(total)));
  const row = Math.floor(index / cols);
  const col = index % cols;
  const offsetX = (row % 2) * 8;
  return {
    x: 15 + (col / Math.max(1, cols - 1)) * 70 + (cols === 1 ? 35 : 0) + offsetX,
    y: 30 + row * 25,
    scale: 0.8 + (index % 3) * 0.1,
  };
}

function BosqueTree({ tree, position, index }) {
  const treeType = TREE_TYPES.find(t => t.id === tree.typeId) || TREE_TYPES[0];
  const colors = treeType.colors;
  const isMature = tree.health > 50;

  return (
    <div
      style={{
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) scale(${position.scale})`,
        transition: "transform 0.3s",
        cursor: "default",
      }}
      title={`${treeType.name} - ${tree.health}% vida`}
    >
      <svg viewBox="0 0 60 70" width={40} height={46}>
        {/* Sombra */}
        <ellipse cx="30" cy="66" rx="12" ry="3" fill="rgba(0,0,0,0.2)" />
        {/* Tronco */}
        <rect x="27" y={isMature ? 40 : 45} width="6" height={isMature ? 26 : 21} rx="3" fill={colors.trunk} />
        {/* Copa */}
        {tree.health <= 25 ? (
          <circle cx="30" cy="38" r="10" fill={colors.leaves[0]} />
        ) : tree.health <= 50 ? (<>
          <circle cx="30" cy="32" r="14" fill={colors.leaves[0]} />
          <circle cx="22" cy="38" r="9" fill={colors.leaves[1]} />
          <circle cx="38" cy="37" r="9" fill={colors.leaves[1]} />
        </>) : tree.health <= 75 ? (<>
          <circle cx="30" cy="28" r="18" fill={colors.leaves[0]} />
          <circle cx="18" cy="35" r="12" fill={colors.leaves[1]} />
          <circle cx="42" cy="34" r="12" fill={colors.leaves[1]} />
          <circle cx="30" cy="20" r="11" fill={colors.leaves[2]} />
        </>) : (<>
          <circle cx="30" cy="24" r="22" fill={colors.leaves[0]} />
          <circle cx="14" cy="32" r="16" fill={colors.leaves[1]} />
          <circle cx="46" cy="30" r="16" fill={colors.leaves[1]} />
          <circle cx="30" cy="14" r="14" fill={colors.leaves[2]} />
          <circle cx="20" cy="20" r="8" fill={colors.leaves[3]} opacity="0.6" />
          <circle cx="40" cy="18" r="7" fill={colors.leaves[3]} opacity="0.5" />
        </>)}
      </svg>
    </div>
  );
}

export default function Bosque({ active, onClose, trees, totalMinutes }) {
  if (!active) return null;

  const stats = useMemo(() => {
    const byType = {};
    let totalHealth = 0;
    trees.forEach(t => {
      byType[t.typeId] = (byType[t.typeId] || 0) + 1;
      totalHealth += t.health;
    });
    return { byType, totalHealth, avgHealth: trees.length ? Math.round(totalHealth / trees.length) : 0 };
  }, [trees]);

  // Últimas 20 árvores (as mais recentes)
  const recentTrees = trees.slice(-20);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
    }}>
      <div style={{
        background: "#0d1117", border: "1px solid #21262d", borderRadius: 20,
        padding: 0, width: "95%", maxWidth: 500, maxHeight: "90vh",
        overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)"
      }}>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
          padding: "20px 20px 16px", position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)", filter: "blur(30px)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 8, fontFamily: "Outfit, sans-serif" }}>
                <TreePine size={22} color="#4ade80" /> Meu Bosque
              </h3>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", margin: "4px 0 0", fontFamily: "Outfit, sans-serif" }}>
                {trees.length} {trees.length === 1 ? "árvore plantada" : "árvores plantadas"} · {totalMinutes} min focando
              </p>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.15)",
              border: "none", display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", cursor: "pointer"
            }}><X size={18} /></button>
          </div>
        </div>

        {/* Bosque visual */}
        <div style={{
          height: 200, position: "relative", overflow: "hidden",
          background: "linear-gradient(180deg, #0a1628 0%, #0d1f0d 50%, #1a2e1a 100%)",
          borderBottom: "1px solid #21262d"
        }}>
          {/* Chão */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 40,
            background: "linear-gradient(180deg, transparent, #1a2e1a)"
          }} />

          {recentTrees.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
              <TreePine size={48} color="#1e3a1e" />
              <p style={{ fontSize: 13, color: "#4a6a4a", margin: 0, fontFamily: "Outfit, sans-serif" }}>
                Complete sessões para plantar árvores
              </p>
            </div>
          ) : (
            recentTrees.map((tree, i) => (
              <BosqueTree
                key={tree.id}
                tree={tree}
                position={getTreePosition(i, recentTrees.length)}
                index={i}
              />
            ))
          )}
        </div>

        {/* Stats */}
        <div style={{ padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
            {[
              { label: "Árvores", value: trees.length, icon: "🌳" },
              { label: "Vida Média", value: `${stats.avgHealth}%`, icon: "💚" },
              { label: "Tipos", value: Object.keys(stats.byType).length, icon: "🧬" },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{
                background: "#161b22", border: "1px solid #21262d", borderRadius: 10,
                padding: "10px 8px", textAlign: "center"
              }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "white", fontFamily: "Outfit, sans-serif" }}>{value}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Tipos plantados */}
          {Object.keys(stats.byType).length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 900, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Tipos plantados
              </div>
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
                      <span style={{ fontSize: 10, color: type.colors.leaves[2], fontWeight: 900, fontFamily: "Outfit, sans-serif" }}>
                        {type.name}
                      </span>
                      <span style={{ fontSize: 10, color: "#6b7280", fontFamily: "Outfit, sans-serif" }}>
                        ×{count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
