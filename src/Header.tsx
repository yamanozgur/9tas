// Navigation & Game Header Component
import React from 'react';
import { ArrowLeft, HelpCircle, RefreshCw, Trophy } from 'lucide-react';
import { UserProfile } from '../lib/firebase';

interface HeaderProps {
  onBackToMenu: () => void;
  onOpenRules: () => void;
  onOpenLeaderboard?: () => void;
  onResetGame: () => void;
  currentUser: UserProfile | null;
  modeLabel: string;
}

export const Header: React.FC<HeaderProps> = ({
  onBackToMenu,
  onOpenRules,
  onOpenLeaderboard,
  onResetGame,
  modeLabel,
}) => {
  return (
    <header className="w-full bg-[#FFFDF9] border-b border-[#D4C3B3] text-[#2C1810] px-4 py-2.5 z-40 shrink-0 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Back to Menu */}
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#D4C3B3] text-xs font-bold text-[#7A4219] hover:bg-[#7A4219]/10 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Menü</span>
        </button>

        {/* Center: Title & Mode */}
        <div className="text-center">
          <h1 className="text-base sm:text-lg font-black text-[#2C1810] tracking-wider font-serif">
            DOKUZ TAŞ
          </h1>
          <span className="text-[10px] sm:text-xs text-[#7A4219] font-semibold block -mt-0.5">
            {modeLabel}
          </span>
        </div>

        {/* Right: Reset, Leaderboard & Rules */}
        <div className="flex items-center gap-1.5">
          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              title="Sıralama"
              className="p-2 rounded-xl bg-[#FAF6F0] border border-[#D4C3B3] text-[#7A4219] hover:bg-[#7A4219]/10 transition-colors cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-[#D4AF37]" />
            </button>
          )}

          <button
            onClick={onResetGame}
            title="Oyunu Sıfırla"
            className="p-2 rounded-xl bg-[#FAF6F0] border border-[#D4C3B3] text-[#7A4219] hover:bg-[#7A4219]/10 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenRules}
            title="Kurallar"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#7A4219] text-[#FFF8E7] font-bold text-xs hover:bg-[#8B5A2B] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">Kurallar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
