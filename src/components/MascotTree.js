"use client";

export default function MascotTree({ treeHealth, totalFocusMinutes }) {
  return (
    <div className="p-6 bg-white border-2 border-[#d9e2ec] border-b-4 rounded-2xl flex items-center justify-between relative overflow-hidden">
      <div className="flex flex-col gap-2 z-10">
        <span className="text-[10px] uppercase font-black tracking-widest text-[#9fb3c8]">Tempo Focado</span>
        <div className="text-2xl md:text-3xl font-black text-[#0f2d4a] leading-none">
          {totalFocusMinutes} <span className="text-xs font-bold text-[#627d98]">minutos</span>
        </div>
        <span className="text-[10px] font-black text-[#10b981]">Saúde do Mascotinho: {treeHealth}%</span>
        
        {/* Barra de progresso */}
        <div className="w-28 h-2.5 bg-[#d9e2ec] rounded-full overflow-hidden mt-1">
          <div className="h-full bg-[#10b981] transition-all duration-500" style={{ width: `${treeHealth}%` }}></div>
        </div>
      </div>

      {/* Ilustração do Mascotinho */}
      <div className="w-16 h-16 flex items-center justify-center bg-[#f2f6f4] border-2 border-[#d9e2ec] rounded-2xl p-2 z-10">
        <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-300 ${treeHealth <= 0 ? "grayscale opacity-45" : ""}`}>
          {/* Chão */}
          <path d="M20,80 Q50,78 80,80" stroke="#9fb3c8" strokeWidth="4" fill="none" />
          {/* Tronco */}
          <path d="M50,80 L50,48" stroke="#627d98" strokeWidth="7" strokeLinecap="round" />
          
          {/* Copa (Folhas) */}
          <circle cx="50" cy="38" r="18" fill="#10b981" />
          <circle cx="36" cy="46" r="14" fill="#059669" />
          <circle cx="64" cy="44" r="14" fill="#10b981" />

          {/* Expressões do Mascote (Olhos e Boca) */}
          {treeHealth <= 0 ? (
            // Olhos em X e Boca Reta (Morta/Seca)
            <>
              <path d="M40,38 L48,46" stroke="#0f2d4a" strokeWidth="3" strokeLinecap="round" />
              <path d="M48,38 L40,46" stroke="#0f2d4a" strokeWidth="3" strokeLinecap="round" />
              <path d="M54,38 L62,46" stroke="#0f2d4a" strokeWidth="3" strokeLinecap="round" />
              <path d="M62,38 L54,46" stroke="#0f2d4a" strokeWidth="3" strokeLinecap="round" />
              <path d="M44,56 L58,56" stroke="#0f2d4a" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : treeHealth < 50 ? (
            // Olhos Preocupados e Boca Triste (Saúde Baixa)
            <>
              <circle cx="43" cy="42" r="3.5" fill="#0f2d4a" />
              <circle cx="57" cy="42" r="3.5" fill="#0f2d4a" />
              <path d="M40,35 Q44,32 47,35" stroke="#0f2d4a" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M53,35 Q56,32 60,35" stroke="#0f2d4a" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M46,55 Q50,50 54,55" stroke="#0f2d4a" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ) : (
            // Olhos Felizes com Brilho e Sorriso Aberto (Saudável)
            <>
              <circle cx="43" cy="42" r="4.5" fill="#0f2d4a" />
              <circle cx="44.5" cy="40.5" r="1.5" fill="#ffffff" />
              <circle cx="57" cy="42" r="4.5" fill="#0f2d4a" />
              <circle cx="58.5" cy="40.5" r="1.5" fill="#ffffff" />
              <path d="M45,52 Q50,60 55,52" stroke="#0f2d4a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
