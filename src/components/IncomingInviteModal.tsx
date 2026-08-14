import React, { useState, useEffect } from 'react';
import { Swords, Check, X, Clock, ShieldAlert, Sparkles } from 'lucide-react';
import { GameInvitation } from '../lib/multiplayer';

interface IncomingInviteModalProps {
  invitation: GameInvitation | null;
  onAccept: (invite: GameInvitation) => void;
  onDecline: (invite: GameInvitation) => void;
}

export const IncomingInviteModal: React.FC<IncomingInviteModalProps> = ({
  invitation,
  onAccept,
  onDecline,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(30);

  useEffect(() => {
    if (!invitation) return;

    // Reset countdown to 30 seconds
    setTimeLeft(30);

    // Audio chime notification
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.6;
      audio.play().catch(() => {});
    } catch (e) {
      // Audio autoplay might be blocked
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDecline(invitation);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [invitation?.id]);

  if (!invitation) return null;

  const gameTitle = invitation.gameType === 'uc-tas' ? 'Üç Taş' : 'Dokuz Taş';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="bg-[#FFFDF9] border-3 border-[#D4AF37] rounded-3xl w-full max-w-sm sm:max-w-md p-6 shadow-2xl relative overflow-hidden flex flex-col items-center text-center text-[#2C1810]">
        
        {/* Top Glowing Ambient Accents */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#8B5A2B]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close / Dismiss */}
        <button
          onClick={() => onDecline(invitation)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8B5A2B] hover:text-[#2C1810] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
          title="Reddet ve Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Badge / Icon */}
        <div className="relative mb-3 mt-1">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7A4219] to-[#D4AF37] text-white flex items-center justify-center shadow-lg shadow-[#D4AF37]/30 animate-bounce">
            <Swords className="w-9 h-9 text-[#FFF8E7]" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
          </span>
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#7A4219] text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Canlı Meydan Okuma!</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black font-serif text-[#2C1810] tracking-tight">
          Maç Daveti Geldi!
        </h3>

        {/* Challenger Card */}
        <div className="w-full my-4 p-4 rounded-2xl bg-[#FAF6F0] border border-[#7A4219]/20 flex flex-col items-center gap-1 shadow-inner">
          <span className="text-xs font-semibold text-[#8B5A2B]">Rakip Oyuncu</span>
          <span className="text-lg font-black text-[#2C1810] tracking-wide">
            {invitation.senderName}
          </span>
          <span className="mt-1 px-2.5 py-0.5 rounded-lg bg-[#7A4219]/10 text-[#7A4219] text-xs font-bold">
            {gameTitle} Modu
          </span>
        </div>

        {/* Timer Bar */}
        <div className="w-full mb-5 flex flex-col items-center gap-1.5">
          <div className="flex items-center justify-between w-full text-xs font-bold text-[#8B5A2B]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              Kalan Süre
            </span>
            <span className="text-[#7A4219] font-black">{timeLeft} sn</span>
          </div>
          <div className="w-full h-2 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#7A4219]/15">
            <div 
              className="h-full bg-gradient-to-r from-[#D4AF37] to-emerald-500 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-3">
          <button
            onClick={() => onDecline(invitation)}
            className="py-3 px-4 rounded-2xl border-2 border-[#7A4219]/20 bg-[#FAF6F0] hover:bg-red-50 hover:border-red-300 text-[#7A4219] hover:text-red-700 font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <X className="w-4 h-4 text-red-500" />
            <span>Reddet</span>
          </button>

          <button
            onClick={() => onAccept(invitation)}
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 animate-pulse"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Kabul Et</span>
          </button>
        </div>

      </div>
    </div>
  );
};
