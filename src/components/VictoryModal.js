"use client";

import { Sparkles, ArrowRight, Share2, TreePine } from "lucide-react";
import { useTheme } from '@/contexts/ThemeContext';

export default function VictoryModal({ active, xpGained, totalXP, level, levelName, sessionsToday, onContinue, onShare, sessionType = "focus" }) {
  if (!active) return null;
  const { theme } = useTheme();

  const isFocus = sessionType === "focus";

  return (
    <div style={{
      position: "fixed", inset: 0, background: theme.victoryBg,
      backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.card} 100%)`,
        border: `1px solid ${theme.accent}40`, borderRadius: 24,
        padding: "40px 32px", width: "92%", maxWidth: 380,
        boxShadow: `0 0 80px rgba(74,222,128,0.15), 0 24px 64px rgba(0,0,0,0.6)`,
        textAlign: "center", animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both"
      }}>

        {/* Ícone de vitória */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", boxShadow: "0 0 40px rgba(74,222,128,0.4)"
        }}>
          <Sparkles size={32} color={theme.text} fill={theme.text} />
        </div>

        {/* Título */}
        <h2 style={{
          fontSize: 24, fontWeight: 900, color: theme.text, margin: "0 0 6px",
          fontFamily: "Outfit, sans-serif"
        }}>
          {isFocus ? "Sessão Completa!" : "Pausa Completa!"}
        </h2>
        <p style={{ fontSize: 13, color: theme.textDim, margin: "0 0 24px", fontFamily: "Outfit, sans-serif" }}>
          {isFocus ? "Você focou por 25 minutos. Continue assim!" : "Descanso feito! Hora de voltar ao foco."}
        </p>

        {/* XP ganho */}
        <div style={{
          background: theme.inputBg, border: `1px solid ${theme.borderLight}`, borderRadius: 16,
          padding: "20px 16px", marginBottom: 20
        }}>
          <div style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.textDim, marginBottom: 8 }}>
            XP Ganho
          </div>
          <div style={{ fontSize: 48, fontWeight: 900, color: theme.accentLight, lineHeight: 1, fontFamily: "Outfit, sans-serif" }}>
            +{xpGained}
          </div>
          <div style={{ fontSize: 12, color: theme.textDim, marginTop: 6, fontFamily: "Outfit, sans-serif" }}>
            Total: {totalXP} XP
          </div>
        </div>

        {/* Nível */}
        <div style={{
          background: theme.inputBg, border: `1px solid ${theme.borderLight}`, borderRadius: 16,
          padding: "16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 12
        }}>
          <TreePine size={20} color={theme.accentLight} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.textDim }}>
              Nível Atual
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: theme.text, fontFamily: "Outfit, sans-serif" }}>
              {level} · {levelName}
            </div>
          </div>
        </div>

        {/* Sessões hoje */}
        <div style={{
          fontSize: 12, color: theme.textDim, marginBottom: 24,
          fontFamily: "Outfit, sans-serif"
        }}>
          {sessionsToday}/4 sessões completadas hoje
        </div>

        {/* Botões */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onShare} style={{
            flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center",
            padding: "14px 18px", borderRadius: 12, fontSize: 13, fontWeight: 900,
            background: theme.border, color: theme.textMuted, border: `1px solid ${theme.borderLight}`,
            cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.2s"
          }}
            onMouseEnter={e => { e.currentTarget.style.background = theme.borderLight; e.currentTarget.style.color = theme.text; }}
            onMouseLeave={e => { e.currentTarget.style.background = theme.border; e.currentTarget.style.color = theme.textMuted; }}
          >
            <Share2 size={16} />
          </button>
          <button onClick={onContinue} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 900,
            background: theme.accent, color: theme.text, border: "none",
            cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "background 0.2s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = theme.accentLight}
            onMouseLeave={e => e.currentTarget.style.background = theme.accent}
          >
            Continuar <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
