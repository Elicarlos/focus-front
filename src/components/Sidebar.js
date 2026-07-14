"use client";

import { useEffect, useState } from "react";
import { Target, Timer, Trophy, Zap, Flame, Award, X, TreePine } from "lucide-react";
import MascotTree from "@/components/MascotTree";

const S = {
  aside: { width: 240, flexShrink: 0, background: "#161b22", borderRight: "1px solid #21262d", display: "flex", flexDirection: "column", padding: 20, gap: 16, overflowY: "auto", overflowX: "hidden", transition: "width 0.3s ease, padding 0.3s ease" },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { width: 36, height: 36, borderRadius: 10, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  logoText: { fontWeight: 900, fontSize: 20, color: "white", letterSpacing: "-0.03em" },
  navBtn: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: active ? "1px solid rgba(74,222,128,0.3)" : "1px solid transparent", background: active ? "rgba(74,222,128,0.1)" : "transparent", color: active ? "#4ade80" : "#8b949e", fontSize: 14, fontWeight: active ? 900 : 600, cursor: "pointer", textAlign: "left", width: "100%", fontFamily: "Outfit, sans-serif" }),
  streak: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(124,45,18,0.3)", border: "1px solid rgba(154,52,18,0.4)" },
  loginHint: { display: "flex", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 10, background: "rgba(20,83,45,0.2)", border: "1px solid rgba(20,83,45,0.3)" },
  loginBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #30363d", background: "#21262d", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.2s ease" },
  profileBox: { display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: 10, background: "rgba(20,83,45,0.25)", border: "1px solid rgba(20,83,45,0.4)" },
  avatar: { width: 36, height: 36, borderRadius: "50%", flexShrink: 0 },
  avatarFallback: { width: 36, height: 36, borderRadius: "50%", background: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, flexShrink: 0 },
};

export default function Sidebar({ token, userProfile, onLogout, onOpenRanking, onOpenAchievements, onOpenBosque, streak = 0, treeHealth, totalFocusMinutes, xpGain, timerRunning = false, open = true, onClose, totalSessions = 0 }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const opacity = timerRunning ? 0.2 : 1;
  const pointerEvents = timerRunning ? "none" : "auto";

  // Mobile: overlay sidebar
  if (isMobile) {
    if (!open) return null;
    return (
      <>
        {/* Overlay backdrop */}
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 40, cursor: "pointer"
          }}
        />
        {/* Sidebar */}
        <aside style={{
          ...S.aside,
          position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 50,
          width: 260, padding: 20,
          boxShadow: "4px 0 24px rgba(0,0,0,0.5)",
        }}>
          {/* Botão fechar */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: -8 }}>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8b949e", padding: 4 }}>
              <X size={20} />
            </button>
          </div>
          <SidebarContent token={token} userProfile={userProfile} onLogout={onLogout} onOpenRanking={onOpenRanking} onOpenAchievements={onOpenAchievements} onOpenBosque={onOpenBosque} streak={streak} treeHealth={treeHealth} totalFocusMinutes={totalFocusMinutes} xpGain={xpGain} totalSessions={totalSessions} />
        </aside>
      </>
    );
  }

  // Desktop
  return (
    <aside style={{
      ...S.aside,
      width: open ? 240 : 0,
      padding: open ? 20 : 0,
      opacity,
      pointerEvents,
      overflow: "hidden",
      minHeight: "100vh",
      position: "sticky",
      top: 0,
    }}>
      <SidebarContent token={token} userProfile={userProfile} onLogout={onLogout} onOpenRanking={onOpenRanking} onOpenAchievements={onOpenAchievements} onOpenBosque={onOpenBosque} streak={streak} treeHealth={treeHealth} totalFocusMinutes={totalFocusMinutes} xpGain={xpGain} totalSessions={totalSessions} />
    </aside>
  );
}

function SidebarContent({ token, userProfile, onLogout, onOpenRanking, onOpenAchievements, onOpenBosque, streak, treeHealth, totalFocusMinutes, xpGain, totalSessions }) {
  return (<>
      {/* Logo */}
      <div style={S.logo}>
        <div style={S.logoIcon}><Target size={16} color="white" strokeWidth={2.5} /></div>
        <span style={S.logoText}>Grove</span>
      </div>

      {/* Mascote */}
      <MascotTree treeHealth={treeHealth} totalFocusMinutes={totalFocusMinutes} xpGain={xpGain} totalSessions={totalSessions} streak={streak} />

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
        <button onClick={onOpenAchievements} style={S.navBtn(false)}>
          <Award size={16} strokeWidth={2} /> Conquistas
        </button>
      </nav>

      {/* Login / Perfil */}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {!token ? (
          <>
            <div style={S.loginHint}>
              <Zap size={13} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 10, fontWeight: 600, color: "#166534", lineHeight: 1.5, margin: 0 }}>
                Entre com Google para salvar progresso e aparecer no ranking.
              </p>
            </div>
            <button
              onClick={() => window.google?.accounts?.id?.prompt()}
              style={S.loginBtn}
              onMouseEnter={e => { e.currentTarget.style.background = "#30363d"; e.currentTarget.style.borderColor = "#22c55e"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#21262d"; e.currentTarget.style.borderColor = "#30363d"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Entrar com Google
            </button>
          </>
        ) : (
          <div style={S.profileBox}>
            {userProfile?.avatar_url
              ? <img src={userProfile.avatar_url} style={S.avatar} alt="" />
              : <div style={S.avatarFallback}>{userProfile?.username?.[0]?.toUpperCase() || "U"}</div>
            }
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userProfile?.username}</div>
              <div style={{ fontSize: 10, color: "#6e7681", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userProfile?.email}</div>
            </div>
            <button onClick={onLogout} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 900, color: "#f87171", fontFamily: "Outfit, sans-serif", flexShrink: 0 }}>Sair</button>
          </div>
        )}
      </div>
    </>
  );
}
