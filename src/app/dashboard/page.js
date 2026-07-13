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
  Sparkles
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
    <div className="min-h-screen bg-[#f7faf7] text-[#3c3c3c] flex flex-col md:flex-row font-sans relative overflow-hidden select-none">
      <canvas id="confetti-canvas" ref={confettiCanvasRef} className="absolute inset-0 pointer-events-none z-50"></canvas>

      {/* Sidebar Esquerda (Estilo Duolingo Minimal) */}
      <aside className="w-full md:w-[260px] bg-white border-r-2 border-[#e5e5e5] flex flex-col p-6 z-10 gap-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#58cc02] flex items-center justify-center shadow-[0_3px_0_#46a302]">
            <Target className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
          <span className="font-black text-2xl tracking-wider text-[#58cc02]">PRAGMA</span>
        </div>

        {/* Perfil & Login do Google One Tap */}
        <div className="p-4 bg-[#f1f1f1] border-2 border-[#e5e5e5] rounded-2xl flex flex-col gap-2">
          {!token ? (
            <div>
              <div className="text-[10px] font-black text-[#777777] mb-2 text-center uppercase tracking-wider">Entrar na Conta</div>
              <div ref={googleBtnContainerRef} id="google-login-btn"></div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {userProfile?.avatar_url ? (
                <img src={userProfile.avatar_url} className="w-8 h-8 rounded-full border-2 border-[#58cc02]" alt="Avatar" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-xs text-[#3c3c3c] border border-[#e5e5e5]">U</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black truncate text-[#3c3c3c] flex items-center gap-1">
                  {userProfile?.username}
                  <span className="text-[9px] px-1 py-0.25 rounded bg-[#e5e5e5] font-normal text-[#3c3c3c] border border-[#e5e5e5]">
                    {userProfile?.country || "BR"}
                  </span>
                </div>
                <div className="text-[10px] text-[#777777] truncate">{userProfile?.email}</div>
              </div>
              <button onClick={handleLogout} className="text-[10px] text-red-600 hover:text-red-700 font-extrabold cursor-pointer transition-all">Sair</button>
            </div>
          )}
        </div>

        {/* Links de navegação simples */}
        <nav className="flex flex-col gap-3 flex-1">
          <button className="flex items-center gap-3 px-4 py-3 rounded-2xl btn-duo-green border-b-4 text-left transition-all">
            <Timer className="w-5 h-5 text-white" />
            <span className="font-extrabold text-sm">Dashboard Foco</span>
          </button>
          <button onClick={loadGlobalRanking} className="flex items-center gap-3 px-4 py-3 rounded-2xl btn-duo-white text-left transition-all cursor-pointer">
            <Trophy className="w-5 h-5 text-[#afafaf]" />
            <span className="font-extrabold text-sm text-[#afafaf] hover:text-[#777777]">Ranking Mundial</span>
          </button>
          <button onClick={() => setSettingsActive(true)} className="flex items-center gap-3 px-4 py-3 rounded-2xl btn-duo-white text-left transition-all cursor-pointer">
            <Calendar className="w-5 h-5 text-[#afafaf]" />
            <span className="font-extrabold text-sm text-[#afafaf] hover:text-[#777777]">Configurar Prazo</span>
          </button>
        </nav>

        <div className="text-[10px] text-[#afafaf] text-center font-bold">
          PRAGMA &bull; Mantenha o Foco
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 px-6 py-8 flex flex-col md:flex-row items-stretch justify-center gap-8 z-10 max-w-5xl mx-auto w-full">
        
        {/* Coluna Esquerda: Objetivo & Timer */}
        <div className="flex-[1.2] flex flex-col gap-6 w-full">
          
          {/* Card Objetivo Ativo */}
          <div className="bg-white border-2 border-[#e5e5e5] border-b-4 p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#58cc02]">O que vamos fazer agora?</span>
              <input 
                type="text" 
                value={currentTask} 
                onChange={(e) => setCurrentTask(e.target.value)} 
                placeholder="Escreva sua meta simples aqui..."
                className="w-full bg-transparent text-lg font-black text-[#3c3c3c] placeholder-[#afafaf] border-b-2 border-[#e5e5e5] pb-2 focus:border-[#58cc02] focus:outline-none transition-all"
              />
            </div>
            
            <div className="flex justify-between items-center text-xs font-bold text-[#777777]">
              <span className="cursor-pointer hover:text-[#58cc02] transition-all flex items-center gap-1.5" onClick={() => setSettingsActive(true)}>
                <Calendar className="w-3.5 h-3.5 text-[#58cc02]" /> Prazo: {projectDeadline}
              </span>
              <span>Faltam {timeLeftStr.days} dias</span>
            </div>
          </div>

          {/* Card do Timer (Clean & Friendly) */}
          <div className="bg-white border-2 border-[#e5e5e5] border-b-4 p-8 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center gap-8">
            
            {/* Timer Circular */}
            <div className="relative flex items-center justify-center w-[220px] h-[220px] md:w-[240px] md:h-[240px] z-10">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="90"
                  className="stroke-[#e5e5e5]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="90"
                  className="stroke-[#58cc02] transition-all duration-300"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 90}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-5xl md:text-6xl font-black tracking-tight tabular-nums text-[#3c3c3c]">
                  {formatTimer(timerSeconds)}
                </span>
                <span className="text-[10px] uppercase font-black tracking-widest text-[#ffffff] mt-2 bg-[#58cc02] px-3.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-[0_2px_0_#46a302]">
                  <Activity className="w-2.5 h-2.5" /> {activeTimerMode === 1500 ? "Foco" : "Intervalo"}
                </span>
              </div>
            </div>

            {/* Controles de Foco */}
            <div className="w-full max-w-sm flex flex-col gap-4 z-10">
              <div className="flex gap-3 justify-center">
                <button 
                  className={`flex-grow py-2.5 rounded-2xl text-xs font-black transition-all border-b-4 ${activeTimerMode === 1500 ? "btn-duo-green" : "btn-duo-white"}`}
                  onClick={() => selectTimerMode(1500)}
                >
                  Focar (25m)
                </button>
                <button 
                  className={`flex-grow py-2.5 rounded-2xl text-xs font-black transition-all border-b-4 ${activeTimerMode === 300 ? "btn-duo-green opacity-90" : "btn-duo-white"}`}
                  onClick={() => selectTimerMode(300)}
                >
                  Intervalo (5m)
                </button>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleStartTimer} 
                  className="flex-grow py-4 rounded-2xl btn-duo-green text-sm tracking-wider active:scale-[0.98] transition-all cursor-pointer text-center"
                >
                  {timerRunning ? "PAUSAR SESSÃO" : "INICIAR AGORA!"}
                </button>
                <button 
                  onClick={() => selectTimerMode(activeTimerMode)} 
                  className="px-5 py-4 rounded-2xl btn-duo-white transition-all cursor-pointer flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 text-[#afafaf]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Jardim de Foco & Notas */}
        <div className="flex-[0.8] flex flex-col gap-6 w-full">
          
          {/* Card: Jardim de Hábitos */}
          <div className="p-6 bg-white border-2 border-[#e5e5e5] border-b-4 rounded-2xl flex items-center justify-between relative overflow-hidden">
            <div className="flex flex-col gap-2 z-10">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#afafaf]">Tempo Focado</span>
              <div className="text-3xl font-black text-[#3c3c3c] leading-none">
                {totalFocusMinutes} <span className="text-xs font-bold text-[#777777]">minutos</span>
              </div>
              <span className="text-[10px] font-black text-[#58cc02]">Saúde do Mascotinho: {treeHealth}%</span>
              
              {/* Barra de progresso */}
              <div className="w-28 h-2.5 bg-[#e5e5e5] rounded-full overflow-hidden mt-1">
                <div className="h-full bg-[#58cc02] transition-all duration-500" style={{ width: `${treeHealth}%` }}></div>
              </div>
            </div>

            {/* Ilustração Minimalista da Árvore */}
            <div className="w-16 h-16 flex items-center justify-center bg-[#f7faf7] border-2 border-[#e5e5e5] rounded-2xl p-2 z-10">
              <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-300 ${treeHealth <= 0 ? "grayscale opacity-45" : ""}`}>
                {/* Chão */}
                <path d="M20,80 Q50,78 80,80" stroke="#afafaf" strokeWidth="4" fill="none" />
                {/* Tronco */}
                <path d="M50,80 L50,48" stroke="#777777" strokeWidth="7" strokeLinecap="round" />
                
                {/* Copa (Folhas) */}
                <circle cx="50" cy="38" r="18" fill="#58cc02" />
                <circle cx="36" cy="46" r="14" fill="#46a302" />
                <circle cx="64" cy="44" r="14" fill="#58cc02" />

                {/* Expressões do Mascote (Olhos e Boca) */}
                {treeHealth <= 0 ? (
                  // Olhos em X e Boca Reta (Morta/Seca)
                  <>
                    <path d="M40,38 L48,46" stroke="#3c3c3c" strokeWidth="3" strokeLinecap="round" />
                    <path d="M48,38 L40,46" stroke="#3c3c3c" strokeWidth="3" strokeLinecap="round" />
                    <path d="M54,38 L62,46" stroke="#3c3c3c" strokeWidth="3" strokeLinecap="round" />
                    <path d="M62,38 L54,46" stroke="#3c3c3c" strokeWidth="3" strokeLinecap="round" />
                    <path d="M44,56 L58,56" stroke="#3c3c3c" strokeWidth="3" strokeLinecap="round" />
                  </>
                ) : treeHealth < 50 ? (
                  // Olhos Preocupados e Boca Triste (Saúde Baixa)
                  <>
                    <circle cx="43" cy="42" r="3.5" fill="#3c3c3c" />
                    <circle cx="57" cy="42" r="3.5" fill="#3c3c3c" />
                    <path d="M40,35 Q44,32 47,35" stroke="#3c3c3c" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M53,35 Q56,32 60,35" stroke="#3c3c3c" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M46,55 Q50,50 54,55" stroke="#3c3c3c" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </>
                ) : (
                  // Olhos Felizes com Brilho e Sorriso Aberto (Saudável)
                  <>
                    <circle cx="43" cy="42" r="4.5" fill="#3c3c3c" />
                    <circle cx="44.5" cy="40.5" r="1.5" fill="#ffffff" />
                    <circle cx="57" cy="42" r="4.5" fill="#3c3c3c" />
                    <circle cx="58.5" cy="40.5" r="1.5" fill="#ffffff" />
                    <path d="M45,52 Q50,60 55,52" stroke="#3c3c3c" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* Card: Bloco de Notas */}
          <div className="flex-1 flex flex-col gap-2 bg-white border-2 border-[#e5e5e5] border-b-4 p-5 rounded-2xl">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#58cc02] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#58cc02]" /> Limpeza Mental
            </span>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escreva aqui qualquer pensamento que queira tirar da cabeça antes de começar..."
              className="w-full h-full min-h-[160px] bg-transparent border-0 focus:outline-none text-sm font-bold text-[#3c3c3c] placeholder-[#afafaf] resize-none transition-all"
            />
          </div>
        </div>
      </main>

      {/* MODAL CONFIGURAÇÕES */}
      {settingsActive && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header flex justify-between items-center pb-4 border-b-2 border-[#e5e5e5]">
              <h3 className="font-black text-[#3c3c3c] flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#58cc02]" /> Definir Prazo
              </h3>
              <button className="close-modal-btn font-black cursor-pointer" onClick={() => setSettingsActive(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="modal-body py-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#777777] font-black">Data Limite da Meta:</label>
                <input 
                  type="date" 
                  value={projectDeadline} 
                  onChange={(e) => setProjectDeadline(e.target.value)} 
                  className="w-full p-3 rounded-2xl bg-[#f7faf7] border-2 border-[#e5e5e5] text-[#3c3c3c] font-black focus:outline-none focus:border-[#58cc02]"
                />
              </div>
            </div>
            <div className="modal-footer pt-4 border-t-2 border-[#e5e5e5] flex gap-3">
              <button className="w-full py-3.5 rounded-2xl btn-duo-green text-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5" onClick={() => { setSettingsActive(false); updateDeadlineCountdown(); }}>
                <Check className="w-4 h-4 text-white" /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RANKING GLOBAL MUNDIAL */}
      {rankingActive && (
        <div className="modal-overlay active">
          <div className="modal-content max-w-sm">
            <div className="modal-header flex justify-between items-center pb-4 border-b-2 border-[#e5e5e5]">
              <h3 className="font-black text-[#3c3c3c] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#58cc02]" /> Ranking de Foco
              </h3>
              <button className="close-modal-btn font-black cursor-pointer" onClick={() => setRankingActive(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="modal-body py-6 flex flex-col gap-2 max-h-[400px] overflow-y-auto">
              {rankingList.map((user, idx) => (
                <div key={user.username} className={`flex items-center gap-3 p-3 rounded-2xl border-2 ${idx === 0 ? 'bg-[#58cc02]/10 border-[#58cc02]' : 'bg-[#f7faf7] border-[#e5e5e5]'}`}>
                  <span className="font-black text-sm w-5 text-center text-[#3c3c3c]">{idx + 1}</span>
                  {user.avatar_url ? (
                    <img src={user.avatar_url} className="w-8 h-8 rounded-full border border-[#cbdccb]" alt="Avatar" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-xs text-[#3c3c3c] border border-[#e5e5e5]">U</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-black truncate text-[#3c3c3c] flex items-center gap-1.5">
                      {user.username}
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white font-normal text-[#3c3c3c] border border-[#e5e5e5]">
                        {user.country || "BR"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-[#3c3c3c]">{user.level} min</div>
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
