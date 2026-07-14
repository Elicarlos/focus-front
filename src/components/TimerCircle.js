"use client";

import { useState, useEffect } from "react";
import { RotateCcw, Zap, Flame, Circle, Timer } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const MODE_FOCUS = 1500;
const MODE_BREAK = 300;
const MAX_SESSIONS = 4;

function getHeatColor(progress) {
  if (progress > 0.6) return "#e6edf3";
  if (progress > 0.4) return "#fbbf24";
  if (progress > 0.2) return "#f97316";
  return "#ef4444";
}

function getHeatGlow(progress) {
  if (progress > 0.6) return "rgba(230,237,243,0)";
  if (progress > 0.4) return "rgba(251,191,36,0.25)";
  if (progress > 0.2) return "rgba(249,115,22,0.35)";
  return "rgba(239,68,68,0.45)";
}

export default function TimerCircle({ timerSeconds, timerRunning, activeTimerMode, handleStartTimer, selectTimerMode, formatTimer, sessionsToday = 0, onStartQuick }) {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 480);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isFocus = activeTimerMode === MODE_FOCUS;
  const progress = timerSeconds / activeTimerMode;
  const isUrgent = progress < 0.15 && timerRunning;

  const heatColor = timerRunning ? getHeatColor(progress) : (isFocus ? theme.accent : "#60a5fa");
  const arcColor = isUrgent ? "#f97316" : isFocus ? theme.accent : "#60a5fa";
  const glowColor = isUrgent ? "rgba(249,115,22,0.3)" : timerRunning ? getHeatGlow(progress) : (isFocus ? theme.timerGlow : "rgba(96,165,250,0.25)");
  const btnBg = isFocus ? theme.accent : "#3b82f6";
  const btnHoverBg = isFocus ? theme.accentLight : "#2563eb";
  const btnLabel = timerRunning ? (isFocus ? "Pausar Foco" : "Pausar Pausa") : (isFocus ? "Iniciar Foco" : "Iniciar Pausa");

  // SVG progress ring - responsive
  const ringRadius = isMobile ? 90 : 140;
  const ringStroke = isMobile ? 5 : 6;
  const timerFontSize = isMobile ? 56 : 96;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progress);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%", maxWidth: 480 }}>

      {/* Sessões dots */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: theme.textDim }}>Sessões hoje:</span>
        {Array.from({ length: MAX_SESSIONS }).map((_, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: "50%",
            background: i < sessionsToday ? theme.accent : theme.border,
            boxShadow: i < sessionsToday ? `0 0 6px ${theme.accent}90` : "none",
            transform: i === sessionsToday - 1 ? "scale(1.3)" : "scale(1)",
            transition: "all 0.5s"
          }} />
        ))}
        <span style={{ fontSize: 11, fontWeight: 700, color: "#4b5563" }}>{sessionsToday}/{MAX_SESSIONS}</span>
      </div>

      {/* Timer com anel de progresso */}
      <div style={{ position: "relative", width: ringRadius * 2 + 40, height: ringRadius * 2 + 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg
          width={ringRadius * 2 + 40}
          height={ringRadius * 2 + 40}
          style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
        >
          {/* Background ring */}
          <circle
            cx={ringRadius + 20}
            cy={ringRadius + 20}
            r={ringRadius}
            fill="none"
            stroke="#21262d"
            strokeWidth={ringStroke}
          />
          {/* Progress ring */}
          <circle
            cx={ringRadius + 20}
            cy={ringRadius + 20}
            r={ringRadius}
            fill="none"
            stroke={heatColor}
            strokeWidth={ringStroke}
            strokeLinecap="round"
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringOffset}
            style={{
              transition: "stroke-dashoffset 1s linear, stroke 0.5s ease",
              filter: timerRunning ? `drop-shadow(0 0 8px ${glowColor})` : "none",
            }}
          />
        </svg>

        {/* Número do timer */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{
            fontSize: timerFontSize,
            fontWeight: 900,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: heatColor,
            transition: "color 0.5s ease",
            fontFamily: "Outfit, sans-serif",
            userSelect: "none",
            textShadow: timerRunning ? `0 0 40px ${glowColor}` : "none",
          }}>
            {formatTimer(timerSeconds)}
          </span>
        </div>
      </div>

      {/* Badge modo */}
      <div style={{
        fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em",
        padding: "6px 16px", borderRadius: 99,
        color: arcColor, border: `1px solid ${arcColor}40`, background: `${arcColor}12`,
        marginTop: -12
      }}>
        {isUrgent
          ? <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Flame size={12} fill={arcColor} color={arcColor} /> Quase lá!</span>
          : <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Circle size={8} fill={arcColor} color={arcColor} /> {isFocus ? "Foco" : "Pausa"}</span>
        }
      </div>

      {/* Seletores de modo */}
      <div style={{ display: "flex", gap: 10 }}>
        {[
          { mode: MODE_FOCUS, label: "Pomodoro · 25m", active: isFocus, color: "#4ade80" },
          { mode: MODE_BREAK, label: "Pausa Curta · 5m", active: !isFocus, color: "#60a5fa" },
        ].map(({ mode, label, active, color }) => (
          <button key={mode} onClick={() => selectTimerMode(mode)} style={{
            padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 900, cursor: "pointer",
            fontFamily: "Outfit, sans-serif",
            border: active ? `1px solid ${color}50` : "1px solid #30363d",
            background: active ? `${color}15` : "transparent",
            color: active ? color : "#6b7280",
            transition: "all 0.2s"
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Botões Iniciar + Reiniciar + Rápido */}
      <div style={{ display: "flex", gap: isMobile ? 6 : 10, width: "100%", maxWidth: 420, flexWrap: isMobile ? "wrap" : "nowrap" }}>
        <button onClick={handleStartTimer} style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: isMobile ? "14px 16px" : "16px 24px", borderRadius: 14, fontSize: isMobile ? 13 : 15, fontWeight: 900,
          background: btnBg, color: "white", border: "none", cursor: "pointer",
          fontFamily: "Outfit, sans-serif", transition: "background 0.2s"
        }}
          onMouseEnter={e => e.currentTarget.style.background = btnHoverBg}
          onMouseLeave={e => e.currentTarget.style.background = btnBg}
        >
          <Zap size={isMobile ? 16 : 18} fill="white" /> {btnLabel}
        </button>
        <button onClick={() => selectTimerMode(activeTimerMode)} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: isMobile ? "14px 14px" : "16px 20px", borderRadius: 14, fontSize: isMobile ? 11 : 13, fontWeight: 900,
          background: "#161b22", color: "#8b949e", border: "1px solid #30363d", cursor: "pointer",
          fontFamily: "Outfit, sans-serif", transition: "all 0.2s"
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#21262d"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#161b22"; e.currentTarget.style.color = "#8b949e"; }}
        >
          <RotateCcw size={isMobile ? 13 : 15} /> {isMobile ? "Reset" : "Reiniciar"}
        </button>
        {isFocus && !timerRunning && (
          <button onClick={onStartQuick} title="Sessão rápida de 5 minutos" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: isMobile ? "14px 12px" : "16px 16px", borderRadius: 14, fontSize: isMobile ? 11 : 12, fontWeight: 900,
            background: "#161b22", color: "#f59e0b", border: "1px solid #92400e", cursor: "pointer",
            fontFamily: "Outfit, sans-serif", transition: "all 0.2s"
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#78350f"; e.currentTarget.style.color = "#fbbf24"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#161b22"; e.currentTarget.style.color = "#f59e0b"; }}
          >
            <Timer size={isMobile ? 13 : 15} /> 5min
          </button>
        )}
      </div>
    </div>
  );
}
