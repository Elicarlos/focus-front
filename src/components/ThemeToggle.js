"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Palette } from "lucide-react";

export default function ThemeToggle() {
  const { theme, themeId, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        title="Mudar tema"
        style={{
          background: "none", border: `1px solid ${theme.borderLight}`,
          borderRadius: 10, padding: "6px 10px", cursor: "pointer",
          color: theme.textMuted, display: "flex", alignItems: "center", gap: 6,
          fontSize: 12, fontWeight: 700, fontFamily: "Outfit, sans-serif",
          transition: "all 0.2s"
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.text; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = theme.borderLight; e.currentTarget.style.color = theme.textMuted; }}
      >
        <Palette size={14} />
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }} />
          <div style={{
            position: "absolute", top: "100%", right: 0, marginTop: 8,
            background: "#ffffff", border: `1px solid ${theme.border}`,
            borderRadius: 12, padding: 8, zIndex: 91,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)", minWidth: 140
          }}>
            {Object.values(themes).map(t => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "8px 12px", borderRadius: 8,
                  border: "none", cursor: "pointer",
                  background: themeId === t.id ? theme.accentBg : "transparent",
                  color: themeId === t.id ? theme.accent : "#1f2937",
                  fontSize: 13, fontWeight: themeId === t.id ? 900 : 600,
                  fontFamily: "Outfit, sans-serif", transition: "all 0.15s",
                  textAlign: "left"
                }}
                onMouseEnter={e => { if (themeId !== t.id) e.currentTarget.style.background = "#f3f4f6"; }}
                onMouseLeave={e => { if (themeId !== t.id) e.currentTarget.style.background = "transparent"; }}
              >
                {t.id === "dark" && <Moon size={14} />}
                {t.id === "light" && <Sun size={14} />}
                {t.id === "midnight" && <Palette size={14} />}
                {t.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
