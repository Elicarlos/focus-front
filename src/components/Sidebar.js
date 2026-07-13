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
    <aside className="w-full md:w-[260px] bg-white border-b md:border-b-0 md:border-r border-[#e5e0d8] flex flex-col p-6 z-10 gap-6 md:gap-8">
      {/* Brand Logo */}
      <div className="flex items-center justify-between md:justify-start gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#1b2d2a] flex items-center justify-center">
            <Target className="w-4 h-4 text-[#f8f7f4]" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-lg tracking-wider text-[#1b2d2a]">PRAGMA</span>
        </div>

        {/* Sair Mobile */}
        {token && (
          <button 
            onClick={onLogout} 
            className="md:hidden text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        )}
      </div>

      {/* Google Profile / One Tap */}
      <div className="p-4 bg-[#f8f7f4] border border-[#e5e0d8] rounded-xl flex flex-col gap-2">
        {!token ? (
          <div>
            <div className="text-[10px] font-black text-[#556965] mb-2 text-center uppercase tracking-wider">Entrar na Conta</div>
            <div ref={googleBtnContainerRef} id="google-login-btn"></div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {userProfile?.avatar_url ? (
              <img src={userProfile.avatar_url} className="w-8 h-8 rounded-full border border-[#2d5a27]" alt="Avatar" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-xs text-[#1b2d2a] border border-[#e5e0d8]">U</div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black truncate text-[#1b2d2a] flex items-center gap-1">
                {userProfile?.username}
                <span className="text-[9px] px-1 py-0.25 rounded bg-[#efebe4] font-normal text-[#1b2d2a] border border-[#e5e0d8]">
                  {userProfile?.country || "BR"}
                </span>
              </div>
              <div className="text-[10px] text-[#556965] truncate">{userProfile?.email}</div>
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
        <button className="flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1b2d2a] text-white font-bold text-sm text-left transition-all shadow-sm">
          <Timer className="w-4 h-4 text-[#2d5a27]" strokeWidth={2.5} />
          <span className="font-extrabold text-xs md:text-sm whitespace-nowrap">Dashboard Foco</span>
        </button>
        <button 
          onClick={onOpenRanking} 
          className="flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl btn-studio-secondary border-none bg-transparent hover:bg-[#f8f7f4] text-left transition-all cursor-pointer"
        >
          <Trophy className="w-4 h-4 text-[#556965]" />
          <span className="font-bold text-xs md:text-sm text-[#556965] hover:text-[#1b2d2a] whitespace-nowrap">Ranking Mundial</span>
        </button>
        <button 
          onClick={onOpenSettings} 
          className="flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl btn-studio-secondary border-none bg-transparent hover:bg-[#f8f7f4] text-left transition-all cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-[#556965]" />
          <span className="font-bold text-xs md:text-sm text-[#556965] hover:text-[#1b2d2a] whitespace-nowrap">Configurar Prazo</span>
        </button>
      </nav>

      <div className="hidden md:block text-[10px] text-[#9fb3c8] text-center font-bold">
        PRAGMA &bull; Mantenha o Foco
      </div>
    </aside>
  );
}
