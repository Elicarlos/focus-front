import Link from "next/link";

export const metadata = {
  title: "Pragma | Conquiste seus Objetivos com Foco Pragmático",
  description: "Diga adeus à procrastinação com o Jardim de Foco: a central definitiva de produtividade com gamificação RPG, Alquimia de Resident Evil e timers Skinner.",
  openGraph: {
    title: "Pragma | Central de Foco & Produtividade",
    description: "SaaS de produtividade gamificada para TCCs, escrita criativa, programação e metas pragmáticas.",
    url: "https://geraqrcode.com.br",
    siteName: "Pragma Focus",
    locale: "pt_BR",
    type: "website",
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0e13] text-[#f4f4f7] flex flex-col font-sans selection:bg-[#ff7b00] selection:text-[#0f0e13]">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#ff7b00]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#9d4edd]/10 blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center relative z-10 border-b border-white/[0.03]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff7b00] to-[#ffaa00] flex items-center justify-center shadow-lg shadow-[#ff7b00]/20">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0f0e13" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-[#a3a3a3] bg-clip-text text-transparent">PRAGMA</span>
        </div>
        <Link href="/dashboard" className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold transition-all border border-white/10 hover:border-white/20 active:scale-95">
          Entrar no App
        </Link>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center relative z-10 flex-1 flex flex-col justify-center">
        <span className="px-4 py-1.5 rounded-full bg-[#ff7b00]/15 text-[#ff8800] text-xs font-bold uppercase tracking-wider mb-6 mx-auto border border-[#ff7b00]/30 animate-pulse">
          SaaS de Gamificação de Foco Único
        </span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
          Diga adeus à <br />
          <span className="bg-gradient-to-r from-[#ff7b00] to-[#ffb700] bg-clip-text text-transparent">Procrastinação</span>
        </h1>
        <p className="text-base md:text-lg text-[#9a99a2] max-w-xl mx-auto mb-10 leading-relaxed">
          Gerencie seus objetivos de TCC, escrita criativa, estudos e programação. Cultive seu **Jardim de Foco**, compre itens de RPG e faça Alquimia com suas mudas e adubos diários.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ff7b00] to-[#ffaa00] text-[#0f0e13] font-bold text-base transition-all hover:shadow-[0_0_30px_rgba(255,123,0,0.4)] active:scale-[0.98] text-center">
            Começar Agora Grátis
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-sm font-bold border border-white/10 hover:border-white/20 transition-all text-center">
            Conhecer Recursos
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-white/[0.03]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all hover:translate-y-[-4px]">
            <div className="w-12 h-12 rounded-2xl bg-[#ff7b00]/10 text-[#ff8800] flex items-center justify-center text-xl font-bold mb-6">🌳</div>
            <h3 className="text-xl font-bold mb-3 text-white">Jardim de Foco Único</h3>
            <p className="text-[#8e8d96] text-sm leading-relaxed">
              Plante uma semente para cada objetivo. Se você focar e cumprir seus hábitos, a árvore cresce. Se procrastinar, ela morre!
            </p>
          </div>
          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all hover:translate-y-[-4px]">
            <div className="w-12 h-12 rounded-2xl bg-[#9d4edd]/10 text-[#9d4edd] flex items-center justify-center text-xl font-bold mb-6">🧪</div>
            <h3 className="text-xl font-bold mb-3 text-white">Alquimia & RPG</h3>
            <p className="text-[#8e8d96] text-sm leading-relaxed">
              Acumule Mudas, Adubos e Essências com seus timers. Faça misturas químicas para curar sua árvore ou compre auras decorativas na Loja.
            </p>
          </div>
          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all hover:translate-y-[-4px]">
            <div className="w-12 h-12 rounded-2xl bg-[#00f5d4]/10 text-[#00f5d4] flex items-center justify-center text-xl font-bold mb-6">✍️</div>
            <h3 className="text-xl font-bold mb-3 text-white">Escrita Pragmática</h3>
            <p className="text-[#8e8d96] text-sm leading-relaxed">
              Jornadas estruturadas de TCC, escrita criativa e documentação. Escreva no fluxo livre (Freewriting) sem parar de digitar.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-8 mt-auto text-center border-t border-white/[0.03] text-xs text-[#525159]">
        &copy; {new Date().getFullYear()} Pragma Focus. Desenvolvido para alta performance acadêmica e profissional.
      </footer>
    </div>
  );
}
