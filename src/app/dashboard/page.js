"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TimerCircle from "@/components/TimerCircle";
import { SettingsModal, RankingModal, CheckInModal } from "@/components/Modals";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://a33qw28hn83ky06i7gua435q.187.127.15.180.sslip.io";

export default function PragmaDashboard() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [rankingList, setRankingList] = useState([]);
  const [rankingActive, setRankingActive] = useState(false);

  const [currentTask, setCurrentTask] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");
  const [treeHealth, setTreeHealth] = useState(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);
  const [streak, setStreak] = useState(0);

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

  const audioCtxRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const googleBtnContainerRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const taskInputRef = useRef(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("pragma_token");
    if (savedToken) { setToken(savedToken); fetchUserData(savedToken); }
    else loadStateLocal();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !token) {
      const initGoogle = () => {
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: "274648341216-k3s64mlubsm394u5ephef4hopiv887ng.apps.googleusercontent.com",
            callback: handleGoogleLoginResponse
          });
          if (googleBtnContainerRef.current) {
            window.google.accounts.id.renderButton(
              googleBtnContainerRef.current,
              { theme: "outline", size: "large", width: 180 }
            );
          }
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
          level: 1, gems: 100, streak: 1, water_units: 0, skill_points: 0,
          tree_health: treeHealth, tree_dead: treeHealth <= 0,
          mudas: 0, adubos: 0, essencias: 0, last_streak_date: "", last_activity_date: ""
        })
      });
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (token) syncWithBackend();
    else localStorage.setItem("pragma_state_minimal", JSON.stringify({ currentTask, projectDeadline, treeHealth, totalFocusMinutes }));
  }, [currentTask, projectDeadline, treeHealth, totalFocusMinutes]);

  const loadGlobalRanking = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/ranking`);
      setRankingList(await res.json()); setRankingActive(true);
    } catch { alert("Erro ao obter o ranking."); }
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
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    const t = ctx.currentTime;
    if (type === "alarm") {
      osc.type = "sine"; osc.frequency.setValueAtTime(660, t); osc.frequency.linearRampToValueAtTime(440, t + 0.2);
      gain.gain.setValueAtTime(0.08, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.start(t); osc.stop(t + 0.4);
    }
  };

  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * -canvas.height - 20,
      size: Math.random() * 6 + 3, color: `hsl(${Math.random() * 360},65%,55%)`,
      sx: Math.random() * 3 - 1.5, sy: Math.random() * 3 + 3,
      rot: Math.random() * 360, rs: Math.random() * 3 - 1.5
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

  const handleStartTimer = () => {
    if (timerRunning) { clearInterval(timerIntervalRef.current); setTimerRunning(false); return; }
    if (!currentTask.trim()) {
      setTaskShaking(true);
      setTimeout(() => setTaskShaking(false), 400);
      taskInputRef.current?.focus();
      return;
    }
    // Abre check-in apenas para sessões de foco (não pausa)
    if (activeTimerMode === 1500) {
      setSelectedMood(null);
      setMicroStep("");
      setCheckInActive(true);
      return;
    }
    confirmStartTimer();
  };

  const confirmStartTimer = () => {
    setCheckInActive(false);
    setTimerRunning(true);
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current); setTimerRunning(false);
          playSound("alarm"); triggerConfetti();
          const isFocus = activeTimerMode === 1500;
          setTotalFocusMinutes(m => m + (isFocus ? 25 : 5));
          if (isFocus) { setTreeHealth(th => Math.min(100, th + 25)); setSessionsToday(s => Math.min(4, s + 1)); setXpGain(true); setTimeout(() => setXpGain(false), 1800); setTimeout(() => selectTimerMode(300), 500); }
          else setTimeout(() => selectTimerMode(1500), 500);
          return activeTimerMode;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const selectTimerMode = (d) => { clearInterval(timerIntervalRef.current); setTimerRunning(false); setActiveTimerMode(d); setTimerSeconds(d); };
  const formatTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const isUrgent = parseInt(timeLeftStr.days) <= 3;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "Outfit, sans-serif", display: "flex", position: "relative", userSelect: "none" }}>
      <canvas ref={confettiCanvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50 }} />

      {/* Overlay mobile quando sidebar aberta */}
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
        googleBtnContainerRef={googleBtnContainerRef}
        onLogout={handleLogout}
        onOpenRanking={loadGlobalRanking}
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

        {/* Header: projeto ativo + countdown */}
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
          {/* Botão toggle sidebar */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            title={sidebarOpen ? "Esconder sidebar" : "Mostrar sidebar"}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563", display: "flex", alignItems: "center", flexShrink: 0, padding: 4 }}
          >
            {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>

          {/* Projeto */}
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

          {/* Countdown */}
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

        {/* Timer — centralizado */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px" }}>
          <TimerCircle
            timerSeconds={timerSeconds}
            timerRunning={timerRunning}
            activeTimerMode={activeTimerMode}
            handleStartTimer={handleStartTimer}
            selectTimerMode={selectTimerMode}
            formatTimer={formatTimer}
            sessionsToday={sessionsToday}
          />
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
    </div>
  );
}
