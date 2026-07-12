// LÓGICA DO PRAGMA HUB - PRODUTIVIDADE, DOPAMINA, SKINNER, RPG LOJA & ALQUIMIA

// Estado Global da Aplicação
let state = {
    xp: 0,
    level: 1,
    streak: 0,
    lastStreakDate: null,
    lastActivityDate: null, 
    currentTask: "",
    projectName: "Pré-Projeto de TCC",
    projectDeadline: "2026-07-31",
    theme: "cajuina",
    soundEnabled: true,
    skinnerHardcore: false,  
    skinnerIdleAlert: true,  
    treeHealth: 100,         
    treeDead: false,         
    
    // VARIÁVEIS DE RPG & LOJA
    gems: 0,
    skillPoints: 0,
    skillsPurchased: [],     
    itemsOwned: [],          // Cosméticos comprados e EQUIPADOS pelo usuário
    itemsOwnedUnlocked: [],  // Cosméticos comprados (liberados no baú)
    weeklyXpAccumulated: 0,  
    weeklyQuestCompleted: false,
    waterUnits: 0,           
    forest: [],              
    
    // INGREDIENTES E ALQUIMIA
    inventory: {
        mudas: 0,
        adubos: 0,
        essencias: 0,
        potions: {
            potion: 0,       // Estoque de Poções de Vitalidade
            revive: 0        // Estoque de Poções de Reviver
        }
    },
    todoList: [],            // Lista de tarefas secundárias (To-Do)
    
    // JORNADAS CUSTOMIZADAS E ANTIFRAUDE
    customJourneys: [],      // Lista de jornadas customizadas do usuário
    draftsXpClaimedToday: {}, // Controle diário de XP de rascunhos: { "DateString": ["tcc_intro", ...] }
    
    habits: [
        { id: 1, text: "Abrir o arquivo e ler uma página", completed: false },
        { id: 2, text: "Escrever pelo menos uma frase nova", completed: false },
        { id: 3, text: "Organizar a mesa de trabalho por 2 min", completed: false }
    ],
    unlockedBadges: [],
    dailyQuest: {
        title: "Focar sem interrupções por 5 minutos",
        xpReward: 120,
        completed: false,
        date: ""
    },
    drafts: {}
};

// Definições de Conquistas (Badges)
const BADGES = [
    { id: 'inertia', icon: '🚀', title: 'Adeus Inércia', desc: 'Completou um timer de 5 minutos.' },
    { id: 'focus', icon: '🛡️', title: 'Foco de Aço', desc: 'Completou um timer Pomodoro (25 min).' },
    { id: 'freewriter', icon: '✍️', title: 'Escritor Veloz', desc: 'Concluiu uma sessão de Freewriting.' },
    { id: 'level5', icon: '👑', title: 'Mestre do Foco', desc: 'Alcançou o nível 5 de produtividade.' },
    { id: 'streak3', icon: '🔥', title: 'Hábito Consistente', desc: 'Manteve 3 dias seguidos de hábitos.' },
    { id: 'projectDone', icon: '🏆', title: 'Entregador Pragmático', desc: 'Concluiu uma meta principal de foco.' }
];

// Definições do Shop
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

// Definições de Alquimia (Receitas de Crafting)
const RECIPES = [
    { id: 'nutritiva', name: 'Mistura Nutritiva', desc: 'Restaura +15 de Saúde do Jardim.', cost: { mudas: 1, adubos: 1, essencias: 0 }, effect: () => healGarden(15) },
    { id: 'focosimpl', name: 'Poção de Foco Simples', desc: 'Restaura +25 de Saúde do Jardim.', cost: { mudas: 2, adubos: 0, essencias: 0 }, effect: () => healGarden(25) },
    { id: 'superadub', name: 'Super Adubo Químico', desc: 'Restaura +60 de Saúde do Jardim.', cost: { mudas: 1, adubos: 0, essencias: 1 }, effect: () => healGarden(60) },
    { id: 'elixirvit', name: 'Elixir da Vitalidade', desc: 'Restaura 100% de saúde e concede +50 XP.', cost: { mudas: 1, adubos: 1, essencias: 1 }, effect: () => { healGarden(100); addXP(50); } }
];

// Definições dos Templates de Escrita por Jornada Padrão
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

// --- SISTEMA DE ÁUDIO WEB API NATIVO ---
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(type) {
    if (!state.soundEnabled) return;
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'coin') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); 
        osc.frequency.setValueAtTime(880, now + 0.1); 
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'levelup') {
        osc.type = 'triangle';
        const notes = [523.25, 659.25, 783.99, 1046.50]; 
        notes.forEach((freq, idx) => {
            osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        });
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.setValueAtTime(0.15, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
    } else if (type === 'alarm') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.linearRampToValueAtTime(440, now + 0.2);
        osc.frequency.setValueAtTime(880, now + 0.2);
        osc.frequency.linearRampToValueAtTime(440, now + 0.4);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
    } else if (type === 'fail') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    } else if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.setValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    }
}

// --- ENGINE DE CONFETES NATIVO ---
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiActive = false;
let confettiParticles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height - 20;
        this.size = Math.random() * 8 + 6;
        this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 5 + 4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 4 - 2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
    }
}

