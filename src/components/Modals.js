"use client";

import { useState } from "react";
import { X, Check, Trophy, Settings, Medal, Zap, ChevronRight, ClipboardList, Heart, Target } from "lucide-react";
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

export function CheckInModal({ active, task, selectedMood, setSelectedMood, microStep, setMicroStep, onConfirm, onClose, whyValue, setWhyValue }) {
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

        {/* Pergunta de motivação intrínseca — opcional */}
        {selectedMood && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: theme.textDim, display: "block", marginBottom: 6, fontFamily: "Outfit, sans-serif" }}>
              Por que isso é importante pra você? <span style={{ fontWeight: 400, opacity: 0.6 }}>(opcional)</span>
            </label>
            <input
              type="text"
              value={whyValue || ""}
              onChange={e => setWhyValue(e.target.value)}
              placeholder="Ex: Pra passar na prova e não trancar o curso"
              maxLength={120}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10,
                background: "transparent", border: `1px solid ${theme.border}`,
                color: theme.textDim, fontFamily: "Outfit, sans-serif", fontSize: 12,
                fontWeight: 500, outline: "none", boxSizing: "border-box",
                fontStyle: "italic"
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

export function SelfCompassionModal({ active, onClose }) {
  if (!active) return null;
  const { theme } = useTheme();
  
  // Lista de mensagens acolhedoras baseadas em TCC e regulação emocional
  const messages = [
    "Tudo bem fazer uma pausa. O progresso não é linear. O importante é você ter tentado e poder recomeçar suavemente quando quiser.",
    "Estudos mostram que perdoar a si mesmo por procrastinar ou pausar uma tarefa reduz a ansiedade e melhora o foco na próxima tentativa. Respire fundo, você é humano.",
    "Não seja tão duro consigo mesmo. Pausar para respirar ou reorganizar as ideias também faz parte do processo de aprendizagem e regulação emocional.",
    "Parar agora não cancela o esforço que você já fez. Cada minuto conta. Quando estiver pronto, defina um micro-passo ainda menor para recomeçar sem pressão."
  ];
  
  // Seleção semi-estável
  const message = messages[Math.floor(Date.now() / 10000) % messages.length];

  return (
    <div style={backdrop(theme)}>
      <div style={card(theme)}>
        <div style={modalHeader}>
          <h3 style={{ fontWeight: 900, color: theme.text, fontSize: 16, margin: 0, display: "flex", alignItems: "center", gap: 8, fontFamily: "Outfit, sans-serif" }}>
            <Heart size={16} fill="#22c55e" color="#22c55e" /> Autocompaixão
          </h3>
          <button onClick={onClose} style={closeBtn(theme)}><X size={15} /></button>
        </div>
        <p style={{ fontSize: 13, color: theme.textDim, lineHeight: 1.6, margin: "0 0 24px", fontFamily: "Outfit, sans-serif", textAlign: "left" }}>
          {message}
        </p>
        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 14, fontWeight: 900,
            border: "none", cursor: "pointer", background: theme.accent, color: "white",
            fontFamily: "Outfit, sans-serif"
          }}
        >
          Recomeçar Suavemente
        </button>
      </div>
    </div>
  );
}

