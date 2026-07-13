"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import TaskInput from "@/components/TaskInput";
import TimerCircle from "@/components/TimerCircle";
import MascotTree from "@/components/MascotTree";
import Notepad from "@/components/Notepad";
import { SettingsModal, RankingModal } from "@/components/Modals";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://a33qw28hn83ky06i7gua435q.187.127.15.180.sslip.io";

export default function PragmaDashboard() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [rankingList, setRankingList] = useState([]);
  const [rankingActive, setRankingActive] = useState(false);

  // Estados de Foco Minimalista
  const [currentTask, setCurrentTask] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("2026-07-31");
  const [treeHealth, setTreeHealth] = useState(100);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);
  const [notes, setNotes] = useState("");

  // Timers
  const [timerSeconds, setTimerSeconds] = useState(1500);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeTimerMode, setActiveTimerMode] = useState(1500);

  // Modais e Contadores
  const [settingsActive, setSettingsActive] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState({ days: "00", hours: "00", percent: 0 });

  const audioCtxRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const googleBtnContainerRef = useRef(null);
  const confettiCanvasRef = useRef(null);

  // --- CARREGAMENTO INICIAL ---
  useEffect(() => {
    const savedToken = localStorage.getItem("pragma_token");
    if (savedToken) {
      setToken(savedToken);
      fetchUserData(savedToken);
    } else {
      loadStateLocal();
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
          
          if (googleBtnContainerRef.current) {
            window.google.accounts.id.renderButton(
              googleBtnContainerRef.current,
              { theme: "outline", size: "large", width: "100%" }
            );
          }
        } else {
          setTimeout(initGoogle, 500);
        }
      };
      initGoogle();
    }
  }, [token]);

  const loadStateLocal = () => {
    const saved = localStorage.getItem("pragma_state_minimal");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.currentTask !== undefined) setCurrentTask(data.currentTask);
        if (data.projectDeadline !== undefined) setProjectDeadline(data.projectDeadline);
        if (data.treeHealth !== undefined) setTreeHealth(data.treeHealth);
        if (data.totalFocusMinutes !== undefined) setTotalFocusMinutes(data.totalFocusMinutes);
        if (data.notes !== undefined) setNotes(data.notes);
      } catch (e) { console.error(e); }
    }
  };

  const fetchUserData = async (jwtToken) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { "Authorization": `Bearer ${jwtToken}` }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setUserProfile(data);
      setTreeHealth(data.tree_health);
      setTotalFocusMinutes(data.xp); 
    } catch (e) {
      console.error(e);
      loadStateLocal();
    }
  };

  const handleGoogleLoginResponse = async (googleResponse) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential_token: googleResponse.credential })
      });
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("pragma_token", data.access_token);
        setToken(data.access_token);
        fetchUserData(data.access_token);
      }
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
    localStorage.removeItem("pragma_token");
    setToken(null);
    setUserProfile(null);
    loadStateLocal();
  };

  const syncWithBackend = async () => {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/users/me/sync`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          email: userProfile.email,
          username: userProfile.username,
          xp: totalFocusMinutes,
          level: 1,
          gems: 100,
          streak: 1,
          water_units: 0,
          skill_points: 0,
          tree_health: treeHealth,
          tree_dead: treeHealth <= 0,
          mudas: 0,
          adubos: 0,
          essencias: 0,
          last_streak_date: "",
          last_activity_date: ""
        })
      });
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (token) {
      syncWithBackend();
    } else {
      const stateObj = { currentTask, projectDeadline, treeHealth, totalFocusMinutes, notes };
      localStorage.setItem("pragma_state_minimal", JSON.stringify(stateObj));
    }
  }, [currentTask, projectDeadline, treeHealth, totalFocusMinutes, notes]);

  const loadGlobalRanking = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/ranking`);
      const data = await res.json();
      setRankingList(data);
      setRankingActive(true);
    } catch (e) { alert("Erro ao obter o ranking."); }
  };

  useEffect(() => {
    updateDeadlineCountdown();
    const deadlineInterval = setInterval(updateDeadlineCountdown, 60000);
    return () => clearInterval(deadlineInterval);
  }, [projectDeadline]);

  const updateDeadlineCountdown = () => {
    if (!projectDeadline) return;
    const target = new Date(`${projectDeadline}T23:59:59`);
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      setTimeLeftStr({ days: "00", hours: "00", percent: 100 });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const monthStart = new Date(target.getFullYear(), target.getMonth(), 1);
    const total = target - monthStart;
    const elapsed = now - monthStart;
    let percent = Math.min(100, Math.max(0, (elapsed / total) * 100));

    setTimeLeftStr({
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      percent: Math.round(percent)
    });
  };

  // --- AUDIO API ---
  const playSound = (type) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const audioCtx = audioCtxRef.current;
    if (audioCtx.state === "suspended") audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === "success") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "alarm") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.linearRampToValueAtTime(440, now + 0.2);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  };

  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height - 20,
        size: Math.random() * 6 + 3,
        color: `hsl(${Math.random() * 360}, 65%, 55%)`,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 3 - 1.5
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();
        if (p.y < canvas.height) active = true;
      });
      if (active) requestAnimationFrame(animate);
    };
    animate();
  };

  // --- TIMER CONTROLS ---
  const handleStartTimer = () => {
    if (timerRunning) {
      clearInterval(timerIntervalRef.current);
      setTimerRunning(false);
    } else {
      setTimerRunning(true);
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setTimerRunning(false);
            playSound("alarm");
            triggerConfetti();
            
            const minutesFocused = activeTimerMode === 1500 ? 25 : 5;
            setTotalFocusMinutes(m => m + minutesFocused);
            setTreeHealth(th => Math.min(100, th + 20));
            return activeTimerMode;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const selectTimerMode = (duration) => {
    clearInterval(timerIntervalRef.current);
    setTimerRunning(false);
    setActiveTimerMode(duration);
    setTimerSeconds(duration);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Círculo progress
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timerSeconds / activeTimerMode) * circumference;

  return (
    <div className="min-h-screen bg-[#f2f6f4] text-[#0f2d4a] flex flex-col md:flex-row font-sans relative overflow-hidden select-none">
      <canvas id="confetti-canvas" ref={confettiCanvasRef} className="absolute inset-0 pointer-events-none z-50"></canvas>

      {/* Sidebar Modular */}
      <Sidebar 
        token={token}
        userProfile={userProfile}
        googleBtnContainerRef={googleBtnContainerRef}
        onLogout={handleLogout}
        onOpenRanking={loadGlobalRanking}
        onOpenSettings={() => setSettingsActive(true)}
      />

      {/* Grid Central Baseado na Proporção Áurea (61.8% e 38.2%) */}
      <main className="flex-1 p-4 md:p-[26px] flex flex-col lg:flex-row items-stretch justify-center gap-[26px] max-w-6xl mx-auto w-full">
        
        {/* Coluna Esquerda: Objetivo & Timer (61.8% da largura) */}
        <div className="w-full lg:basis-[61.8%] flex flex-col gap-[26px]">
          
          <TaskInput 
            currentTask={currentTask}
            setCurrentTask={setCurrentTask}
            projectDeadline={projectDeadline}
            timeLeftStr={timeLeftStr}
            onOpenSettings={() => setSettingsActive(true)}
          />

          <TimerCircle 
            timerSeconds={timerSeconds}
            timerRunning={timerRunning}
            activeTimerMode={activeTimerMode}
            handleStartTimer={handleStartTimer}
            selectTimerMode={selectTimerMode}
            formatTimer={formatTimer}
            strokeDashoffset={strokeDashoffset}
            circumference={circumference}
          />
        </div>

        {/* Coluna Direita: Jardim de Foco & Notas (38.2% da largura) */}
        <div className="w-full lg:basis-[38.2%] flex flex-col gap-[26px]">
          
          <MascotTree 
            treeHealth={treeHealth}
            totalFocusMinutes={totalFocusMinutes}
          />

          <Notepad 
            notes={notes}
            setNotes={setNotes}
            timeLeftStr={timeLeftStr}
          />
        </div>
      </main>

      {/* Modais Modulares */}
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
    </div>
  );
}