function triggerConfetti() {
    confettiParticles = [];
    for (let i = 0; i < 150; i++) {
        confettiParticles.push(new ConfettiParticle());
    }
    if (!confettiActive) {
        confettiActive = true;
        animateConfetti();
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    confettiParticles.forEach(p => {
        p.update();
        p.draw();
        if (p.y < canvas.height) active = true;
    });
    if (active) {
        requestAnimationFrame(animateConfetti);
    } else {
        confettiActive = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// --- CONTROLE DE PERSISTÊNCIA ---
function loadState() {
    const saved = localStorage.getItem('pragma_state');
    if (saved) {
        try {
            state = { ...state, ...JSON.parse(saved) };
        } catch (e) {
            console.error("Erro ao carregar dados salvos.", e);
        }
    }
    if (!state.projectDeadline) {
        state.projectDeadline = "2026-07-31";
    }
    if (state.treeHealth === undefined) state.treeHealth = 100;
    if (state.treeDead === undefined) state.treeDead = false;
    if (state.gems === undefined) state.gems = 0;
    if (state.skillPoints === undefined) state.skillPoints = 0;
    if (state.skillsPurchased === undefined) state.skillsPurchased = [];
    if (state.itemsOwned === undefined) state.itemsOwned = [];
    if (state.itemsOwnedUnlocked === undefined) state.itemsOwnedUnlocked = [];
    if (state.weeklyXpAccumulated === undefined) state.weeklyXpAccumulated = 0;
    if (state.weeklyQuestCompleted === undefined) state.weeklyQuestCompleted = false;
    if (state.waterUnits === undefined) state.waterUnits = 0;
    if (state.forest === undefined) state.forest = [];
    
    // Novas variáveis de Alquimia e To-Do
    if (state.inventory === undefined) {
        state.inventory = { mudas: 0, adubos: 0, essencias: 0 };
    }
    if (state.inventory.potions === undefined) {
        state.inventory.potions = { potion: 0, revive: 0 };
    }
    if (state.todoList === undefined) state.todoList = [];
    
    // Customização de Jornadas e Antifraude
    if (state.customJourneys === undefined) state.customJourneys = [];
    if (state.draftsXpClaimedToday === undefined) state.draftsXpClaimedToday = {};
}

function saveState() {
    localStorage.setItem('pragma_state', JSON.stringify(state));
}

// --- JARDIM DO FOCO (SVG ÁRVORE & COSMÉTICOS) ---
function updateGardenTree() {
    const trunk = document.getElementById('tree-trunk');
    const branches = document.getElementById('tree-branches');
    const treeSvg = document.getElementById('garden-tree');
    const treePot = document.getElementById('tree-pot');
    const treeAura = document.getElementById('tree-aura');
    
    branches.innerHTML = '';
    treeAura.innerHTML = '';
    
    if (state.itemsOwned.includes('goldpot')) {
        treePot.classList.add('golden');
    } else {
        treePot.classList.remove('golden');
    }
    
    if (state.itemsOwned.includes('aura') && state.treeHealth >= 50 && !state.treeDead) {
        for (let i = 0; i < 6; i++) {
            const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            particle.setAttribute('cx', (30 + Math.random() * 40).toString());
            particle.setAttribute('cy', (30 + Math.random() * 40).toString());
            particle.setAttribute('r', (1.5 + Math.random() * 2).toString());
            particle.classList.add('aura-particle');
            particle.style.animationDelay = `${Math.random() * 2}s`;
            treeAura.appendChild(particle);
        }
    }
    
    if (state.treeDead) {
        treeSvg.className = '';
        treeSvg.classList.add('dead');
        trunk.setAttribute('d', 'M50,80 L50,65 M50,65 Q45,55 42,50 M50,65 Q55,58 58,54');
        trunk.setAttribute('stroke-width', '4');
        document.getElementById('garden-desc').innerText = "💀 Sua árvore de foco MORREU por inatividade ou desistência extrema! Use uma Poção de Reviver no seu Inventário (RPG).";
    } else if (state.treeHealth < 50) {
        treeSvg.className = '';
        treeSvg.classList.add('murcho');
        document.getElementById('garden-desc').innerText = "⚠️ Seu Jardim de Foco está murchando! Complete hábitos ou regue a árvore para curá-la.";
    } else {
        treeSvg.className = '';
        document.getElementById('garden-desc').innerText = "Sua árvore está crescendo. Mantenha o foco diário para mantê-la viva.";
    }

    if (!state.treeDead) {
        const lvl = state.level;
        
        if (lvl === 1) {
            trunk.setAttribute('d', 'M50,80 L50,75');
            trunk.setAttribute('stroke-width', '3');
            const leaf = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            leaf.setAttribute('cx', '50');
            leaf.setAttribute('cy', '74');
            leaf.setAttribute('r', '2.5');
            leaf.setAttribute('fill', 'var(--color-primary)');
            branches.appendChild(leaf);
        } else if (lvl === 2) {
            trunk.setAttribute('d', 'M50,80 L50,60');
            trunk.setAttribute('stroke-width', '4');
            createSvgLeaf(branches, 47, 68, 5, -45);
            createSvgLeaf(branches, 53, 64, 5, 45);
            createSvgLeaf(branches, 50, 58, 6, 0);
        } else if (lvl === 3) {
            trunk.setAttribute('d', 'M50,80 L50,55');
            trunk.setAttribute('stroke-width', '5');
            createSvgBranch(branches, 'M50,68 Q40,60 38,58', 3);
            createSvgBranch(branches, 'M50,62 Q60,54 62,52', 3);
            createSvgLeaf(branches, 38, 58, 6, -60);
            createSvgLeaf(branches, 62, 52, 6, 60);
            createSvgLeaf(branches, 50, 53, 7, 0);
        } else if (lvl === 4) {
            trunk.setAttribute('d', 'M50,80 L50,45');
            trunk.setAttribute('stroke-width', '6');
            createSvgBranch(branches, 'M50,65 Q35,55 30,52', 4);
            createSvgBranch(branches, 'M50,58 Q65,48 70,45', 4);
            createSvgBranch(branches, 'M50,50 Q42,40 40,36', 3);
            createSvgLeaf(branches, 30, 52, 7, -50);
            createSvgLeaf(branches, 70, 45, 7, 50);
            createSvgLeaf(branches, 40, 36, 6, -30);
            createSvgLeaf(branches, 50, 42, 8, 0);
        } else {
            trunk.setAttribute('d', 'M50,80 L50,40');
            trunk.setAttribute('stroke-width', '7');
            createSvgBranch(branches, 'M50,65 Q30,55 25,50', 5);
            createSvgBranch(branches, 'M50,58 Q70,48 75,42', 5);
            createSvgBranch(branches, 'M50,48 Q40,32 35,28', 4);
            createSvgBranch(branches, 'M50,48 Q60,32 65,28', 4);
            createSvgLeaf(branches, 25, 50, 8, -60);
            createSvgLeaf(branches, 75, 42, 8, 60);
            createSvgLeaf(branches, 35, 28, 7, -30);
            createSvgLeaf(branches, 65, 28, 7, 30);
            createSvgLeaf(branches, 50, 36, 9, 0);
            
            const crystalColor = state.treeHealth < 50 ? '#8b7c74' : 'var(--color-secondary)';
            createSvgFruit(branches, 40, 48, crystalColor);
            createSvgFruit(branches, 60, 42, crystalColor);
            createSvgFruit(branches, 48, 28, crystalColor);
        }
    }

    const fill = document.getElementById('vitality-fill');
    const text = document.getElementById('vitality-text');
    fill.style.width = `${state.treeHealth}%`;
    
    fill.className = 'vitality-bar-fill';
    if (state.treeDead) {
        text.innerText = "Morta";
        fill.classList.add('danger');
    } else if (state.treeHealth >= 75) {
        text.innerText = "Excelente";
    } else if (state.treeHealth >= 45) {
        text.innerText = "Instável";
        fill.classList.add('warning');
    } else {
        text.innerText = "Murchando!";
        fill.classList.add('danger');
    }
    
    const waterBtn = document.getElementById('water-tree-btn');
    waterBtn.disabled = state.waterUnits <= 0 || state.treeHealth >= 100 || state.treeDead;
}

function createSvgBranch(parent, d, strokeWidth) {
    const branch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    branch.setAttribute('d', d);
    branch.setAttribute('stroke', 'var(--text-main)');
    branch.setAttribute('stroke-width', strokeWidth);
    branch.setAttribute('stroke-linecap', 'round');
    branch.setAttribute('fill', 'none');
    parent.appendChild(branch);
}

function createSvgLeaf(parent, cx, cy, r, rot) {
    const leaf = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    leaf.setAttribute('cx', cx);
    leaf.setAttribute('cy', cy);
    leaf.setAttribute('rx', r);
    leaf.setAttribute('ry', r * 0.5);
    leaf.setAttribute('fill', state.treeHealth < 50 ? '#6e5f57' : 'var(--color-primary)');
    leaf.setAttribute('transform', `rotate(${rot}, ${cx}, ${cy})`);
    leaf.setAttribute('filter', 'drop-shadow(0 0 2px var(--accent-glow))');
    parent.appendChild(leaf);
}

function createSvgFruit(parent, cx, cy, color) {
    const fruit = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const points = `${cx},${cy-4} ${cx+3},${cy} ${cx},${cy+4} ${cx-3},${cy}`;
    fruit.setAttribute('points', points);
    fruit.setAttribute('fill', color);
    fruit.setAttribute('filter', 'drop-shadow(0 0 3px rgba(255,255,255,0.4))');
    parent.appendChild(fruit);
}

// --- MECÂNICA DO REGADOR ---
document.getElementById('water-tree-btn').addEventListener('click', () => {
    if (state.waterUnits <= 0 || state.treeHealth >= 100 || state.treeDead) return;
    
    state.waterUnits--;
    playSound('coin');
    healGarden(10);
    
    saveState();
    updateUI();
});

// --- DECLÍNIO DIÁRIO & MORTE ---
function checkDailyDecline() {
    const todayStr = new Date().toDateString();
    
    if (!state.lastActivityDate) {
        state.lastActivityDate = todayStr;
        saveState();
        return;
    }
    
    if (state.lastActivityDate !== todayStr) {
        const lastDate = new Date(state.lastActivityDate);
        const today = new Date(todayStr);
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
            const factor = state.skillsPurchased.includes('resistance') ? 0.5 : 1;
            
            state.treeHealth = Math.max(0, state.treeHealth - Math.round(25 * diffDays * factor));
            const xpLoss = Math.round(15 * diffDays * factor);
            reduceXP(xpLoss);
            
            if (state.treeHealth <= 0 && !state.treeDead) {
                triggerTreeDeath();
            }
            
            state.habits.forEach(h => h.completed = false);
            state.lastActivityDate = todayStr;
            saveState();
            
            if (state.treeDead) {
                alert("⚠️ A negligência extrema matou a sua árvore de foco! Adquira a Poção de Reviver na Loja para reiniciar.");
            } else {
                alert(`⚠️ Inatividade diária: Jardim perdeu vitalidade e você perdeu ${xpLoss} XP.`);
            }
            updateUI();
        }
    }
}

function triggerTreeDeath() {
    state.treeDead = true;
    state.treeHealth = 0;
    
    const factor = state.skillsPurchased.includes('resistance') ? 0.5 : 1;
    reduceXP(Math.round(100 * factor));
    state.gems = Math.round(state.gems * 0.5); 
    
    playSound('fail');
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 600);
}

function healGarden(amount) {
    if (state.treeDead) return;
    state.treeHealth = Math.min(100, state.treeHealth + amount);
    state.lastActivityDate = new Date().toDateString();
    saveState();
    updateGardenTree();
}

// --- SISTEMA DE RECOMPENSA XP, GEMAS E NÍVEIS ---
function addXP(amount) {
    if (state.treeDead) return;
    
    const factor = state.skillsPurchased.includes('extra') ? 1.25 : 1;
    const finalXp = Math.round(amount * factor);
    
    state.xp += finalXp;
    
    updateWeeklyQuestProgress(finalXp);
    
    const gemsEarned = Math.round(amount * 0.2 * factor);
    if (gemsEarned > 0) {
        state.gems += gemsEarned;
    }
    
    const xpNeeded = 100;
    
    if (state.xp >= xpNeeded) {
        state.xp = state.xp - xpNeeded;
        state.level += 1;
        state.skillPoints += 1; 
        state.gems += 50; 
        
        document.getElementById('new-level-display').innerText = state.level;
        document.getElementById('levelup-modal').classList.add('active');
        playSound('levelup');
        triggerConfetti();
        
        if (state.level >= 5) {
            unlockBadge('level5');
        }
    }
    
    saveState();
    updateUI();
}

function reduceXP(amount) {
    state.xp = Math.max(0, state.xp - amount);
    saveState();
    updateUI();
}

function unlockBadge(badgeId) {
    if (!state.unlockedBadges.includes(badgeId)) {
        state.unlockedBadges.push(badgeId);
        playSound('levelup');
        triggerConfetti();
        saveState();
        updateUI();
    }
}

// --- TIMER DE FOCO ---
let timerInterval = null;
let timerSeconds = 1500;
let timerRunning = false;

const timerDisplay = document.getElementById('timer-display');
const startTimerBtn = document.getElementById('start-timer-btn');
const resetTimerBtn = document.getElementById('reset-timer-btn');
const timerModeButtons = document.querySelectorAll('.timer-mode-btn');

function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
    const secs = (timerSeconds % 60).toString().padStart(2, '0');
    timerDisplay.innerText = `${mins}:${secs}`;
}

function stopTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    startTimerBtn.innerText = "Iniciar";
    startTimerBtn.classList.remove('secondary');
    startTimerBtn.classList.add('primary');
}

function startTimer() {
    if (state.treeDead) {
        alert("💀 Sua árvore está morta! Você precisa usar uma Poção de Reviver no seu Inventário (RPG) para voltar a focar.");
        return;
    }
    
    if (timerRunning) {
        stopTimer();
    } else {
        initAudio();
        timerRunning = true;
        startTimerBtn.innerText = "Pausar";
        startTimerBtn.classList.remove('primary');
        startTimerBtn.classList.add('secondary');
        
        stopIdleAlert();
        
        timerInterval = setInterval(() => {
            timerSeconds--;
            updateTimerDisplay();
            
            if (timerSeconds <= 0) {
                stopTimer();
                playSound('alarm');
                triggerConfetti();
                
                const activeMode = document.querySelector('.timer-mode-btn.active');
                const duration = parseInt(activeMode.dataset.time);
                
                if (duration === 1500) {
                    addXP(100);
                    healGarden(40);
                    state.waterUnits += 5; 
                    
                    state.inventory.essencias += 1;
                    state.inventory.mudas += 1;
                    
                    unlockBadge('focus');
                    alert("🛡️ Pomodoro concluído! (+100 XP, +5💧 Água, +1 🧪 Essência e +1 🌿 Muda)");
                } else if (duration === 300 && activeMode.classList.contains('mode-dopamine')) {
                    addXP(50);
                    healGarden(20);
                    state.waterUnits += 1; 
                    
                    state.inventory.mudas += 1;
                    
                    unlockBadge('inertia');
                    alert("🚀 Foco rápido concluído! (+50 XP, +1💧 Água, +1 🌿 Muda)");
                } else {
                    addXP(10);
                }
                
                timerSeconds = duration;
                updateTimerDisplay();
            }
        }, 1000);
    }
}

timerModeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (timerRunning && state.skinnerHardcore) {
            triggerSkinnerTimerPenalty();
        }
        
        stopTimer();
        timerModeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        timerSeconds = parseInt(btn.dataset.time);
        updateTimerDisplay();
    });
});

startTimerBtn.addEventListener('click', startTimer);

resetTimerBtn.addEventListener('click', () => {
    if (timerRunning && state.skinnerHardcore) {
        triggerSkinnerTimerPenalty();
    }
    
    stopTimer();
    const activeMode = document.querySelector('.timer-mode-btn.active');
    timerSeconds = parseInt(activeMode.dataset.time);
    updateTimerDisplay();
});

function triggerSkinnerTimerPenalty() {
    const factor = state.skillsPurchased.includes('resistance') ? 0.5 : 1;
    
    playSound('fail');
    reduceXP(Math.round(25 * factor));
    state.treeHealth = Math.max(0, state.treeHealth - Math.round(15 * factor));
    
    if (state.treeHealth <= 0 && !state.treeDead) {
        triggerTreeDeath();
    }
    
    updateGardenTree();
    
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 400);
    
    if (state.treeDead) {
        alert("⚠️ A desistência matou a sua árvore de foco!");
    } else {
        alert(`⚠️ Penalidade por Desistência! (-${Math.round(25 * factor)} XP e -${Math.round(15 * factor)} de saúde no jardim)`);
    }
}

// --- COBRANÇA ATIVA DE OCIOSIDADE ---
let idleTime = 0;
let idleInterval = null;
let beepInterval = null;
const IDLE_LIMIT = 600;

function startIdleMonitoring() {
    window.addEventListener('mousemove', resetIdleTime);
    window.addEventListener('keydown', resetIdleTime);
    window.addEventListener('click', resetIdleTime);
    
    idleInterval = setInterval(() => {
        if (!timerRunning && state.skinnerIdleAlert && !state.treeDead) {
            idleTime++;
            if (idleTime >= IDLE_LIMIT) {
                triggerSkinnerIdleAlert();
            }
        } else {
            resetIdleTime();
        }
    }, 1000);
}

function resetIdleTime() {
    idleTime = 0;
    if (document.getElementById('skinner-banner').classList.contains('active')) {
        stopIdleAlert();
    }
}

function triggerSkinnerIdleAlert() {
    document.getElementById('skinner-banner').classList.add('active');
    document.title = "⚠️ Alerta de Procrastinação!";
    
    if (!beepInterval) {
        playSound('beep');
        beepInterval = setInterval(() => {
            playSound('beep');
            const factor = state.skillsPurchased.includes('resistance') ? 0.5 : 1;
            reduceXP(Math.round(5 * factor));
            
            state.treeHealth = Math.max(0, state.treeHealth - Math.round(3 * factor));
            if (state.treeHealth <= 0 && !state.treeDead) {
                triggerTreeDeath();
                stopIdleAlert();
            }
            updateGardenTree();
        }, 30000);
    }
}

