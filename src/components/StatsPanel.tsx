// Player Stats & Status Panel Component
import React from 'react';
import { User, Bot, RotateCcw, Lightbulb, RefreshCw, Cpu } from 'lucide-react';
import { GameMode, Player } from '../types';

interface StatsPanelProps {
  currentPlayer: Player;
  gameMode: GameMode;
  p1Name?: string;
  p2Name?: string;
  p1StonesReserve: number;
  p2StonesReserve: number;
  p1StonesOnBoard: number;
  p2StonesOnBoard: number;
  p1Wins: number;
  p2Wins: number;
  isAiThinking: boolean;
  onUndo?: () => void;
  onHint?: () => void;
  onRestart: () => void;
  canUndo?: boolean;
  statusMessage: string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  currentPlayer,
  gameMode,
  p1Name = '1. Oyuncu',
  p2Name = '2. Oyuncu',
  p1StonesReserve,
  p2StonesReserve,
  p1StonesOnBoard,
  p2StonesOnBoard,
  p1Wins,
  p2Wins,
  isAiThinking,
  onUndo,
  onHint,
  onRestart,
  canUndo = false,
  statusMessage,
}) => {
  return (
    <div className="w-full max-w-[500px] mx-auto flex flex-col gap-2 shrink-0 select-none">
      
      {/* Player Scoreboard */}
      <div className="bg-[#FFFDF9] border border-[#D4C3B3] rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-2 shadow-sm">
        
        {/* Player 1 (Ivory Gold) */}
        <div
          className={`flex-1 flex items-center gap-2 p-2 rounded-xl transition-all ${
            currentPlayer === 'P1'
              ? 'bg-[#7A4219] text-[#FFF8E7] shadow-md ring-2 ring-[#D4AF37]'
              : 'bg-[#FAF6F0] text-[#6E4223] border border-[#D4C3B3]'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] border border-[#FFF] flex items-center justify-center text-[#2C1810] shrink-0 font-bold">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-xs truncate">
              {p1Name}
            </div>
            <div className="text-[10px] opacity-90 font-bold">
              Elde: {p1StonesReserve} | Tahtada: {p1StonesOnBoard}
            </div>
          </div>
        </div>

        {/* Center Score */}
        <div className="flex flex-col items-center justify-center px-1">
          <div className="bg-[#FAF6F0] border border-[#D4C3B3] px-2.5 py-1 rounded-xl text-xs font-black text-[#2C1810] font-mono tracking-wider flex items-center gap-1.5 shadow-inner">
            <span className="text-[#7A4219]">{p1Wins}</span>
            <span>:</span>
            <span className="text-[#2C1810]">{p2Wins}</span>
          </div>
          {isAiThinking && (
            <div className="text-[9px] font-bold text-[#7A4219] animate-pulse flex items-center gap-1 mt-1">
              <Cpu className="w-3 h-3 animate-spin" />
              <span>Düşünüyor</span>
            </div>
          )}
        </div>

        {/* Player 2 (Ebony Slate) */}
        <div
          className={`flex-1 flex items-center gap-2 p-2 rounded-xl transition-all ${
            currentPlayer === 'P2'
              ? 'bg-[#7A4219] text-[#FFF8E7] shadow-md ring-2 ring-[#D4AF37]'
              : 'bg-[#FAF6F0] text-[#6E4223] border border-[#D4C3B3]'
          }`}
        >
          <div className="min-w-0 flex-1 text-right">
            <div className="font-extrabold text-xs truncate">
              {gameMode === 'vs-ai' ? 'Yapay Zeka' : p2Name}
            </div>
            <div className="text-[10px] opacity-90 font-bold">
              Elde: {p2StonesReserve} | Tahtada: {p2StonesOnBoard}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#2C1810] border border-[#D4AF37] flex items-center justify-center text-[#FFF8E7] shrink-0 font-bold">
            {gameMode === 'vs-ai' ? <Bot className="w-4 h-4 text-[#D4AF37]" /> : <User className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-[#FFFDF9] border border-[#D4C3B3] rounded-xl px-3 py-1.5 text-center shadow-xs">
        <p className="text-xs font-bold text-[#7A4219]">
          {statusMessage}
        </p>
      </div>

      {/* Quick Action Controls (Hint, Undo, Restart) */}
      <div className="flex items-center justify-end gap-2">
        {onHint && (
          <button
            onClick={onHint}
            disabled={isAiThinking}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFFDF9] border border-[#D4C3B3] text-xs font-bold text-[#7A4219] hover:bg-[#7A4219]/10 disabled:opacity-40 transition-colors cursor-pointer shadow-xs"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>İpucu</span>
          </button>
        )}

        {onUndo && (
          <button
            onClick={onUndo}
            disabled={!canUndo || isAiThinking}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFFDF9] border border-[#D4C3B3] text-xs font-bold text-[#7A4219] hover:bg-[#7A4219]/10 disabled:opacity-40 transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Geri Al</span>
          </button>
        )}

        <button
          onClick={onRestart}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFFDF9] border border-[#D4C3B3] text-xs font-bold text-[#7A4219] hover:bg-[#7A4219]/10 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Yeniden Başlat</span>
        </button>
      </div>
    </div>
  );
};
