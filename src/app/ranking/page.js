"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://a33qw28hn83ky06i7gua435q.187.127.15.180.sslip.io";

function getLevel(min) { return Math.floor(min / 100) + 1; }

export default function RankingPage() {
  const router = useRouter();
  const [rankingList, setRankingList] = useState([]);
  const [nickname, setNickname] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [nicknamePrompt, setNicknamePrompt] = useState(false);
  const [offline, setOffline] = useState(false);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("pragma_nickname");
    const savedXP = localStorage.getItem("pragma_state_minimal");
    if (saved) setNickname(saved);
    if (savedXP) {
      try { setTotalXP(JSON.parse(savedXP).totalFocusMinutes || 0); } catch {}
    }
  }, []);

  useEffect(() => {
    if (!nickname) {
      setNicknamePrompt(true);
      return;
    }
    loadRanking();
  }, [nickname]);

  const loadRanking = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/ranking`);
      if (!res.ok) throw new Error("offline");
      setRankingList(await res.json());
      setOffline(false);
    } catch {
      setRankingList([
        { username: nickname, xp: totalXP, level: getLevel(totalXP), country: "BR", avatar_url: null },
      ]);
      setOffline(true);
    }
  };

  const handleSaveNickname = () => {
    const trimmed = nicknameInput.trim();
    if (trimmed.length < 2 || trimmed.length > 20) return;
    setNickname(trimmed);
    localStorage.setItem("pragma_nickname", trimmed);
    setNicknamePrompt(false);
  };

  const medalEmoji = ["🥇", "🥈", "🥉"];

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "Outfit, sans-serif" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)",
        padding: "24px 20px 28px", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)", filter: "blur(40px)" }} />
        <div style={{ maxWidth: 600, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <button onClick={() => router.push("/dashboard")} style={{
            background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10,
            padding: "8px 12px", cursor: "pointer", color: "white", display: "flex",
            alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, marginBottom: 16,
            fontFamily: "Outfit, sans-serif"
          }}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "white", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 10 }}>
            <Trophy size={28} color="#fbbf24" fill="#fbbf24" /> Ranking
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0 }}>
            {rankingList.length} {rankingList.length === 1 ? "jogador" : "jogadores"} · Top 50 por XP
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>

        {/* Nickname prompt */}
        {nicknamePrompt && (
          <div style={{
            background: "#161b22", border: "1px solid #30363d", borderRadius: 16,
            padding: 28, textAlign: "center", marginBottom: 20
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🏷️</div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: "white", margin: "0 0 6px" }}>Qual seu apelido?</h3>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 16px" }}>Aparecerá no ranking</p>
            <input
              type="text" value={nicknameInput}
              onChange={e => setNicknameInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSaveNickname()}
              placeholder="Ex: FocadoMan" maxLength={20} autoFocus
              style={{
                width: "100%", maxWidth: 300, padding: "14px 16px", borderRadius: 12,
                background: "#0d1117", border: "1px solid #30363d",
                color: "white", fontSize: 15, fontWeight: 700, outline: "none",
                fontFamily: "Outfit, sans-serif", marginBottom: 16, boxSizing: "border-box"
              }}
            />
            <button onClick={handleSaveNickname} disabled={nicknameInput.trim().length < 2} style={{
              padding: "14px 32px", borderRadius: 12, border: "none",
              background: nicknameInput.trim().length >= 2 ? "#22c55e" : "#21262d",
              color: nicknameInput.trim().length >= 2 ? "white" : "#4b5563",
              fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "Outfit, sans-serif"
            }}>
              Entrar no Ranking
            </button>
          </div>
        )}

        {/* Lista */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rankingList.map((user, idx) => {
            const isMe = user.username === nickname;
            return (
              <div key={user.username} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 18px", borderRadius: 14,
                background: isMe ? "rgba(74,222,128,0.12)" : idx === 0 ? "rgba(245,158,11,0.08)" : "#161b22",
                border: isMe ? "1px solid rgba(74,222,128,0.3)" : "1px solid #21262d",
              }}>
                <span style={{ width: 32, textAlign: "center", fontSize: idx < 3 ? 22 : 15, fontWeight: 900, color: idx < 3 ? "white" : "#6b7280" }}>
                  {idx < 3 ? medalEmoji[idx] : idx + 1}
                </span>
                {user.avatar_url
                  ? <img src={user.avatar_url} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} alt="" />
                  : <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #166534, #22c55e)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, flexShrink: 0 }}>
                      {user.username?.[0]?.toUpperCase() || "U"}
                    </div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: isMe ? "#4ade80" : "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.username} {isMe && <span style={{ fontSize: 11, opacity: 0.7 }}>(você)</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#4b5563" }}>Nível {user.level} · {user.country || "BR"}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#4ade80", flexShrink: 0 }}>
                  {user.xp ?? 0}
                  <span style={{ fontSize: 11, color: "#4b5563", marginLeft: 2 }}>XP</span>
                </div>
              </div>
            );
          })}
        </div>

        {rankingList.length === 0 && !nicknamePrompt && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: 40, margin: 0 }}>🏆</p>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "12px 0 0" }}>Ninguém ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
