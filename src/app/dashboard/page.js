"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Trophy, 
  Target, 
  Timer, 
  RefreshCw, 
  Settings, 
  LogOut, 
  Calendar, 
  FileText, 
  Activity, 
  X, 
  Check, 
  Sparkles,
  ArrowRight
} from "lucide-react";

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

  // --- TIMER ---
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
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timerSeconds / activeTimerMode) * circumference;

  return (
    <div className="min-h-screen bg-[#f0f6f3] text-[#0a2540] flex flex-col md:flex-row font-sans relative overflow-hidden select-none">
      <canvas id="confetti-canvas" ref={confettiCanvasRef} className="absolute inset-0 pointer-events-none z-50"></canvas>

      {/* Sidebar Esquerda (Tailwind Clean Design) */}
      <aside className="w-full md:w-[260px] bg-white border-r border-[#cbdccb]/50 flex flex-col p-6 z-10 gap-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#0a2540] flex items-center justify-center shadow-md">
            <Target className="w-5 h-5 text-[#2ec4b6]" strokeWidth={3} />
          </div>
          <span className="font-black text-xl tracking-wider text-[#0a2540]">PRAGMA</span>
        </div>

        {/* Perfil & Login do Google One Tap */}
        <div className="p-4 bg-[#e5f0e7] border border-[#cbdccb]/40 rounded-2xl flex flex-col gap-2">
          {!token ? (
            <div>
              <div className="text-[10px] font-black text-[#0a2540] mb-2 text-center uppercase tracking-wider">Entrar na Conta</div>
              <div ref={googleBtnContainerRef} id="google-login-btn"></div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {userProfile?.avatar_url ? (
                <img src={userProfile.avatar_url} className="w-8 h-8 rounded-full border border-[#2ec4b6]" alt="Avatar" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-xs text-[#0a2540]">U</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black truncate text-[#0a2540] flex items-center gap-1">
                  {userProfile?.username}
                  <span className="text-[9px] px-1 py-0.25 rounded bg-white font-normal text-[#0a2540]">
                    {userProfile?.country || "BR"}
                  </span>
                </div>
                <div className="text-[10px] text-[#0a2540]/70 truncate">{userProfile?.email}</div>
              </div>
              <button onClick={handleLogout} className="text-[10px] text-red-600 hover:text-red-700 font-extrabold cursor-pointer transition-all">Sair</button>
            </div>
          )}
        </div>

        {/* Links de navegação simples */}
        <nav className="flex flex-col gap-2 flex-1">
          <button className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#0a2540] text-white font-black text-sm text-left transition-all shadow-sm">
            <Timer className="w-4 h-4 text-[#2ec4b6]" /> Dashboard Foco
          </button>
          <button onClick={loadGlobalRanking} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[#0a2540] hover:bg-[#e5f0e7] font-bold text-sm text-left transition-all cursor-pointer">
            <Trophy className="w-4 h-4 text-[#0a2540]/60" /> Ranking Mundial
          </button>
          <button onClick={() => setSettingsActive(true)} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[#0a2540] hover:bg-[#e5f0e7] font-bold text-sm text-left transition-all cursor-pointer">
            <Calendar className="w-4 h-4 text-[#0a2540]/60" /> Configurar Prazo
          </button>
        </nav>

        <div className="text-[10px] text-[#0a2540]/50 text-center font-bold">
          Pragma &bull; Design Autoral
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 px-8 py-10 flex flex-col md:flex-row items-stretch justify-center gap-8 z-10 max-w-5xl mx-auto w-full">
        
        {/* Coluna Esquerda: Objetivo & Timer */}
        <div className="flex-[1.2] flex flex-col gap-6 w-full">
          
          {/* Card Objetivo Ativo */}
          <div className="bg-white border border-[#cbdccb]/50 p-6 rounded-[24px] shadow-sm flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] w-24 h-24 rounded-full bg-[#2ec4b6]/5 pointer-events-none"></div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#2ec4b6]">No que você vai focar agora?</span>
              <input 
                type="text" 
                value={currentTask} 
                onChange={(e) => setCurrentTask(e.target.value)} 
                placeholder="Ex: Concluir rascunho da introdução..."
                className="w-full bg-transparent text-xl font-black text-[#0a2540] placeholder-[#0a2540]/15 border-b border-[#cbdccb]/40 pb-2 focus:border-[#2ec4b6] focus:outline-none transition-all"
              />
            </div>
            
            <div className="flex justify-between items-center text-xs font-bold text-[#0a2540]/60">
              <span className="cursor-pointer hover:text-[#2ec4b6] transition-all flex items-center gap-1.5" onClick={() => setSettingsActive(true)}>
                <Calendar className="w-3.5 h-3.5 text-[#2ec4b6]" /> Prazo: {projectDeadline}
              </span>
              <span>Faltam {timeLeftStr.days} dias ({timeLeftStr.percent}% decorrido)</span>
            </div>
          </div>

          {/* Card do Timer (Navy e Bold) */}
          <div className="bg-[#0a2540] text-white p-8 rounded-[32px] shadow-lg relative overflow-hidden flex flex-col items-center justify-center gap-8">
            
            {/* Curvas Orgânicas Vetoriais Decorativas */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,40 C30,50 70,20 100,40 L100,100 L0,100 Z" fill="#2ec4b6" />
              <path d="M0,60 C40,40 60,80 100,60 L100,100 L0,100 Z" fill="#cbf3f0" />
            </svg>

            {/* Timer Circular */}
            <div className="relative flex items-center justify-center w-[220px] h-[220px] md:w-[240px] md:h-[240px] z-10">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="90"
                  className="stroke-white/[0.04]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="90"
                  className="stroke-[#2ec4b6] transition-all duration-300"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 90}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-5xl md:text-6xl font-black tracking-tight tabular-nums text-white">
                  {formatTimer(timerSeconds)}
                </span>
                <span className="text-[9px] uppercase font-black tracking-widest text-[#2ec4b6] mt-1.5 bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Activity className="w-2.5 h-2.5" /> {activeTimerMode === 1500 ? "Focar" : "Pausa"}
                </span>
              </div>
            </div>

            {/* Controles de Foco */}
            <div className="w-full max-w-sm flex flex-col gap-4 z-10">
              <div className="flex gap-2.5 justify-center">
                <button 
                  className={`flex-grow py-2.5 rounded-2xl text-xs font-black transition-all border ${activeTimerMode === 1500 ? "bg-[#2ec4b6] text-[#0a2540] border-[#2ec4b6]" : "bg-white/5 text-white/70 border-white/10 hover:border-white/20"}`}
                  onClick={() => selectTimerMode(1500)}
                >
                  Foco (25m)
                </button>
                <button 
                  className={`flex-grow py-2.5 rounded-2xl text-xs font-black transition-all border ${activeTimerMode === 300 ? "bg-[#2ec4b6] text-[#0a2540] border-[#2ec4b6]" : "bg-white/5 text-white/70 border-white/10 hover:border-white/20"}`}
                  onClick={() => selectTimerMode(300)}
                >
                  Pausa (5m)
                </button>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleStartTimer} 
                  className="flex-grow py-4 rounded-2xl bg-[#2ec4b6] hover:bg-[#25ab9e] text-[#0a2540] font-black text-sm tracking-wider active:scale-[0.98] transition-all cursor-pointer text-center"
                >
                  {timerRunning ? "PAUSAR" : "INICIAR SESSÃO"}
                </button>
                <button 
                  onClick={() => selectTimerMode(activeTimerMode)} 
                  className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Jardim de Foco & Notas */}
        <div className="flex-[0.8] flex flex-col gap-6 w-full">
          
          {/* Card: Jardim de Hábitos */}
          <div className="p-6 bg-gradient-to-br from-[#2ec4b6] to-[#0a2540] text-white rounded-[24px] shadow-md flex items-center justify-between relative overflow-hidden">
            <div className="flex flex-col gap-2 z-10">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#cbf3f0]">Tempo Focado</span>
              <div className="text-3xl font-black text-white leading-none">
                {totalFocusMinutes} <span className="text-xs font-medium text-[#cbf3f0]">minutos</span>
              </div>
              <span className="text-[10px] font-bold text-white/80">Saúde do Jardim: {treeHealth}%</span>
              
              {/* Barra de progresso */}
              <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-white transition-all duration-500" style={{ width: `${treeHealth}%` }}></div>
              </div>
            </div>

            {/* Ilustração Minimalista da Árvore */}
            <div className="w-16 h-16 flex items-center justify-center bg-white/10 border border-white/20 rounded-2xl p-2 z-10 backdrop-blur-md">
              <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-300 ${treeHealth <= 0 ? "grayscale opacity-40" : ""}`}>
                <path d="M20,80 Q50,78 80,80" stroke="rgba(255,255,255,0.25)" strokeWidth="3" fill="none" />
                <path d="M50,80 L50,45" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
                {treeHealth > 0 && (
                  <>
                    <circle cx="50" cy="40" r="12" fill="#cbf3f0" />
                    <circle cx="40" cy="48" r="9" fill="#2ec4b6" />
                    <circle cx="60" cy="46" r="9" fill="#ffffff" />
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* Card: Bloco de Notas */}
          <div className="flex-1 flex flex-col gap-2 bg-white border border-[#cbdccb]/50 p-6 rounded-[24px] shadow-sm">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#2ec4b6] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#2ec4b6]" /> Descarregar Pensamentos
            </span>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="O que está tirando seu foco? Registre aqui rapidamente e limpe sua mente para o timer atual..."
              className="w-full h-full min-h-[160px] bg-transparent border-0 focus:outline-none text-sm font-medium text-[#0a2540] placeholder-[#0a2540]/20 resize-none transition-all"
            />
          </div>
        </div>
      </main>

      {/* MODAL CONFIGURAÇÕES */}
      {settingsActive && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header flex justify-between items-center pb-4 border-b border-[#cbdccb]/30">
              <h3 className="font-black text-[#0a2540] flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#2ec4b6]" /> Definir Prazo Final
              </h3>
              <button className="close-modal-btn cursor-pointer" onClick={() => setSettingsActive(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="modal-body py-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#0a2540]/60 font-black">Data Limite da Meta:</label>
                <input 
                  type="date" 
                  value={projectDeadline} 
                  onChange={(e) => setProjectDeadline(e.target.value)} 
                  className="w-full p-3.5 rounded-2xl bg-[#f0f6f3] border border-[#cbdccb] text-[#0a2540] font-black focus:outline-none focus:border-[#2ec4b6]"
                />
              </div>
            </div>
            <div className="modal-footer pt-4 border-t border-[#cbdccb]/30 flex gap-3">
              <button className="w-full py-3.5 rounded-2xl bg-[#0a2540] hover:bg-[#061524] text-white font-black text-sm tracking-wider active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5" onClick={() => { setSettingsActive(false); updateDeadlineCountdown(); }}>
                <Check className="w-4 h-4 text-[#2ec4b6]" /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RANKING GLOBAL MUNDIAL */}
      {rankingActive && (
        <div className="modal-overlay active">
          <div className="modal-content max-w-sm">
            <div className="modal-header flex justify-between items-center pb-4 border-b border-[#cbdccb]/30">
              <h3 className="font-black text-[#0a2540] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#2ec4b6]" /> Ranking de Foco
              </h3>
              <button className="close-modal-btn cursor-pointer" onClick={() => setRankingActive(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="modal-body py-6 flex flex-col gap-2 max-h-[400px] overflow-y-auto">
              {rankingList.map((user, idx) => (
                <div key={user.username} className={`flex items-center gap-3 p-3 rounded-2xl border ${idx === 0 ? 'bg-[#cbf3f0]/60 border-[#2ec4b6]' : 'bg-[#f0f6f3] border-[#cbdccb]'}`}>
                  <span className="font-black text-sm w-5 text-center text-[#0a2540]">{idx + 1}</span>
                  {user.avatar_url ? (
                    <img src={user.avatar_url} className="w-8 h-8 rounded-full border border-[#cbdccb]" alt="Avatar" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-xs text-[#0a2540]">U</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-black truncate text-[#0a2540] flex items-center gap-1.5">
                      {user.username}
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white font-normal text-[#0a2540]">
                        {user.country || "BR"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-[#0a2540]">{user.level} min</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
