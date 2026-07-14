"use client";

import { X, Check, Trophy, Settings, Medal, Zap, ChevronRight } from "lucide-react";
import { useTheme } from '@/contexts/ThemeContext';

const backdrop = (theme) => ({
  position: "fixed", inset: 0, background: theme.victoryBg, backdropFilter: "blur(8px)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
});
const card = (theme) => ({
  background: theme.card, border: `1px solid ${theme.borderLight}`, borderRadius: 20,
  padding: 24, width: "92%", maxWidth: 400, boxShadow: "0 24px 64px rgba(0,0,0,0.6)"
});
const modalHeader = {
  display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24
};
const closeBtn = (theme) => ({
  width: 32, height: 32, borderRadius: 8, background: theme.border, border: "none",
  display: "flex", alignItems: "center", justifyContent: "center",
  color: theme.textMuted, cursor: "pointer"
});

export function SettingsModal({ active, onClose, projectDeadline, setProjectDeadline, onSave }) {
  if (!active) return null;
  const { theme } = useTheme();
  return (
    <div style={backdrop(theme)}>
      <div style={card(theme)}>
        <div style={modalHeader}>
          <h3 style={{ fontWeight: 900, color: theme.text, fontSize: 16, margin: 0, display: "flex", alignItems: "center", gap: 8, fontFamily: "Outfit, sans-serif" }}>
            <Settings size={16} color={theme.accentLight} /> Prazo do Projeto
          </h3>
          <button onClick={onClose} style={closeBtn(theme)}><X size={15} /></button>
        </div>

        {/* Descrição contextual */}
        <p style={{ fontSize: 13, color: theme.textDim, lineHeight: 1.6, margin: "0 0 20px", fontFamily: "Outfit, sans-serif" }}>
          Defina até quando esse projeto precisa estar concluído. O countdown aparece no topo da tela para manter a urgência visível enquanto você foca.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.textDim, display: "block", marginBottom: 8, fontFamily: "Outfit, sans-serif" }}>Data Limite</label>
          <input
            type="date" value={projectDeadline} onChange={e => setProjectDeadline(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 12, background: theme.inputBg, border: `1px solid ${theme.borderLight}`, color: theme.text, fontFamily: "Outfit, sans-serif", fontSize: 14, fontWeight: 700, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <button onClick={onSave} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 0", borderRadius: 12, background: theme.accent, color: theme.text, fontWeight: 900, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>
          <Check size={16} /> Salvar
        </button>
      </div>
    </div>
  );
}

