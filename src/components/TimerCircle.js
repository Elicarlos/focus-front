"use client";

import { Activity, RefreshCw } from "lucide-react";

export default function TimerCircle({
  timerSeconds,
  timerRunning,
  activeTimerMode,
  handleStartTimer,
  selectTimerMode,
  formatTimer,
  strokeDashoffset,
  circumference
}) {
  return (
    <div className="bg-white border border-[#e5e0d8] p-6 md:p-8 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center gap-6 md:gap-8 shadow-sm">
      
      {/* Timer Circular */}
      <div className="relative flex items-center justify-center w-[190px] h-[190px] md:w-[240px] md:h-[240px] z-10">
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="80"
            className="stroke-[#efebe4]"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="50%"
            cy="50%"
            r="80"
            className="stroke-[#2d5a27] transition-all duration-300"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl md:text-5xl font-black tracking-tight tabular-nums text-[#1b2d2a]">
            {formatTimer(timerSeconds)}
          </span>
          <span className="text-[9px] uppercase font-bold tracking-widest text-[#1b2d2a] mt-2 bg-[#efebe4] px-3.5 py-0.5 rounded-full flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 text-[#2d5a27]" /> {activeTimerMode === 1500 ? "Foco" : "Intervalo"}
          </span>
        </div>
      </div>

      {/* Controles do Timer */}
      <div className="w-full max-w-sm flex flex-col gap-4 z-10">
        <div className="flex gap-3 justify-center">
          <button 
            className={`flex-grow py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTimerMode === 1500 ? "bg-[#1b2d2a] text-white border-transparent" : "btn-studio-secondary"}`}
            onClick={() => selectTimerMode(1500)}
          >
            Focar (25m)
          </button>
          <button 
            className={`flex-grow py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTimerMode === 300 ? "bg-[#1b2d2a] text-white border-transparent" : "btn-studio-secondary"}`}
            onClick={() => selectTimerMode(300)}
          >
            Intervalo (5m)
          </button>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleStartTimer} 
            className="flex-grow py-3.5 rounded-xl btn-studio-primary text-xs font-bold tracking-wider active:scale-[0.98] transition-all cursor-pointer text-center"
          >
            {timerRunning ? "PAUSAR SESSÃO" : "INICIAR SESSÃO"}
          </button>
          <button 
            onClick={() => selectTimerMode(activeTimerMode)} 
            className="px-5 py-3.5 rounded-xl btn-studio-secondary transition-all cursor-pointer flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 text-[#556965]" />
          </button>
        </div>
      </div>
    </div>
  );
}