function stopIdleAlert() {
    document.getElementById('skinner-banner').classList.remove('active');
    document.title = "Pragma | Central de Foco & Produtividade";
    clearInterval(beepInterval);
    beepInterval = null;
    idleTime = 0;
}

document.getElementById('skinner-banner-action').addEventListener('click', () => {
    stopIdleAlert();
    const btn5m = document.querySelector('.timer-mode-btn[data-time="300"].mode-dopamine');
    if (btn5m) {
        btn5m.click();
        startTimer();
    }
});

// --- CONTADOR REGRESSIVO DO PRAZO ---
function updateDeadlineCountdown() {
    const deadlineVal = state.projectDeadline;
    if (!deadlineVal) return;

    const deadlineDate = new Date(`${deadlineVal}T23:59:59`);
    const now = new Date();
    const diff = deadlineDate - now;
    
    if (diff <= 0) {
        document.getElementById('days-left').innerText = "00";
        document.getElementById('hours-left').innerText = "00";
        document.getElementById('mins-left').innerText = "00";
        document.getElementById('deadline-progress-fill').style.width = "100%";
        document.getElementById('progress-percent').innerText = "Prazo encerrado";
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    document.getElementById('days-left').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours-left').innerText = hours.toString().padStart(2, '0');
    document.getElementById('mins-left').innerText = mins.toString().padStart(2, '0');
    
    const monthStart = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), 1);
    const totalDuration = deadlineDate - monthStart;
    const elapsed = now - monthStart;
    
    let percent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    
    document.getElementById('deadline-progress-fill').style.width = `${percent}%`;
    document.getElementById('progress-percent').innerText = `${Math.round(percent)}% do tempo decorrido`;
}

// --- MISSÃO SEMANAL ---
const WEEKLY_XP_TARGET = 300;

function updateWeeklyQuestProgress(xpGained) {
    if (state.weeklyQuestCompleted) return;
    
    state.weeklyXpAccumulated = Math.min(WEEKLY_XP_TARGET, state.weeklyXpAccumulated + xpGained);
    
    if (state.weeklyXpAccumulated >= WEEKLY_XP_TARGET && !state.weeklyQuestCompleted) {
        state.weeklyQuestCompleted = true;
        state.gems += 150; 
        playSound('levelup');
        triggerConfetti();
        alert("🏆 Quest Semanal Concluída! Você ganhou +150 Gemas de bônus por bater a meta de 300 XP.");
    }
    
    saveState();
    renderWeeklyQuest();
}

function renderWeeklyQuest() {
    document.getElementById('weekly-quest-title').innerText = `Desafio: Obter ${WEEKLY_XP_TARGET} XP nesta semana`;
    
    const percent = (state.weeklyXpAccumulated / WEEKLY_XP_TARGET) * 100;
    document.getElementById('weekly-progress-fill').style.width = `${percent}%`;
    document.getElementById('weekly-progress-text').innerText = `${state.weeklyXpAccumulated} / ${WEEKLY_XP_TARGET} XP`;
}

// --- GESTÃO DE MICRO-HÁBITOS & STREAK ---
function renderHabits() {
    const container = document.getElementById('habits-list');
    container.innerHTML = '';
    
    state.habits.forEach(habit => {
        const row = document.createElement('div');
        row.className = `habit-row ${habit.completed ? 'completed' : ''}`;
        
        row.innerHTML = `
            <div class="habit-checkbox"></div>
            <span class="habit-text">${habit.text}</span>
        `;
        
        row.addEventListener('click', () => {
            if (state.treeDead) {
                alert("💀 Sua árvore está morta! Reviva-a usando Poção de Reviver no seu Inventário.");
                return;
            }
            
            habit.completed = !habit.completed;
            playSound('coin');
            
            if (habit.completed) {
                addXP(20);
                healGarden(15);
                
                state.inventory.mudas += 1;
            } else {
                state.treeHealth = Math.max(0, state.treeHealth - 15);
                updateGardenTree();
            }
            
            checkHabitsStreak();
            saveState();
            updateUI();
        });
        
        container.appendChild(row);
    });
}

function checkHabitsStreak() {
    const allCompleted = state.habits.every(h => h.completed);
    const todayStr = new Date().toDateString();
    
    if (allCompleted) {
        if (state.lastStreakDate !== todayStr) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();
            
            if (state.lastStreakDate === yesterdayStr) {
                state.streak += 1;
            } else if (state.lastStreakDate !== todayStr) {
                state.streak = 1;
            }
            
            state.lastStreakDate = todayStr;
            triggerConfetti();
            
            if (state.streak >= 3) {
                unlockBadge('streak3');
            }
        }
    }
}

// --- GESTÃO DE TAREFAS SECUNDÁRIAS (TO-DO LIST) ---
function renderTodoList() {
    const container = document.getElementById('todo-list');
    container.innerHTML = '';
    
    if (state.todoList.length === 0) {
        container.innerHTML = `<p class="empty-forest-msg" style="padding: 10px 0; font-size: 0.75rem;">Sem tarefas pendentes.</p>`;
        return;
    }
    
    state.todoList.forEach(todo => {
        const item = document.createElement('div');
        item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        item.innerHTML = `
            <div class="todo-checkbox"></div>
            <span class="todo-text">${todo.text}</span>
            <span class="todo-reward-tag">🍂 +1 Adubo</span>
        `;
        
        item.addEventListener('click', () => {
            if (state.treeDead) {
                alert("💀 Sua árvore está morta!");
                return;
            }
            
            todo.completed = !todo.completed;
            playSound('coin');
            
            if (todo.completed) {
                addXP(5);
                state.inventory.adubos += 1;
            } else {
                state.inventory.adubos = Math.max(0, state.inventory.adubos - 1);
            }
            
            saveState();
            updateUI();
        });
        
        container.appendChild(item);
    });
}

document.getElementById('add-todo-btn').addEventListener('click', () => {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (text === "") return;
    
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    state.todoList.push(newTodo);
    input.value = "";
    
    saveState();
    updateUI();
});

document.getElementById('todo-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('add-todo-btn').click();
    }
});

// --- SISTEMA DE JORNADAS PERSONALIZADAS ---
const customJourneyModal = document.getElementById('custom-journey-modal');
const customStepsContainer = document.getElementById('custom-steps-container');

function populateJourneyDropdown() {
    const select = document.getElementById('journey-select');
    select.innerHTML = `
        <option value="tcc">Pré-Projeto & TCC</option>
        <option value="creative">Escrita Criativa</option>
        <option value="code">Tech & Documentação</option>
        <option value="general">Planejamento Geral</option>
    `;
    
    state.customJourneys.forEach(journey => {
        const opt = document.createElement('option');
        opt.value = journey.id;
        opt.innerText = journey.name;
        select.appendChild(opt);
    });
}

function getTemplatesForJourney(journeyId) {
    if (WRITING_JOURNEYS[journeyId]) {
        return WRITING_JOURNEYS[journeyId];
    }
    const custom = state.customJourneys.find(j => j.id === journeyId);
    return custom ? custom.steps : [];
}

document.getElementById('create-journey-trigger').addEventListener('click', () => {
    document.getElementById('custom-journey-name').value = "";
    customStepsContainer.innerHTML = "";
    addStepBuilderRow(); 
    customJourneyModal.classList.add('active');
});

document.getElementById('close-custom-journey-btn').addEventListener('click', () => {
    customJourneyModal.classList.remove('active');
});

document.getElementById('add-step-fields-btn').addEventListener('click', () => {
    addStepBuilderRow();
});

function addStepBuilderRow() {
    const row = document.createElement('div');
    row.className = 'custom-step-builder-row';
    row.innerHTML = `
        <button class="remove-step-btn">&times;</button>
        <input type="text" class="step-title-input" placeholder="Título do Passo (Ex: 1. Introdução)" required>
        <textarea class="step-guide-input" placeholder="Instruções de escrita pragmáticas para guiar você..." required></textarea>
    `;
    
    row.querySelector('.remove-step-btn').addEventListener('click', () => {
        row.remove();
    });
    
    customStepsContainer.appendChild(row);
}

