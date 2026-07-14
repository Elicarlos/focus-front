"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy, LogIn } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://a33qw28hn83ky06i7gua435q.187.127.15.180.sslip.io";

export default function RankingPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [rankingList, setRankingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const googleBtnRef = useRef(null);

  // Carregar token do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pragma_token");
    if (saved) {
      setToken(saved);
      fetchUserData(saved);
    } else {
      setLoading(false);
      initGoogle();
    }
  }, []);

  // Init Google Sign-In
  useEffect(() => {
    if (!token) initGoogle();
  }, [token]);

  const initGoogle = () => {
    const check = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin
        });
        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(
            googleBtnRef.current,
            { theme: "outline", size: "large", width: 280 }
          );
        }
      } else {
        setTimeout(check, 500);
      }
    };
    check();
  };

  const handleGoogleLogin = async (gr) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential_token: gr.credential })
      });
      const d = await res.json();
      if (d.access_token) {
        localStorage.setItem("pragma_token", d.access_token);
        setToken(d.access_token);
        fetchUserData(d.access_token);
      }
    } catch (e) { console.error(e); }
  };

  const fetchUserData = async (jwt) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      if (res.status === 401) { setToken(null); setLoading(false); return; }
      const d = await res.json();
      setUserProfile(d);
      localStorage.setItem("pragma_nickname", d.username);
      loadRanking(jwt);
    } catch {
      setLoading(false);
    }
  };

  const loadRanking = async (jwt) => {
    try {
      const res = await fetch(`${API_BASE_URL}/ranking`, {
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
      });
      if (!res.ok) throw new Error("offline");
      setRankingList(await res.json());
    } catch {
      setRankingList([]);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("pragma_token");
    setToken(null);
    setUserProfile(null);
    setRankingList([]);
    setLoading(false);
  };

  const medalEmoji = ["🥇", "🥈", "🥉"];

  // Tela de login
  if (!token) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "Outfit, sans-serif" }}>
        <div style={{
          background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)",
          padding: "24px 20px 28px", position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)", filter: "blur(40px)" }} />
          <div style={{ maxWidth: 600, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <button onClick={() => router.push("/dashboard")} style={{
              background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10,
              padding: "8px 12px", cursor: "pointer", color: theme.text, display: "flex",
              alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, marginBottom: 16,
              fontFamily: "Outfit, sans-serif"
            }}>
              <ArrowLeft size={16} /> Voltar
            </button>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: theme.text, margin: "0 0 6px", display: "flex", alignItems: "center", gap: 10 }}>
              <Trophy size={28} color="#fbbf24" fill="#fbbf24" /> Ranking
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0 }}>
              Top 50 jogadores por XP
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
          <div style={{
            background: theme.card, border: `1px solid ${theme.borderLight}`, borderRadius: 20,
            padding: "40px 28px", maxWidth: 380, margin: "0 auto"
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: theme.text, margin: "0 0 8px" }}>
              Login necessário
            </h3>
            <p style={{ fontSize: 13, color: theme.textDim, margin: "0 0 24px", lineHeight: 1.5 }}>
              Faça login com Google para aparecer no ranking e competir com outros jogadores.
            </p>
            <div ref={googleBtnRef} style={{ display: "flex", justifyContent: "center" }} />
            <p style={{ fontSize: 11, color: theme.textDim, margin: "16px 0 0" }}>
              Seus dados ficam seguros e privados
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Ranking carregando
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "Outfit, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: theme.textDim, fontSize: 14 }}>Carregando ranking...</p>
      </div>
    );
  }

  // Ranking (logado)
  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "Outfit, sans-serif" }}>
      <div style={{
        background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)",
        padding: "24px 20px 28px", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)", filter: "blur(40px)" }} />
        <div style={{ maxWidth: 600, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <button onClick={() => router.push("/dashboard")} style={{
                background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10,
                padding: "8px 12px", cursor: "pointer", color: theme.text, display: "flex",
                alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, marginBottom: 16,
                fontFamily: "Outfit, sans-serif"
              }}>
                <ArrowLeft size={16} /> Voltar
              </button>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: theme.text, margin: "0 0 6px", display: "flex", alignItems: "center", gap: 10 }}>
                <Trophy size={28} color="#fbbf24" fill="#fbbf24" /> Ranking
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0 }}>
                {rankingList.length} {rankingList.length === 1 ? "jogador" : "jogadores"} · Top 50 por XP
              </p>
            </div>
            <button onClick={handleLogout} style={{
              background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10,
              padding: "8px 12px", cursor: "pointer", color: theme.text,
              fontSize: 12, fontWeight: 700, fontFamily: "Outfit, sans-serif"
            }}>
              Sair
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rankingList.map((user, idx) => {
            const isMe = userProfile && user.username === userProfile.username;
            return (
              <div key={user.username} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 18px", borderRadius: 14,
                background: isMe ? "rgba(74,222,128,0.12)" : idx === 0 ? "rgba(245,158,11,0.08)" : theme.card,
                border: isMe ? "1px solid rgba(74,222,128,0.3)" : `1px solid ${theme.border}`,
              }}>
                <span style={{ width: 32, textAlign: "center", fontSize: idx < 3 ? 22 : 15, fontWeight: 900, color: idx < 3 ? theme.text : theme.textDim }}>
                  {idx < 3 ? medalEmoji[idx] : idx + 1}
                </span>
                {user.avatar_url
                  ? <img src={user.avatar_url} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} alt="" />
                  : <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, #166534, ${theme.accent})`, color: theme.text, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, flexShrink: 0 }}>
                      {user.username?.[0]?.toUpperCase() || "U"}
                    </div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: isMe ? theme.accentLight : theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.username} {isMe && <span style={{ fontSize: 11, opacity: 0.7 }}>(você)</span>}
                  </div>
                  <div style={{ fontSize: 11, color: theme.textDim }}>Nível {user.level} · {user.country || "BR"}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: theme.accentLight, flexShrink: 0 }}>
                  {user.xp ?? 0}
                  <span style={{ fontSize: 11, color: theme.textDim, marginLeft: 2 }}>XP</span>
                </div>
              </div>
            );
          })}
        </div>

        {rankingList.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: 40, margin: 0 }}>🏆</p>
            <p style={{ fontSize: 14, color: theme.textDim, margin: "12px 0 0" }}>Ninguém no ranking ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
