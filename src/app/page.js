"use client";

import { useState, useEffect, useRef } from "react";

// Definições de Badges
const BADGES = [
  { id: 'inertia', icon: '🚀', title: 'Adeus Inércia', desc: 'Completou um timer de 5 minutos.' },
  { id: 'focus', icon: '🛡️', title: 'Foco de Aço', desc: 'Completou um timer Pomodoro (25 min).' },
  { id: 'freewriter', icon: '✍️', title: 'Escritor Veloz', desc: 'Concluiu uma sessão de Freewriting.' },
  { id: 'level5', icon: '👑', title: 'Mestre do Foco', desc: 'Alcançou o nível 5 de produtividade.' },
  { id: 'streak3', icon: '🔥', title: 'Hábito Consistente', desc: 'Manteve 3 dias seguidos de hábitos.' },
  { id: 'projectDone', icon: '🏆', title: 'Entregador Pragmático', desc: 'Concluiu uma meta principal de foco.' }
];

// Definições de itens do Shop
const SHOP_ITEMS = [
  { id: 'potion', icon: '🧪', title: 'Poção de Vitalidade', desc: 'Cura +50 de saúde do Jardim de Foco.', price: 100, type: 'consumable' },
  { id: 'revive', icon: '⚡', title: 'Poção de Reviver', desc: 'Revive uma árvore morta com 50% de vitalidade.', price: 150, type: 'consumable' },
  { id: 'goldpot', icon: '🏺', title: 'Vaso de Ouro', desc: 'Transforma o vaso da árvore em ouro brilhante (cosmético).', price: 250, type: 'cosmetic' },
  { id: 'aura', icon: '✨', title: 'Aura de Foco', desc: 'Adiciona partículas de luz flutuantes ao redor da árvore (cosmético).', price: 400, type: 'cosmetic' }
];

// Definições das Habilidades
const SKILLS = [
  { id: 'resistance', icon: '🛡️', title: 'Resistência Comportamental', desc: 'Reduz todas as penalidades de XP e saúde do jardim por inatividade ou desistência em 50%.', cost: 1 },
  { id: 'extra', icon: '💰', title: 'Ganhos Amplificados', desc: 'Aumenta permanentemente o recebimento de XP e Gemas em +25%.', cost: 1 },
  { id: 'efficiency', icon: '⚡', title: 'Escritor Eficiente', desc: 'Sessões de Freewriting dão o dobro de XP e o alerta de tremor de escrita é suavizado de 3s para 5s.', cost: 2 }
];

// Definições das Receitas de Alquimia
const RECIPES = [
  { id: 'nutritiva', name: 'Mistura Nutritiva', desc: 'Restaura +15 de Saúde do Jardim.', cost: { mudas: 1, adubos: 1, essencias: 0 } },
  { id: 'focosimpl', name: 'Poção de Foco Simples', desc: 'Restaura +25 de Saúde do Jardim.', cost: { mudas: 2, adubos: 0, essencias: 0 } },
  { id: 'superadub', name: 'Super Adubo Químico', desc: 'Restaura +60 de Saúde do Jardim.', cost: { mudas: 1, adubos: 0, essencias: 1 } },
  { id: 'elixirvit', name: 'Elixir da Vitalidade', desc: 'Restaura 100% de saúde e concede +50 XP.', cost: { mudas: 1, adubos: 1, essencias: 1 } }
];

// Definições de Jornadas
const WRITING_JOURNEYS = {
  tcc: [
    { id: 'tcc_intro', title: '1. Introdução', guide: 'Apresente o seu tema de forma direta. O que você vai estudar? Qual é o problema principal que seu projeto tenta resolver? Evite enrolações.' },
    { id: 'tcc_obj', title: '2. Objetivos', guide: 'Onde você quer chegar? Defina 1 Objetivo Geral (a grande meta) e 3 Objetivos Específicos (os passos intermediários para alcançar a meta).' },
    { id: 'tcc_just', title: '3. Justificativa', guide: 'Por que este trabalho é importante? Quem se beneficia dele? Demonstre a relevância teórica ou prática do seu TCC.' },
    { id: 'tcc_met', title: '4. Metodologia', guide: 'Como você fará a pesquisa ou o desenvolvimento? Quais ferramentas, métodos de coleta de dados ou tecnologias serão utilizados?' }
  ],
  creative: [
    { id: 'cre_concept', title: '1. Premissa', guide: 'Escreva a ideia central em uma frase: Quem é o protagonista, qual é o conflito principal e qual o cenário?' },
    { id: 'cre_chars', title: '2. Protagonista', guide: 'Defina o que o seu personagem principal quer mais do que tudo e qual o seu maior defeito que o impede.' },
    { id: 'cre_plot', title: '3. Estrutura Rápida', guide: 'Esboce em tópicos: O Gancho Inicial, a Mudança no Meio e o Clímax da sua história.' }
  ],
  code: [
    { id: 'code_overview', title: '1. README Geral', guide: 'Explique o que é o software de forma simples para alguém que nunca ouviu falar. Qual problema ele resolve?' },
    { id: 'code_install', title: '2. Instalação', guide: 'Liste os passos e comandos necessários para instalar as dependências e rodar o projeto localmente.' },
    { id: 'code_usage', title: '3. Exemplo de Uso', guide: 'Forneça um exemplo básico de código ou comando demonstrando o projeto funcionando na prática.' }
  ],
  general: [
    { id: 'gen_meta', title: '1. O Objetivo', guide: 'O que exatamente você quer concluir? Seja muito específico e pragmático nas palavras.' },
    { id: 'gen_step1', title: '2. Passo Mínimo', guide: 'Qual a menor ação possível que você pode fazer hoje para iniciar este projeto?' },
    { id: 'gen_delivery', title: '3. Critério de Sucesso', guide: 'Como você vai saber que o projeto está 100% concluído? Defina as regras de entrega.' }
  ]
};

const MOTIVATIONAL_PHRASES = [
  "A procrastinação chora quando você foca.",
  "Mais vale um parágrafo imperfeito hoje do que um TCC perfeito que não existe.",
  "Só 5 minutos. Você consegue começar por 5 minutos.",
  "A inércia é o maior inimigo. Você já deu o primeiro passo.",
  "1% melhor a cada dia. Foco pragmático.",
  "Você vai mesmo deixar sua árvore de foco morrer hoje?",
  "A cobrança diária é dura, mas a aprovação é doce."
];