document.getElementById('save-custom-journey-btn').addEventListener('click', () => {
    const jName = document.getElementById('custom-journey-name').value.trim();
    if (!jName) {
        alert("Digite o nome da jornada!");
        return;
    }
    
    const rows = customStepsContainer.querySelectorAll('.custom-step-builder-row');
    if (rows.length === 0) {
        alert("Adicione pelo menos 1 passo na jornada!");
        return;
    }
    
    let steps = [];
    let isValid = true;
    
    rows.forEach((row, idx) => {
        const title = row.querySelector('.step-title-input').value.trim();
        const guide = row.querySelector('.step-guide-input').value.trim();
        
        if (!title || !guide) {
            isValid = false;
        } else {
            steps.push({
                id: `custom_${Date.now()}_${idx}`,
                title: title,
                guide: guide
            });
        }
    });
    
    if (!isValid) {
        alert("Preencha todos os campos dos passos!");
        return;
    }
    
    const newJourney = {
        id: `journey_${Date.now()}`,
        name: jName,
        steps: steps
    };
    
    state.customJourneys.push(newJourney);
    saveState();
    
    populateJourneyDropdown();
    document.getElementById('journey-select').value = newJourney.id;
    activeTemplateId = null;
    renderTemplates(newJourney.id);
    
    customJourneyModal.classList.remove('active');
    playSound('levelup');
    triggerConfetti();
    alert(`Jornada "${jName}" criada com sucesso!`);
});

// --- ASSISTENTE DE ESCRITA ---
let activeTemplateId = null;

function renderTemplates(journeyId) {
    const container = document.getElementById('templates-list');
    container.innerHTML = '';
    
    const templates = getTemplatesForJourney(journeyId);
    
    templates.forEach((temp, idx) => {
        const btn = document.createElement('button');
        btn.className = `template-nav-btn ${activeTemplateId === temp.id ? 'active' : ''}`;
        btn.innerText = temp.title;
        
        btn.addEventListener('click', () => {
            selectTemplate(temp.id, journeyId);
        });
        
        container.appendChild(btn);
    });
    
    if (templates.length > 0 && !activeTemplateId) {
        selectTemplate(templates[0].id, journeyId);
    }
}

