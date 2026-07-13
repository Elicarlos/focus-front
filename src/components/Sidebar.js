"use client";

import { Target, Timer, Trophy, Calendar, LogOut } from "lucide-react";

export default function Sidebar({
  token,
  userProfile,
  googleBtnContainerRef,
  onLogout,
  onOpenRanking,
  onOpenSettings
}) {
  return (
    <aside className="w-full md:w-[260px] bg-white border-b-2 md:border-b-0 md:border-r-2 border-[#e5e5e5] flex flex-col p-6 z-10 gap-6 md:gap-8">
      {/* Brand Logo */}
      <div className="flex items-center justify-between md:justify-start gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#10b981] flex items-center justify-center shadow-[0_3px_0_#059669]">
            <Target className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
          <span className="font-black text-2xl tracking-wider text-[#0a2540]">PRAGMA</span>
        </div>

        {/* Sair Mobile */}
        {token && (
          <button 
            onClick={onLogout} 
            className="md:hidden text-xs text-red-600 hover:text-red-700 font-extrabold flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        )}
      </div>

      {/* Google Profile / One Tap */}
      <div className="p-4 bg-[#eef3f6] border-2 border-[#d9e2ec] rounded-2xl flex flex-col gap-2">
        {!token ? (
          <div>
            <div className="text-[10px] font-black text-[#627d98] mb-2 text-center uppercase tracking-wider">Entrar na Conta</div>
            <div ref={googleBtnContainerRef} id="google-login-btn"></div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {userProfile?.avatar_url ? (
              <img src={userProfile.avatar_url} className="w-8 h-8 rounded-full border-2 border-[#10b981]" alt="Avatar" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-xs text-[#0a2540] border border-[#d9e2ec]">U</div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black truncate text-[#0a2540] flex items-center gap-1">
                {userProfile?.username}
                <span className="text-[9px] px-1 py-0.25 rounded bg-[#d9e2ec] font-normal text-[#0a2540] border border-[#d9e2ec]">
                  {userProfile?.country || "BR"}
                </span>
              </div>
              <div className="text-[10px] text-[#627d98] truncate">{userProfile?.email}</div>
            </div>
            <button 
              onClick={onLogout} 
              className="hidden md:inline text-[10px] text-red-600 hover:text-red-700 font-extrabold cursor-pointer transition-all"
            >
              Sair
            </button>
          </div>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex flex-row md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none flex-1">
        <button className="flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl btn-duo-green border-b-4 text-left transition-all cursor-pointer">
          <Timer className="w-4 h-4 md:w-5 md:h-5 text-white" />
          <span className="font-extrabold text-xs md:text-sm whitespace-nowrap">Dashboard Foco</span>
        </button>
        <button 
          onClick={onOpenRanking} 
          className="flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl btn-duo-white text-left transition-all cursor-pointer"
        >
          <Trophy className="w-4 h-4 md:w-5 md:h-5 text-[#9fb3c8]" />
          <span className="font-extrabold text-xs md:text-sm text-[#627d98] hover:text-[#0a2540] whitespace-nowrap">Ranking Mundial</span>
        </button>
        <button 
          onClick={onOpenSettings} 
          className="flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl btn-duo-white text-left transition-all cursor-pointer"
        >
          <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#9fb3c8]" />
          <span className="font-extrabold text-xs md:text-sm text-[#627d98] hover:text-[#0a2540] whitespace-nowrap">Configurar Prazo</span>
        </button>
      </nav>

      <div className="hidden md:block text-[10px] text-[#9fb3c8] text-center font-bold">
        PRAGMA &bull; Mantenha o Foco
      </div>
    </aside>
  );
}
