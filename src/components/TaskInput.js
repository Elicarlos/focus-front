"use client";

import { Calendar } from "lucide-react";

export default function TaskInput({
  currentTask,
  setCurrentTask,
  projectDeadline,
  timeLeftStr,
  onOpenSettings
}) {
  return (
    <div className="bg-white border border-[#e5e0d8] p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden shadow-sm">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase font-black tracking-widest text-[#2d5a27]">O que vamos fazer agora?</span>
        <input 
          type="text" 
          value={currentTask} 
          onChange={(e) => setCurrentTask(e.target.value)} 
          placeholder="Escreva sua meta simples aqui..."
          className="w-full bg-transparent text-base md:text-lg font-black text-[#1b2d2a] placeholder-[#9fb3c8] border-b border-[#e5e0d8] pb-2 focus:border-[#2d5a27] focus:outline-none transition-all"
        />
      </div>
      
      <div className="flex justify-between items-center text-xs font-bold text-[#556965]">
        <span 
          onClick={onOpenSettings} 
          className="cursor-pointer hover:text-[#2d5a27] transition-all flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5 text-[#2d5a27]" /> Prazo: {projectDeadline}
        </span>
        <span>Faltam {timeLeftStr.days} dias</span>
      </div>
    </div>
  );
}