function selectTemplate(templateId, journeyId) {
    activeTemplateId = templateId;
    const buttons = document.querySelectorAll('.template-nav-btn');
    const templates = getTemplatesForJourney(journeyId);
    const activeIndex = templates.findIndex(t => t.id === templateId);
    
    buttons.forEach((btn, idx) => {
        if (idx === activeIndex) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    const temp = templates.find(t => t.id === templateId);
    if (temp) {
        document.getElementById('current-template-title').innerText = temp.title;
        document.getElementById('current-template-guide').innerText = temp.guide;
        
        const textarea = document.getElementById('editor-textarea');
        textarea.value = state.drafts[templateId] || "";
        updateWordCount(textarea.value);
    }
}

function updateWordCount(text) {
    const count = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    document.getElementById('word-count').innerText = `${count} palavras`;
}

// --- ANTIFRAUDE DE DIGITAÇÃO ---
function validateDraftContent(text, templateId) {
    const cleanedText = text.trim();
    
    if (cleanedText.length < 25) {
        return { valid: false, reason: "O texto precisa conter pelo menos 25 caracteres para pontuar." };
    }
    
    if (/(.)\1{9,}/.test(cleanedText)) {
        return { valid: false, reason: "Padrão de escrita inválido (caracteres repetidos)." };
    }
    
    const words = cleanedText.split(/\s+/);
    let consecutiveSpam = 0;
    for (let i = 0; i < words.length - 1; i++) {
        if (words[i].toLowerCase() === words[i+1].toLowerCase() && words[i].length > 1) {
            consecutiveSpam++;
            if (consecutiveSpam > 4) {
                return { valid: false, reason: "Spam de palavras idênticas detectado." };
            }
        }
    }
    
    const previousContent = state.drafts[templateId] || "";
    if (cleanedText === previousContent.trim()) {
        return { valid: false, reason: "Nenhuma alteração detectada no rascunho." };
    }
    
    return { valid: true };
}

// LÓGICA DO FREEWRITING
let freewritingTimer = null;
let freewritingTimeLeft = 180;
let lastTypingTime = Date.now();
let freewritingActive = false;
let checkTypingInterval = null;

const freewritingTextarea = document.getElementById('freewriting-textarea');

function startFreewriting() {
    if (state.treeDead) {
        alert("💀 Sua árvore está morta! Compre a Poção de Reviver antes de escrever.");
        return;
    }
    
    initAudio();
    freewritingActive = true;
    freewritingTimeLeft = 180;
    lastTypingTime = Date.now();
    
    document.querySelector('.freewriting-intro').style.display = 'none';
    const activeArea = document.querySelector('.freewriting-active-area');
    activeArea.style.display = 'flex';
    
    freewritingTextarea.value = "";
    freewritingTextarea.focus();
    
    freewritingTimer = setInterval(() => {
        freewritingTimeLeft--;
        const mins = Math.floor(freewritingTimeLeft / 60).toString().padStart(2, '0');
        const secs = (freewritingTimeLeft % 60).toString().padStart(2, '0');
        document.getElementById('freewriting-timer').innerText = `${mins}:${secs}`;
        
        if (freewritingTimeLeft <= 0) {
            finishFreewriting(true);
        }
    }, 1000);
    
    const allowedInactiveTime = state.skillsPurchased.includes('efficiency') ? 5000 : 3000;
    
    checkTypingInterval = setInterval(() => {
        const inactiveTime = Date.now() - lastTypingTime;
        if (inactiveTime > allowedInactiveTime) {
            freewritingTextarea.classList.add('shake');
            document.getElementById('freewriting-warning').innerText = "DIGITE ALGO! NÃO PARE!";
        } else {
            freewritingTextarea.classList.remove('shake');
            document.getElementById('freewriting-warning').innerText = "Fluxo contínuo ativo...";
        }
    }, 500);
}

function finishFreewriting(success) {
    clearInterval(freewritingTimer);
    clearInterval(checkTypingInterval);
    freewritingActive = false;
    freewritingTextarea.classList.remove('shake');
    
    if (success) {
        const content = freewritingTextarea.value.trim();
        const hasSpam = /(.)\1{14,}/.test(content) || content.length < 50;
        
        if (hasSpam) {
            playSound('fail');
            alert("⚠️ Escrita contínua inválida! Escreva textos reais para receber XP.");
        } else {
            playSound('levelup');
            triggerConfetti();
            
            const baseXP = 75;
            const xpAmount = state.skillsPurchased.includes('efficiency') ? baseXP * 2 : baseXP;
            
            addXP(xpAmount);
            healGarden(30);
            
            state.inventory.mudas += 2;
            unlockBadge('freewriter');
            alert(`Excelente! Você completou a escrita contínua. (+${xpAmount} XP, +30 vitalidade, +2 🌿 Mudas)`);
        }
    }
    
    document.querySelector('.freewriting-intro').style.display = 'flex';
    document.querySelector('.freewriting-active-area').style.display = 'none';
}

freewritingTextarea.addEventListener('input', () => {
    lastTypingTime = Date.now();
});

document.getElementById('start-freewriting-btn').addEventListener('click', startFreewriting);

// --- BOSQUE DE TROFÉUS (FOREST) ---
function renderForest() {
    const grid = document.getElementById('forest-grid');
    grid.innerHTML = '';
    
    if (state.forest.length === 0) {
        grid.innerHTML = `<p class="empty-forest-msg">Nenhum objetivo eternizado ainda.</p>`;
        return;
    }
    
    state.forest.forEach(tree => {
        const item = document.createElement('div');
        item.className = 'forest-tree-item';
        
        let icon = '🌳';
        if (tree.theme === 'pragma') icon = '🔮';
        if (tree.theme === 'geraqrcode') icon = '⚡';
        
        item.innerHTML = `
            <div class="forest-tree-icon">${icon}</div>
            <div class="forest-tree-details">
                <span class="forest-tree-name">${tree.name}</span>
                <span class="forest-tree-meta">Nível ${tree.level} • Concluído em ${tree.date}</span>
            </div>
        `;
        
        item.addEventListener('click', () => {
            alert(`Objetivo Concluído:\n\n"${tree.name}"\nTema: ${tree.theme.toUpperCase()}\nNível final alcançado: ${tree.level}\nData de eternização: ${tree.date}`);
        });
        
        grid.appendChild(item);
    });
}

// --- SISTEMA RPG & LOJA DE RECOMPENSAS ---
function renderShop() {
    const grid = document.getElementById('shop-items-grid');
    grid.innerHTML = '';
    
    SHOP_ITEMS.forEach(item => {
        const card = document.createElement('div');
        card.className = 'shop-item-card';
        
        const unlocked = state.itemsOwnedUnlocked.includes(item.id);
        
        let canBuy = state.gems >= item.price;
        if (item.type === 'cosmetic') {
            canBuy = canBuy && !unlocked;
        }
        
        card.innerHTML = `
            <div class="shop-item-icon">${item.icon}</div>
            <div class="shop-item-title">${item.title}</div>
            <div class="shop-item-desc">${item.desc}</div>
            <div class="shop-item-buy-row">
                <span class="shop-item-price">💎 ${item.price}</span>
                <button class="shop-buy-btn" ${canBuy ? '' : 'disabled'}>
                    ${unlocked && item.type === 'cosmetic' ? 'Adquirido' : 'Comprar'}
                </button>
            </div>
        `;
        
        const buyBtn = card.querySelector('.shop-buy-btn');
        buyBtn.addEventListener('click', () => {
            buyShopItem(item);
        });
        
        grid.appendChild(card);
    });
}

function buyShopItem(item) {
    if (state.gems < item.price) return;
    
    state.gems -= item.price;
    playSound('levelup');
    triggerConfetti();
    
    if (item.type === 'consumable') {
        // Poções agora são ESTOCADAS no inventário físico
        if (item.id === 'potion') {
            state.inventory.potions.potion += 1;
            alert("🧪 Poção de Vitalidade comprada e enviada ao seu Baú de Itens!");
        } else if (item.id === 'revive') {
            state.inventory.potions.revive += 1;
            alert("⚡ Poção de Reviver comprada e enviada ao seu Baú de Itens!");
        }
    } else {
        // Cosméticos vão para a lista de liberados no baú
        if (!state.itemsOwnedUnlocked.includes(item.id)) {
            state.itemsOwnedUnlocked.push(item.id);
        }
        // Ativa o cosmético na hora por conveniência
        if (!state.itemsOwned.includes(item.id)) {
            state.itemsOwned.push(item.id);
        }
        alert(`${item.icon} ${item.title} adquirido e ativado no Jardim de Foco!`);
    }
    
    saveState();
    updateUI();
    renderShop();
    renderInventory();
}

// --- SISTEMA DE INVENTÁRIO (NOVO) ---
function renderInventory() {
    const container = document.getElementById('bag-inventory-list');
    container.innerHTML = '';
    
    let hasItems = false;
    
    // 1. Renderiza Poções de Vitalidade (Consumível)
    if (state.inventory.potions.potion > 0) {
        hasItems = true;
        const row = createInventoryItemCard('🧪', 'Poção de Vitalidade', `Quantidade: ${state.inventory.potions.potion}`, 'Usar', () => {
            if (state.treeDead) {
                alert("💀 Esta poção cura vitalidade, mas não pode reviver uma árvore morta!");
                return;
            }
            if (state.treeHealth >= 100) {
                alert("Sua árvore já está com 100% de vitalidade!");
                return;
            }
            state.inventory.potions.potion--;
            healGarden(50);
            playSound('coin');
            alert("🧪 Poção de Vitalidade consumida! +50 de saúde no Jardim.");
            saveState();
            updateUI();
            renderInventory();
        });
        container.appendChild(row);
    }
    
    // 2. Renderiza Poções de Reviver (Consumível)
    if (state.inventory.potions.revive > 0) {
        hasItems = true;
        const row = createInventoryItemCard('⚡', 'Poção de Reviver', `Quantidade: ${state.inventory.potions.revive}`, 'Usar', () => {
            if (!state.treeDead) {
                alert("Sua árvore de foco está viva e não precisa ser revivida!");
                return;
            }
            state.inventory.potions.revive--;
            state.treeDead = false;
            state.treeHealth = 50;
            playSound('levelup');
            triggerConfetti();
            alert("⚡ Sua árvore foi revivida com sucesso no Jardim de Foco!");
            saveState();
            updateUI();
            renderInventory();
        });
        container.appendChild(row);
    }
    
    // 3. Renderiza Cosméticos Liberados (Equipáveis)
    state.itemsOwnedUnlocked.forEach(cosmeticId => {
        hasItems = true;
        const itemDef = SHOP_ITEMS.find(i => i.id === cosmeticId);
        if (!itemDef) return;
        
        const isEquipped = state.itemsOwned.includes(cosmeticId);
        const btnText = isEquipped ? 'Equipado' : 'Equipar';
        
        const row = createInventoryItemCard(itemDef.icon, itemDef.title, 'Cosmético Destravado', btnText, () => {
            if (isEquipped) {
                // Desequipar
                state.itemsOwned = state.itemsOwned.filter(id => id !== cosmeticId);
                alert(`${itemDef.title} desequipado.`);
            } else {
                // Equipar
                state.itemsOwned.push(cosmeticId);
                alert(`${itemDef.title} equipado com sucesso.`);
            }
            saveState();
            updateGardenTree();
            renderInventory();
        });
        
        if (isEquipped) {
            row.querySelector('.bag-item-use-btn').classList.add('active-equipped');
        }
        
        container.appendChild(row);
    });
    
    if (!hasItems) {
        container.innerHTML = `<p class="empty-forest-msg" style="padding: 10px 0; font-size: 0.75rem;">Seu baú de itens está vazio.</p>`;
    }
}

function createInventoryItemCard(icon, name, metaText, buttonText, onClickAction) {
    const card = document.createElement('div');
    card.className = 'bag-item-card';
    
    card.innerHTML = `
        <div class="bag-item-details">
            <span class="bag-item-name">${icon} ${name}</span>
            <span class="bag-item-qty">${metaText}</span>
        </div>
        <button class="bag-item-use-btn">${buttonText}</button>
    `;
    
    card.querySelector('.bag-item-use-btn').addEventListener('click', onClickAction);
    return card;
}

// --- SISTEMA DE ALQUIMIA (CRAFTING) ---
function renderAlchemy() {
    document.getElementById('ing-mudas-count').innerText = state.inventory.mudas;
    document.getElementById('ing-adubos-count').innerText = state.inventory.adubos;
    document.getElementById('ing-essencias-count').innerText = state.inventory.essencias;
    
    const container = document.getElementById('recipes-list');
    container.innerHTML = '';
    
    RECIPES.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        
        const hasMudas = state.inventory.mudas >= recipe.cost.mudas;
        const hasAdubos = state.inventory.adubos >= recipe.cost.adubos;
        const hasEssencias = state.inventory.essencias >= recipe.cost.essencias;
        
        const canCraft = hasMudas && hasAdubos && hasEssencias && !state.treeDead;
        
        let costArr = [];
        if (recipe.cost.mudas > 0) costArr.push(`🌿 x${recipe.cost.mudas}`);
        if (recipe.cost.adubos > 0) costArr.push(`🍂 x${recipe.cost.adubos}`);
        if (recipe.cost.essencias > 0) costArr.push(`🧪 x${recipe.cost.essencias}`);
        
        card.innerHTML = `
            <div class="recipe-header-row">
                <span class="recipe-title">${recipe.name}</span>
                <button class="recipe-craft-btn" ${canCraft ? '' : 'disabled'}>Preparar</button>
            </div>
            <div class="recipe-desc">${recipe.desc}</div>
            <div class="recipe-ingredients-cost">Custo: ${costArr.join(' + ')}</div>
        `;
        
        const craftBtn = card.querySelector('.recipe-craft-btn');
        craftBtn.addEventListener('click', () => {
            craftRecipe(recipe);
        });
        
        container.appendChild(card);
    });
}

