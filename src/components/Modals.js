"use client";

import { X, Check, Trophy, Settings } from "lucide-react";

export function SettingsModal({
  active,
  onClose,
  projectDeadline,
  setProjectDeadline,
  onSave
}) {
  if (!active) return null;
  return (
    <div className="modal-overlay active">
      <div className="modal-content">
        <div className="modal-header flex justify-between items-center pb-4 border-b border-[#e5e0d8]">
          <h3 className="font-black text-[#1b2d2a] flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#2d5a27]" /> Definir Prazo
          </h3>
          <button className="close-modal-btn font-black cursor-pointer" onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="modal-body py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#556965] font-black">Data Limite da Meta:</label>
            <input 
              type="date" 
              value={projectDeadline} 
              onChange={(e) => setProjectDeadline(e.target.value)} 
              className="w-full p-3 rounded-xl bg-[#f8f7f4] border border-[#e5e0d8] text-[#1b2d2a] font-black focus:outline-none focus:border-[#2d5a27]"
            />
          </div>
        </div>
        <div className="modal-footer pt-4 border-t border-[#e5e0d8] flex gap-3">
          <button 
            className="w-full py-3 rounded-xl btn-studio-primary text-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            onClick={onSave}
          >
            <Check className="w-4 h-4 text-white" /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export function RankingModal({ active, onClose, rankingList }) {
  if (!active) return null;
  return (
    <div className="modal-overlay active">
      <div className="modal-content max-w-sm">
        <div className="modal-header flex justify-between items-center pb-4 border-b border-[#e5e0d8]">
          <h3 className="font-black text-[#1b2d2a] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#2d5a27]" /> Ranking de Foco
          </h3>
          <button className="close-modal-btn font-black cursor-pointer" onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="modal-body py-6 flex flex-col gap-2 max-h-[400px] overflow-y-auto">
          {rankingList.map((user, idx) => (
            <div 
              key={user.username} 
              className={`flex items-center gap-3 p-3 rounded-xl border ${idx === 0 ? 'bg-[#f0f6f3] border-[#2d5a27]' : 'bg-[#f8f7f4] border-[#e5e0d8]'}`}
            >
              <span className="font-black text-sm w-5 text-center text-[#1b2d2a]">{idx + 1}</span>
              {user.avatar_url ? (
                <img src={user.avatar_url} className="w-8 h-8 rounded-full border border-[#cbdccb]" alt="Avatar" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-xs text-[#1b2d2a] border border-[#e5e0d8]">U</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black truncate text-[#1b2d2a] flex items-center gap-1.5">
                  {user.username}
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white font-normal text-[#1b2d2a] border border-[#e5e0d8]">
                    {user.country || "BR"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-[#1b2d2a]">{user.level} min</div>
              </div>
            </div>
          ))}
          {rankingList.length === 0 && (
            <div className="text-xs text-[#9fb3c8] text-center py-6">Ranking não disponível.</div>
          )}
        </div>
      </div>
    </div>
  );
}
