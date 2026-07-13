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
    <div className="bg-white border-2 border-[#d9e2ec] border-b-4 p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase font-black tracking-widest text-[#10b981]">O que vamos fazer agora?</span>
        <input 
          type="text" 
          value={currentTask} 
          onChange={(e) => setCurrentTask(e.target.value)} 
          placeholder="Escreva sua meta simples aqui..."
          className="w-full bg-transparent text-base md:text-lg font-black text-[#0f2d4a] placeholder-[#cbd5e1] border-b-2 border-[#d9e2ec] pb-2 focus:border-[#10b981] focus:outline-none transition-all"
        />
      </div>
      
      <div className="flex justify-between items-center text-xs font-bold text-[#627d98]">
        <span 
          onClick={onOpenSettings} 
          className="cursor-pointer hover:text-[#10b981] transition-all flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5 text-[#10b981]" /> Prazo: {projectDeadline}
        </span>
        <span>Faltam {timeLeftStr.days} dias</span>
      </div>
    </div>
  );
}