function craftRecipe(recipe) {
    if (state.treeDead) return;
    
    state.inventory.mudas -= recipe.cost.mudas;
    state.inventory.adubos -= recipe.cost.adubos;
    state.inventory.essencias -= recipe.cost.essencias;
    
    playSound('coin');
    triggerConfetti();
    
    recipe.effect();
    
    alert(`🧪 Sucesso! Você preparou e consumiu: ${recipe.name}.`);
    
    saveState();
    updateUI();
    renderAlchemy();
}

function renderSkillsTree() {
    const grid = document.getElementById('skills-tree-grid');
    grid.innerHTML = '';
    
    SKILLS.forEach(skill => {
        const node = document.createElement('div');
        const purchased = state.skillsPurchased.includes(skill.id);
        const canPurchase = state.skillPoints >= skill.cost && !purchased;
        
        let statusClass = 'locked';
        let statusText = 'Bloqueado';
        if (purchased) {
            statusClass = 'active-skill';
            statusText = 'Ativo';
        } else if (canPurchase) {
            statusClass = 'available';
            statusText = `Desbloquear (${skill.cost} pts)`;
        } else {
            statusText = `Falta ${skill.cost - state.skillPoints} pts`;
        }
        
        node.className = `skill-node ${statusClass}`;
        
        node.innerHTML = `
            <div class="skill-icon">${skill.icon}</div>
            <div class="skill-info">
                <div class="skill-title">${skill.title}</div>
                <div class="skill-desc">${skill.desc}</div>
            </div>
            <span class="skill-status-tag">${statusText}</span>
        `;
        
        if (canPurchase) {
            node.addEventListener('click', () => {
                purchaseSkill(skill);
            });
        }
        
        grid.appendChild(node);
    });
}

function purchaseSkill(skill) {
    if (state.skillPoints < skill.cost) return;
    
    state.skillPoints -= skill.cost;
    state.skillsPurchased.push(skill.id);
    
    playSound('levelup');
    triggerConfetti();
    
    alert(`🌳 Habilidade "${skill.title}" ativada!`);
    
    saveState();
    updateUI();
    renderSkillsTree();
}

// --- COMPLEMENTO DA UI PRINCIPAL ---
function updateUI() {
    document.getElementById('level-number').innerText = state.level;
    document.getElementById('xp-text').innerText = `${state.xp} / 100 XP`;
    document.getElementById('xp-fill').style.width = `${state.xp}%`;
    document.getElementById('streak-count').innerText = state.streak;
    
    document.getElementById('gems-count').innerText = state.gems;
    document.getElementById('skill-points-count').innerText = state.skillPoints;
    document.getElementById('water-count').innerText = state.waterUnits;
    
    document.getElementById('project-display-name').innerText = state.projectName;
    
    const taskInput = document.getElementById('current-task-input');
    const completeBtn = document.getElementById('complete-task-btn');
    completeBtn.disabled = taskInput.value.trim() === "" || state.treeDead;
    
    updateGardenTree();
    renderWeeklyQuest();
    renderForest();
    renderTodoList();
    renderAlchemy();
}

// --- EVENTOS E TAREFAS DE FOCO ---
const taskInput = document.getElementById('current-task-input');
const completeBtn = document.getElementById('complete-task-btn');

taskInput.addEventListener('input', () => {
    state.currentTask = taskInput.value;
    completeBtn.disabled = taskInput.value.trim() === "" || state.treeDead;
    saveState();
});

completeBtn.addEventListener('click', () => {
    if (taskInput.value.trim() === "" || state.treeDead) return;
    
    playSound('coin');
    triggerConfetti();
    
    const newTree = {
        name: state.projectName,
        level: state.level,
        date: new Date().toLocaleDateString('pt-BR'),
        theme: state.theme
    };
    state.forest.push(newTree);
    state.gems += 200;
    
    state.level = 1;
    state.xp = 0;
    state.treeHealth = 100;
    state.treeDead = false;
    
    state.todoList = [];
    
    unlockBadge('projectDone');
    
    alert(`🏆 PARABÉNS! Objetivo "${state.projectName}" Concluído!\n\nSua árvore foi eternizada no Bosque de Troféus.\nVocê ganhou 💎 200 de recompensa premium.\nPlante sua próxima meta agora!`);
    
    taskInput.value = "";
    state.currentTask = "";
    completeBtn.disabled = true;
    
    saveState();
    updateUI();
    initOnboarding();
});

// --- HÁBITOS DIÁRIOS ---
const editHabitsBtn = document.getElementById('edit-habits-btn');
const habitsModal = document.getElementById('habits-modal');
const closeHabitsBtn = document.getElementById('close-habits-btn');
const saveHabitsBtn = document.getElementById('save-habits-btn');

editHabitsBtn.addEventListener('click', () => {
    document.getElementById('habit-1-input').value = state.habits[0]?.text || "";
    document.getElementById('habit-2-input').value = state.habits[1]?.text || "";
    document.getElementById('habit-3-input').value = state.habits[2]?.text || "";
    habitsModal.classList.add('active');
});

closeHabitsBtn.addEventListener('click', () => habitsModal.classList.remove('active'));

saveHabitsBtn.addEventListener('click', () => {
    state.habits[0].text = document.getElementById('habit-1-input').value || "Hábito 1";
    state.habits[1].text = document.getElementById('habit-2-input').value || "Hábito 2";
    state.habits[2].text = document.getElementById('habit-3-input').value || "Hábito 3";
    
    state.habits.forEach(h => h.completed = false);
    
    saveState();
    renderHabits();
    updateUI();
    habitsModal.classList.remove('active');
});

// --- SALVAR RASCUNHO & ANTIFRAUDE ---
document.getElementById('save-draft-btn').addEventListener('click', () => {
    if (state.treeDead) {
        alert("💀 Sua árvore está morta!");
        return;
    }
    
    if (!activeTemplateId) {
        alert("Selecione um tópico de escrita antes de salvar!");
        return;
    }
    
    const textContent = document.getElementById('editor-textarea').value;
    const validation = validateDraftContent(textContent, activeTemplateId);
    
    state.drafts[activeTemplateId] = textContent;
    saveState();
    
    playSound('coin');
    triggerConfetti();
    
    if (!validation.valid) {
        alert(`Rascunho salvo com sucesso!\n\nNota: ${validation.reason} (Nenhum XP foi concedido para este salvamento)`);
        return;
    }
    
    const todayStr = new Date().toDateString();
    if (!state.draftsXpClaimedToday[todayStr]) {
        state.draftsXpClaimedToday[todayStr] = [];
    }
    
    if (state.draftsXpClaimedToday[todayStr].includes(activeTemplateId)) {
        alert("Rascunho atualizado com sucesso! (Você já recebeu o XP de rascunho para este tópico hoje)");
    } else {
        state.draftsXpClaimedToday[todayStr].push(activeTemplateId);
        addXP(10);
        alert("Excelente rascunho de escrita! (+10 XP concedidos)");
    }
    
    saveState();
    updateUI();
});

const journeySelect = document.getElementById('journey-select');
journeySelect.addEventListener('change', (e) => {
    activeTemplateId = null;
    renderTemplates(e.target.value);
});

const writeTabs = document.querySelectorAll('.write-tab');
writeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        writeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
        
        const journeySelector = document.getElementById('journey-selector-wrapper');
        if (tab.dataset.tab === 'rpg') {
            journeySelector.style.display = 'none';
            renderShop();
            renderSkillsTree();
            renderAlchemy();
            renderInventory(); // Renderiza o baú de itens ao carregar aba RPG
        } else {
            journeySelector.style.display = 'flex';
        }
    });
});