export function MicrotasksModal({ active, onClose, microtasks, setMicrotasks, whyValue, setWhyValue, triggerConfetti, playSound, onStartFocus }) {
  if (!active) return null;
  const { theme } = useTheme();
  const [localInput, setLocalInput] = useState("");

  const handleAdd = () => {
    if (localInput.trim()) {
      const updated = [...microtasks, { text: localInput.trim(), completed: false }];
      setMicrotasks(updated);
      localStorage.setItem("pragma_microtasks", JSON.stringify(updated));
      setLocalInput("");
    }
  };

  const labelColor = theme.id === "light" ? "#334155" : "#e2e8f0"; // slate-700 / slate-200
  const descColor = theme.id === "light" ? "#64748b" : "#94a3b8"; // slate-500 / slate-400
  const placeholderColor = theme.id === "light" ? "#94a3b8" : "#6e7681";
  const inputBorder = theme.id === "light" ? "#cbd5e1" : "#30363d";

  return (
    <div style={backdrop(theme)}>
      <div style={{ ...card(theme), maxWidth: 440 }}>
        <style>{`
          .pragma-modal-input::placeholder {
            color: ${placeholderColor} !important;
            opacity: 1 !important;
          }
        `}</style>

        {/* Header */}
        <div style={modalHeader}>
          <h3 style={{ fontWeight: 900, color: theme.text, fontSize: 16, margin: 0, display: "flex", alignItems: "center", gap: 8, fontFamily: "Outfit, sans-serif" }}>
            <ClipboardList size={16} color={theme.accent} /> Quebra de Tarefas
          </h3>
          <button onClick={onClose} style={closeBtn(theme)}><X size={15} /></button>
        </div>

        {/* Lista de Microtarefas */}
        <div style={{ fontSize: 11, fontWeight: 800, color: labelColor, marginBottom: 8, fontFamily: "Outfit, sans-serif" }}>
          Passos Planejados ({microtasks.length})
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 180, overflowY: "auto", paddingRight: 4, marginBottom: 20 }}>
          {microtasks.length > 0 ? (
            microtasks.map((mt, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", borderRadius: 10,
                background: theme.id === "light" ? "#f8fafc" : "#161b22",
                border: `1px solid ${theme.borderLight}`,
                transition: "all 0.2s ease"
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = theme.accent + "50"}
                onMouseLeave={e => e.currentTarget.style.borderColor = theme.borderLight}
              >
                <button
                  onClick={() => {
                    const updated = [...microtasks];
                    const isNowCompleted = !updated[i].completed;
                    updated[i] = { ...updated[i], completed: isNowCompleted };
                    setMicrotasks(updated);
                    localStorage.setItem("pragma_microtasks", JSON.stringify(updated));
                    if (isNowCompleted) {
                      triggerConfetti();
                      playSound("alarm");
                    }
                  }}
                  style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: `2px solid ${mt.completed ? theme.accent : theme.textDim}`,
                    background: mt.completed ? theme.accent : "transparent",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, padding: 0, transition: "all 0.2s ease"
                  }}
                >
                  {mt.completed && <span style={{ fontSize: 9, color: "white", fontWeight: "bold" }}>✓</span>}
                </button>
                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: mt.completed ? theme.textMuted : theme.text,
                  textDecoration: mt.completed ? "line-through" : "none",
                  fontFamily: "Outfit, sans-serif",
                  flex: 1,
                  lineHeight: 1.4,
                  opacity: mt.completed ? 0.5 : 1
                }}>
                  {mt.text}
                </span>
                <button
                  onClick={() => {
                    const updated = microtasks.filter((_, idx) => idx !== i);
                    setMicrotasks(updated);
                    localStorage.setItem("pragma_microtasks", JSON.stringify(updated));
                  }}
                  style={{
                    background: "none", border: "none", color: theme.danger,
                    cursor: "pointer", fontSize: 12, padding: 4, opacity: 0.3,
                    transition: "opacity 0.2s ease"
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0.3}
                >✕</button>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", color: descColor, fontSize: 12, padding: "20px 0", fontFamily: "Outfit, sans-serif" }}>
              Nenhum passo definido ainda. Adicione micro-ações abaixo para vencer a inércia.
            </div>
          )}
        </div>

        {/* Input para adicionar nova microtarefa */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <input
            type="text"
            className="pragma-modal-input"
            value={localInput}
            onChange={e => setLocalInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="Adicionar passo de 5 min..."
            maxLength={80}
            style={{
              flex: 1, background: theme.inputBg, border: `1px solid ${inputBorder}`,
              borderRadius: 10, padding: "10px 14px", fontSize: 12, color: theme.text,
              fontFamily: "Outfit, sans-serif", outline: "none"
            }}
          />
          <button
            onClick={handleAdd}
            style={{
              background: theme.accent, border: "none", borderRadius: 10,
              color: "white", width: 36, height: 36, fontWeight: 900,
              fontSize: 16, cursor: "pointer", fontFamily: "Outfit, sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            +
          </button>
        </div>

        {/* Botão de ação para Iniciar Foco */}
        <button
          onClick={() => {
            onClose();
            onStartFocus();
          }}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 14, fontWeight: 900,
            border: "none", cursor: "pointer", background: theme.accent, color: "white",
            fontFamily: "Outfit, sans-serif", marginTop: 12, marginBottom: 12, display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8, transition: "all 0.2s ease"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.background = theme.accentLight;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = theme.accent;
          }}
        >
          <Zap size={16} fill="white" /> Iniciar Sessão de Foco
        </button>
 
        <p style={{ fontSize: 10, color: descColor, margin: 0, fontFamily: "Outfit, sans-serif", lineHeight: 1.4, textAlign: "center" }}>
          Quebre seu projeto em tarefas tão minúsculas que seja impossível falhar ou procrastinar.
        </p>
      </div>
    </div>
  );
}

