"use client";

import { X, Check, Trophy, Settings, Medal, Zap, ChevronRight } from "lucide-react";

const backdrop = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
};
const card = {
  background: "#161b22", border: "1px solid #30363d", borderRadius: 20,
  padding: 24, width: "92%", maxWidth: 400, boxShadow: "0 24px 64px rgba(0,0,0,0.6)"
};
const modalHeader = {
  display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24
};
const closeBtn = {
  width: 32, height: 32, borderRadius: 8, background: "#21262d", border: "none",
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "#8b949e", cursor: "pointer"
};

export function SettingsModal({ active, onClose, projectDeadline, setProjectDeadline, onSave }) {
  if (!active) return null;
  return (
    <div style={backdrop}>
      <div style={card}>
        <div style={modalHeader}>
          <h3 style={{ fontWeight: 900, color: "white", fontSize: 16, margin: 0, display: "flex", alignItems: "center", gap: 8, fontFamily: "Outfit, sans-serif" }}>
            <Settings size={16} color="#4ade80" /> Prazo do Projeto
          </h3>
          <button onClick={onClose} style={closeBtn}><X size={15} /></button>
        </div>

        {/* Descrição contextual */}
        <p style={{ fontSize: 13, color: "#6e7681", lineHeight: 1.6, margin: "0 0 20px", fontFamily: "Outfit, sans-serif" }}>
          Defina até quando esse projeto precisa estar concluído. O countdown aparece no topo da tela para manter a urgência visível enquanto você foca.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "#4b5563", display: "block", marginBottom: 8, fontFamily: "Outfit, sans-serif" }}>Data Limite</label>
          <input
            type="date" value={projectDeadline} onChange={e => setProjectDeadline(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 12, background: "#0d1117", border: "1px solid #30363d", color: "white", fontFamily: "Outfit, sans-serif", fontSize: 14, fontWeight: 700, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <button onClick={onSave} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 0", borderRadius: 12, background: "#22c55e", color: "white", fontWeight: 900, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>
          <Check size={16} /> Salvar
        </button>
      </div>
    </div>
  );
}

