"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Trophy, Zap, Flame, Award, X, TreePine } from "lucide-react";
import MascotTree from "@/components/MascotTree";
import { useTheme } from "@/contexts/ThemeContext";

export default function Sidebar({ token, userProfile, onLogout, onOpenRanking, onOpenAchievements, onOpenBosque, streak = 0, treeHealth, totalFocusMinutes, xpGain, timerRunning = false, open = true, onClose, totalSessions = 0, microtasks = [], onToggleMicrotask, onDeleteMicrotask, newMicrotask = "", onSetNewMicrotask, onAddMicrotask }) {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const opacity = timerRunning ? 0.2 : 1;
  const pointerEvents = timerRunning ? "none" : "auto";

  const S = {
    aside: { width: 240, flexShrink: 0, background: theme.sidebarBg, borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", padding: 20, gap: 16, overflowY: "auto", overflowX: "hidden", transition: "width 0.3s ease, padding 0.3s ease, background 0.3s, border-color 0.3s" },
    logo: { display: "flex", alignItems: "center", gap: 10 },
    logoIcon: { width: 36, height: 36, borderRadius: 10, background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    logoText: { fontWeight: 900, fontSize: 20, color: theme.text, letterSpacing: "-0.03em" },
    navBtn: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: active ? `1px solid ${theme.accent}40` : "1px solid transparent", background: active ? theme.accentBg : "transparent", color: active ? theme.accent : theme.textMuted, fontSize: 14, fontWeight: active ? 900 : 600, cursor: "pointer", textAlign: "left", width: "100%", fontFamily: "Outfit, sans-serif", transition: "all 0.2s" }),
    streak: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(124,45,18,0.3)", border: "1px solid rgba(154,52,18,0.4)" },
  };

  // Mobile: overlay sidebar
  if (isMobile) {
    if (!open) return null;
    return (
      <>
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40, cursor: "pointer" }} />
        <aside style={{ ...S.aside, position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 50, width: 260, padding: 20, boxShadow: "4px 0 24px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: -8 }}>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, padding: 4 }}><X size={20} /></button>
          </div>
          <SidebarContent theme={theme} token={token} userProfile={userProfile} onLogout={onLogout} onOpenRanking={onOpenRanking} onOpenAchievements={onOpenAchievements} onOpenBosque={onOpenBosque} streak={streak} treeHealth={treeHealth} totalFocusMinutes={totalFocusMinutes} xpGain={xpGain} totalSessions={totalSessions} S={S} microtasks={microtasks} onToggleMicrotask={onToggleMicrotask} onDeleteMicrotask={onDeleteMicrotask} newMicrotask={newMicrotask} onSetNewMicrotask={onSetNewMicrotask} onAddMicrotask={onAddMicrotask} />
        </aside>
      </>
    );
  }

  // Desktop
  return (
    <aside style={{ ...S.aside, width: open ? 240 : 0, padding: open ? 20 : 0, opacity, pointerEvents, overflow: "hidden", minHeight: "100vh", position: "sticky", top: 0 }}>
      <SidebarContent theme={theme} token={token} userProfile={userProfile} onLogout={onLogout} onOpenRanking={onOpenRanking} onOpenAchievements={onOpenAchievements} onOpenBosque={onOpenBosque} streak={streak} treeHealth={treeHealth} totalFocusMinutes={totalFocusMinutes} xpGain={xpGain} totalSessions={totalSessions} S={S} microtasks={microtasks} onToggleMicrotask={onToggleMicrotask} onDeleteMicrotask={onDeleteMicrotask} newMicrotask={newMicrotask} onSetNewMicrotask={onSetNewMicrotask} onAddMicrotask={onAddMicrotask} />
    </aside>
  );
}

function SidebarContent({ theme, token, userProfile, onLogout, onOpenRanking, onOpenAchievements, onOpenBosque, streak, treeHealth, totalFocusMinutes, xpGain, totalSessions, S, microtasks, onToggleMicrotask, onDeleteMicrotask, newMicrotask, onSetNewMicrotask, onAddMicrotask }) {
  const router = useRouter();
  return (<>
      {/* Logo */}
      <div style={S.logo}>
        <div style={S.logoIcon}><Target size={16} color="white" strokeWidth={2.5} /></div>
        <span style={S.logoText}>Grove</span>
      </div>

      {/* Mascote */}
      <MascotTree treeHealth={treeHealth} totalFocusMinutes={totalFocusMinutes} xpGain={xpGain} totalSessions={totalSessions} streak={streak} />

      {/* Microtarefas */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.textDim, marginBottom: 6, fontFamily: "Outfit, sans-serif" }}>
          Microtarefas
        </div>
        {microtasks.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 6 }}>
            {microtasks.map((mt, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 6px", borderRadius: 6, background: mt.completed ? `${theme.accent}10` : "transparent" }}>
                <button
                  onClick={() => onToggleMicrotask(i)}
                  style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${mt.completed ? theme.accent : theme.textDim}`, background: mt.completed ? theme.accent : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0 }}
                >
                  {mt.completed && <span style={{ fontSize: 8, color: "white" }}>✓</span>}
                </button>
                <span style={{ fontSize: 11, color: mt.completed ? theme.accent : theme.textDim, textDecoration: mt.completed ? "line-through" : "none", fontFamily: "Outfit, sans-serif", flex: 1 }}>
                  {mt.text}
                </span>
                <button
                  onClick={() => onDeleteMicrotask(i)}
                  style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", fontSize: 10, padding: 0, opacity: 0.4 }}
                >✕</button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 10, color: theme.textDim, margin: "0 0 6px", fontFamily: "Outfit, sans-serif" }}>
            Adicione passos pra sua tarefa
          </p>
        )}
        <div style={{ display: "flex", gap: 4 }}>
          <input
            type="text"
            value={newMicrotask}
            onChange={e => onSetNewMicrotask(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") onAddMicrotask(); }}
            placeholder="+ Novo passo"
            maxLength={60}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 11, color: theme.textDim, fontFamily: "Outfit, sans-serif", padding: "3px 0" }}
          />
        </div>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div style={S.streak}>
          <Flame size={18} fill="#f97316" color="#f97316" className="fire-anim" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#fb923c" }}>{streak} dias</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#c2410c" }}>em sequência!</div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <button onClick={onOpenBosque} style={S.navBtn(false)}>
          <TreePine size={16} strokeWidth={2} /> Bosque
        </button>
        <button onClick={onOpenRanking} style={S.navBtn(false)}>
          <Trophy size={16} strokeWidth={2} /> Ranking
        </button>
        <button onClick={() => onOpenAchievements()} style={S.navBtn(false)}>
          <Award size={16} strokeWidth={2} /> Conquistas
        </button>
      </nav>
    </>
  );
}
