"use client";

export default function TaskInput({ currentTask, setCurrentTask, onOpenSettings }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-[10px] uppercase font-black tracking-widest text-green-500 mb-1">
        Projeto Ativo
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={currentTask}
          onChange={(e) => setCurrentTask(e.target.value)}
          placeholder="No que você vai focar agora?"
          maxLength={80}
          className="bg-transparent text-lg md:text-xl font-black text-white placeholder-gray-600 border-none focus:outline-none leading-snug w-full"
          style={{ caretColor: "#4ade80" }}
        />
        <button
          onClick={onOpenSettings}
          className="text-gray-600 hover:text-green-400 transition-colors cursor-pointer shrink-0"
          title="Alterar prazo"
        >
          ✎
        </button>
      </div>
    </div>
  );
}
