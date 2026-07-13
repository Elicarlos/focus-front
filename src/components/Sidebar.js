"use client";

import { Target, Timer, Trophy, Zap, Flame } from "lucide-react";
import MascotTree from "@/components/MascotTree";

const S = {
  aside: { width: 240, flexShrink: 0, background: "#161b22", borderRight: "1px solid #21262d", display: "flex", flexDirection: "column", padding: 20, gap: 16, minHeight: "100vh", position: "sticky", top: 0, overflowY: "auto", overflowX: "hidden", transition: "width 0.3s ease, opacity 0.3s ease, padding 0.3s ease" },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { width: 36, height: 36, borderRadius: 10, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  logoText: { fontWeight: 900, fontSize: 20, color: "white", letterSpacing: "-0.03em" },
  navBtn: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: active ? "1px solid rgba(74,222,128,0.3)" : "1px solid transparent", background: active ? "rgba(74,222,128,0.1)" : "transparent", color: active ? "#4ade80" : "#8b949e", fontSize: 14, fontWeight: active ? 900 : 600, cursor: "pointer", textAlign: "left", width: "100%", fontFamily: "Outfit, sans-serif" }),
  streak: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(124,45,18,0.3)", border: "1px solid rgba(154,52,18,0.4)" },
  loginHint: { display: "flex", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 10, background: "rgba(20,83,45,0.2)", border: "1px solid rgba(20,83,45,0.3)" },
  loginBox: { padding: 12, borderRadius: 10, background: "#0d1117", border: "1px solid #30363d", overflow: "hidden" },
  loginLabel: { fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "#4b5563", marginBottom: 10, textAlign: "center" },
  profileBox: { display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: 10, background: "rgba(20,83,45,0.25)", border: "1px solid rgba(20,83,45,0.4)" },
  avatar: { width: 36, height: 36, borderRadius: "50%", flexShrink: 0 },
  avatarFallback: { width: 36, height: 36, borderRadius: "50%", background: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, flexShrink: 0 },
};

export default function Sidebar({ token, userProfile, googleBtnContainerRef, onLogout, onOpenRanking, streak = 0, treeHealth, totalFocusMinutes, xpGain, timerRunning = false, open = true }) {
  const opacity = timerRunning ? 0.2 : open ? 1 : 0;
  const pointerEvents = (timerRunning || !open) ? "none" : "auto";

  return (
    <aside style={{
      ...S.aside,
      width: open ? 240 : 0,
      padding: open ? 20 : 0,
      opacity,
      pointerEvents,
      overflow: "hidden",
    }}>

      {/* Logo */}
      <div style={S.logo}>
        <div style={S.logoIcon}><Target size={16} color="white" strokeWidth={2.5} /></div>
        <span style={S.logoText}>Grove</span>
      </div>

      {/* Mascote */}
      <MascotTree treeHealth={treeHealth} totalFocusMinutes={totalFocusMinutes} xpGain={xpGain} />

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
        <button style={S.navBtn(true)}>
          <Timer size={16} strokeWidth={2.5} /> Sessão de Foco
        </button>
        <button onClick={onOpenRanking} style={S.navBtn(false)}>
          <Trophy size={16} strokeWidth={2} /> Ranking Global
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
            <div style={S.loginBox}>
              <div style={S.loginLabel}>Entrar na conta</div>
              <div ref={googleBtnContainerRef} id="google-login-btn" />
            </div>
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
    </aside>
  );
}
