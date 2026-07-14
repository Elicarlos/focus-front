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
  },
  light: {
    id: "light",
    name: "Claro",
    bg: "#f8fafc",
    card: "#ffffff",
    cardHover: "#f1f5f9",
    border: "#e2e8f0",
    borderLight: "#cbd5e1",
    text: "#0f172a",
    textMuted: "#64748b",
    textDim: "#94a3b8",
    accent: "#16a34a",
    accentLight: "#22c55e",
    accentBg: "rgba(22,163,74,0.08)",
    danger: "#dc2626",
    warning: "#ea580c",
    inputBg: "#f1f5f9",
    sidebarBg: "#ffffff",
    headerBorder: "#e2e8f0",
    timerGlow: "rgba(22,163,74,0.2)",
    victoryBg: "rgba(0,0,0,0.5)",
    modalBg: "#ffffff",
  },
  midnight: {
    id: "midnight",
    name: "Meia-noite",
    bg: "#0a0e1a",
    card: "#111827",
    cardHover: "#1a2332",
    border: "#1e293b",
    borderLight: "#334155",
    text: "#f1f5f9",
    textMuted: "#94a3b8",
    textDim: "#64748b",
    accent: "#3b82f6",
    accentLight: "#60a5fa",
    accentBg: "rgba(59,130,246,0.1)",
    danger: "#ef4444",
    warning: "#f59e0b",
    inputBg: "#0a0e1a",
    sidebarBg: "#111827",
    headerBorder: "#1e293b",
    timerGlow: "rgba(59,130,246,0.25)",
    victoryBg: "rgba(0,0,0,0.85)",
    modalBg: "#111827",
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
