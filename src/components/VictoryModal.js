"use client";

import { Sparkles, ArrowRight, Share2, TreePine } from "lucide-react";

export default function VictoryModal({ active, xpGained, totalXP, level, levelName, sessionsToday, onContinue, onShare, sessionType = "focus" }) {
  if (!active) return null;

  const isFocus = sessionType === "focus";

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
    }}>
      <div style={{
        background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
        border: "1px solid #22c55e40", borderRadius: 24,
        padding: "40px 32px", width: "92%", maxWidth: 380,
        boxShadow: "0 0 80px rgba(74,222,128,0.15), 0 24px 64px rgba(0,0,0,0.6)",
        textAlign: "center", animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both"
      }}>

        {/* Ícone de vitória */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, #22c55e, #16a34a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", boxShadow: "0 0 40px rgba(74,222,128,0.4)"
        }}>
          <Sparkles size={32} color="white" fill="white" />
        </div>

        {/* Título */}
        <h2 style={{
          fontSize: 24, fontWeight: 900, color: "white", margin: "0 0 6px",
          fontFamily: "Outfit, sans-serif"
        }}>
          {isFocus ? "Sessão Completa!" : "Pausa Completa!"}
        </h2>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 24px", fontFamily: "Outfit, sans-serif" }}>
          {isFocus ? "Você focou por 25 minutos. Continue assim!" : "Descanso feito! Hora de voltar ao foco."}
        </p>

        {/* XP ganho */}
        <div style={{
          background: "#0d1117", border: "1px solid #30363d", borderRadius: 16,
          padding: "20px 16px", marginBottom: 20
        }}>
          <div style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "#4b5563", marginBottom: 8 }}>
            XP Ganho
          </div>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#4ade80", lineHeight: 1, fontFamily: "Outfit, sans-serif" }}>
            +{xpGained}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6, fontFamily: "Outfit, sans-serif" }}>
            Total: {totalXP} XP
          </div>
        </div>

        {/* Nível */}
        <div style={{
          background: "#0d1117", border: "1px solid #30363d", borderRadius: 16,
          padding: "16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 12
        }}>
          <TreePine size={20} color="#4ade80" />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "#4b5563" }}>
              Nível Atual
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "white", fontFamily: "Outfit, sans-serif" }}>
              {level} · {levelName}
            </div>
          </div>
        </div>

        {/* Sessões hoje */}
        <div style={{
          fontSize: 12, color: "#6b7280", marginBottom: 24,
          fontFamily: "Outfit, sans-serif"
        }}>
          {sessionsToday}/4 sessões completadas hoje
        </div>

        {/* Botões */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onShare} style={{
            flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center",
            padding: "14px 18px", borderRadius: 12, fontSize: 13, fontWeight: 900,
            background: "#21262d", color: "#8b949e", border: "1px solid #30363d",
            cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.2s"
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#30363d"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#21262d"; e.currentTarget.style.color = "#8b949e"; }}
          >
            <Share2 size={16} />
          </button>
          <button onClick={onContinue} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 900,
            background: "#22c55e", color: "white", border: "none",
            cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "background 0.2s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#16a34a"}
            onMouseLeave={e => e.currentTarget.style.background = "#22c55e"}
          >
            Continuar <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
