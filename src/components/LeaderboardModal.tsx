// Global Leaderboard Modal Component
import React, { useEffect, useState } from 'react';
import { X, Trophy, Medal, Crown, RefreshCw, User, Flame } from 'lucide-react';
import { getLeaderboard, UserProfile } from '../lib/firebase';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserUid?: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUserUid,
}) => {
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchBoard = async () => {
    setIsLoading(true);
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBoard();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-md bg-[#FFFDF9] border-2 border-[#7A4219] rounded-2xl text-[#2C1810] p-5 overflow-hidden max-h-[85vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D4C3B3]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#7A4219]/10 rounded-xl border border-[#7A4219]/30 text-[#7A4219]">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#7A4219] font-serif leading-tight">
                Liderlik Tablosu
              </h2>
              <p className="text-[11px] text-[#6E4223] font-semibold">
                Dokuz Taş En İyiler
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={fetchBoard}
              disabled={isLoading}
              title="Yenile"
              className="p-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#E8DFD5] text-[#7A4219] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#E8DFD5] text-[#2C1810] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="py-3 overflow-y-auto space-y-2 flex-1 pr-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-[#7A4219] gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-[#D4AF37]" />
              <span className="text-xs font-bold">Sıralama yükleniyor...</span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="py-12 text-center text-[#6E4223] text-xs font-semibold">
              Henüz sıralamada oyuncu bulunmuyor.
            </div>
          ) : (
            leaderboard.map((user, index) => {
              const rank = index + 1;
              const wins = user.stats?.dokuzTasWins || 0;
              const losses = user.stats?.dokuzTasLosses || 0;
              const totalGames = wins + losses;
              const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
              const isMe = currentUserUid === user.uid;

              return (
                <div
                  key={user.uid || index}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                    isMe
                      ? 'bg-[#7A4219]/15 border-[#7A4219] shadow-sm'
                      : rank === 1
                      ? 'bg-[#FFFDF3] border-[#D4AF37]/60 shadow-xs'
                      : 'bg-[#FAF6F0] border-[#D4C3B3]'
                  }`}
                >
                  {/* Rank Badge & User Info */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Rank */}
                    <div className="w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0">
                      {rank === 1 ? (
                        <div className="flex items-center justify-center w-full h-full rounded-lg bg-gradient-to-br from-[#FFD700] to-[#C59B27] text-[#1C130B] shadow-sm">
                          <Crown className="w-4 h-4 fill-current text-[#1C130B]" />
                        </div>
                      ) : rank === 2 ? (
                        <div className="flex items-center justify-center w-full h-full rounded-lg bg-gradient-to-br from-[#C0C0C0] to-[#808080] text-white shadow-sm">
                          <Medal className="w-4 h-4 fill-current" />
                        </div>
                      ) : rank === 3 ? (
                        <div className="flex items-center justify-center w-full h-full rounded-lg bg-gradient-to-br from-[#CD7F32] to-[#8B4513] text-white shadow-sm">
                          <Medal className="w-4 h-4 fill-current" />
                        </div>
                      ) : (
                        <span className="text-[#7A4219] font-bold text-xs">#{rank}</span>
                      )}
                    </div>

                    {/* Avatar / Name */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-[#2C1810] truncate">
                          {user.displayName || 'Oyuncu'}
                        </span>
                        {isMe && (
                          <span className="text-[9px] bg-[#7A4219] text-[#FFF8E7] px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0">
                            Sen
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#6E4223] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        <span>{wins} Galibiyet</span>
                        {totalGames > 0 && <span>• %{winRate} Oran</span>}
                      </div>
                    </div>
                  </div>

                  {/* Wins Stats Pill */}
                  <div className="flex items-center gap-1 bg-[#FFFDF9] border border-[#D4C3B3] px-2.5 py-1 rounded-lg shrink-0 shadow-xs">
                    <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="font-extrabold text-xs text-[#7A4219]">{wins} Zafer</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#D4C3B3] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#7A4219] text-[#FFF8E7] font-extrabold text-xs hover:bg-[#8B5A2B] transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
