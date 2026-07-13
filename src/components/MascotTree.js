"use client";

export default function MascotTree({ treeHealth, totalFocusMinutes }) {
  return (
    <div className="p-6 bg-white border border-[#e5e0d8] rounded-2xl flex items-center justify-between relative overflow-hidden shadow-sm">
      <div className="flex flex-col gap-2 z-10">
        <span className="text-[10px] uppercase font-black tracking-widest text-[#9fb3c8]">Tempo Focado</span>
        <div className="text-2xl md:text-3xl font-black text-[#1b2d2a] leading-none">
          {totalFocusMinutes} <span className="text-xs font-bold text-[#556965]">minutos</span>
        </div>
        <span className="text-[10px] font-black text-[#2d5a27]">Desenvolvimento: {treeHealth}%</span>
        
        {/* Barra de progresso */}
        <div className="w-28 h-1.5 bg-[#efebe4] rounded-full overflow-hidden mt-1">
          <div className="h-full bg-[#2d5a27] transition-all duration-500" style={{ width: `${treeHealth}%` }}></div>
        </div>
      </div>

      {/* Ilustração Poética Orgânica em SVG */}
      <div className="w-16 h-16 flex items-center justify-center bg-[#f8f7f4] border border-[#e5e0d8] rounded-xl p-2.5 z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-95">
          {treeHealth <= 0 ? (
            // Tronco Seco / Sem vida
            <path 
              d="M50,90 Q50,75 50,55 M50,70 Q46,65 44,60 M50,65 Q54,60 56,56" 
              stroke="#556965" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
            />
          ) : treeHealth < 50 ? (
            // Planta crescendo (estágio intermediário)
            <path 
              d="M50,90 Q50,70 50,45 Q44,35 38,38 Q46,30 50,38 Q54,30 62,38 Q54,35 50,45" 
              stroke="#1b2d2a" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          ) : (
            // Planta completamente florescida (estágio saudável)
            <path 
              d="M50,90 Q50,70 50,40 Q45,25 35,25 Q45,20 50,30 Q55,20 65,25 Q55,25 50,40 M50,60 Q40,55 35,50 Q45,45 50,55 M50,75 Q60,70 65,65 Q55,60 50,70" 
              stroke="#2d5a27" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          )}
          <circle cx="50" cy="90" r="1.5" fill="#1b2d2a" />
        </svg>
      </div>
    </div>
  );
}