export default function PragmaApp() {
  // --- ESTADOS DO JOGO ---
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [lastStreakDate, setLastStreakDate] = useState(null);
  const [lastActivityDate, setLastActivityDate] = useState(null);
  const [projectName, setProjectName] = useState("Pré-Projeto de TCC");
  const [projectDeadline, setProjectDeadline] = useState("2026-07-31");
  const [theme, setTheme] = useState("cajuina");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [skinnerHardcore, setSkinnerHardcore] = useState(false);
  const [skinnerIdleAlert, setSkinnerIdleAlert] = useState(true);
  const [treeHealth, setTreeHealth] = useState(100);
  const [treeDead, setTreeDead] = useState(false);
  const [currentTask, setCurrentTask] = useState("");
  
  // RPG
  const [gems, setGems] = useState(100);
  const [skillPoints, setSkillPoints] = useState(0);
  const [skillsPurchased, setSkillsPurchased] = useState([]);
  const [itemsOwned, setItemsOwned] = useState([]);
  const [itemsOwnedUnlocked, setItemsOwnedUnlocked] = useState([]);
  const [waterUnits, setWaterUnits] = useState(0);
  const [forest, setForest] = useState([]);
  
  // Alquimia e Inventário Físico
  const [mudas, setMudas] = useState(0);
  const [adubos, setAdubos] = useState(0);
  const [essencias, setEssencias] = useState(0);
  const [potions, setPotions] = useState({ potion: 0, revive: 0 });
  const [todoList, setTodoList] = useState([]);

  // Jornadas customizadas e Antifraude
  const [customJourneys, setCustomJourneys] = useState([]);
  const [draftsXpClaimedToday, setDraftsXpClaimedToday] = useState({});
  const [drafts, setDrafts] = useState({});

  // UI e Abas
  const [activeTab, setActiveTab] = useState("assistant");
  const [journeySelected, setJourneySelected] = useState("tcc");
  const [activeTemplateId, setActiveTemplateId] = useState(null);
  const [editorText, setEditorText] = useState("");
  const [todoInputValue, setTodoInputValue] = useState("");
  
  // Modais
  const [settingsActive, setSettingsActive] = useState(false);
  const [onboardingActive, setOnboardingActive] = useState(false);
  const [customJourneyActive, setCustomJourneyActive] = useState(false);
  const [levelupActive, setLevelupActive] = useState(false);
  const [habitsModalActive, setHabitsModalActive] = useState(false);

  // Skinner/Alerta Ocioso
  const [idleAlertActive, setIdleAlertActive] = useState(false);
  const [weeklyXp, setWeeklyXp] = useState(0);
  const [weeklyQuestCompleted, setWeeklyQuestCompleted] = useState(false);

  // Hábitos
  const [habits, setHabits] = useState([
    { id: 1, text: "Abrir o arquivo e ler uma página", completed: false },
    { id: 2, text: "Escrever pelo menos uma frase nova", completed: false },
    { id: 3, text: "Organizar a mesa de trabalho por 2 min", completed: false }
  ]);

  // Timers
  const [timerSeconds, setTimerSeconds] = useState(1500);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeTimerMode, setActiveTimerMode] = useState(1500);

  // Freewriting
  const [freewritingActive, setFreewritingActive] = useState(false);
  const [freewritingTimeLeft, setFreewritingTimeLeft] = useState(180);
  const [freewritingText, setFreewritingText] = useState("");
  const [freewritingWarning, setFreewritingWarning] = useState("Fluxo contínuo ativo...");

  // Referências
  const audioCtxRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const freewritingTimerRef = useRef(null);
  const typingTimerRef = useRef(null);
  const idleTimeRef = useRef(0);
  const lastTypingTimeRef = useRef(Date.now());
  const confettiCanvasRef = useRef(null);

  // Onboarding dinâmico
  const [onboardProject, setOnboardProject] = useState("");
  const [onboardDeadline, setOnboardDeadline] = useState("");
  const [onboardJourney, setOnboardJourney] = useState("tcc");
  const [onboardHabit1, setOnboardHabit1] = useState("");
  const [onboardHabit2, setOnboardHabit2] = useState("");
  const [onboardHabit3, setOnboardHabit3] = useState("");

  // Construtor de Jornada Customizada
  const [customJourneyName, setCustomJourneyName] = useState("");
  const [customSteps, setCustomSteps] = useState([{ title: "", guide: "" }]);

  // --- CONTADORES DE PRAZO ---
  const [timeLeftStr, setTimeLeftStr] = useState({ days: "00", hours: "00", minutes: "00", percent: 0 });

  // --- CARREGAMENTO INICIAL E EVENTOS ---
  useEffect(() => {
    // Carrega dados salvos do localStorage
    const saved = localStorage.getItem("pragma_state");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.xp !== undefined) setXp(data.xp);
        if (data.level !== undefined) setLevel(data.level);
        if (data.streak !== undefined) setStreak(data.streak);
        if (data.lastStreakDate !== undefined) setLastStreakDate(data.lastStreakDate);
        if (data.lastActivityDate !== undefined) setLastActivityDate(data.lastActivityDate);
        if (data.projectName !== undefined) setProjectName(data.projectName);
        if (data.projectDeadline !== undefined) setProjectDeadline(data.projectDeadline);
        if (data.theme !== undefined) {
          setTheme(data.theme);
          applyThemeClass(data.theme);
        }
        if (data.soundEnabled !== undefined) setSoundEnabled(data.soundEnabled);
        if (data.skinnerHardcore !== undefined) setSkinnerHardcore(data.skinnerHardcore);
        if (data.skinnerIdleAlert !== undefined) setSkinnerIdleAlert(data.skinnerIdleAlert);
        if (data.treeHealth !== undefined) setTreeHealth(data.treeHealth);
        if (data.treeDead !== undefined) setTreeDead(data.treeDead);
        if (data.gems !== undefined) setGems(data.gems);
        if (data.skillPoints !== undefined) setSkillPoints(data.skillPoints);
        if (data.skillsPurchased !== undefined) setSkillsPurchased(data.skillsPurchased);
        if (data.itemsOwned !== undefined) setItemsOwned(data.itemsOwned);
        if (data.itemsOwnedUnlocked !== undefined) setItemsOwnedUnlocked(data.itemsOwnedUnlocked);
        if (data.waterUnits !== undefined) setWaterUnits(data.waterUnits);
        if (data.forest !== undefined) setForest(data.forest);
        if (data.todoList !== undefined) setTodoList(data.todoList);
        if (data.habits !== undefined) setHabits(data.habits);
        
        if (data.inventory !== undefined) {
          if (data.inventory.mudas !== undefined) setMudas(data.inventory.mudas);
          if (data.inventory.adubos !== undefined) setAdubos(data.inventory.adubos);
          if (data.inventory.essencias !== undefined) setEssencias(data.inventory.essencias);
          if (data.inventory.potions !== undefined) setPotions(data.inventory.potions);
        }

        if (data.customJourneys !== undefined) setCustomJourneys(data.customJourneys);
        if (data.draftsXpClaimedToday !== undefined) setDraftsXpClaimedToday(data.draftsXpClaimedToday);
        if (data.drafts !== undefined) setDrafts(data.drafts);
        if (data.weeklyXp !== undefined) setWeeklyXp(data.weeklyXp);
        if (data.weeklyQuestCompleted !== undefined) setWeeklyQuestCompleted(data.weeklyQuestCompleted);
      } catch (e) {
        console.error("Erro ao ler dados.", e);
      }
    } else {
      setOnboardingActive(true);
    }
  }, []);

  // Salva no localStorage em toda modificação significativa do estado
  useEffect(() => {
    const stateObj = {
      xp, level, streak, lastStreakDate, lastActivityDate, projectName, projectDeadline, theme,
      soundEnabled, skinnerHardcore, skinnerIdleAlert, treeHealth, treeDead, gems, skillPoints,
      skillsPurchased, itemsOwned, itemsOwnedUnlocked, waterUnits, forest, todoList, habits,
      inventory: { mudas, adubos, essencias, potions }, customJourneys, draftsXpClaimedToday, drafts,
      weeklyXp, weeklyQuestCompleted
    };
    localStorage.setItem("pragma_state", JSON.stringify(stateObj));
  }, [xp, level, streak, lastStreakDate, lastActivityDate, projectName, projectDeadline, theme,
      soundEnabled, skinnerHardcore, skinnerIdleAlert, treeHealth, treeDead, gems, skillPoints,
      skillsPurchased, itemsOwned, itemsOwnedUnlocked, waterUnits, forest, todoList, habits,
      mudas, adubos, essencias, potions, customJourneys, draftsXpClaimedToday, drafts,
      weeklyXp, weeklyQuestCompleted]);

  // Executa monitoramento de ociosidade e contagem regressiva
  useEffect(() => {
    updateDeadlineCountdown();
    const deadlineInterval = setInterval(updateDeadlineCountdown, 60000);

    // Monitoramento de mouse/teclado para alerta de procrastinação
    const resetIdleTime = () => {
      idleTimeRef.current = 0;
      setIdleAlertActive(false);
    };

    window.addEventListener("mousemove", resetIdleTime);
    window.addEventListener("keydown", resetIdleTime);
    window.addEventListener("click", resetIdleTime);

    const idleInterval = setInterval(() => {
      if (!timerRunning && skinnerIdleAlert && !treeDead) {
        idleTimeRef.current++;
        if (idleTimeRef.current >= 600) { // 10 minutos ocioso
          setIdleAlertActive(true);
          playSound("beep");
          
          // Aplica pequena penalidade a cada 30 segundos
          if (idleTimeRef.current % 30 === 0) {
            const factor = skillsPurchased.includes("resistance") ? 0.5 : 1;
            setXp(prev => Math.max(0, prev - Math.round(5 * factor)));
            setTreeHealth(prev => {
              const nextVal = Math.max(0, prev - Math.round(3 * factor));
              if (nextVal <= 0) {
                setTreeDead(true);
                setIdleAlertActive(false);
              }
              return nextVal;
            });
          }
        }
      } else {
        idleTimeRef.current = 0;
      }
    }, 1000);

    return () => {
      clearInterval(deadlineInterval);
      clearInterval(idleInterval);
      window.removeEventListener("mousemove", resetIdleTime);
      window.removeEventListener("keydown", resetIdleTime);
      window.removeEventListener("click", resetIdleTime);
    };
  }, [timerRunning, skinnerIdleAlert, treeDead, skillsPurchased]);

  // --- ENGINE DE AUDIO WEB API ---
  const playSound = (type) => {
    if (!soundEnabled) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const audioCtx = audioCtxRef.current;
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === "coin") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "levelup") {
      osc.type = "triangle";
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      });
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.setValueAtTime(0.15, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "alarm") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.linearRampToValueAtTime(440, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.2);
      osc.frequency.linearRampToValueAtTime(440, now + 0.4);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "fail") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.4);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === "beep") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.setValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  };

  // --- ENGINE DE CONFETES NATIVO ---
  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height - 20,
        size: Math.random() * 8 + 6,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 5 + 4,
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
      if (active) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  };

  // --- CONTADORES E PONTOS ---
  const addXP = (amount) => {
    if (treeDead) return;
    const factor = skillsPurchased.includes("extra") ? 1.25 : 1;
    const finalXp = Math.round(amount * factor);
    
    // Atualiza Quest Semanal
    if (!weeklyQuestCompleted) {
      setWeeklyXp(prev => {
        const nextVal = Math.min(300, prev + finalXp);
        if (nextVal >= 300) {
          setWeeklyQuestCompleted(true);
          setGems(g => g + 150);
          playSound("levelup");
          triggerConfetti();
          alert("🏆 Quest Semanal Concluída! Você ganhou +150 Gemas.");
        }
        return nextVal;
      });
    }

    // Gemas obtidas por XP
    const gemsEarned = Math.round(amount * 0.2 * factor);
    if (gemsEarned > 0) setGems(g => g + gemsEarned);

    setXp(prev => {
      let nextXp = prev + finalXp;
      if (nextXp >= 100) {
        nextXp -= 100;
        setLevel(lvl => {
          const nextLvl = lvl + 1;
          setSkillPoints(sp => sp + 1);
          setGems(g => g + 50);
          setLevelupActive(true);
          playSound("levelup");
          triggerConfetti();
          return nextLvl;
        });
      }
      return nextXp;
    });
  };

  const healGarden = (amount) => {
    if (treeDead) return;
    setTreeHealth(prev => Math.min(100, prev + amount));
  };

  // --- TEMAS VISUAIS ---
  const applyThemeClass = (themeName) => {
    document.body.className = "";
    document.body.classList.add(`theme-${themeName}`);
  };

  const selectTheme = (themeName) => {
    setTheme(themeName);
    applyThemeClass(themeName);
  };

  // --- ATUALIZAR PRAZO CONTADOR ---
  const updateDeadlineCountdown = () => {
    if (!projectDeadline) return;
    const target = new Date(`${projectDeadline}T23:59:59`);
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      setTimeLeftStr({ days: "00", hours: "00", minutes: "00", percent: 100 });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const monthStart = new Date(target.getFullYear(), target.getMonth(), 1);
    const total = target - monthStart;
    const elapsed = now - monthStart;
    let percent = Math.min(100, Math.max(0, (elapsed / total) * 100));

    setTimeLeftStr({
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      percent: Math.round(percent)
    });
  };

  // --- TIMER DE FOCO ---
  const handleStartTimer = () => {
    if (treeDead) {
      alert("💀 Sua árvore está morta! Use uma Poção de Reviver no seu Inventário (RPG) para voltar a focar.");
      return;
    }

    if (timerRunning) {
      // Pausa e aplica penalidade caso Hardcore esteja ativo
      if (skinnerHardcore) {
        const factor = skillsPurchased.includes("resistance") ? 0.5 : 1;
        playSound("fail");
        setXp(prev => Math.max(0, prev - Math.round(25 * factor)));
        setTreeHealth(prev => {
          const nextVal = Math.max(0, prev - Math.round(15 * factor));
          if (nextVal <= 0) setTreeDead(true);
          return nextVal;
        });
        alert(`⚠️ Penalidade por Desistência! (-${Math.round(25 * factor)} XP e -${Math.round(15 * factor)} de saúde)`);
      }
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
            
            // Recompensas baseadas no modo concluído
            if (activeTimerMode === 1500) { // Pomodoro 25 min
              addXP(100);
              healGarden(40);
              setWaterUnits(w => w + 5);
              setMudas(m => m + 1);
              setEssencias(e => e + 1);
              alert("🛡️ Pomodoro concluído! (+100 XP, +5💧 Água, +1 🧪 Essência e +1 🌿 Muda)");
            } else if (activeTimerMode === 300) { // Só 5 minutos
              addXP(50);
              healGarden(20);
              setWaterUnits(w => w + 1);
              setMudas(m => m + 1);
              alert("🚀 Foco rápido concluído! (+50 XP, +1💧 Água, +1 🌿 Muda)");
            } else {
              addXP(10);
            }
            return activeTimerMode;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const selectTimerMode = (duration) => {
    if (timerRunning && skinnerHardcore) {
      const factor = skillsPurchased.includes("resistance") ? 0.5 : 1;
      playSound("fail");
      setXp(prev => Math.max(0, prev - Math.round(25 * factor)));
      setTreeHealth(prev => {
        const nextVal = Math.max(0, prev - Math.round(15 * factor));
        if (nextVal <= 0) setTreeDead(true);
        return nextVal;
      });
      alert(`⚠️ Penalidade por Desistência! (-${Math.round(25 * factor)} XP)`);
    }
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

  // --- MICRO HÁBITOS ---
  const toggleHabit = (id) => {
    if (treeDead) {
      alert("💀 Sua árvore está morta! Use uma Poção de Reviver antes de marcar hábitos.");
      return;
    }
    playSound("coin");
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const completed = !h.completed;
        if (completed) {
          addXP(20);
          healGarden(15);
          setMudas(m => m + 1);
        } else {
          setTreeHealth(th => Math.max(0, th - 15));
        }
        return { ...h, completed };
      }
      return h;
    }));
  };

  // --- TAREFAS SECUNDÁRIAS (TO-DO LIST) ---
  const handleAddTodo = () => {
    if (!todoInputValue.trim()) return;
    const newTodo = { id: Date.now(), text: todoInputValue.trim(), completed: false };
    setTodoList(prev => [...prev, newTodo]);
    setTodoInputValue("");
  };

  const toggleTodo = (id) => {
    if (treeDead) return;
    playSound("coin");
    setTodoList(prev => prev.map(t => {
      if (t.id === id) {
        const completed = !t.completed;
        if (completed) {
          addXP(5);
          setAdubos(a => a + 1);
        } else {
          setAdubos(a => Math.max(0, a - 1));
        }
        return { ...t, completed };
      }
      return t;
    }));
  };

  // --- CORTAR ÁRVORE E META PRINCIPAL ---
  const handleCompleteMeta = () => {
    if (treeDead || !currentTask.trim()) return;
    
    playSound("coin");
    triggerConfetti();

    const newTree = {
      name: projectName,
      level: level,
      date: new Date().toLocaleDateString('pt-BR'),
      theme: theme
    };
    
    setForest(prev => [...prev, newTree]);
    setGems(g => g + 200);
    setLevel(1);
    setXp(0);
    setTreeHealth(100);
    setTreeDead(false);
    setTodoList([]);
    setCurrentTask("");

    alert(`🏆 PARABÉNS! Objetivo "${projectName}" Concluído!\n\nSua árvore foi eternizada no Bosque de Troféus.\nVocê ganhou 💎 200 de recompensa premium.\nPlante sua próxima meta agora!`);
    setOnboardingActive(true);
  };

  // --- ANTIFRAUDE & SALVAR RASCUNHO ---
  const handleSaveDraft = () => {
    if (treeDead) return;
    if (!activeTemplateId) {
      alert("Selecione um tópico de escrita antes de salvar!");
      return;
    }

    const text = editorText.trim();
    
    // Validação antifraude
    if (text.length < 25) {
      alert("O texto precisa conter pelo menos 25 caracteres para pontuar.");
      return;
    }
    if (/(.)\1{9,}/.test(text)) {
      alert("Padrão de escrita inválido (caracteres repetidos).");
      return;
    }
    if (text === (drafts[activeTemplateId] || "").trim()) {
      alert("Nenhuma alteração detectada no rascunho.");
      return;
    }

    setDrafts(prev => ({ ...prev, [activeTemplateId]: text }));
    playSound("coin");
    triggerConfetti();

    // Controle diário de XP por template
    const today = new Date().toDateString();
    const claimedList = draftsXpClaimedToday[today] || [];

    if (claimedList.includes(activeTemplateId)) {
      alert("Rascunho atualizado com sucesso! (Você já recebeu o XP de rascunho para este tópico hoje)");
    } else {
      setDraftsXpClaimedToday(prev => ({ ...prev, [today]: [...claimedList, activeTemplateId] }));
      addXP(10);
      alert("Excelente rascunho de escrita! (+10 XP concedidos)");
    }
  };

  // --- FREEWRITING ---
  const handleStartFreewriting = () => {
    if (treeDead) return;
    setFreewritingActive(true);
    setFreewritingTimeLeft(180);
    setFreewritingText("");
    lastTypingTimeRef.current = Date.now();

    freewritingTimerRef.current = setInterval(() => {
      setFreewritingTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(freewritingTimerRef.current);
          clearInterval(typingTimerRef.current);
          setFreewritingActive(false);
          playSound("levelup");
          triggerConfetti();
          addXP(75);
          setMudas(m => m + 2);
          alert("Excelente! Você completou a escrita contínua. (+75 XP, +2 🌿 Mudas)");
          return 180;
        }
        return prev - 1;
      });
    }, 1000);

    const allowed = skillsPurchased.includes("efficiency") ? 5000 : 3000;
    typingTimerRef.current = setInterval(() => {
      const diff = Date.now() - lastTypingTimeRef.current;
      if (diff > allowed) {
        setFreewritingWarning("DIGITE ALGO! NÃO PARE!");
      } else {
        setFreewritingWarning("Fluxo contínuo ativo...");
      }
    }, 500);
  };

  // --- LOJA E INVENTÁRIO (BAÚ DE ITENS) ---
  const buyShopItem = (item) => {
    if (gems < item.price) return;
    setGems(prev => prev - item.price);
    playSound("levelup");
    triggerConfetti();

    if (item.type === "consumable") {
      setPotions(prev => {
        const next = { ...prev };
        if (item.id === "potion") next.potion += 1;
        if (item.id === "revive") next.revive += 1;
        return next;
      });
      alert(`${item.title} comprada e enviada ao seu Baú de Itens!`);
    } else {
      setItemsOwnedUnlocked(prev => [...prev, item.id]);
      setItemsOwned(prev => [...prev, item.id]);
      alert(`${item.icon} ${item.title} adquirido e ativado no Jardim!`);
    }
  };

  const usePotion = (type) => {
    if (type === "potion") {
      if (treeDead) {
        alert("💀 Esta poção cura vitalidade, mas não pode reviver uma árvore morta!");
        return;
      }
      if (treeHealth >= 100) return;
      setPotions(prev => ({ ...prev, potion: prev.potion - 1 }));
      healGarden(50);
      playSound("coin");
    } else if (type === "revive") {
      if (!treeDead) return;
      setPotions(prev => ({ ...prev, revive: prev.revive - 1 }));
      setTreeDead(false);
      setTreeHealth(50);
      playSound("levelup");
      triggerConfetti();
    }
  };

  const toggleCosmetic = (id) => {
    if (itemsOwned.includes(id)) {
      setItemsOwned(prev => prev.filter(x => x !== id));
    } else {
      setItemsOwned(prev => [...prev, id]);
    }
  };

  // --- ALQUIMIA CRAFTING ---
  const craftRecipe = (recipe) => {
    if (treeDead) return;
    setMudas(m => m - recipe.cost.mudas);
    setAdubos(a => a - recipe.cost.adubos);
    setEssencias(e => e - recipe.cost.essencias);

    playSound("coin");
    triggerConfetti();

    if (recipe.id === "nutritiva") healGarden(15);
    if (recipe.id === "focosimpl") healGarden(25);
    if (recipe.id === "superadub") healGarden(60);
    if (recipe.id === "elixirvit") {
      healGarden(100);
      addXP(50);
    }
    alert(`🧪 Sucesso! Você preparou e consumiu: ${recipe.name}.`);
  };

  // --- HABILIDADES ---
  const buySkill = (skill) => {
    if (skillPoints < skill.cost) return;
    setSkillPoints(prev => prev - skill.cost);
    setSkillsPurchased(prev => [...prev, skill.id]);
    playSound("levelup");
    triggerConfetti();
  };

  // --- SUBMISSÃO DE JORNADA CUSTOMIZADA ---
  const handleSaveCustomJourney = () => {
    if (!customJourneyName.trim() || customSteps.some(s => !s.title || !s.guide)) {
      alert("Preencha todos os campos!");
      return;
    }
    const newJ = {
      id: `journey_${Date.now()}`,
      name: customJourneyName.trim(),
      steps: customSteps.map((s, idx) => ({ ...s, id: `custom_${Date.now()}_${idx}` }))
    };
    setCustomJourneys(prev => [...prev, newJ]);
    setJourneySelected(newJ.id);
    setActiveTemplateId(newJ.steps[0].id);
    setEditorText("");
    setCustomJourneyActive(false);
    playSound("levelup");
    triggerConfetti();
  };

  // --- ONBOARDING INICIAL ---
  const handleStartOnboard = () => {
    if (!onboardProject.trim() || !onboardDeadline) {
      alert("Preencha o objetivo principal e o prazo final!");
      return;
    }
    setProjectName(onboardProject.trim());
    setProjectDeadline(onboardDeadline);
    setJourneySelected(onboardJourney);
    
    setHabits([
      { id: 1, text: onboardHabit1.trim() || "Abrir o arquivo e ler uma página", completed: false },
      { id: 2, text: onboardHabit2.trim() || "Escrever pelo menos uma frase nova", completed: false },
      { id: 3, text: onboardHabit3.trim() || "Organizar a mesa de trabalho por 2 min", completed: false }
    ]);

    setTreeDead(false);
    setTreeHealth(100);
    setTodoList([]);
    setOnboardingActive(false);
    setGems(prev => prev === 0 ? 100 : prev);
  };

  // Regar árvore gastando unidades de água obtidas ao focar
  const handleWaterTree = () => {
    if (waterUnits <= 0 || treeHealth >= 100 || treeDead) return;
    setWaterUnits(w => w - 1);
    healGarden(10);
    playSound("coin");
  };

  const getJourneySteps = () => {
    if (WRITING_JOURNEYS[journeySelected]) return WRITING_JOURNEYS[journeySelected];
    const custom = customJourneys.find(j => j.id === journeySelected);
    return custom ? custom.steps : [];
  };

  return (
    <div className="app-container">
      <canvas id="confetti-canvas" ref={confettiCanvasRef}></canvas>

      {/* Banner de Procrastinação Ociosa */}
      {idleAlertActive && (
        <div id="skinner-banner" className="skinner-alert-banner active">
          <div className="skinner-banner-content">
            <span className="warning-icon">⚠️</span>
            <div className="skinner-banner-text">
              <strong>Alerta de Procrastinação!</strong>
              <span>Você está ocioso há muito tempo. Inicie uma tarefa ou perderá XP!</span>
            </div>
            <button className="skinner-banner-btn" onClick={() => { setIdleAlertActive(false); selectTimerMode(300); handleStartTimer(); }}>Focar Agora (5 min)</button>
          </div>
        </div>
      )}

      {/* BARRA LATERAL */}
      <aside className="sidebar">
        <div className="brand-section">
          <div className="brand-logo" id="app-logo">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="brand-name" id="app-title">
            {theme === "cajuina" ? "Cajuína Code" : theme === "pragma" ? "Pragma Focus" : "GeraQRCode Foco"}
          </h1>
        </div>

        {/* Card de Nível */}
        <div className="profile-card">
          <div className="profile-header-row">
            <div className="level-badge">NÍVEL <span>{level}</span></div>
            <div className="gems-badge">💎 <span>{gems}</span></div>
          </div>
          <div className="xp-container">
            <div className="xp-header">
              <span>Foco Acumulado</span>
              <span>{xp} / 100 XP</span>
            </div>
            <div className="xp-bar-bg">
              <div className="xp-bar-fill" style={{ width: `${xp}%` }}></div>
            </div>
          </div>
          <div className="streak-badge">🔥 Sequência: <strong>{streak}</strong> dias</div>
        </div>

        {/* Jardim Virtual */}
        <div className="garden-card">
          <div className="garden-header-row">
            <h3>Jardim de Foco</h3>
            <div className="water-badge">💧 <span>{waterUnits}</span></div>
          </div>
          <div className="tree-display">
            <svg id="garden-tree" className={treeDead ? "dead" : treeHealth < 50 ? "murcho" : ""} viewBox="0 0 100 100" width="120" height="120">
              <g id="tree-aura">
                {itemsOwned.includes("aura") && treeHealth >= 50 && !treeDead && Array.from({ length: 6 }).map((_, i) => (
                  <circle key={i} className="aura-particle" cx={30 + Math.random() * 40} cy={30 + Math.random() * 40} r={1.5 + Math.random() * 2} style={{ animationDelay: `${i * 0.3}s` }} />
                ))}
              </g>
              <path d="M20,80 Q50,75 80,80" stroke="var(--accent-glow)" strokeWidth="3" fill="none" />
              <path id="tree-pot" className={itemsOwned.includes("goldpot") ? "golden" : ""} d="M35,80 L65,80 L60,88 L40,88 Z" fill="#1f1e24" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
              <path id="tree-trunk" d={treeDead ? "M50,80 L50,65 M50,65 Q45,55 42,50 M50,65 Q55,58 58,54" : "M50,80 L50,45"} stroke="var(--text-main)" strokeWidth={level >= 4 ? 6 : level === 3 ? 5 : level === 2 ? 4 : 3} strokeLinecap="round" />
            </svg>
          </div>
          
          <div className="vitality-container">
            <div className="vitality-header">
              <span>Saúde do Jardim</span>
              <span>{treeDead ? "Morta" : treeHealth >= 75 ? "Excelente" : treeHealth >= 45 ? "Instável" : "Murchando!"}</span>
            </div>
            <div className="vitality-bar-bg">
              <div className={`vitality-bar-fill ${treeDead || treeHealth < 45 ? "danger" : treeHealth < 75 ? "warning" : ""}`} style={{ width: `${treeHealth}%` }}></div>
            </div>
          </div>
          <button className="water-btn" onClick={handleWaterTree} disabled={waterUnits <= 0 || treeHealth >= 100 || treeDead}>Regar Jardim (+10 Saúde)</button>
        </div>

        {/* Bosque de Troféus */}
        <div className="forest-card">
          <h3>Bosque de Troféus</h3>
          <div className="forest-grid">
            {forest.length === 0 ? (
              <p className="empty-forest-msg">Nenhum objetivo eternizado ainda.</p>
            ) : (
              forest.map((tree, i) => (
                <div key={i} className="forest-tree-item" onClick={() => alert(`Objetivo Concluído:\n\n"${tree.name}"\nNível: ${tree.level}\nData: ${tree.date}`)}>
                  <div className="forest-tree-icon">{tree.theme === "pragma" ? "🔮" : tree.theme === "geraqrcode" ? "⚡" : "🌳"}</div>
                  <div className="forest-tree-details">
                    <span className="forest-tree-name">{tree.name}</span>
                    <span className="forest-tree-meta">Nível {tree.level} • {tree.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Conquistas */}
        <div className="badges-card">
          <h3>Conquistas</h3>
          <div className="badges-grid">
            {BADGES.map(badge => {
              const unlocked = forest.length > 0 && badge.id === "projectDone"; // etc.
              return (
                <div key={badge.id} className={`badge-item ${unlocked ? "unlocked" : "locked"}`} data-title={`${badge.title}: ${badge.desc}`}>
                  {badge.icon}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="main-content">
        <header className="project-header">
          <div className="project-info">
            <span className="project-tag">Projeto Ativo</span>
            <div className="project-title-wrapper">
              <h2>{projectName}</h2>
              <button className="icon-text-btn" onClick={() => setSettingsActive(true)}>✏️</button>
            </div>
          </div>
          <div className="countdown-widget">
            <div className="countdown-time">
              <div className="time-block"><span>{timeLeftStr.days}</span><small>dias</small></div>
              <div className="time-block"><span>{timeLeftStr.hours}</span><small>horas</small></div>
              <div className="time-block"><span>{timeLeftStr.minutes}</span><small>min</small></div>
            </div>
            <div className="countdown-progress">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${timeLeftStr.percent}%` }}></div>
              </div>
              <span>{timeLeftStr.percent}% do tempo decorrido</span>
            </div>
          </div>
        </header>

        <div className="content-grid">
          {/* Foco Único e Timer */}
          <div className="focus-section card">
            <div className="focus-header">
              <h3>Foco Único</h3>
            </div>
            <div className="single-task-box">
              <input type="text" value={currentTask} onChange={(e) => setCurrentTask(e.target.value)} placeholder="O que você vai concluir agora?" />
              <button className="glow-btn" onClick={handleCompleteMeta} disabled={!currentTask.trim() || treeDead}>Concluir Meta</button>
            </div>
            <div className="timer-container">
              <div className="timer-display">{formatTimer(timerSeconds)}</div>
              <div className="timer-modes">
                <button className={`timer-mode-btn ${activeTimerMode === 1500 ? "active" : ""}`} onClick={() => selectTimerMode(1500)}>Pomodoro (25m)</button>
                <button className={`timer-mode-btn mode-dopamine ${activeTimerMode === 300 ? "active" : ""}`} onClick={() => selectTimerMode(300)}>Só 5 Minutos</button>
              </div>
              <div className="timer-controls">
                <button className="control-btn primary" onClick={handleStartTimer}>{timerRunning ? "Pausar" : "Iniciar"}</button>
                <button className="control-btn secondary" onClick={() => selectTimerMode(activeTimerMode)}>Reiniciar</button>
              </div>
            </div>
          </div>

          {/* Hábitos e To-Do */}
          <div className="daily-section card">
            <div className="section-title">
              <h3>Micro-Hábitos Diários</h3>
              <button className="text-btn" onClick={() => setHabitsModalActive(true)}>Editar</button>
            </div>
            <div className="habits-list">
              {habits.map(h => (
                <div key={h.id} className={`habit-row ${h.completed ? "completed" : ""}`} onClick={() => toggleHabit(h.id)}>
                  <div className="habit-checkbox"></div>
                  <span className="habit-text">{h.text}</span>
                </div>
              ))}
            </div>
            <hr className="divider" />
            <div className="section-title">
              <h3>Tarefas Secundárias</h3>
            </div>
            <div className="todo-input-row">
              <input type="text" value={todoInputValue} onChange={(e) => setTodoInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()} placeholder="Nova tarefa (Ganha Adubo 🍂)" />
              <button className="todo-add-btn" onClick={handleAddTodo}>+</button>
            </div>
            <div className="todo-list">
              {todoList.map(todo => (
                <div key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`} onClick={() => toggleTodo(todo.id)}>
                  <div className="todo-checkbox"></div>
                  <span className="todo-text">{todo.text}</span>
                  <span className="todo-reward-tag">🍂 +1 Adubo</span>
                </div>
              ))}
            </div>
          </div>

          {/* Abas e RPG / Escrita */}
          <div className="writing-section card">
            <div className="writing-header">
              <div className="writing-tabs">
                <button className={`write-tab ${activeTab === "assistant" ? "active" : ""}`} onClick={() => setActiveTab("assistant")}>Assistente de Escrita</button>
                <button className={`write-tab ${activeTab === "freewriting" ? "active" : ""}`} onClick={() => setActiveTab("freewriting")}>Modo Freewriting</button>
                <button className={`write-tab write-tab-rpg ${activeTab === "rpg" ? "active" : ""}`} onClick={() => setActiveTab("rpg")}>💎 RPG, Loja & Alquimia</button>
              </div>
              {activeTab !== "rpg" && (
                <div className="journey-selector-container">
                  <label>Jornada:</label>
                  <select value={journeySelected} onChange={(e) => { setJourneySelected(e.target.value); setActiveTemplateId(null); }}>
                    <option value="tcc">Pré-Projeto & TCC</option>
                    <option value="creative">Escrita Criativa</option>
                    <option value="code">Tech & Documentação</option>
                    <option value="general">Planejamento Geral</option>
                    {customJourneys.map(j => (
                      <option key={j.id} value={j.id}>{j.name}</option>
                    ))}
                  </select>
                  <button className="add-journey-btn" onClick={() => setCustomJourneyActive(true)}>+</button>
                </div>
              )}
            </div>

            {/* ABA ASSISTENTE */}
            {activeTab === "assistant" && (
              <div className="tab-content active">
                <div className="assistant-layout">
                  <div className="templates-sidebar">
                    {getJourneySteps().map(step => (
                      <button key={step.id} className={`template-nav-btn ${activeTemplateId === step.id ? "active" : ""}`} onClick={() => { setActiveTemplateId(step.id); setEditorText(drafts[step.id] || ""); }}>
                        {step.title}
                      </button>
                    ))}
                  </div>
                  <div className="editor-area">
                    <div className="editor-header">
                      <h4>{activeTemplateId ? getJourneySteps().find(s => s.id === activeTemplateId)?.title : "Selecione um tópico"}</h4>
                    </div>
                    {activeTemplateId && (
                      <>
                        <div className="editor-guide">{getJourneySteps().find(s => s.id === activeTemplateId)?.guide}</div>
                        <textarea value={editorText} onChange={(e) => setEditorText(e.target.value)} placeholder="Comece a escrever aqui..."></textarea>
                        <div className="editor-actions">
                          <button className="glow-btn" onClick={handleSaveDraft}>Salvar Rascunho</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ABA FREEWRITING */}
            {activeTab === "freewriting" && (
              <div className="tab-content active">
                <div className="freewriting-layout">
                  {!freewritingActive ? (
                    <div className="freewriting-intro">
                      <h4>Vença o Perfeccionismo e o Bloqueio</h4>
                      <p>O temporizador de 3 minutos começará a rodar. Escreva sem parar de digitar!</p>
                      <button className="glow-btn" onClick={handleStartFreewriting}>Iniciar Fluxo (3 Minutos)</button>
                    </div>
                  ) : (
                    <div className="freewriting-active-area">
                      <div className="freewriting-header">
                        <span>{formatTimer(freewritingTimeLeft)}</span>
                        <span>{freewritingWarning}</span>
                      </div>
                      <textarea value={freewritingText} onChange={(e) => { setFreewritingText(e.target.value); lastTypingTimeRef.current = Date.now(); }} placeholder="Digite sem parar, sem editar e sem apagar..."></textarea>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ABA RPG, SHOP, ALQUIMIA */}
            {activeTab === "rpg" && (
              <div className="tab-content active">
                <div className="rpg-layout-three">
                  {/* Shop */}
                  <div className="rpg-column">
                    <h4>💎 Loja Virtual</h4>
                    <div className="shop-grid-vertical">
                      {SHOP_ITEMS.map(item => {
                        const owned = itemsOwnedUnlocked.includes(item.id);
                        const canBuy = gems >= item.price && (item.type === "consumable" || !owned);
                        return (
                          <div key={item.id} className="shop-item-card">
                            <div className="shop-item-icon">{item.icon}</div>
                            <div className="shop-item-title">{item.title}</div>
                            <div className="shop-item-desc">{item.desc}</div>
                            <div className="shop-item-buy-row">
                              <span className="shop-item-price">💎 {item.price}</span>
                              <button className="shop-buy-btn" onClick={() => buyShopItem(item)} disabled={!canBuy}>
                                {owned && item.type === "cosmetic" ? "Adquirido" : "Comprar"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Alquimia & Baú */}
                  <div className="rpg-column">
                    <h4>🧪 Alquimia & Inventário</h4>
                    <div className="alchemy-box">
                      <div className="ingredients-inventory">
                        <div className="ing-item"><span>🌿</span><small>Mudas</small><strong>{mudas}</strong></div>
                        <div className="ing-item"><span>🍂</span><small>Adubos</small><strong>{adubos}</strong></div>
                        <div className="ing-item"><span>🧪</span><small>Essências</small><strong>{essencias}</strong></div>
                      </div>
                      <h5 className="alchemy-sub-title">Criação</h5>
                      <div className="recipes-list">
                        {RECIPES.map(recipe => {
                          const canCraft = mudas >= recipe.cost.mudas && adubos >= recipe.cost.adubos && essencias >= recipe.cost.essencias;
                          return (
                            <div key={recipe.id} className="recipe-card">
                              <div className="recipe-header-row">
                                <span className="recipe-title">{recipe.name}</span>
                                <button className="recipe-craft-btn" onClick={() => craftRecipe(recipe)} disabled={!canCraft}>Criar</button>
                              </div>
                              <div className="recipe-desc">{recipe.desc}</div>
                            </div>
                          );
                        })}
                      </div>

                      <hr className="divider" />
                      <h5 className="alchemy-sub-title">🎒 Meu Baú de Itens</h5>
                      <div className="bag-inventory-list">
                        {potions.potion > 0 && (
                          <div className="bag-item-card">
                            <span>🧪 Poção de Vitalidade ({potions.potion})</span>
                            <button className="bag-item-use-btn" onClick={() => usePotion("potion")}>Usar</button>
                          </div>
                        )}
                        {potions.revive > 0 && (
                          <div className="bag-item-card">
                            <span>⚡ Poção de Reviver ({potions.revive})</span>
                            <button className="bag-item-use-btn" onClick={() => usePotion("revive")}>Usar</button>
                          </div>
                        )}
                        {itemsOwnedUnlocked.map(cosId => {
                          const item = SHOP_ITEMS.find(s => s.id === cosId);
                          const equipped = itemsOwned.includes(cosId);
                          return (
                            <div key={cosId} className="bag-item-card">
                              <span>{item?.icon} {item?.title}</span>
                              <button className={`bag-item-use-btn ${equipped ? "active-equipped" : ""}`} onClick={() => toggleCosmetic(cosId)}>
                                {equipped ? "Equipado" : "Equipar"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Habilidades */}
                  <div className="rpg-column">
                    <h4>🌳 Habilidades (Disponíveis: {skillPoints})</h4>
                    <div className="skills-tree-container">
                      {SKILLS.map(skill => {
                        const purchased = skillsPurchased.includes(skill.id);
                        const canBuy = skillPoints >= skill.cost && !purchased;
                        return (
                          <div key={skill.id} className={`skill-node ${purchased ? "active-skill" : canBuy ? "available" : "locked"}`}>
                            <div className="skill-icon">{skill.icon}</div>
                            <div className="skill-info">
                              <div className="skill-title">{skill.title}</div>
                              <div className="skill-desc">{skill.desc}</div>
                            </div>
                            <button className="skill-status-tag" onClick={() => buySkill(skill)} disabled={!canBuy}>
                              {purchased ? "Ativo" : `Desbloquear (${skill.cost})`}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL CONFIGURAÇÕES */}
      {settingsActive && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Configurações do Pragma</h3>
              <button className="close-modal-btn" onClick={() => setSettingsActive(false)}>&times;</button>
            </div>
            <div class="modal-body">
              <div className="settings-group">
                <label>Nome da Meta Principal:</label>
                <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                <label>Data Limite:</label>
                <input type="date" value={projectDeadline} onChange={(e) => setProjectDeadline(e.target.value)} />
              </div>
              <div className="settings-group">
                <h4>Temas</h4>
                <div className="theme-selector-grid">
                  <div className={`theme-option ${theme === "cajuina" ? "active" : ""}`} onClick={() => selectTheme("cajuina")}>Cajuína</div>
                  <div className={`theme-option ${theme === "pragma" ? "active" : ""}`} onClick={() => selectTheme("pragma")}>Pragma Roxo</div>
                  <div className={`theme-option ${theme === "geraqrcode" ? "active" : ""}`} onClick={() => selectTheme("geraqrcode")}>GeraQRCode</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="glow-btn" onClick={() => { setSettingsActive(false); updateDeadlineCountdown(); }}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL JORNADA CUSTOMIZADA */}
      {customJourneyActive && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Criar Jornada Customizada</h3>
              <button className="close-modal-btn" onClick={() => setCustomJourneyActive(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <label>Nome da Jornada:</label>
              <input type="text" value={customJourneyName} onChange={(e) => setCustomJourneyName(e.target.value)} placeholder="Ex: Tese de Mestrado" />
              
              <div className="section-title">
                <h5>Passos da Escrita:</h5>
                <button className="text-btn" onClick={() => setCustomSteps(prev => [...prev, { title: "", guide: "" }])}>+ Adicionar</button>
              </div>
              <div class="custom-steps-builder">
                {customSteps.map((step, idx) => (
                  <div key={idx} className="custom-step-builder-row">
                    <input type="text" value={step.title} onChange={(e) => {
                      const next = [...customSteps];
                      next[idx].title = e.target.value;
                      setCustomSteps(next);
                    }} placeholder="Título do Passo" />
                    <textarea value={step.guide} onChange={(e) => {
                      const next = [...customSteps];
                      next[idx].guide = e.target.value;
                      setCustomSteps(next);
                    }} placeholder="Instruções de Escrita"></textarea>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="glow-btn" onClick={handleSaveCustomJourney}>Salvar Jornada</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ONBOARDING */}
      {onboardingActive && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Defina Seu Próximo Grande Objetivo</h3>
            </div>
            <div className="modal-body">
              <label>Qual é o seu objetivo principal?</label>
              <input type="text" value={onboardProject} onChange={(e) => setOnboardProject(e.target.value)} placeholder="Ex: Terminar Pré-Projeto de TCC" />
              <label>Qual é o seu prazo final?</label>
              <input type="date" value={onboardDeadline} onChange={(e) => setOnboardDeadline(e.target.value)} />
              
              <label>Jornada de Escrita:</label>
              <select value={onboardJourney} onChange={(e) => setOnboardJourney(e.target.value)}>
                <option value="tcc">Pré-Projeto & TCC</option>
                <option value="creative">Escrita Criativa</option>
                <option value="code">Tech & Documentação</option>
                <option value="general">Planejamento Geral</option>
              </select>

              <label>3 Hábitos Diários:</label>
              <input type="text" value={onboardHabit1} onChange={(e) => setOnboardHabit1(e.target.value)} placeholder="Hábito 1" />
              <input type="text" value={onboardHabit2} onChange={(e) => setOnboardHabit2(e.target.value)} placeholder="Hábito 2" />
              <input type="text" value={onboardHabit3} onChange={(e) => setOnboardHabit3(e.target.value)} placeholder="Hábito 3" />
            </div>
            <div className="modal-footer">
              <button className="glow-btn" onClick={handleStartOnboard}>Iniciar Jornada</button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL UP MODAL */}
      {levelupActive && (
        <div className="modal-overlay active levelup-overlay">
          <div className="levelup-content">
            <h2>SUBIU DE NÍVEL!</h2>
            <div className="levelup-number">{level}</div>
            <p>Seu foco está se tornando imparável.</p>
            <button className="glow-btn" onClick={() => setLevelupActive(false)}>Reivindicar</button>
          </div>
        </div>
      )}
    </div>
  );
}
