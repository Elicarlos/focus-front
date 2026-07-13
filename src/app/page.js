import Link from "next/link";

export const metadata = {
  title: "Pragma | Simplifique seus Objetivos com Foco",
  description: "Diga adeus à procrastinação e distrações com uma central de foco limpa e gamificada baseada em micro-hábitos e timers amigáveis.",
  openGraph: {
    title: "Pragma | Central de Foco & Produtividade",
    description: "SaaS de produtividade amigável e gamificada para ajudar você a manter o foco sem esforço.",
    url: "https://geraqrcode.com.br",
    siteName: "Pragma Focus",
    locale: "pt_BR",
    type: "website",
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7faf7] text-[#3c3c3c] flex flex-col font-sans selection:bg-[#58cc02] selection:text-white">
      {/* Header */}
      <header className="max-w-5xl mx-auto w-full px-6 py-6 flex justify-between items-center border-b-2 border-[#e5e5e5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#58cc02] flex items-center justify-center shadow-[0_4px_0_#46a302]">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ffffff" strokeWidth="3">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="font-black text-2xl tracking-wider text-[#58cc02]">PRAGMA</span>
        </div>
        <Link href="/dashboard" className="px-5 py-3 rounded-2xl btn-duo-white text-xs text-center border-b-4">
          Entrar no App
        </Link>
      </header>

      {/* Hero Section */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center flex-1 flex flex-col justify-center items-center">
        <span className="px-4 py-2 rounded-2xl bg-[#58cc02]/10 text-[#46a302] text-xs font-black uppercase tracking-wider mb-6 border-2 border-[#58cc02]/20">
          PRODUTIVIDADE SEM COMPLICAÇÕES
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6 text-[#3c3c3c]">
          Mantenha o foco de um jeito <br />
          <span className="text-[#58cc02]">divertido e leve!</span>
        </h1>
        <p className="text-base md:text-lg text-[#777777] max-w-lg mx-auto mb-10 font-bold leading-relaxed">
          Sem telas pretas assustadoras ou relatórios complicados. Cultive seu mascotinho de árvore, complete sessões de estudo curtas e combata a distração com simplicidade.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <Link href="/dashboard" className="px-8 py-4 rounded-2xl btn-duo-green text-sm flex-1 text-center">
            Começar Grátis
          </Link>
          <a href="#features" className="px-8 py-4 rounded-2xl btn-duo-white text-sm flex-1 text-center">
            Como funciona
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-16 border-t-2 border-[#e5e5e5]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-white border-2 border-[#e5e5e5] border-b-4 hover:translate-y-[-2px] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#58cc02]/15 text-2xl flex items-center justify-center mb-6">🌳</div>
            <h3 className="text-lg font-black mb-3 text-[#3c3c3c]">Mascotinho de Foco</h3>
            <p className="text-[#777777] text-sm font-bold leading-relaxed">
              Diga o que vai fazer e comece. Se você manter o foco, sua plantinha cresce e ganha auras divertidas!
            </p>
          </div>
          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-white border-2 border-[#e5e5e5] border-b-4 hover:translate-y-[-2px] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#1899d6]/15 text-2xl flex items-center justify-center mb-6">🏆</div>
            <h3 className="text-lg font-black mb-3 text-[#3c3c3c]">Missões Simples</h3>
            <p className="text-[#777777] text-sm font-bold leading-relaxed">
              Junte minutos focados para subir no ranking global de foco e desbloquear conquistas amigáveis.
            </p>
          </div>
          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-white border-2 border-[#e5e5e5] border-b-4 hover:translate-y-[-2px] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#ff9600]/15 text-2xl flex items-center justify-center mb-6">✍️</div>
            <h3 className="text-lg font-black mb-3 text-[#3c3c3c]">Espaço Livre de Ansiedade</h3>
            <p className="text-[#777777] text-sm font-bold leading-relaxed">
              Um bloco simples para você descarregar qualquer pensamento ansioso antes de começar o timer. Limpe sua mente.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full px-6 py-8 mt-auto text-center border-t-2 border-[#e5e5e5] text-xs font-bold text-[#afafaf]">
        &copy; {new Date().getFullYear()} Pragma Focus. A central de foco mais amigável do mundo.
      </footer>
    </div>
  );
}
