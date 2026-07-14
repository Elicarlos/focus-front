// Cada árvore é um objeto. Para adicionar uma nova, basta inserir aqui.
// O sistema cuida do resto.

export const TREE_TYPES = [
  {
    id: "carvalho",
    name: "Carvalho",
    desc: "Robusto e confiável",
    unlock: { type: "default" }, // todos começam com ele
    colors: { trunk: "#6b4c1e", leaves: ["#16a34a", "#15803d", "#22c55e", "#4ade80"], highlight: "rgba(255,255,255,0.18)" },
  },
  {
    id: "cerejeira",
    name: "Cerejeira",
    desc: "Floresce com consistência",
    unlock: { type: "streak", value: 7 },
    colors: { trunk: "#7c4a3a", leaves: ["#f472b6", "#ec4899", "#f9a8d4", "#fbcfe8"], highlight: "rgba(255,255,255,0.25)" },
    particles: { type: "petals", color: "#f9a8d4", count: 6 },
  },
  {
    id: "pinheiro",
    name: "Pinheiro",
    desc: "Resistente ao frio",
    unlock: { type: "sessions", value: 50 },
    colors: { trunk: "#5c3d2e", leaves: ["#065f46", "#047857", "#059669", "#10b981"], highlight: "rgba(255,255,255,0.1)" },
    shape: "pine",
  },
  {
    id: "bambu",
    name: "Bambu",
    desc: "Flexível e resiliente",
    unlock: { type: "xp", value: 500 },
    colors: { trunk: "#4d7c0f", leaves: ["#65a30d", "#84cc16", "#a3e635", "#d9f99d"], highlight: "rgba(255,255,255,0.2)" },
    shape: "bamboo",
    particles: { type: "leaves", color: "#84cc16", count: 4 },
  },
  {
    id: "ipe",
    name: "Ipê",
    desc: "Floresce com dedicação",
    unlock: { type: "sessions", value: 100 },
    colors: { trunk: "#5c3d2e", leaves: ["#9333ea", "#a855f7", "#c084fc", "#e9d5ff"], highlight: "rgba(255,255,255,0.25)" },
    particles: { type: "petals", color: "#c084fc", count: 8 },
  },
  {
    id: "dourada",
    name: "Árvore Dourada",
    desc: "A lendária",
    unlock: { type: "xp", value: 1000 },
    colors: { trunk: "#92400e", leaves: ["#b45309", "#d97706", "#f59e0b", "#fbbf24"], highlight: "rgba(255,255,255,0.35)" },
    particles: { type: "sparkles", color: "#fbbf24", count: 5 },
    glow: true,
  },
];

// Verifica se o usuário desbloqueou uma árvore
export function isTreeUnlocked(tree, stats) {
  if (tree.unlock.type === "default") return true;
  if (tree.unlock.type === "streak") return stats.streak >= tree.unlock.value;
  if (tree.unlock.type === "sessions") return stats.totalSessions >= tree.unlock.value;
  if (tree.unlock.type === "xp") return stats.totalXP >= tree.unlock.value;
  return false;
}

// Retorna a árvore desbloqueada mais recente
export function getCurrentTree(stats) {
  const unlocked = TREE_TYPES.filter(t => isTreeUnlocked(t, stats));
  return unlocked[unlocked.length - 1] || TREE_TYPES[0];
}

// Próxima árvore a desbloquear
export function getNextTree(stats) {
  const locked = TREE_TYPES.filter(t => !isTreeUnlocked(t, stats));
  return locked[0] || null;
}

// Progresso até a próxima árvore (0-100)
export function getTreeProgress(stats) {
  const next = getNextTree(stats);
  if (!next) return 100;

  if (next.unlock.type === "streak") {
    return Math.min(100, (stats.streak / next.unlock.value) * 100);
  }
  if (next.unlock.type === "sessions") {
    return Math.min(100, (stats.totalSessions / next.unlock.value) * 100);
  }
  if (next.unlock.type === "xp") {
    return Math.min(100, (stats.totalXP / next.unlock.value) * 100);
  }
  return 0;
}
