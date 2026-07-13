import Link from "next/link";
import { Target, Trophy, Calendar, FileText, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Pragma | Espaço de Foco Minimalista",
  description: "Organize seus objetivos e timers em uma central de produtividade calma e sem distrações visuais.",
  openGraph: {
    title: "Pragma | Central de Foco & Produtividade",
    description: "SaaS de produtividade calmo para organizar suas metas acadêmicas, profissionais e escritas.",
    url: "https://geraqrcode.com.br",
    siteName: "Pragma Focus",
    locale: "pt_BR",
    type: "website",
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#1b2d2a] flex flex-col font-sans antialiased selection:bg-[#2d5a27] selection:text-white">
      
      {/* Header Minimalista */}
      <header className="w-full bg-transparent border-b border-[#e5e0d8] sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-8 h-16 md:h-20 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#1b2d2a] flex items-center justify-center">
              <Target className="w-4 h-4 text-[#f8f7f4]" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-lg tracking-wider text-[#1b2d2a]">PRAGMA</span>
          </div>
          <Link href="/dashboard" className="btn-studio-secondary py-2 px-4 text-xs">
            Entrar no App
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-8 py-16 md:py-24 flex-grow flex flex-col gap-24">
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Texto Hero */}
          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#2d5a27] mb-4">
              Silêncio Visual & Foco
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-[#1b2d2a]">
              Sua mente precisa <br />
              <span className="text-[#2d5a27] italic font-normal font-serif">de espaço</span> para focar.
            </h1>
            <p className="text-base md:text-lg text-[#556965] mb-8 font-medium leading-relaxed max-w-md">
              Pragma é uma central de foco simplificada projetada para eliminar o ruído digital, organizar objetivos e acompanhar o seu progresso diário de forma calma e natural.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <Link href="/dashboard" className="btn-studio-primary text-center flex-grow flex items-center justify-center gap-1.5">
                Começar a Focar <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="btn-studio-secondary text-center flex-grow">
                Conhecer a Ideia
              </a>
            </div>
          </div>

          {/* Ilustração Premium: Linha Contínua Orgânica em SVG */}
          <div className="flex items-center justify-center bg-white border border-[#e5e0d8] rounded-[24px] shadow-sm p-12 h-[300px] md:h-[400px]">
            <svg viewBox="0 0 100 100" className="w-40 h-40 opacity-80">
              {/* Single line art de uma planta minimalista */}
              <path 
                d="M50,90 Q50,70 50,40 Q45,25 35,25 Q45,20 50,30 Q55,20 65,25 Q55,25 50,40 M50,60 Q40,55 35,50 Q45,45 50,55 M50,75 Q60,70 65,65 Q55,60 50,70" 
                stroke="#1b2d2a" 
                strokeWidth="2.5" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <circle cx="50" cy="90" r="1.5" fill="#1b2d2a" />
            </svg>
          </div>
        </section>

        {/* Recursos em Cards Precisos */}
        <section id="features" className="w-full pt-16 border-t border-[#e5e0d8]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="card-studio p-8 flex flex-col gap-5">
              <div className="w-10 h-10 rounded bg-[#f0f6f3] flex items-center justify-center text-[#2d5a27]">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#1b2d2a]">Metas Claras</h3>
                <p className="text-[#556965] text-sm leading-relaxed">
                  Defina um único objetivo prioritário de cada vez. Mantenha a atenção onde ela realmente importa, sem listas infinitas de tarefas.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card-studio p-8 flex flex-col gap-5">
              <div className="w-10 h-10 rounded bg-[#f0f6f3] flex items-center justify-center text-[#2d5a27]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#1b2d2a]">Medição Silenciosa</h3>
                <p className="text-[#556965] text-sm leading-relaxed">
                  Acompanhe seus minutos focados sem gamificações infantis. A evolução da árvore reflete o seu progresso de maneira estética.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card-studio p-8 flex flex-col gap-5">
              <div className="w-10 h-10 rounded bg-[#f0f6f3] flex items-center justify-center text-[#2d5a27]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#1b2d2a]">Espaço de Notas</h3>
                <p className="text-[#556965] text-sm leading-relaxed">
                  Um bloco de rascunhos em tempo real para esvaziar a mente de ideias intrusivas, salvaguardando a sua atenção durante as sessões.
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer Minimalista */}
      <footer className="w-full bg-white border-t border-[#e5e0d8] py-8 text-xs font-semibold text-[#9fb3c8]">
        <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} Pragma Studio.</span>
          <span className="text-[#556965]">Desenvolvido para criar foco calmo e poético.</span>
        </div>
      </footer>
    </div>
  );
}
