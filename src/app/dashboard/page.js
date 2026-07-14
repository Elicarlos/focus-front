"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import Sidebar from "@/components/Sidebar";
import TimerCircle from "@/components/TimerCircle";
import VictoryModal from "@/components/VictoryModal";
import AchievementsModal from "@/components/Achievements";
import Bosque from "@/components/Bosque";
import MascotTree from "@/components/MascotTree";
import { getCurrentTree } from "@/components/TreeTypes";
import { SettingsModal, CheckInModal } from "@/components/Modals";

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
  const { theme } = useTheme();
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

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
  const [bosqueActive, setBosqueActive] = useState(false);
  const [bosqueTrees, setBosqueTrees] = useState([]);
  const [rankingActive, setRankingActive] = useState(false);
  const [rankingList, setRankingList] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(false);

  const audioCtxRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const taskInputRef = useRef(null);
  const syncTimeoutRef = useRef(null);

  // Salvar estado do timer no localStorage (a cada segundo)
  const saveTimerState = () => {
    const state = {
      timerSeconds,
      activeTimerMode,
      timerRunning,
      currentTask,
      treeHealth,
      totalFocusMinutes,
      sessionsToday,
      streak,
      totalSessions,
      savedAt: Date.now(),
    };
    localStorage.setItem("pragma_timer_state", JSON.stringify(state));
  };

  // Restaurar estado do timer do localStorage
  const restoreTimerState = () => {
    try {
      const saved = localStorage.getItem("pragma_timer_state");
      if (!saved) return false;

      const state = JSON.parse(saved);
      const elapsed = Math.floor((Date.now() - state.savedAt) / 1000);

      // Se salvou há mais de 10 minutos, descarta (sessão expirou)
      if (elapsed > 600) {
        localStorage.removeItem("pragma_timer_state");
        return false;
      }

      // Se estava rodando, retomar de onde parou
      if (state.timerRunning && state.timerSeconds > elapsed) {
        const remaining = state.timerSeconds - elapsed;
        setTimerSeconds(remaining);
        setActiveTimerMode(state.activeTimerMode);
        setCurrentTask(state.currentTask || "");
        setTreeHealth(state.treeHealth || 0);
        setTotalFocusMinutes(state.totalFocusMinutes || 0);
        setSessionsToday(state.sessionsToday || 0);
        setStreak(state.streak || 0);
        setTotalSessions(state.totalSessions || 0);
        return true; // Timer estava rodando
      }
    } catch (e) { console.error(e); }
    return false;
  };

  // Aviso antes de recarregar a página
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (timerRunning) {
        saveTimerState();
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [timerRunning, timerSeconds, activeTimerMode, currentTask, treeHealth, totalFocusMinutes, sessionsToday, streak, totalSessions]);

  // Salvar estado do timer a cada segundo quando estiver rodando
  useEffect(() => {
    if (timerRunning) {
      saveTimerState();
    }
  }, [timerSeconds, timerRunning]);

  // Restaurar timer ao carregar a página
  useEffect(() => {
    const wasRunning = restoreTimerState();
    if (wasRunning) {
      // Timer estava rodando — retomar automaticamente
      confirmStartTimer();
    }
  }, []);

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

    // Carregar sessões de hoje (resetar se mudou o dia)
    const savedSessionsDate = localStorage.getItem("pragma_sessions_date");
    const savedSessionsCount = localStorage.getItem("pragma_sessions_today");
    if (savedSessionsDate && savedSessionsCount) {
      const today = new Date().toDateString();
      if (savedSessionsDate === today) {
        setSessionsToday(parseInt(savedSessionsCount));
      } else {
        localStorage.setItem("pragma_sessions_date", today);
        localStorage.setItem("pragma_sessions_today", "0");
      }
    }

    // Carregar bosque
    const savedBosque = localStorage.getItem("pragma_bosque");
    if (savedBosque) {
      try { setBosqueTrees(JSON.parse(savedBosque)); } catch (e) {}
    }

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
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
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
      // Salvar nome do Google como nickname
      if (d.username) {
        setNickname(d.username);
        localStorage.setItem("pragma_nickname", d.username);
      }
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
    // Debounce sync - espera 3 segundos sem mudanças antes de enviar
    if (token) {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => syncWithBackend(), 3000);
    } else {
      localStorage.setItem("pragma_state_minimal", JSON.stringify({ currentTask, projectDeadline, treeHealth, totalFocusMinutes }));
    }
    localStorage.setItem("pragma_streak", streak.toString());
    localStorage.setItem("pragma_total_sessions", totalSessions.toString());
  }, [currentTask, projectDeadline, treeHealth, totalFocusMinutes, streak, totalSessions]);

  const loadGlobalRanking = async () => {
    setBosqueActive(false);
    setRankingActive(true);
    setRankingLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ranking`);
      if (!res.ok) throw new Error("offline");
      setRankingList(await res.json());
    } catch {
      setRankingList([]);
    }
    setRankingLoading(false);
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
    if (timerRunning) { clearInterval(timerIntervalRef.current); setTimerRunning(false); setShowTreeInCenter(false); localStorage.removeItem("pragma_timer_state"); return; }
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
          localStorage.removeItem("pragma_timer_state");
          playSound("alarm"); triggerConfetti();
          setTotalFocusMinutes(m => m + 5);
          const newSessions = totalSessions + 1;
          setTotalSessions(newSessions);
          setSessionsToday(s => {
            const newCount = Math.min(4, s + 1);
            localStorage.setItem("pragma_sessions_today", newCount.toString());
            localStorage.setItem("pragma_sessions_date", new Date().toDateString());
            return newCount;
          });
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
          localStorage.removeItem("pragma_timer_state");
          playSound("alarm"); triggerConfetti();
          const isFocus = activeTimerMode === 1500;
          const xpGained = isFocus ? 25 : 5;
          setTotalFocusMinutes(m => m + xpGained);
          const newSessions = totalSessions + 1;
          setTotalSessions(newSessions);

          if (isFocus) {
            setTreeHealth(th => Math.min(100, th + 25));
            setSessionsToday(s => {
              const newCount = Math.min(4, s + 1);
              localStorage.setItem("pragma_sessions_today", newCount.toString());
              localStorage.setItem("pragma_sessions_date", new Date().toDateString());
              return newCount;
            });
            setXpGain(true); setTimeout(() => setXpGain(false), 1800);

            // Atualizar streak (ANTES de plantar árvore)
            const today = new Date().toDateString();
            const lastDate = localStorage.getItem("pragma_last_activity");
            let newStreak = streak;
            if (lastDate !== today) {
              const yesterday = new Date(Date.now() - 86400000).toDateString();
              newStreak = lastDate === yesterday ? streak + 1 : 1;
              setStreak(newStreak);
              localStorage.setItem("pragma_last_activity", today);
            }

            // Plantar árvore no bosque
            const stats = { totalSessions: newSessions, streak: newStreak, totalXP: totalFocusMinutes + xpGained };
            const currentTree = getCurrentTree(stats);
            const newTree = {
              id: Date.now(),
              typeId: currentTree.id,
              health: Math.min(100, treeHealth + 25),
              plantedAt: new Date().toISOString(),
            };
            const updatedBosque = [...bosqueTrees, newTree];
            setBosqueTrees(updatedBosque);
            localStorage.setItem("pragma_bosque", JSON.stringify(updatedBosque));

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

  const selectTimerMode = (d) => { clearInterval(timerIntervalRef.current); setTimerRunning(false); setShowTreeInCenter(false); setActiveTimerMode(d); setTimerSeconds(d); localStorage.removeItem("pragma_timer_state"); };
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
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "Outfit, sans-serif", display: "flex", position: "relative", userSelect: "none" }}>
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
        onOpenBosque={() => setBosqueActive(true)}
        streak={streak}
        treeHealth={treeHealth}
        totalFocusMinutes={totalFocusMinutes}
        xpGain={xpGain}
        timerRunning={timerRunning}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        totalSessions={totalSessions}
      />

      {/* Área principal */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", minWidth: 0 }}>

        {/* Header */}
        <div style={{
          borderBottom: `1px solid ${theme.border}`,
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
            {/* Countdown — só aparece se tem prazo */}
            {projectDeadline && (
              <>
                {[{ v: timeLeftStr.days, l: "Dias" }, { v: timeLeftStr.hours, l: "Horas" }].map(({ v, l }) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: isUrgent ? theme.warning : theme.text, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: theme.textDim, marginTop: 3 }}>{l}</div>
                  </div>
                ))}
                <button onClick={() => setSettingsActive(true)} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "center", padding: 0 }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: isUrgent ? theme.warning : theme.text, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{timeLeftStr.percent}%</div>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: theme.textDim, marginTop: 3 }}>do prazo</div>
                </button>
              </>
            )}

            {/* Login / Avatar no canto direito */}
            <div style={{ marginLeft: 16, borderLeft: "1px solid #21262d", paddingLeft: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <ThemeToggle />
              {token && userProfile ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {userProfile.avatar_url
                    ? <img src={userProfile.avatar_url} style={{ width: 32, height: 32, borderRadius: "50%" }} alt="" />
                    : <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13 }}>{userProfile.username?.[0]?.toUpperCase() || "U"}</div>
                  }
                  <button onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 900, color: "#f87171", fontFamily: "Outfit, sans-serif" }}>Sair</button>
                </div>
              ) : (
                <button
                  onClick={() => window.google?.accounts?.id?.prompt()}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10,
                    border: "1px solid #30363d", background: "#161b22", color: "#8b949e",
                    fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#30363d"; e.currentTarget.style.color = "#8b949e"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Área do timer com árvore central quando rodando */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", position: "relative" }}>
          {/* Só a árvore SVG — sem card, sem stats */}
          {showTreeInCenter && (
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.12, pointerEvents: "none",
              transition: "opacity 1s ease"
            }}>
              <svg viewBox="0 0 120 140" width={180} height={210} className="tree-sway" style={{ overflow: "visible" }}>
                <ellipse cx="60" cy="132" rx="22" ry="5" fill="#21262d" />
                {treeHealth === 0 ? (<>
                  <circle cx="60" cy="128" r="5" fill="#4ade80" opacity="0.6" />
                  <circle cx="60" cy="128" r="3" fill="#86efac" />
                  <line x1="60" y1="123" x2="60" y2="115" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
                </>) : treeHealth <= 25 ? (<>
                  <rect x="57" y="105" width="6" height="27" rx="3" fill="#6b4c1e" />
                  <circle cx="60" cy="100" r="12" fill="#16a34a" />
                  <circle cx="52" cy="107" r="8" fill="#15803d" />
                  <circle cx="68" cy="106" r="8" fill="#15803d" />
                </>) : treeHealth <= 50 ? (<>
                  <rect x="55" y="95" width="10" height="37" rx="5" fill="#6b4c1e" />
                  <circle cx="60" cy="85" r="20" fill="#16a34a" />
                  <circle cx="44" cy="96" r="13" fill="#15803d" />
                  <circle cx="76" cy="94" r="13" fill="#15803d" />
                  <circle cx="60" cy="73" r="12" fill="#22c55e" />
                </>) : treeHealth <= 75 ? (<>
                  <rect x="54" y="92" width="12" height="40" rx="6" fill="#6b4c1e" />
                  <circle cx="60" cy="74" r="26" fill="#16a34a" />
                  <circle cx="40" cy="85" r="18" fill="#15803d" />
                  <circle cx="80" cy="83" r="18" fill="#15803d" />
                  <circle cx="60" cy="60" r="17" fill="#22c55e" />
                  <circle cx="48" cy="68" r="10" fill="#4ade80" opacity="0.5" />
                </>) : (<>
                  <rect x="54" y="90" width="12" height="42" rx="6" fill="#6b4c1e" />
                  <circle cx="60" cy="60" r="32" fill="#16a34a" />
                  <circle cx="38" cy="74" r="22" fill="#15803d" />
                  <circle cx="82" cy="72" r="22" fill="#15803d" />
                  <circle cx="60" cy="46" r="20" fill="#22c55e" />
                  <circle cx="47" cy="55" r="13" fill="#4ade80" opacity="0.6" />
                  <circle cx="73" cy="53" r="11" fill="#4ade80" opacity="0.5" />
                </>)}
              </svg>
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

      <Bosque
        active={bosqueActive}
        onClose={() => setBosqueActive(false)}
        trees={bosqueTrees}
        totalMinutes={totalFocusMinutes}
      />

      {/* Ranking Overlay */}
      {rankingActive && (
        <div style={{
          position: "fixed", inset: 0, background: theme.victoryBg,
          backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div style={{
            background: theme.modalBg, border: `1px solid ${theme.border}`, borderRadius: 20,
            padding: 24, width: "92%", maxWidth: 420, maxHeight: "80vh", overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: theme.text, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                🏆 Ranking
              </h3>
              <button onClick={() => setRankingActive(false)} style={{
                width: 32, height: 32, borderRadius: 8, background: theme.border,
                border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                color: theme.textMuted, cursor: "pointer"
              }}>✕</button>
            </div>

            {!token ? (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <p style={{ fontSize: 36, margin: 0 }}>🔒</p>
                <p style={{ fontSize: 14, color: theme.textMuted, margin: "12px 0 0" }}>Faça login para ver o ranking</p>
              </div>
            ) : rankingLoading ? (
              <p style={{ textAlign: "center", color: theme.textMuted, padding: 30 }}>Carregando...</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 400, overflowY: "auto" }}>
                {rankingList.length === 0 ? (
                  <p style={{ textAlign: "center", color: theme.textMuted, padding: 30 }}>Ninguém no ranking ainda</p>
                ) : rankingList.map((user, idx) => {
                  const isMe = userProfile && user.username === userProfile.username;
                  return (
                    <div key={user.username} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 14px", borderRadius: 12,
                      background: isMe ? theme.accentBg : "transparent",
                      border: isMe ? `1px solid ${theme.accent}40` : "1px solid transparent",
                    }}>
                      <span style={{ width: 28, textAlign: "center", fontSize: idx < 3 ? 18 : 13, fontWeight: 900, color: idx < 3 ? theme.accent : theme.textDim }}>
                        {idx < 3 ? ["🥇","🥈","🥉"][idx] : idx + 1}
                      </span>
                      {user.avatar_url
                        ? <img src={user.avatar_url} style={{ width: 36, height: 36, borderRadius: "50%" }} alt="" />
                        : <div style={{ width: 36, height: 36, borderRadius: "50%", background: theme.accentBg, color: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14 }}>{user.username?.[0]?.toUpperCase() || "U"}</div>
                      }
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 900, color: isMe ? theme.accent : theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {user.username} {isMe && <span style={{ fontSize: 10, opacity: 0.7 }}>(você)</span>}
                        </div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: theme.accent }}>{user.xp ?? 0}<span style={{ fontSize: 10, color: theme.textDim, marginLeft: 2 }}>XP</span></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