export function RankingModal({ active, onClose, rankingList, currentUser, isOffline }) {
  if (!active) return null;

  const medalEmoji = ["🥇", "🥈", "🥉"];

  return (
    <div style={backdrop}>
      <div style={{ ...card, maxWidth: 380, padding: "20px" }}>

        {/* Header simples */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontWeight: 900, color: "white", fontSize: 18, margin: 0, fontFamily: "Outfit, sans-serif" }}>
              🏆 Ranking
            </h3>
            <p style={{ fontSize: 11, color: "#4b5563", margin: "4px 0 0", fontFamily: "Outfit, sans-serif" }}>
              {rankingList.length} jogadores
            </p>
          </div>
          <button onClick={onClose} style={closeBtn}><X size={16} /></button>
        </div>

        {/* Lista limpa */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 360, overflowY: "auto" }}>
          {rankingList.map((user, idx) => {
            const isMe = currentUser && user.username === currentUser.username;
            return (
              <div key={user.username} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", borderRadius: 12,
                background: isMe ? "rgba(74,222,128,0.12)" : idx === 0 ? "rgba(245,158,11,0.08)" : "#0d1117",
                border: isMe ? "1px solid rgba(74,222,128,0.3)" : "1px solid #21262d",
              }}>
                <span style={{ width: 28, textAlign: "center", flexShrink: 0, fontSize: idx < 3 ? 18 : 13, fontWeight: 900, color: idx < 3 ? "white" : "#6b7280" }}>
                  {idx < 3 ? medalEmoji[idx] : idx + 1}
                </span>
                {user.avatar_url
                  ? <img src={user.avatar_url} style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} alt="" />
                  : <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#166534", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{user.username?.[0]?.toUpperCase() || "U"}</div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: isMe ? "#4ade80" : "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "Outfit, sans-serif" }}>
                    {user.username} {isMe && <span style={{ fontSize: 10, color: "#4ade80", opacity: 0.7 }}>(você)</span>}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#4ade80", flexShrink: 0, fontFamily: "Outfit, sans-serif" }}>
                  {user.xp ?? user.level}
                  <span style={{ fontSize: 10, color: "#4b5563", marginLeft: 2 }}>XP</span>
                </div>
              </div>
            );
          })}

          {rankingList.length === 0 && (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              <p style={{ fontSize: 28, margin: 0 }}>{isOffline ? "📡" : "🏆"}</p>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "8px 0 0", fontFamily: "Outfit, sans-serif" }}>
                {isOffline ? "Servidor indisponível" : "Ninguém ainda"}
              </p>
              {isOffline && (
                <p style={{ fontSize: 11, color: "#4b5563", margin: "4px 0 0", fontFamily: "Outfit, sans-serif" }}>
                  Tente novamente mais tarde
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const MOODS = [
  { id: "anxious",  icon: "😰", label: "Ansioso",   color: "#f97316", hint: "Normal sentir isso. Um micro-passo vai quebrar o bloqueio." },
  { id: "bored",    icon: "😑", label: "Entediado",  color: "#60a5fa", hint: "Tédio some nos primeiros 3 minutos. Só comece." },
  { id: "stuck",    icon: "😤", label: "Travado",    color: "#a78bfa", hint: "Defina só o primeiro passo físico. Sem pressão pelo resto." },
  { id: "ready",    icon: "✅", label: "Pronto",     color: "#4ade80", hint: null },
];

export function CheckInModal({ active, task, selectedMood, setSelectedMood, microStep, setMicroStep, onConfirm, onClose }) {
  if (!active) return null;

  const mood = MOODS.find(m => m.id === selectedMood);
  const needsMicroStep = selectedMood && selectedMood !== "ready";
  const canStart = selectedMood === "ready" || (needsMicroStep && microStep.trim().length > 0);

  return (
    <div style={backdrop}>
      <div style={{ ...card, maxWidth: 440 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "#4ade80", marginBottom: 6, fontFamily: "Outfit, sans-serif" }}>
              Antes de começar
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "white", fontFamily: "Outfit, sans-serif", lineHeight: 1.3 }}>
              "{task}"
            </div>
          </div>
          <button onClick={onClose} style={closeBtn}><X size={15} /></button>
        </div>

        {/* Pergunta emocional */}
        <p style={{ fontSize: 13, color: "#6e7681", margin: "0 0 14px", fontFamily: "Outfit, sans-serif" }}>
          Como você está em relação a essa tarefa?
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          {MOODS.map(m => (
            <button key={m.id} onClick={() => setSelectedMood(m.id)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
              borderRadius: 10, cursor: "pointer", fontFamily: "Outfit, sans-serif",
              border: selectedMood === m.id ? `1px solid ${m.color}60` : "1px solid #30363d",
              background: selectedMood === m.id ? `${m.color}15` : "#0d1117",
              color: selectedMood === m.id ? m.color : "#6b7280",
              fontWeight: selectedMood === m.id ? 900 : 600,
              fontSize: 13, transition: "all 0.15s"
            }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        {/* Hint contextual */}
        {mood?.hint && (
          <div style={{ padding: "10px 14px", borderRadius: 10, background: `${mood.color}10`, border: `1px solid ${mood.color}30`, marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: mood.color, margin: 0, fontFamily: "Outfit, sans-serif", lineHeight: 1.5 }}>
              {mood.hint}
            </p>
          </div>
        )}

        {/* Campo de micro-passo — aparece só se não estiver pronto */}
        {needsMicroStep && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "#4b5563", display: "block", marginBottom: 8, fontFamily: "Outfit, sans-serif" }}>
              Qual é o primeiro passo? (só um, pequeno)
            </label>
            <input
              type="text"
              value={microStep}
              onChange={e => setMicroStep(e.target.value)}
              onKeyDown={e => e.key === "Enter" && canStart && onConfirm()}
              placeholder="Ex: Abrir o documento e ler o primeiro parágrafo"
              maxLength={100}
              autoFocus
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 10,
                background: "#0d1117", border: "1px solid #30363d",
                color: "white", fontFamily: "Outfit, sans-serif", fontSize: 13,
                fontWeight: 600, outline: "none", boxSizing: "border-box"
              }}
            />
          </div>
        )}

        {/* Botão confirmar */}
        <button
          onClick={onConfirm}
          disabled={!canStart}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "14px 0", borderRadius: 12, fontSize: 14, fontWeight: 900,
            border: "none", cursor: canStart ? "pointer" : "not-allowed",
            fontFamily: "Outfit, sans-serif", transition: "all 0.2s",
            background: canStart ? "#22c55e" : "#21262d",
            color: canStart ? "white" : "#4b5563",
          }}
        >
          <Zap size={16} fill={canStart ? "white" : "#4b5563"} />
          {selectedMood === "ready" ? "Iniciar Foco!" : canStart ? "Iniciar com esse passo" : "Selecione como está se sentindo"}
          {canStart && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
}
