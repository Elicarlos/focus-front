import Link from "next/link";
import { Target, Trophy, FileText, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-[#f2f6f4] text-[#0f2d4a] flex flex-col font-sans antialiased selection:bg-[#10b981] selection:text-white">
      
      {/* Header */}
      <header className="w-full bg-white border-b-2 border-[#d9e2ec] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 md:h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#10b981] flex items-center justify-center shadow-[0_3px_0_#059669]">
              <Target className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
            <span className="font-black text-2xl tracking-wider text-[#0f2d4a]">PRAGMA</span>
          </div>
          <Link href="/dashboard" className="px-5 py-2.5 rounded-2xl btn-duo-blue text-xs text-center border-b-4 hover:brightness-105 active:scale-95 transition-all">
            Entrar no App
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
        
        {/* Badge */}
        <span className="px-4 py-2 rounded-2xl bg-[#10b981]/10 text-[#059669] text-xs font-black uppercase tracking-wider mb-8 border-2 border-[#10b981]/20">
          Produtividade sem complicações
        </span>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-8 text-[#0f2d4a]">
          Mantenha o foco de um jeito <br className="hidden md:inline" />
          <span className="text-[#10b981] relative">
            divertido e leve!
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-[#627d98] max-w-xl mx-auto mb-10 font-bold leading-relaxed">
          Sem telas pretas ou relatórios complicados. Cultive seu mascotinho de árvore, complete sessões curtas de foco e afaste as distrações com simplicidade.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md mb-20">
          <Link href="/dashboard" className="px-8 py-4 rounded-2xl btn-duo-green text-sm text-center flex-1 hover:brightness-105 transition-all flex items-center justify-center gap-2">
            Começar Grátis <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#features" className="px-8 py-4 rounded-2xl btn-duo-white text-sm text-center flex-1 border border-[#d9e2ec] text-[#0f2d4a] hover:bg-[#fafafa] transition-all">
            Como funciona
          </a>
        </div>

        {/* Features Section */}
        <section id="features" className="w-full pt-12 border-t-2 border-[#d9e2ec]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border-2 border-[#d9e2ec] border-b-4 hover:translate-y-[-2px] transition-all duration-200">
              <div className="w-12 h-12 rounded-2xl bg-[#10b981]/10 text-2xl flex items-center justify-center mb-5 font-black text-[#10b981] border border-[#10b981]/20">
                🌳
              </div>
              <h3 className="text-lg font-black mb-2 text-[#0f2d4a]">Mascotinho de Foco</h3>
              <p className="text-[#627d98] text-sm font-bold leading-relaxed">
                Escreva o que vai fazer e inicie o timer. A sua plantinha reage à sua dedicação e fica feliz ao ver seu foco.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border-2 border-[#d9e2ec] border-b-4 hover:translate-y-[-2px] transition-all duration-200">
              <div className="w-12 h-12 rounded-2xl bg-[#0284c7]/10 text-2xl flex items-center justify-center mb-5 font-black text-[#0284c7] border border-[#0284c7]/20">
                🏆
              </div>
              <h3 className="text-lg font-black mb-2 text-[#0f2d4a]">Ranking Semanal</h3>
              <p className="text-[#627d98] text-sm font-bold leading-relaxed">
                Acumule minutos focados e dispute posições no ranking semanal global com outros usuários focados.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border-2 border-[#d9e2ec] border-b-4 hover:translate-y-[-2px] transition-all duration-200">
              <div className="w-12 h-12 rounded-2xl bg-[#f97316]/10 text-2xl flex items-center justify-center mb-5 font-black text-[#f97316] border border-[#f97316]/20">
                ✍️
              </div>
              <h3 className="text-lg font-black mb-2 text-[#0f2d4a]">Limpeza Mental</h3>
              <p className="text-[#627d98] text-sm font-bold leading-relaxed">
                Use o espaço de notas temporárias para descarregar distrações e preocupações, mantendo seu cérebro focado.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t-2 border-[#d9e2ec] py-8 text-center text-xs font-black text-[#9fb3c8] mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} Pragma Focus.</span>
          <span className="text-[#627d98]">A central de foco mais divertida do mundo.</span>
        </div>
      </footer>
    </div>
  );
}
