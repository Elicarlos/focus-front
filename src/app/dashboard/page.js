"use client";

import { useState, useEffect, useRef } from "react";

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
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "alarm") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.linearRampToValueAtTime(440, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
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
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height - 20,
        size: Math.random() * 6 + 4,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 4 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2
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
            alert(`🛡️ Sessão de foco concluída! (+${minutesFocused} minutos focados)`);
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

  // Porcentagem do círculo
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timerSeconds / activeTimerMode) * circumference;

  return (
    <div className="min-h-screen bg-[#050406] text-[#f4f4f7] flex flex-col font-sans relative overflow-hidden select-none">
      <canvas id="confetti-canvas" ref={confettiCanvasRef} className="absolute inset-0 pointer-events-none z-50"></canvas>

      {/* Background Dopamine Glows */}
      <div className="absolute top-[-25%] left-[-15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#ff3c00]/10 to-[#ffaa00]/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#7b2cbf]/10 to-[#ff007f]/10 blur-[130px] pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-8 py-6 flex justify-between items-center border-b border-white/[0.02] z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff3c00] to-[#ffaa00] flex items-center justify-center shadow-lg shadow-[#ff3c00]/25">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#050406" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="font-black text-xl tracking-widest bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">PRAGMA</span>
        </div>

        {/* Authentication Widget */}
        <div className="z-20">
          {!token ? (
            <div ref={googleBtnContainerRef} id="google-login-btn"></div>
          ) : (
            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.04] py-2 px-4 rounded-2xl backdrop-blur-xl">
              {userProfile?.avatar_url && (
                <img src={userProfile.avatar_url} className="w-7 h-7 rounded-full border border-[#ff3c00]/40" alt="Avatar" />
              )}
              <span className="text-xs font-black text-white max-w-[120px] truncate">{userProfile?.username}</span>
              <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-400 font-extrabold transition-all ml-1.5 cursor-pointer">Sair</button>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto px-6 py-8 flex-1 flex flex-col md:flex-row items-center justify-center gap-12 z-10">
        
        {/* Left Column: Timer & Target */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
          
          {/* Active Target Input */}
          <div className="w-full max-w-md bg-white/[0.01] border border-white/[0.03] p-6 rounded-3xl relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#ff3c00] block mb-1">Foco Ativo</span>
            <input 
              type="text" 
              value={currentTask} 
              onChange={(e) => setCurrentTask(e.target.value)} 
              placeholder="Qual o seu único objetivo deste ciclo?"
              className="w-full bg-transparent text-xl font-black text-white placeholder-white/[0.08] border-b border-white/[0.05] pb-2 focus:border-[#ff3c00] focus:outline-none transition-all"
            />
            <div className="flex justify-between items-center text-xs text-[#8e8d96] mt-3">
              <span>Prazo final: {projectDeadline}</span>
              <button onClick={() => setSettingsActive(true)} className="hover:text-white font-bold transition-all cursor-pointer">Alterar</button>
            </div>
          </div>

          {/* Giant Circular Timer (High Dopamine) */}
          <div className="relative flex items-center justify-center w-[280px] h-[280px] md:w-[320px] md:h-[320px]">
            <svg className="w-full h-full transform -rotate-90">
              {/* Back Circle */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="stroke-white/[0.02]"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Glowing Active Ring */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="stroke-[url(#neon-gradient)] transition-all duration-300"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0px 0px 12px rgba(255, 60, 0, 0.4))" }}
              />
              <defs>
                <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff3c00" />
                  <stop offset="100%" stopColor="#ffaa00" />
                </linearGradient>
              </defs>
            </svg>

            {/* Time Text inside Circle */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-6xl md:text-7xl font-black tracking-tighter tabular-nums text-white bg-gradient-to-b from-white to-white/70 bg-clip-text">
                {formatTimer(timerSeconds)}
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#8e8d96] mt-1.5">
                {activeTimerMode === 1500 ? "Trabalho" : "Pausa"}
              </span>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <div className="flex gap-2.5 justify-center">
              <button 
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${activeTimerMode === 1500 ? "bg-white text-black border-white shadow-lg" : "bg-white/[0.02] text-[#8e8d96] border-white/[0.03] hover:border-white/[0.1] hover:text-white"}`}
                onClick={() => selectTimerMode(1500)}
              >
                Foco (25 min)
              </button>
              <button 
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${activeTimerMode === 300 ? "bg-white text-black border-white shadow-lg" : "bg-white/[0.02] text-[#8e8d96] border-white/[0.03] hover:border-white/[0.1] hover:text-white"}`}
                onClick={() => selectTimerMode(300)}
              >
                Pausa (5 min)
              </button>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleStartTimer} 
                className="flex-grow py-4 rounded-2xl bg-gradient-to-r from-[#ff3c00] to-[#ffaa00] text-[#050406] font-black text-sm tracking-widest hover:shadow-[0_0_35px_rgba(255,60,0,0.45)] active:scale-[0.97] transition-all cursor-pointer text-center"
              >
                {timerRunning ? "PAUSAR FOCO" : "INICIAR FOCO"}
              </button>
              <button 
                onClick={() => selectTimerMode(activeTimerMode)} 
                className="px-5 py-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] active:scale-[0.97] hover:border-white/[0.15] transition-all cursor-pointer text-center text-sm"
              >
                🔄
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Crystal Tree & Stats & Notes */}
        <div className="w-full max-w-sm flex flex-col gap-6">
          
          {/* Crystal Tree Card (Passiva & Visual) */}
          <div className="p-6 bg-white/[0.01] border border-white/[0.03] rounded-3xl relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between backdrop-blur-xl">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#ff3c00]">Jardim Estético</span>
              <div className="text-2xl font-black text-white leading-none">
                {totalFocusMinutes} <span className="text-xs font-medium text-[#8e8d96]">min focados</span>
              </div>
              <span className="text-[10px] text-[#8e8d96]">Saúde da Árvore: {treeHealth}%</span>
              
              {/* Micro Progress Bar */}
              <div className="w-32 h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#ff3c00] to-[#ffaa00] transition-all duration-500" style={{ width: `${treeHealth}%` }}></div>
              </div>
            </div>

            {/* Glowing Minimal SVG Tree */}
            <div className="w-20 h-20 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-500 ${treeHealth <= 0 ? "opacity-30 filter grayscale" : "opacity-100"}`}>
                <path d="M20,85 Q50,80 80,85" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" fill="none" />
                <path d="M50,85 L50,55" stroke="url(#tree-grad)" strokeWidth="4.5" strokeLinecap="round" style={{ filter: "drop-shadow(0px 0px 5px rgba(255,60,0,0.3))" }} />
                {treeHealth > 0 && (
                  <>
                    <circle cx="50" cy="50" r="12" fill="#ff7b00" opacity="0.35" className="animate-pulse" style={{ filter: "blur(4px)" }} />
                    {/* Glowing branches */}
                    <path d="M50,58 Q42,48 38,42" stroke="#ffaa00" strokeWidth="3" strokeLinecap="round" />
                    <path d="M50,66 Q58,58 62,50" stroke="#ff3c00" strokeWidth="3" strokeLinecap="round" />
                  </>
                )}
                <defs>
                  <linearGradient id="tree-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffaa00" />
                    <stop offset="100%" stopColor="#ff3c00" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Minimalist Notepad */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#ff3c00]">Bloco de Notas Temporário</span>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descarregue pensamentos aleatórios aqui para não perder a atenção no timer..."
              className="w-full h-[180px] bg-white/[0.01] border border-white/[0.03] hover:border-white/[0.06] focus:border-[#ff3c00]/30 rounded-2xl p-4 text-sm text-[#ceced8] placeholder-white/[0.08] focus:outline-none transition-all resize-none shadow-2xl backdrop-blur-xl"
            />
          </div>

          {/* Subfooter Actions */}
          <div className="flex justify-between items-center text-xs text-[#525159] mt-2 border-t border-white/[0.03] pt-4">
            <button onClick={loadGlobalRanking} className="hover:text-white font-extrabold transition-all cursor-pointer">🏆 Ver Ranking Global</button>
            <span>Faltam {timeLeftStr.days} dias ({timeLeftStr.percent}% concluído)</span>
          </div>
        </div>
      </main>

      {/* MODAL CONFIGURAÇÕES */}
      {settingsActive && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Definir Prazo Final</h3>
              <button className="close-modal-btn" onClick={() => setSettingsActive(false)}>&times;</button>
            </div>
            <div className="modal-body flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#8e8d96]">Data Limite da Meta:</label>
                <input 
                  type="date" 
                  value={projectDeadline} 
                  onChange={(e) => setProjectDeadline(e.target.value)} 
                  className="w-full p-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-white focus:outline-none focus:border-[#ff3c00]"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="glow-btn w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff3c00] to-[#ffaa00] text-black font-black text-sm tracking-wider active:scale-[0.98] transition-all cursor-pointer" onClick={() => { setSettingsActive(false); updateDeadlineCountdown(); }}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RANKING GLOBAL MUNDIAL */}
      {rankingActive && (
        <div className="modal-overlay active">
          <div className="modal-content max-w-sm">
            <div className="modal-header">
              <h3>🏆 Ranking por Minutos Focados</h3>
              <button className="close-modal-btn" onClick={() => setRankingActive(false)}>&times;</button>
            </div>
            <div className="modal-body flex flex-col gap-2 mt-2">
              {rankingList.map((user, idx) => (
                <div key={user.username} className={`flex items-center gap-3 p-3 rounded-xl border ${idx === 0 ? 'bg-[#ff3c00]/10 border-[#ff3c00]/30' : idx === 1 ? 'bg-white/5 border-white/10' : 'bg-[#0a090d] border-white/5'}`}>
                  <span className="font-extrabold text-sm w-5 text-center text-[#ff3c00]">{idx + 1}</span>
                  {user.avatar_url ? (
                    <img src={user.avatar_url} className="w-8 h-8 rounded-full border border-white/10" alt="Avatar" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs text-[#8e8d96]">U</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate text-white flex items-center gap-1.5">
                      {user.username}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 font-normal text-[#8e8d96]">
                        {user.country || "BR"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-white">{user.level} min</div>
                  </div>
                </div>
              ))}
              {rankingList.length === 0 && (
                <div className="text-xs text-[#8e8d96] text-center py-6">Nenhum jogador no ranking ainda.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-6 text-center text-[10px] text-[#3e3d43] border-t border-white/[0.01]">
        Pragma Focus System &bull; Desenvolvido para Foco Absoluto
      </footer>
    </div>
  );
}
