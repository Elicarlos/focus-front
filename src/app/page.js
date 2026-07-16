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
              <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", color: "white", margin: "0 0 20px" }}>
                  A procrastinação não é preguiça —<br />
                  <span style={{ color: "#4ade80" }}>é regulação emocional.</span>
                </h1>
                <p style={{ fontSize: 15, color: "#8b949e", lineHeight: 1.6, margin: "0 0 32px", fontWeight: 500 }}>
                  Vença o bloqueio inicial em 5 minutos com foco baseado em ciência. Pomodoro intuitivo, mascote que cresce com você e ranking global.
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

        {/* ── TABELA COMPARATIVA ── */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "72px 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "#4ade80", marginBottom: 12 }}>Comparativo</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: "white", margin: 0, letterSpacing: "-0.02em" }}>Por que escolher o Grove?</h2>
          </div>
          
          <div style={{ overflowX: "auto", border: "1px solid #30363d", borderRadius: 16, background: "#161b22" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #30363d", background: "#0d1117" }}>
                  <th style={{ padding: "16px 24px", fontWeight: 900, color: "white" }}>Funcionalidade</th>
                  <th style={{ padding: "16px 24px", fontWeight: 900, color: "#8b949e" }}>Grove Grátis</th>
                  <th style={{ padding: "16px 24px", fontWeight: 900, color: "#4ade80" }}>Grove PRO</th>
                  <th style={{ padding: "16px 24px", fontWeight: 900, color: "#8b949e" }}>Outros Apps</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Sessões de Foco Diárias", free: "4 sessões", pro: "Ilimitado", others: "Ilimitado" },
                  { name: "Check-in Emocional (Científico)", free: "Sim", pro: "Sim", others: "Não" },
                  { name: "Espécies de Árvore Mascote", free: "1 espécie (Carvalho)", pro: "6 espécies exclusivas", others: "Sem mascotes" },
                  { name: "Ranking Global", free: "Não", pro: "Sim", others: "Não" },
                  { name: "Sons de Foco Premium", free: "Não", pro: "Sim (Áudios Zen/Lo-Fi)", others: "Requer compras extras" },
                  { name: "Espaço do Bosque", free: "Máx. 10 árvores", pro: "Ilimitado", others: "Sem bosque visual" },
                  { name: "Preço", free: "Grátis (4 sessões/dia)", pro: "R$ 9,90/mês (Anual) ou R$ 14,90/mês", others: "R$ 29,90+ / mês" }
                ].map((row, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #21262d", background: index % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                    <td style={{ padding: "16px 24px", color: "white", fontWeight: 700 }}>{row.name}</td>
                    <td style={{ padding: "16px 24px", color: "#8b949e" }}>{row.free}</td>
                    <td style={{ padding: "16px 24px", color: "#4ade80", fontWeight: 900 }}>{row.pro}</td>
                    <td style={{ padding: "16px 24px", color: "#8b949e" }}>{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── DIVISOR ── */}
        <div style={{ borderTop: "1px solid #21262d" }} />

        {/* ── SEÇÃO DE PREÇOS ── */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "72px 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "#4ade80", marginBottom: 12 }}>Planos</div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: "white", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Escolha o plano ideal para você</h2>
            <p style={{ fontSize: 14, color: "#6e7681", margin: 0, lineHeight: 1.6 }}>Comece grátis e faça upgrade quando quiser desbloquear todo o potencial.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, maxWidth: 640, margin: "0 auto" }}>
            {/* Plano Free */}
            <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8b949e", marginBottom: 8 }}>Grátis</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "white", marginBottom: 4 }}>R$ 0</div>
              <div style={{ fontSize: 13, color: "#6e7681", marginBottom: 20 }}>Para sempre</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <li style={{ fontSize: 13, color: "#c9d1d9", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#4ade80" }}>✓</span> 4 sessões de foco por dia
                </li>
                <li style={{ fontSize: 13, color: "#c9d1d9", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#4ade80" }}>✓</span> Check-in emocional
                </li>
                <li style={{ fontSize: 13, color: "#c9d1d9", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#4ade80" }}>✓</span> 1 espécie de árvore
                </li>
                <li style={{ fontSize: 13, color: "#c9d1d9", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#4ade80" }}>✓</span> Bosque com até 10 árvores
                </li>
              </ul>
              <Link href="/dashboard" style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 20px", borderRadius: 10, background: "#21262d", color: "#c9d1d9", fontWeight: 700, fontSize: 13, textDecoration: "none", border: "1px solid #30363d", transition: "all 0.2s" }}>
                Começar Grátis
              </Link>
            </div>

            {/* Plano PRO */}
            <div style={{ background: "#161b22", border: "2px solid #22c55e", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", position: "relative" }}>
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#22c55e", color: "white", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 12px", borderRadius: 20 }}>Mais Popular</div>
              <div style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4ade80", marginBottom: 8 }}>PRO</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "white", marginBottom: 4 }}>R$ 9,90<span style={{ fontSize: 14, fontWeight: 600, color: "#8b949e" }}>/mês</span></div>
              <div style={{ fontSize: 13, color: "#6e7681", marginBottom: 20 }}>Plano anual (economize 34%)</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <li style={{ fontSize: 13, color: "#c9d1d9", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#4ade80" }}>✓</span> Sessões ilimitadas
                </li>
                <li style={{ fontSize: 13, color: "#c9d1d9", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#4ade80" }}>✓</span> 6 espécies de árvores exclusivas
                </li>
                <li style={{ fontSize: 13, color: "#c9d1d9", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#4ade80" }}>✓</span> Ranking global
                </li>
                <li style={{ fontSize: 13, color: "#c9d1d9", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#4ade80" }}>✓</span> Sons de foco premium
                </li>
                <li style={{ fontSize: 13, color: "#c9d1d9", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#4ade80" }}>✓</span> Bosque ilimitado
                </li>
              </ul>
              <Link href="/dashboard?buy=annual" style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", borderRadius: 10, background: "#22c55e", color: "white", fontWeight: 900, fontSize: 13, textDecoration: "none", transition: "all 0.2s" }}>
                Assinar PRO Anual
              </Link>
              <Link href="/dashboard?buy=monthly" style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 20px", borderRadius: 10, background: "transparent", color: "#4ade80", fontWeight: 700, fontSize: 12, textDecoration: "none", border: "1px solid #22c55e40", transition: "all 0.2s" }}>
                ou R$ 14,90/mês (mensal)
              </Link>
            </div>
          </div>
        </div>

        {/* ── DIVISOR ── */}
        <div style={{ borderTop: "1px solid #21262d" }} />

        {/* ── CTA FINAL ── */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "72px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: "white", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Pronto para parar de procrastinar?</h2>
          <p style={{ fontSize: 14, color: "#6e7681", margin: "0 0 32px", lineHeight: 1.6 }}>Sem cadastro. Sem tutorial longo. Comece com 4 sessões grátis por dia.</p>
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: 16, background: "#22c55e", color: "white", fontWeight: 900, fontSize: 16, textDecoration: "none" }}>
            <Zap size={18} fill="white" /> Começar Agora — É Grátis
          </Link>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #21262d", padding: "40px 32px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#8b949e", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          <a href="https://geraqrcode.com.br" target="_blank" rel="noopener noreferrer" style={{ color: "#8b949e", textDecoration: "none", transition: "color 0.2s" }}>Gera QR Code</a>
          <a href="https://gerador-planos.com.br" target="_blank" rel="noopener noreferrer" style={{ color: "#8b949e", textDecoration: "none", transition: "color 0.2s" }}>Gerador de Planos de Aula</a>
          <a href="https://focus-front.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: "#8b949e", textDecoration: "none", transition: "color 0.2s" }}>Grove Foco</a>
        </div>
        <div style={{ color: "#484f58" }}>
          © {new Date().getFullYear()} Pragma · Foco é poder.
        </div>
      </footer>

    </div>
  );
}
