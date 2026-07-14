"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const themes = {
  dark: {
    id: "dark",
    name: "Escuro",
    bg: "#0d1117",
    card: "#161b22",
    cardHover: "#1c2333",
    border: "#21262d",
    borderLight: "#30363d",
    text: "#e6edf3",
    textMuted: "#8b949e",
    textDim: "#6b7280",
    accent: "#22c55e",
    accentLight: "#4ade80",
    accentBg: "rgba(74,222,128,0.1)",
    danger: "#f87171",
    warning: "#f97316",
    inputBg: "#0d1117",
    sidebarBg: "#161b22",
    headerBorder: "#21262d",
    timerGlow: "rgba(74,222,128,0.25)",
    victoryBg: "rgba(0,0,0,0.8)",
    modalBg: "#161b22",
    btnSecondary: "#161b22",
    btnSecondaryText: "#8b949e",
  },
  light: {
    id: "light",
    name: "Claro",
    bg: "#f8fafc",
    card: "#ecfdf5",
    cardHover: "#d1fae5",
    border: "#a7f3d0",
    borderLight: "#6ee7b7",
    text: "#0f172a",
    textMuted: "#64748b",
    textDim: "#94a3b8",
    accent: "#16a34a",
    accentLight: "#22c55e",
    accentBg: "rgba(22,163,74,0.08)",
    danger: "#dc2626",
    warning: "#ea580c",
    inputBg: "#ffffff",
    sidebarBg: "#f0fdf4",
    headerBorder: "#d1fae5",
    timerGlow: "rgba(22,163,74,0.2)",
    victoryBg: "rgba(0,0,0,0.4)",
    modalBg: "#ffffff",
    btnSecondary: "#e2e8f0",
    btnSecondaryText: "#475569",
  },
  midnight: {
    id: "midnight",
    name: "Meia-noite",
    bg: "#050810",
    card: "#0c1222",
    cardHover: "#111d35",
    border: "#152040",
    borderLight: "#1e3060",
    text: "#e0e7ff",
    textMuted: "#7986cb",
    textDim: "#4a5580",
    accent: "#6366f1",
    accentLight: "#818cf8",
    accentBg: "rgba(99,102,241,0.12)",
    danger: "#f43f5e",
    warning: "#f59e0b",
    inputBg: "#050810",
    sidebarBg: "#0a0f1e",
    headerBorder: "#152040",
    timerGlow: "rgba(99,102,241,0.3)",
    victoryBg: "rgba(0,0,0,0.9)",
    modalBg: "#0c1222",
    btnSecondary: "#0c1222",
    btnSecondaryText: "#7986cb",
  },
};

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("pragma_theme");
    if (saved && themes[saved]) setThemeId(saved);
  }, []);

  const setTheme = (id) => {
    setThemeId(id);
    localStorage.setItem("pragma_theme", id);
  };

  const theme = themes[themeId];

  return (
    <ThemeContext.Provider value={{ theme, themeId, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