// --- MODAL DE CONFIGURAÇÕES & TEMAS ---
const settingsTrigger = document.getElementById('settings-trigger');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');

settingsTrigger.addEventListener('click', () => {
    document.getElementById('project-name-input').value = state.projectName;
    document.getElementById('project-deadline-input').value = state.projectDeadline;
    document.getElementById('sound-toggle').checked = state.soundEnabled;
    document.getElementById('skinner-mode-toggle').checked = state.skinnerHardcore;
    document.getElementById('skinner-idle-toggle').checked = state.skinnerIdleAlert;
    
    document.querySelectorAll('.theme-option').forEach(opt => {
        if (opt.dataset.theme === state.theme) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });
    
    settingsModal.classList.add('active');
});

document.getElementById('quick-edit-project-btn').addEventListener('click', () => {
    settingsTrigger.click();
});

closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));

document.querySelectorAll('.theme-option').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
    });
});

saveSettingsBtn.addEventListener('click', () => {
    state.projectName = document.getElementById('project-name-input').value || "Meu Projeto";
    state.projectDeadline = document.getElementById('project-deadline-input').value || "2026-07-31";
    state.soundEnabled = document.getElementById('sound-toggle').checked;
    state.skinnerHardcore = document.getElementById('skinner-mode-toggle').checked;
    state.skinnerIdleAlert = document.getElementById('skinner-idle-toggle').checked;
    
    const activeThemeOpt = document.querySelector('.theme-option.active');
    if (activeThemeOpt) {
        state.theme = activeThemeOpt.dataset.theme;
        applyTheme(state.theme);
    }
    
    if (!state.skinnerIdleAlert) {
        stopIdleAlert();
    }
    
    saveState();
    updateUI();
    updateDeadlineCountdown();
    settingsModal.classList.remove('active');
});

function applyTheme(themeName) {
    document.body.className = '';
    document.body.classList.add(`theme-${themeName}`);
    
    const title = document.getElementById('app-title');
    const logo = document.getElementById('app-logo');
    
    if (themeName === 'cajuina') {
        title.innerText = "Cajuína Code";
        logo.innerHTML = `
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
        `;
    } else if (themeName === 'pragma') {
        title.innerText = "Pragma Focus";
        logo.innerHTML = `
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
            </svg>
        `;
    } else if (themeName === 'geraqrcode') {
        title.innerText = "GeraQRCode Foco";
        logo.innerHTML = `
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <rect x="7" y="7" width="3" height="3"></rect>
                <rect x="14" y="7" width="3" height="3"></rect>
                <rect x="7" y="14" width="3" height="3"></rect>
                <rect x="14" y="14" width="3" height="3"></rect>
            </svg>
        `;
    }
}

function checkUrlBrand() {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get('brand');
    if (brand && ['cajuina', 'pragma', 'geraqrcode'].includes(brand)) {
        state.theme = brand;
        applyTheme(brand);
        saveState();
    }
}

// --- MODAL LEVEL UP ---
document.getElementById('claim-levelup-btn').addEventListener('click', () => {
    document.getElementById('levelup-modal').classList.remove('active');
    triggerConfetti();
});

// --- IMPORTAÇÃO E EXPORTAÇÃO DE BACKUPS JSON ---
document.getElementById('export-backup-btn').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `pragma-backup-${state.projectName.replace(/\s+/g, '-').toLowerCase()}.json`);
    dlAnchorElem.click();
});

const importTrigger = document.getElementById('import-backup-trigger');
const importFile = document.getElementById('import-backup-file');

importTrigger.addEventListener('click', () => importFile.click());

importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedState = JSON.parse(e.target.result);
            if (importedState.hasOwnProperty('xp') && importedState.hasOwnProperty('level')) {
                state = importedState;
                saveState();
                applyTheme(state.theme);
                updateUI();
                renderHabits();
                populateJourneyDropdown();
                renderTemplates(journeySelect.value);
                updateDeadlineCountdown();
                alert("Backup importado com sucesso!");
                settingsModal.classList.remove('active');
            } else {
                alert("Arquivo de backup inválido.");
            }
        } catch (err) {
            alert("Erro ao ler o arquivo de backup.");
        }
    };
    reader.readAsText(file);
});

// --- SIMULADOR DE INATIVIDADE ---
document.getElementById('simulate-inactive-btn').addEventListener('click', () => {
    playSound('fail');
    
    const factor = state.skillsPurchased.includes('resistance') ? 0.5 : 1;
    state.treeHealth = 0; 
    triggerTreeDeath();
    
    state.habits.forEach(h => h.completed = false);
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    state.lastActivityDate = yesterday.toDateString();
    
    saveState();
    updateUI();
    renderHabits();
    
    alert(`Simulação de morte da árvore por inatividade aplicada! Vitalidade zerada, perda de ${Math.round(100 * factor)} XP e redução de gemas.`);
    settingsModal.classList.remove('active');
});

// --- ONBOARDING INICIAL ---
function initOnboarding() {
    const onboardingModal = document.getElementById('onboarding-modal');
    
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const year = endOfMonth.getFullYear();
    const month = (endOfMonth.getMonth() + 1).toString().padStart(2, '0');
    const day = endOfMonth.getDate().toString().padStart(2, '0');
    document.getElementById('onboard-project-deadline').value = `${year}-${month}-${day}`;
    
    document.getElementById('onboard-project-name').value = "";
    document.getElementById('onboard-habit-1').value = "";
    document.getElementById('onboard-habit-2').value = "";
    document.getElementById('onboard-habit-3').value = "";
    
    onboardingModal.classList.add('active');
}

document.getElementById('start-onboard-btn').addEventListener('click', () => {
    const pName = document.getElementById('onboard-project-name').value.trim();
    const pDeadline = document.getElementById('onboard-project-deadline').value;
    const journeyVal = document.getElementById('onboard-journey-select').value;
    
    const h1 = document.getElementById('onboard-habit-1').value.trim();
    const h2 = document.getElementById('onboard-habit-2').value.trim();
    const h3 = document.getElementById('onboard-habit-3').value.trim();
    
    if (!pName) {
        alert("Por favor, dê um nome ao seu objetivo!");
        return;
    }
    if (!pDeadline) {
        alert("Por favor, estipule um prazo final para cobrar a si mesmo!");
        return;
    }

    state.projectName = pName;
    state.projectDeadline = pDeadline;
    
    state.habits[0].text = h1 || "Abrir o arquivo e ler uma página";
    state.habits[1].text = h2 || "Escrever pelo menos uma frase nova";
    state.habits[2].text = h3 || "Organizar mesa de trabalho por 2 min";
    
    state.habits.forEach(h => h.completed = false);
    state.lastActivityDate = new Date().toDateString();
    
    journeySelect.value = journeyVal;
    
    document.getElementById('onboarding-modal').classList.remove('active');
    
    if (state.gems === 0) state.gems = 100;
    
    saveState();
    playSound('levelup');
    triggerConfetti();
    
    applyTheme(state.theme);
    updateUI();
    renderHabits();
    populateJourneyDropdown();
    renderTemplates(journeyVal);
    updateDeadlineCountdown();
    
    alert(`Objetivo "${pName}" registrado com sucesso! Plante novas conquistas focando.`);
});

// --- INICIALIZAÇÃO DO APP ---
window.DOMContentLoaded = () => {
    const isFirstTime = !localStorage.getItem('pragma_state');
    
    loadState();
    checkUrlBrand();
    applyTheme(state.theme);
    
    if (isFirstTime) {
        initOnboarding();
    } else {
        checkDailyDecline();
        updateUI();
        renderHabits();
        populateJourneyDropdown();
        renderTemplates(journeySelect.value);
        updateDeadlineCountdown();
    }
    
    setInterval(updateDeadlineCountdown, 60000);
    startIdleMonitoring();
};
