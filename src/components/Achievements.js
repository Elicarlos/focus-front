import { useState, useEffect } from "react";
import { Trophy, X, Lock, ClipboardList } from "lucide-react";
import { useTheme } from '@/contexts/ThemeContext';

const ACHIEVEMENTS = [
  { id: "first_session", name: "Primeiro Foco", desc: "Complete sua primeira sessão", icon: "🌱", condition: (s) => s.totalSessions >= 1 },
  { id: "five_sessions", name: "Persistente", desc: "Complete 5 sessões", icon: "💪", condition: (s) => s.totalSessions >= 5 },
  { id: "twenty_sessions", name: "Dedicado", desc: "Complete 20 sessões", icon: "🔥", condition: (s) => s.totalSessions >= 20 },
  { id: "hundred_sessions", name: "Mestre do Foco", desc: "Complete 100 sessões", icon: "🏆", condition: (s) => s.totalSessions >= 100 },
  { id: "streak_3", name: "Consistente", desc: "3 dias seguidos focando", icon: "⚡", condition: (s) => s.streak >= 3 },
  { id: "streak_7", name: "Imbatível", desc: "7 dias seguidos focando", icon: "👑", condition: (s) => s.streak >= 7 },
  { id: "streak_30", name: "Lenda", desc: "30 dias seguidos focando", icon: "🌟", condition: (s) => s.streak >= 30 },
  { id: "xp_100", name: "Semente", desc: "Acumule 100 XP", icon: "🌿", condition: (s) => s.totalXP >= 100 },
  { id: "xp_500", name: "Broto", desc: "Acumule 500 XP", icon: "🌳", condition: (s) => s.totalXP >= 500 },
  { id: "xp_1000", name: "Árvore", desc: "Acumule 1000 XP", icon: "🏔️", condition: (s) => s.totalXP >= 1000 },
  { id: "xp_5000", name: "Sequóia", desc: "Acumule 5000 XP", icon: "🌈", condition: (s) => s.totalXP >= 5000 },
  { id: "tree_full", name: "Jardineiro", desc: "Sua árvore ficou 100%", icon: "🌻", condition: (s) => s.treeHealth >= 100 },
];

export default function AchievementsModal({ active, onClose, stats }) {
  if (!active) return null;
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("achievements"); // "achievements" | "projects"
  const [completedProjects, setCompletedProjects] = useState([]);

  useEffect(() => {
    if (active) {
      try {
        const historyStr = localStorage.getItem("pragma_completed_projects") || "[]";
        const history = JSON.parse(historyStr);
        history.sort((a, b) => new Date(b.date) - new Date(a.date));
        setCompletedProjects(history);
      } catch (e) {
        console.error(e);
      }
    }
  }, [active]);

  const unlocked = ACHIEVEMENTS.filter(a => a.condition(stats));
  const locked = ACHIEVEMENTS.filter(a => !a.condition(stats));

  return (
    <div style={{
      position: "fixed", inset: 0, background: theme.victoryBg,
      backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
    }}>
      <div style={{
        background: theme.card, border: `1px solid ${theme.borderLight}`, borderRadius: 20,
        padding: 24, width: "92%", maxWidth: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.6)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h3 style={{
              fontWeight: 900, color: theme.text, fontSize: 16, margin: "0 0 3px",
              display: "flex", alignItems: "center", gap: 8, fontFamily: "Outfit, sans-serif"
            }}>
              <Trophy size={16} color="#f59e0b" /> Realizações
            </h3>
            <p style={{ fontSize: 10, color: theme.textDim, margin: 0, fontFamily: "Outfit, sans-serif" }}>
              {activeTab === "achievements" ? `${unlocked.length}/${ACHIEVEMENTS.length} conquistas liberadas` : `${completedProjects.length} projetos arquivados`}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, background: theme.border, border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: theme.textMuted, cursor: "pointer"
          }}><X size={15} /></button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, borderBottom: `1px solid ${theme.borderLight}`, paddingBottom: 0, marginBottom: 16 }}>
          <button
            onClick={() => setActiveTab("achievements")}
            style={{
              background: "none", border: "none",
              color: activeTab === "achievements" ? theme.text : theme.textMuted,
              fontWeight: 800, fontSize: 13, cursor: "pointer",
              padding: "8px 12px", position: "relative",
              fontFamily: "Outfit, sans-serif", transition: "color 0.2s"
            }}
          >
            🏆 Conquistas
            {activeTab === "achievements" && (
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: theme.accent }} />
            )}
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            style={{
              background: "none", border: "none",
              color: activeTab === "projects" ? theme.text : theme.textMuted,
              fontWeight: 800, fontSize: 13, cursor: "pointer",
              padding: "8px 12px", position: "relative",
              fontFamily: "Outfit, sans-serif", transition: "color 0.2s"
            }}
          >
            <ClipboardList size={14} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
            Projetos Finalizados ({completedProjects.length})
            {activeTab === "projects" && (
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: theme.accent }} />
            )}
          </button>
        </div>

        {/* Conteúdo baseado na Aba */}
        {activeTab === "projects" ? (
          <div style={{ maxHeight: 320, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
            {completedProjects.length > 0 ? (
              completedProjects.map((p) => (
                <div key={p.id} style={{
                  padding: "12px 14px", borderRadius: 12,
                  background: theme.id === "light" ? "#f8fafc" : "#161b22",
                  border: `1px solid ${theme.borderLight}`,
                  display: "flex", flexDirection: "column", gap: 4
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 900, color: theme.text, fontFamily: "Outfit, sans-serif" }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: theme.accent }}>
                      +{p.completedStepsCount > 0 ? 10 + (p.completedStepsCount * 5) : 5} XP
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: theme.textMuted, fontFamily: "Outfit, sans-serif" }}>
                      {p.completedStepsCount || 0}/{p.stepsCount || 0} micro-passos
                    </span>
                    <span style={{ fontSize: 9, color: theme.textMuted, fontFamily: "Outfit, sans-serif" }}>
                      {new Date(p.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", color: theme.textMuted, fontSize: 12, padding: "40px 0", fontFamily: "Outfit, sans-serif" }}>
                Nenhum projeto concluído ainda. Planeje e realize passos de foco para finalizar seu primeiro projeto!
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
            {ACHIEVEMENTS.map(a => {
              const isUnlocked = a.condition(stats);
              return (
                <div key={a.id} style={{
                  padding: 14, borderRadius: 12,
                  background: isUnlocked ? "rgba(20,83,45,0.2)" : theme.inputBg,
                  border: isUnlocked ? "1px solid rgba(20,83,45,0.4)" : `1px solid ${theme.border}`,
                  opacity: isUnlocked ? 1 : 0.5,
                  transition: "all 0.2s"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 20 }}>{a.icon}</span>
                    {isUnlocked ? null : <Lock size={10} color={theme.textDim} />}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: isUnlocked ? theme.text : theme.textDim, fontFamily: "Outfit, sans-serif" }}>
                    {a.name}
                  </div>
                  <div style={{ fontSize: 10, color: theme.textDim, marginTop: 2, fontFamily: "Outfit, sans-serif" }}>
                    {a.desc}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