export function PaywallModal({ active, onClose, onSubscribe }) {
  if (!active) return null;
  const { theme } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState("annual");

  const benefits = [
    { icon: "🌳", title: "Foco e Bosque Ilimitados", desc: "Plante quantas árvores quiser por dia, sem o bloqueio de 4 sessões." },
    { icon: "🎨", title: "5 Novas Árvores Exclusivas", desc: "Desbloqueie Cerejeira, Pinheiro, Bambu, Ipê e a lendária Árvore Dourada." },
    { icon: "🏆", title: "Ranking Global Completo", desc: "Dispute sua posição no ranking em tempo real com toda a comunidade." },
    { icon: "🎶", title: "Sons de Foco Premium", desc: "Acesse áudios zen, de natureza e lo-fi relaxantes para ajudar na concentração." }
  ];

  return (
    <div style={backdrop(theme)}>
      <div style={{ ...card(theme), maxWidth: 440, position: "relative", overflow: "hidden" }}>
        
        {/* Badge Pulsante Premium */}
        <div style={{
          position: "absolute", top: 16, left: 16,
          background: "#f59e0b", color: "#0d1117", fontSize: 9, fontWeight: 900,
          textTransform: "uppercase", letterSpacing: "0.12em", padding: "4px 10px",
          borderRadius: 20, display: "flex", alignItems: "center", gap: 4,
          boxShadow: "0 0 12px rgba(245,158,11,0.4)",
          animation: "pulse 2s infinite"
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0d1117" }} /> Oferta Especial
        </div>

        {/* Header */}
        <div style={{ ...modalHeader, justifyContent: "flex-end", marginBottom: 12 }}>
          <button onClick={onClose} style={closeBtn(theme)}><X size={15} /></button>
        </div>

        {/* Hero do Paywall */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 21, fontWeight: 900, color: theme.text, margin: "0 0 8px", letterSpacing: "-0.02em", fontFamily: "Outfit, sans-serif" }}>
            Vença a Procrastinação Sem Limites
          </h2>
          <p style={{ fontSize: 12, color: theme.textDim, margin: 0, fontFamily: "Outfit, sans-serif", lineHeight: 1.5 }}>
            Você atingiu o limite de 4 sessões gratuitas diárias. Faça o upgrade agora para manter sua árvore viva, não perder sua sequência de dias e focar sem limites.
          </p>
        </div>

        {/* Benefícios */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: theme.border,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0
              }}>
                {b.icon}
              </div>
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 800, color: theme.text, margin: "0 0 1px", fontFamily: "Outfit, sans-serif" }}>
                  {b.title}
                </h4>
                <p style={{ fontSize: 10, color: theme.textDim, margin: 0, fontFamily: "Outfit, sans-serif", lineHeight: 1.3 }}>
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Seletor de Planos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {/* Plano Anual (Recomendado) */}
          <div 
            onClick={() => setSelectedPlan("annual")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", borderRadius: 12, cursor: "pointer",
              border: selectedPlan === "annual" ? "2px solid #22c55e" : `1px solid ${theme.borderLight}`,
              background: selectedPlan === "annual" ? "rgba(34,197,94,0.06)" : theme.inputBg,
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${selectedPlan === "annual" ? "#22c55e" : theme.textMuted}`,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {selectedPlan === "annual" && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: theme.text, display: "flex", alignItems: "center", gap: 6, fontFamily: "Outfit, sans-serif" }}>
                  Plano Anual <span style={{ background: "#22c55e", color: "white", fontSize: 8, fontWeight: 900, padding: "1px 5px", borderRadius: 5, textTransform: "uppercase" }}>Salvar 33%</span>
                </div>
                <div style={{ fontSize: 10, color: theme.textDim, fontFamily: "Outfit, sans-serif" }}>Faturado anualmente por R$ 118,80</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: theme.text, fontFamily: "Outfit, sans-serif" }}>R$ 9,90</div>
              <div style={{ fontSize: 9, color: theme.textDim, fontWeight: 700 }}>/mês</div>
            </div>
          </div>

          {/* Plano Mensal */}
          <div 
            onClick={() => setSelectedPlan("monthly")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", borderRadius: 12, cursor: "pointer",
              border: selectedPlan === "monthly" ? "2px solid #22c55e" : `1px solid ${theme.borderLight}`,
              background: selectedPlan === "monthly" ? "rgba(34,197,94,0.06)" : theme.inputBg,
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${selectedPlan === "monthly" ? "#22c55e" : theme.textMuted}`,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {selectedPlan === "monthly" && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: theme.text, fontFamily: "Outfit, sans-serif" }}>Plano Mensal</div>
                <div style={{ fontSize: 10, color: theme.textDim, fontFamily: "Outfit, sans-serif" }}>Sem fidelidade, cancele quando quiser</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: theme.text, fontFamily: "Outfit, sans-serif" }}>R$ 14,90</div>
              <div style={{ fontSize: 9, color: theme.textDim, fontWeight: 700 }}>/mês</div>
            </div>
          </div>
        </div>

        {/* Preço e CTA */}
        <div style={{
          background: theme.id === "light" ? "#f8fafc" : "#161b22",
          border: `1px solid ${theme.borderLight}`, borderRadius: 16, padding: 16, textAlign: "center"
        }}>
          <button
            onClick={() => onSubscribe(selectedPlan)}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 14, fontWeight: 900,
              border: "none", cursor: "pointer", background: "#22c55e", color: "white",
              fontFamily: "Outfit, sans-serif", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8, transition: "all 0.3s ease",
              boxShadow: "0 4px 14px rgba(34,197,94,0.3)"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.background = "#16a34a";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "#22c55e";
            }}
          >
            <Zap size={16} fill="white" /> Desbloquear Acesso PRO
          </button>
          
          <p style={{ fontSize: 9, color: theme.textDim, margin: "10px 0 0", fontFamily: "Outfit, sans-serif", fontWeight: 700, lineHeight: 1.2 }}>
            🔒 Ativação instantânea. Cancele com 1 clique a qualquer momento no seu painel.
          </p>
        </div>
      </div>
    </div>
  );
}

