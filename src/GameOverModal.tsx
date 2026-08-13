// Game Over & Victory Modal Component
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Award, ArrowLeft } from 'lucide-react';
import { GameMode, Player } from '../types';

interface GameOverModalProps {
  winner: Player | 'draw' | null;
  gameMode: GameMode;
  p1Name?: string;
  p2Name?: string;
  onRestart: () => void;
  onBackToMenu: () => void;
  onInspectBoard?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  gameMode,
  p1Name = '1. Oyuncu',
  p2Name = '2. Oyuncu',
  onRestart,
  onBackToMenu,
  onInspectBoard,
}) => {
  useEffect(() => {
    if (winner && winner !== 'draw') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#7A4219', '#D4AF37', '#2C1810'],
      });
    }
  }, [winner]);

  if (!winner) return null;

  const isP1 = winner === 'P1';
  const isDraw = winner === 'draw';

  const winnerTitle = isDraw
    ? 'Tebrikler, Berabere!'
    : isP1
    ? `${p1Name} KAZANDI! 🎉`
    : gameMode === 'vs-ai'
    ? 'Yapay Zeka KAZANDI!'
    : `${p2Name} KAZANDI! 🎉`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm select-none">
      <div className="bg-[#FFFDF9] border-2 border-[#7A4219] rounded-2xl p-6 w-full max-w-sm flex flex-col items-center gap-5 text-[#2C1810] shadow-2xl relative">
        <div className="w-16 h-16 rounded-2xl bg-[#7A4219]/10 border-2 border-[#7A4219] flex items-center justify-center text-[#7A4219]">
          {isDraw ? <Award className="w-8 h-8 text-[#7A4219]" /> : <Trophy className="w-8 h-8 text-[#D4AF37] animate-bounce" />}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black text-[#7A4219] font-serif">
            Oyun Bitti
          </h2>
          <p className="text-base font-extrabold text-[#2C1810] mt-1.5">
            {winnerTitle}
          </p>
        </div>

        {/* Buttons: Menü and Tekrar Oyna */}
        <div className="w-full flex flex-col gap-2.5">
          <div className="w-full flex items-center gap-2">
            <button
              onClick={onBackToMenu}
              className="flex-1 py-3 rounded-xl bg-[#FAF6F0] border border-[#D4C3B3] text-xs font-bold text-[#2C1810] hover:bg-[#E8DFD5] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#7A4219]" />
              <span>Ana Menü</span>
            </button>
            <button
              onClick={onRestart}
              className="flex-1 py-3 rounded-xl bg-[#7A4219] text-[#FFF8E7] text-xs font-black hover:bg-[#8B5A2B] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
              <span>Tekrar Oyna</span>
            </button>
          </div>

          {onInspectBoard && (
            <button
              onClick={onInspectBoard}
              className="w-full py-2 rounded-xl bg-transparent text-[#7A4219] text-xs font-bold hover:underline transition-colors text-center cursor-pointer"
            >
              Tahtayı İncele
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