export function RankingModal({ active, onClose, rankingList, currentUser, isOffline }) {
  if (!active) return null;
  const { theme } = useTheme();

  const medalEmoji = ["🥇", "🥈", "🥉"];

  return (
    <div style={backdrop(theme)}>
      <div style={{ ...card(theme), maxWidth: 380, padding: "20px" }}>

        {/* Header simples */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontWeight: 900, color: theme.text, fontSize: 18, margin: 0, fontFamily: "Outfit, sans-serif" }}>
              🏆 Ranking
            </h3>
            <p style={{ fontSize: 11, color: theme.textDim, margin: "4px 0 0", fontFamily: "Outfit, sans-serif" }}>
              {rankingList.length} jogadores
            </p>
          </div>
          <button onClick={onClose} style={closeBtn(theme)}><X size={16} /></button>
        </div>

        {/* Lista limpa */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 360, overflowY: "auto" }}>
          {rankingList.map((user, idx) => {
            const isMe = currentUser && user.username === currentUser.username;
            return (
              <div key={user.username} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", borderRadius: 12,
                background: isMe ? "rgba(74,222,128,0.12)" : idx === 0 ? "rgba(245,158,11,0.08)" : theme.inputBg,
                border: isMe ? "1px solid rgba(74,222,128,0.3)" : `1px solid ${theme.border}`,
              }}>
                <span style={{ width: 28, textAlign: "center", flexShrink: 0, fontSize: idx < 3 ? 18 : 13, fontWeight: 900, color: idx < 3 ? theme.text : theme.textDim }}>
                  {idx < 3 ? medalEmoji[idx] : idx + 1}
                </span>
                {user.avatar_url
                  ? <img src={user.avatar_url} style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} alt="" />
                  : <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#166534", color: theme.text, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{user.username?.[0]?.toUpperCase() || "U"}</div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: isMe ? theme.accentLight : theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "Outfit, sans-serif" }}>
                    {user.username} {isMe && <span style={{ fontSize: 10, color: theme.accentLight, opacity: 0.7 }}>(você)</span>}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 900, color: theme.accentLight, flexShrink: 0, fontFamily: "Outfit, sans-serif" }}>
                  {user.xp ?? user.level}
                  <span style={{ fontSize: 10, color: theme.textDim, marginLeft: 2 }}>XP</span>
                </div>
              </div>
            );
          })}

          {rankingList.length === 0 && (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              <p style={{ fontSize: 28, margin: 0 }}>{isOffline ? "📡" : "🏆"}</p>
              <p style={{ fontSize: 13, color: theme.textDim, margin: "8px 0 0", fontFamily: "Outfit, sans-serif" }}>
                {isOffline ? "Servidor indisponível" : "Ninguém ainda"}
              </p>
              {isOffline && (
                <p style={{ fontSize: 11, color: theme.textDim, margin: "4px 0 0", fontFamily: "Outfit, sans-serif" }}>
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
  { id: "anxious",  icon: "😰", label: "Ansioso",   color: "#f97316", hint: "Ansiedade é normal. Seu cérebro está tentando te proteger. Respire fundo — você não precisa ser perfeito, só precisa começar." },
  { id: "bored",    icon: "😑", label: "Entediado",  color: "#60a5fa", hint: "Tédio é o cérebro pedindo novidade. Comece por 5 minutos — o tédio costuma sumir quando você entra no fluxo." },
  { id: "stuck",    icon: "😤", label: "Travado",    color: "#a78bfa", hint: "Travado é diferente de incapaz. Você só precisa de um passo menor. O menor passo possível. Sem pressão pelo resto." },
  { id: "ready",    icon: "✅", label: "Pronto",     color: "#4ade80", hint: null },
];

export function CheckInModal({ active, task, selectedMood, setSelectedMood, microStep, setMicroStep, onConfirm, onClose }) {
  if (!active) return null;
  const { theme } = useTheme();

  const mood = MOODS.find(m => m.id === selectedMood);
  const needsMicroStep = selectedMood && selectedMood !== "ready";
  const canStart = selectedMood === "ready" || (needsMicroStep && microStep.trim().length > 0);

  return (
    <div style={backdrop(theme)}>
      <div style={{ ...card(theme), maxWidth: 440 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.accentLight, marginBottom: 6, fontFamily: "Outfit, sans-serif" }}>
              Antes de começar
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: theme.text, fontFamily: "Outfit, sans-serif", lineHeight: 1.3 }}>
              "{task}"
            </div>
          </div>
          <button onClick={onClose} style={closeBtn(theme)}><X size={15} /></button>
        </div>

        {/* Pergunta emocional */}
        <p style={{ fontSize: 13, color: theme.textDim, margin: "0 0 14px", fontFamily: "Outfit, sans-serif" }}>
          Como você está em relação a essa tarefa?
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          {MOODS.map(m => (
            <button key={m.id} onClick={() => setSelectedMood(m.id)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
              borderRadius: 10, cursor: "pointer", fontFamily: "Outfit, sans-serif",
              border: selectedMood === m.id ? `1px solid ${m.color}60` : `1px solid ${theme.borderLight}`,
              background: selectedMood === m.id ? `${m.color}15` : theme.inputBg,
              color: selectedMood === m.id ? m.color : theme.textDim,
              fontWeight: selectedMood === m.id ? 900 : 600,
              fontSize: 13, transition: "all 0.15s"
            }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        {/* Hint contextual — mais acolhedor */}
        {mood?.hint && (
          <div style={{ padding: "12px 14px", borderRadius: 10, background: `${mood.color}10`, border: `1px solid ${mood.color}25`, marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: mood.color, margin: 0, fontFamily: "Outfit, sans-serif", lineHeight: 1.6 }}>
              {mood.hint}
            </p>
          </div>
        )}

        {/* Campo de micro-passo — linguagem da pesquisa */}
        {needsMicroStep && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: theme.textMuted, display: "block", marginBottom: 8, fontFamily: "Outfit, sans-serif" }}>
              O que você precisa fazer nos próximos 5 minutos?
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
                background: theme.inputBg, border: `1px solid ${theme.borderLight}`,
                color: theme.text, fontFamily: "Outfit, sans-serif", fontSize: 13,
                fontWeight: 600, outline: "none", boxSizing: "border-box"
              }}
            />
            <p style={{ fontSize: 10, color: theme.textDim, margin: "6px 0 0", fontFamily: "Outfit, sans-serif" }}>
              Tão pequeno que seu cérebro não acione o alarme. Só o primeiro passo.
            </p>
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
            background: canStart ? theme.accent : theme.border,
            color: canStart ? theme.text : theme.textDim,
          }}
        >
          <Zap size={16} fill={canStart ? theme.text : theme.textDim} />
          {selectedMood === "ready" ? "Iniciar Foco!" : canStart ? "Começar com esse passo" : "Selecione como está se sentindo"}
          {canStart && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
}
