"use client";

import { FileText } from "lucide-react";

export default function Notepad({ notes, setNotes }) {
  return (
    <div className="flex-grow flex flex-col gap-2 bg-white border border-[#e5e0d8] p-5 rounded-2xl min-h-[220px] shadow-sm">
      <span className="text-[10px] uppercase font-black tracking-widest text-[#2d5a27] flex items-center gap-1.5">
        <FileText className="w-3.5 h-3.5 text-[#2d5a27]" /> Limpeza Mental
      </span>
      <textarea 
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Escreva aqui qualquer pensamento que queira tirar da cabeça antes de começar..."
        className="w-full h-full min-h-[160px] bg-transparent border-0 focus:outline-none text-sm font-bold text-[#1b2d2a] placeholder-[#9fb3c8] resize-none transition-all"
      />
    </div>
  );
}
