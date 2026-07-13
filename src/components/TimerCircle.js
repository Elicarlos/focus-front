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
    <div className="bg-white border-2 border-[#d9e2ec] border-b-4 p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center gap-6 md:gap-8">
      
      {/* Timer Circular */}
      <div className="relative flex items-center justify-center w-[190px] h-[190px] md:w-[240px] md:h-[240px] z-10">
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="80"
            className="stroke-[#d9e2ec]"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50%"
            cy="50%"
            r="80"
            className="stroke-[#10b981] transition-all duration-300"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl md:text-6xl font-black tracking-tight tabular-nums text-[#0f2d4a]">
            {formatTimer(timerSeconds)}
          </span>
          <span className="text-[9px] uppercase font-black tracking-widest text-[#ffffff] mt-2 bg-[#10b981] px-3.5 py-0.5 rounded-full flex items-center gap-1 shadow-[0_2px_0_#059669]">
            <Activity className="w-2.5 h-2.5" /> {activeTimerMode === 1500 ? "Foco" : "Intervalo"}
          </span>
        </div>
      </div>

      {/* Controles do Timer */}
      <div className="w-full max-w-sm flex flex-col gap-4 z-10">
        <div className="flex gap-3 justify-center">
          <button 
            className={`flex-grow py-2.5 rounded-2xl text-xs font-black transition-all border-b-4 cursor-pointer ${activeTimerMode === 1500 ? "btn-duo-green" : "btn-duo-white"}`}
            onClick={() => selectTimerMode(1500)}
          >
            Focar (25m)
          </button>
          <button 
            className={`flex-grow py-2.5 rounded-2xl text-xs font-black transition-all border-b-4 cursor-pointer ${activeTimerMode === 300 ? "btn-duo-green opacity-90" : "btn-duo-white"}`}
            onClick={() => selectTimerMode(300)}
          >
            Intervalo (5m)
          </button>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleStartTimer} 
            className="flex-grow py-4 rounded-2xl btn-duo-green text-sm tracking-wider active:scale-[0.98] transition-all cursor-pointer text-center"
          >
            {timerRunning ? "PAUSAR SESSÃO" : "INICIAR AGORA!"}
          </button>
          <button 
            onClick={() => selectTimerMode(activeTimerMode)} 
            className="px-5 py-4 rounded-2xl btn-duo-white transition-all cursor-pointer flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 text-[#9fb3c8]" />
          </button>
        </div>
      </div>
    </div>
  );
}
