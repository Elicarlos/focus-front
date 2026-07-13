import Link from "next/link";
import { Target, Trophy, ArrowRight, Zap, Timer } from "lucide-react";

export const metadata = {
  title: "Grove — Vença a Procrastinação",
  description: "O app de foco que te faz agir. Timer Pomodoro, mascote que cresce com você, ranking global.",
  openGraph: {
    title: "Grove — Vença a Procrastinação",
    description: "Foco profundo, sem complicação. Comece agora.",
    url: "https://geraqrcode.com.br",
    siteName: "Grove",
    locale: "pt_BR",
    type: "website",
  }
};

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "Outfit, sans-serif", display: "flex", flexDirection: "column" }}>

      {/* ── HEADER ── */}
      <header style={{ borderBottom: "1px solid #21262d", position: "sticky", top: 0, zIndex: 50, background: "rgba(13,17,23,0.96)", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Target size={16} color="white" strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 900, fontSize: 18, color: "white", letterSpacing: "-0.03em" }}>Grove</span>
          </div>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 10, background: "#22c55e", color: "white", fontWeight: 900, fontSize: 14, textDecoration: "none" }}>
            Abrir App <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <main style={{ flex: 1 }}>

        {/* ── HERO ── */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>

            {/* Texto */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "#4ade80", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
                <Zap size={12} fill="#4ade80" /> Anti-procrastinação · Foco Profundo
              </div>
              <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", color: "white", margin: "0 0 20px" }}>
                  Pare de adiar.<br />
                  <span style={{ color: "#4ade80" }}>Comece agora.</span>
                </h1>
                <p style={{ fontSize: 16, color: "#8b949e", lineHeight: 1.7, margin: "0 0 32px", fontWeight: 500 }}>
                  Grove transforma foco em crescimento. Timer Pomodoro, mascote que evolui com você e ranking global.
                </p>
              <div style={{ display: "flex", gap: 12 }}>
                <Link href="/dashboard" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 24px", borderRadius: 12, background: "#22c55e", color: "white", fontWeight: 900, fontSize: 14, textDecoration: "none" }}>
                  <Zap size={16} fill="white" /> Começar Agora
                </Link>
                <a href="#como-funciona" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 24px", borderRadius: 12, background: "#161b22", color: "#c9d1d9", fontWeight: 700, fontSize: 14, textDecoration: "none", border: "1px solid #30363d" }}>
                  Como funciona
                </a>
              </div>
            </div>

            {/* Preview árvore */}
            <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", height: 340, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 200, height: 100, background: "rgba(74,222,128,0.08)", filter: "blur(40px)", borderRadius: "50%" }} />
              <svg viewBox="0 0 120 140" width="180" height="180" className="tree-sway" style={{ overflow: "visible", position: "relative", zIndex: 1 }}>
                <ellipse cx="60" cy="132" rx="22" ry="5" fill="#21262d" />
                <rect x="54" y="90" width="12" height="42" rx="6" fill="#6b4c1e" />
                <circle cx="60" cy="60" r="32" fill="#16a34a" />
                <circle cx="38" cy="74" r="22" fill="#15803d" />
                <circle cx="82" cy="72" r="22" fill="#15803d" />
                <circle cx="60" cy="46" r="20" fill="#22c55e" />
                <circle cx="47" cy="55" r="13" fill="#4ade80" opacity="0.6" />
                <circle cx="73" cy="53" r="11" fill="#4ade80" opacity="0.5" />
                <circle cx="46" cy="40" r="6" fill="rgba(255,255,255,0.18)" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── DIVISOR ── */}
        <div style={{ borderTop: "1px solid #21262d" }} />

        {/* ── COMO FUNCIONA ── */}
        <div id="como-funciona" style={{ maxWidth: 960, margin: "0 auto", padding: "72px 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "#4ade80", marginBottom: 12 }}>Como funciona</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: "white", margin: 0, letterSpacing: "-0.02em" }}>Três passos. Zero complicação.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { icon: <Target size={20} />, step: "01", title: "Defina o Foco", desc: "Escreva UMA coisa que você vai fazer agora. Clareza é 50% da batalha." },
              { icon: <Timer size={20} />, step: "02", title: "Timer — 25 Minutos", desc: "Inicie a sessão. A árvore cresce. O timer mantém você na linha." },
              { icon: <Trophy size={20} />, step: "03", title: "Ganhe e Evolua", desc: "Acumule minutos, suba de nível e apareça no ranking global." },
            ].map((item) => (
              <div key={item.step} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80" }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: 28, fontWeight: 900, color: "#21262d" }}>{item.step}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: "white", margin: "0 0 8px" }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: "#6e7681", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── DIVISOR ── */}
        <div style={{ borderTop: "1px solid #21262d" }} />

        {/* ── CTA FINAL ── */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "72px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: "white", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Pronto para parar de procrastinar?</h2>
          <p style={{ fontSize: 14, color: "#6e7681", margin: "0 0 32px", lineHeight: 1.6 }}>Sem cadastro. Sem tutorial longo. Abra e comece.</p>
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: 16, background: "#22c55e", color: "white", fontWeight: 900, fontSize: 16, textDecoration: "none" }}>
            <Zap size={18} fill="white" /> Começar Agora — É Grátis
          </Link>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #21262d", padding: "28px 32px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#484f58" }}>
        © {new Date().getFullYear()} Pragma · Foco é poder.
      </footer>

    </div>
  );
}
