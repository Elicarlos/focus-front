"use client";

import { RotateCcw, Zap, Flame, Circle } from "lucide-react";

const MODE_FOCUS = 1500;
const MODE_BREAK = 300;
const MAX_SESSIONS = 4;

export default function TimerCircle({ timerSeconds, timerRunning, activeTimerMode, handleStartTimer, selectTimerMode, formatTimer, sessionsToday = 0 }) {
  const isFocus = activeTimerMode === MODE_FOCUS;
  const progress = timerSeconds / activeTimerMode;
  const isUrgent = progress < 0.15 && timerRunning;

  const arcColor = isUrgent ? "#f97316" : isFocus ? "#4ade80" : "#60a5fa";
  const glowColor = isUrgent ? "rgba(249,115,22,0.3)" : isFocus ? "rgba(74,222,128,0.25)" : "rgba(96,165,250,0.25)";
  const btnBg = isFocus ? "#22c55e" : "#3b82f6";
  const btnHoverBg = isFocus ? "#16a34a" : "#2563eb";
  const btnLabel = timerRunning ? (isFocus ? "Pausar Foco" : "Pausar Pausa") : (isFocus ? "Iniciar Foco" : "Iniciar Pausa");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%", maxWidth: 480 }}>

      {/* Sessões dots */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#4b5563" }}>Sessões hoje:</span>
        {Array.from({ length: MAX_SESSIONS }).map((_, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: "50%",
            background: i < sessionsToday ? "#4ade80" : "#21262d",
            boxShadow: i < sessionsToday ? "0 0 6px rgba(74,222,128,0.6)" : "none",
            transform: i === sessionsToday - 1 ? "scale(1.3)" : "scale(1)",
            transition: "all 0.5s"
          }} />
        ))}
        <span style={{ fontSize: 11, fontWeight: 700, color: "#4b5563" }}>{sessionsToday}/{MAX_SESSIONS}</span>
      </div>

      {/* Número grande */}
      <div style={timerRunning ? { filter: `drop-shadow(0 0 40px ${glowColor})` } : {}}>
        <span style={{
          fontSize: 112,
          fontWeight: 900,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: timerRunning ? arcColor : "#e6edf3",
          transition: "color 0.3s",
          fontFamily: "Outfit, sans-serif",
          userSelect: "none"
        }}>
          {formatTimer(timerSeconds)}
        </span>
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

      {/* Botões Iniciar + Reiniciar */}
      <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 380 }}>
        <button onClick={handleStartTimer} style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "16px 24px", borderRadius: 14, fontSize: 15, fontWeight: 900,
          background: btnBg, color: "white", border: "none", cursor: "pointer",
          fontFamily: "Outfit, sans-serif", transition: "background 0.2s"
        }}
          onMouseEnter={e => e.currentTarget.style.background = btnHoverBg}
          onMouseLeave={e => e.currentTarget.style.background = btnBg}
        >
          <Zap size={18} fill="white" /> {btnLabel}
        </button>
        <button onClick={() => selectTimerMode(activeTimerMode)} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "16px 20px", borderRadius: 14, fontSize: 13, fontWeight: 900,
          background: "#161b22", color: "#8b949e", border: "1px solid #30363d", cursor: "pointer",
          fontFamily: "Outfit, sans-serif", transition: "all 0.2s"
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#21262d"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#161b22"; e.currentTarget.style.color = "#8b949e"; }}
        >
          <RotateCcw size={15} /> Reiniciar
        </button>
      </div>
    </div>
  );
}
