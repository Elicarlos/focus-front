"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TimerCircle from "@/components/TimerCircle";
import VictoryModal from "@/components/VictoryModal";
import AchievementsModal from "@/components/Achievements";
import MascotTree from "@/components/MascotTree";
import { SettingsModal, RankingModal, CheckInModal } from "@/components/Modals";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://a33qw28hn83ky06i7gua435q.187.127.15.180.sslip.io";

function getLevel(min) { return Math.floor(min / 100) + 1; }
function getLevelName(lvl) {
  return ["Semente","Broto","Muda","Arbusto","Árvore Jovem","Carvalho","Sequóia","Lenda"][Math.min(lvl - 1, 7)];
}

function calculateStreak(lastActivityDate) {
  if (!lastActivityDate) return 0;
  const last = new Date(lastActivityDate);
  const now = new Date();
  const diffDays = Math.floor((now - last) / 86400000);
  if (diffDays > 1) return 0;
  const saved = localStorage.getItem("pragma_streak");
  return saved ? parseInt(saved) : 0;
}

export default function PragmaDashboard() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [rankingList, setRankingList] = useState([]);
  const [rankingActive, setRankingActive] = useState(false);
  const [rankingOffline, setRankingOffline] = useState(false);

  const [currentTask, setCurrentTask] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");
  const [treeHealth, setTreeHealth] = useState(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  const [timerSeconds, setTimerSeconds] = useState(1500);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeTimerMode, setActiveTimerMode] = useState(1500);

  const [settingsActive, setSettingsActive] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState({ days: "00", hours: "00", percent: 0 });
  const [sessionsToday, setSessionsToday] = useState(0);
  const [xpGain, setXpGain] = useState(false);
  const [taskShaking, setTaskShaking] = useState(false);
  const [checkInActive, setCheckInActive] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [microStep, setMicroStep] = useState("");

  // Novos states
  const [victoryActive, setVictoryActive] = useState(false);
  const [victoryData, setVictoryData] = useState({ xp: 0, total: 0, level: 1, levelName: "Semente", sessions: 0 });
  const [achievementsActive, setAchievementsActive] = useState(false);
  const [showTreeInCenter, setShowTreeInCenter] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nicknamePrompt, setNicknamePrompt] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");

  const audioCtxRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const taskInputRef = useRef(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("pragma_token");
    if (savedToken) { setToken(savedToken); fetchUserData(savedToken); }
    else loadStateLocal();

    // Carregar streak e totalSessions
    const savedStreak = localStorage.getItem("pragma_streak");
    if (savedStreak) setStreak(parseInt(savedStreak));
    const savedTotalSessions = localStorage.getItem("pragma_total_sessions");
    if (savedTotalSessions) setTotalSessions(parseInt(savedTotalSessions));

    // Carregar nickname
    const savedNickname = localStorage.getItem("pragma_nickname");
    if (savedNickname) setNickname(savedNickname);

    // Solicitar permissão de notificação
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !token) {
      const initGoogle = () => {
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: "274648341216-k3s64mlubsm394u5ephef4hopiv887ng.apps.googleusercontent.com",
            callback: handleGoogleLoginResponse
          });
        } else { setTimeout(initGoogle, 500); }
      };
      initGoogle();
    }
  }, [token]);

  const loadStateLocal = () => {
    const saved = localStorage.getItem("pragma_state_minimal");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.currentTask !== undefined) setCurrentTask(d.currentTask);
        if (d.projectDeadline !== undefined) setProjectDeadline(d.projectDeadline);
        if (d.treeHealth !== undefined) setTreeHealth(d.treeHealth);
        if (d.totalFocusMinutes !== undefined) setTotalFocusMinutes(d.totalFocusMinutes);
      } catch (e) { console.error(e); }
    }
  };

  const fetchUserData = async (jwt) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${jwt}` } });
      if (res.status === 401) { handleLogout(); return; }
      const d = await res.json();
      setUserProfile(d); setTreeHealth(d.tree_health); setTotalFocusMinutes(d.xp);
      if (d.streak) setStreak(d.streak);
      if (d.total_sessions) setTotalSessions(d.total_sessions);
    } catch (e) { console.error(e); loadStateLocal(); }
  };

  const handleGoogleLoginResponse = async (gr) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential_token: gr.credential })
      });
      const d = await res.json();
      if (d.access_token) { localStorage.setItem("pragma_token", d.access_token); setToken(d.access_token); fetchUserData(d.access_token); }
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
    localStorage.removeItem("pragma_token");
    setToken(null); setUserProfile(null); loadStateLocal();
  };

  const syncWithBackend = async () => {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/users/me/sync`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          email: userProfile.email, username: userProfile.username, xp: totalFocusMinutes,
          level: getLevel(totalFocusMinutes), gems: 100, streak, water_units: 0, skill_points: 0,
          tree_health: treeHealth, tree_dead: treeHealth <= 0,
          mudas: 0, adubos: 0, essencias: 0, last_streak_date: "", last_activity_date: new Date().toISOString(),
          total_sessions: totalSessions
        })
      });
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (token) syncWithBackend();
    else localStorage.setItem("pragma_state_minimal", JSON.stringify({ currentTask, projectDeadline, treeHealth, totalFocusMinutes }));
    localStorage.setItem("pragma_streak", streak.toString());
    localStorage.setItem("pragma_total_sessions", totalSessions.toString());
  }, [currentTask, projectDeadline, treeHealth, totalFocusMinutes, streak, totalSessions]);

  const loadGlobalRanking = async () => {
    // Se não tem nickname, pedir primeiro
    if (!nickname) {
      setNicknameInput("");
      setNicknamePrompt(true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/ranking`);
      if (!res.ok) throw new Error("offline");
      setRankingList(await res.json());
      setRankingOffline(false);
      setRankingActive(true);
    } catch {
      // Dados mock enquanto backend estiver offline
      setRankingList([
        { username: nickname, xp: totalFocusMinutes || 0, level: getLevel(totalFocusMinutes || 0), country: "BR", avatar_url: null },
      ]);
      setRankingOffline(true);
      setRankingActive(true);
    }
  };

  const handleSaveNickname = () => {
    const trimmed = nicknameInput.trim();
    if (trimmed.length < 2 || trimmed.length > 20) return;
    setNickname(trimmed);
    localStorage.setItem("pragma_nickname", trimmed);
    setNicknamePrompt(false);
  };

  useEffect(() => {
    updateDeadlineCountdown();
    const t = setInterval(updateDeadlineCountdown, 60000);
    return () => clearInterval(t);
  }, [projectDeadline]);

  const updateDeadlineCountdown = () => {
    if (!projectDeadline) return;
    const target = new Date(`${projectDeadline}T23:59:59`);
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) { setTimeLeftStr({ days: "00", hours: "00", percent: 100 }); return; }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const monthStart = new Date(target.getFullYear(), target.getMonth(), 1);
    const percent = Math.round(Math.min(100, Math.max(0, ((now - monthStart) / (target - monthStart)) * 100)));
    setTimeLeftStr({ days: String(days).padStart(2, "0"), hours: String(hours).padStart(2, "0"), percent });
  };

  const playSound = (type) => {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    if (type === "alarm") {
      // Som de vitória - sequência ascendente
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        const t = ctx.currentTime + i * 0.15;
        osc.type = "sine"; osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t); osc.stop(t + 0.3);
      });
    } else if (type === "tick") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine"; osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.05);
    }
  };

  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * -canvas.height - 20,
      size: Math.random() * 8 + 3, color: `hsl(${Math.random() * 360},70%,55%)`,
      sx: Math.random() * 4 - 2, sy: Math.random() * 4 + 4,
      rot: Math.random() * 360, rs: Math.random() * 4 - 2
    }));
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      particles.forEach(p => {
        p.x += p.sx; p.y += p.sy; p.rot += p.rs;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
        if (p.y < canvas.height) active = true;
      });
      if (active) requestAnimationFrame(animate);
    };
    animate();
  };

  const sendNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" });
    }
  };

  const handleStartTimer = () => {
    if (timerRunning) { clearInterval(timerIntervalRef.current); setTimerRunning(false); setShowTreeInCenter(false); return; }
    if (!currentTask.trim()) {
      setTaskShaking(true);
      setTimeout(() => setTaskShaking(false), 400);
      taskInputRef.current?.focus();
      return;
    }
    if (activeTimerMode === 1500) {
      setSelectedMood(null);
      setMicroStep("");
      setCheckInActive(true);
      return;
    }
    confirmStartTimer();
  };

  const handleQuickStart = () => {
    if (!currentTask.trim()) {
      setTaskShaking(true);
      setTimeout(() => setTaskShaking(false), 400);
      taskInputRef.current?.focus();
      return;
    }
    setActiveTimerMode(300);
    setTimerSeconds(300);
    setTimerRunning(true);
    setShowTreeInCenter(true);
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current); setTimerRunning(false); setShowTreeInCenter(false);
          playSound("alarm"); triggerConfetti();
          setTotalFocusMinutes(m => m + 5);
          const newSessions = totalSessions + 1;
          setTotalSessions(newSessions);
          setSessionsToday(s => Math.min(4, s + 1));
          setXpGain(true); setTimeout(() => setXpGain(false), 1800);

          // Atualizar streak
          const today = new Date().toDateString();
          const lastDate = localStorage.getItem("pragma_last_activity");
          if (lastDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            const newStreak = lastDate === yesterday ? streak + 1 : 1;
            setStreak(newStreak);
            localStorage.setItem("pragma_last_activity", today);
            sendNotification("Grove", `Sessão rápida completa! Streak: ${newStreak} dias`);
          }

          // Mostrar vitória
          const lvl = getLevel(totalFocusMinutes + 5);
          setVictoryData({ xp: 5, total: totalFocusMinutes + 5, level: lvl, levelName: getLevelName(lvl), sessions: sessionsToday + 1 });
          setTimeout(() => setVictoryActive(true), 300);

          setTimeout(() => selectTimerMode(1500), 500);
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const confirmStartTimer = () => {
    setCheckInActive(false);
    setTimerRunning(true);
    setShowTreeInCenter(true);
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current); setTimerRunning(false); setShowTreeInCenter(false);
          playSound("alarm"); triggerConfetti();
          const isFocus = activeTimerMode === 1500;
          const xpGained = isFocus ? 25 : 5;
          setTotalFocusMinutes(m => m + xpGained);
          const newSessions = totalSessions + 1;
          setTotalSessions(newSessions);

          if (isFocus) {
            setTreeHealth(th => Math.min(100, th + 25));
            setSessionsToday(s => Math.min(4, s + 1));
            setXpGain(true); setTimeout(() => setXpGain(false), 1800);

            // Atualizar streak
            const today = new Date().toDateString();
            const lastDate = localStorage.getItem("pragma_last_activity");
            let newStreak = streak;
            if (lastDate !== today) {
              const yesterday = new Date(Date.now() - 86400000).toDateString();
              newStreak = lastDate === yesterday ? streak + 1 : 1;
              setStreak(newStreak);
              localStorage.setItem("pragma_last_activity", today);
            }

            // Mostrar vitória
            const lvl = getLevel(totalFocusMinutes + xpGained);
            setVictoryData({ xp: xpGained, total: totalFocusMinutes + xpGained, level: lvl, levelName: getLevelName(lvl), sessions: sessionsToday + 1 });
            setTimeout(() => setVictoryActive(true), 300);

            sendNotification("Grove", `Sessão completa! +25 XP. Streak: ${newStreak} dias`);
            setTimeout(() => selectTimerMode(300), 2000);
          } else {
            sendNotification("Grove", "Pausa completa! Hora de voltar ao foco.");
            setTimeout(() => selectTimerMode(1500), 500);
          }
          return activeTimerMode;
        }
        // Tick a cada 5 minutos para som sutil
        if (prev % 300 === 0 && prev > 0) playSound("tick");
        return prev - 1;
      });
    }, 1000);
  };

  const selectTimerMode = (d) => { clearInterval(timerIntervalRef.current); setTimerRunning(false); setShowTreeInCenter(false); setActiveTimerMode(d); setTimerSeconds(d); };
  const formatTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleShare = () => {
    const text = `🌳 Grove - ${victoryData.sessions} sessões completas!\n🔥 Streak: ${streak} dias\n🌱 Nível ${victoryData.level} · ${victoryData.levelName}\n\nFocado e produtivo! #GroveApp`;
    if (navigator.share) {
      navigator.share({ title: "Grove", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copiado para a área de transferência!");
    }
    setVictoryActive(false);
  };

  const isUrgent = parseInt(timeLeftStr.days) <= 3;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const level = getLevel(totalFocusMinutes);

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "Outfit, sans-serif", display: "flex", position: "relative", userSelect: "none" }}>
      <canvas ref={confettiCanvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50 }} />

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ display: "none", position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40, cursor: "pointer" }}
          className="sidebar-overlay"
        />
      )}

      <Sidebar
        token={token}
        userProfile={userProfile}
        onLogout={handleLogout}
        onOpenRanking={loadGlobalRanking}
        onOpenAchievements={() => setAchievementsActive(true)}
        streak={streak}
        treeHealth={treeHealth}
        totalFocusMinutes={totalFocusMinutes}
        xpGain={xpGain}
        timerRunning={timerRunning}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Área principal */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", minWidth: 0 }}>

        {/* Header */}
        <div style={{
          borderBottom: "1px solid #21262d",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          opacity: timerRunning ? 0.3 : 1,
          pointerEvents: timerRunning ? "none" : "auto",
          transition: "opacity 0.7s"
        }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            title={sidebarOpen ? "Esconder sidebar" : "Mostrar sidebar"}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563", display: "flex", alignItems: "center", flexShrink: 0, padding: 4 }}
          >
            {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>

          <div className={taskShaking ? "shake" : ""} style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: taskShaking ? "#f97316" : "#22c55e", marginBottom: 4, transition: "color 0.2s" }}>
              {taskShaking ? "⚠ Defina o projeto antes de iniciar" : "Projeto Ativo"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${taskShaking ? "#f97316" : "transparent"}`, paddingBottom: 2, transition: "border-color 0.2s" }}>
              <input
                ref={taskInputRef}
                type="text"
                value={currentTask}
                onChange={e => setCurrentTask(e.target.value)}
                placeholder="No que você vai focar agora?"
                maxLength={80}
                style={{ background: "transparent", border: "none", outline: "none", fontSize: 18, fontWeight: 900, color: "white", fontFamily: "Outfit, sans-serif", caretColor: "#4ade80", width: "100%" }}
              />
              <button onClick={() => setSettingsActive(true)} title="Alterar prazo" style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563", display: "flex", alignItems: "center", flexShrink: 0 }}><Pencil size={14} /></button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}>
            {[{ v: timeLeftStr.days, l: "Dias" }, { v: timeLeftStr.hours, l: "Horas" }].map(({ v, l }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: isUrgent ? "#f97316" : "white", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4b5563", marginTop: 3 }}>{l}</div>
              </div>
            ))}
            <button onClick={() => setSettingsActive(true)} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "center", padding: 0 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: isUrgent ? "#f97316" : "white", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{timeLeftStr.percent}%</div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4b5563", marginTop: 3 }}>do prazo</div>
            </button>
          </div>
        </div>

        {/* Área do timer com árvore central quando rodando */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", position: "relative" }}>
          {/* Árvore central durante sessão */}
          {showTreeInCenter && (
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.15, pointerEvents: "none",
              transition: "opacity 1s ease"
            }}>
              <MascotTree treeHealth={treeHealth} totalFocusMinutes={totalFocusMinutes} xpGain={false} />
            </div>
          )}

          <div style={{ position: "relative", zIndex: 1 }}>
            <TimerCircle
              timerSeconds={timerSeconds}
              timerRunning={timerRunning}
              activeTimerMode={activeTimerMode}
              handleStartTimer={handleStartTimer}
              selectTimerMode={selectTimerMode}
              formatTimer={formatTimer}
              sessionsToday={sessionsToday}
              onStartQuick={handleQuickStart}
            />
          </div>
        </div>
      </main>

      <SettingsModal
        active={settingsActive}
        onClose={() => setSettingsActive(false)}
        projectDeadline={projectDeadline}
        setProjectDeadline={setProjectDeadline}
        onSave={() => { setSettingsActive(false); updateDeadlineCountdown(); }}
      />
      <RankingModal
        active={rankingActive}
        onClose={() => setRankingActive(false)}
        rankingList={rankingList}
        isOffline={rankingOffline}
      />
      <CheckInModal
        active={checkInActive}
        task={currentTask}
        selectedMood={selectedMood}
        setSelectedMood={setSelectedMood}
        microStep={microStep}
        setMicroStep={setMicroStep}
        onConfirm={confirmStartTimer}
        onClose={() => setCheckInActive(false)}
      />
      <VictoryModal
        active={victoryActive}
        xpGained={victoryData.xp}
        totalXP={victoryData.total}
        level={victoryData.level}
        levelName={victoryData.levelName}
        sessionsToday={victoryData.sessions}
        onContinue={() => setVictoryActive(false)}
        onShare={handleShare}
      />
      <AchievementsModal
        active={achievementsActive}
        onClose={() => setAchievementsActive(false)}
        stats={{ totalSessions, streak, totalXP: totalFocusMinutes, level, treeHealth }}
      />

      {/* Nickname Prompt */}
      {nicknamePrompt && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div style={{
            background: "#161b22", border: "1px solid #30363d", borderRadius: 20,
            padding: 28, width: "92%", maxWidth: 360, boxShadow: "0 24px 64px rgba(0,0,0,0.6)"
          }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🏷️</div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "white", margin: "0 0 6px", fontFamily: "Outfit, sans-serif" }}>
                Qual seu apelido?
              </h3>
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0, fontFamily: "Outfit, sans-serif" }}>
                Aparecerá no ranking e nas conquistas
              </p>
            </div>
            <input
              type="text"
              value={nicknameInput}
              onChange={e => setNicknameInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSaveNickname()}
              placeholder="Ex: FocadoMan"
              maxLength={20}
              autoFocus
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 12,
                background: "#0d1117", border: "1px solid #30363d",
                color: "white", fontFamily: "Outfit, sans-serif", fontSize: 15,
                fontWeight: 700, outline: "none", marginBottom: 16, boxSizing: "border-box"
              }}
            />
            <button
              onClick={handleSaveNickname}
              disabled={nicknameInput.trim().length < 2}
              style={{
                width: "100%", padding: "14px 0", borderRadius: 12,
                background: nicknameInput.trim().length >= 2 ? "#22c55e" : "#21262d",
                color: nicknameInput.trim().length >= 2 ? "white" : "#4b5563",
                border: "none", fontSize: 14, fontWeight: 900, cursor: "pointer",
                fontFamily: "Outfit, sans-serif", transition: "all 0.2s"
              }}
            >
              Entrar no Ranking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
