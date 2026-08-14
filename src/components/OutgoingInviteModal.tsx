import React, { useState, useEffect } from 'react';
import { Loader2, Swords, X, Clock, AlertCircle } from 'lucide-react';
import { GameInvitation, listenToOutgoingInvite, cancelGameInvite } from '../lib/multiplayer';

interface OutgoingInviteModalProps {
  inviteId: string | null;
  gameId: string | null;
  targetName: string;
  gameType: 'dokuz-tas' | 'uc-tas';
  onAccepted: (gameId: string) => void;
  onDeclined: () => void;
  onCancel: () => void;
}

export const OutgoingInviteModal: React.FC<OutgoingInviteModalProps> = ({
  inviteId,
  gameId,
  targetName,
  gameType,
  onAccepted,
  onDeclined,
  onCancel,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [statusText, setStatusText] = useState<string>('Oyuncudan yanıt bekleniyor...');
  const [isDeclined, setIsDeclined] = useState<boolean>(false);

  useEffect(() => {
    if (!inviteId) return;

    setTimeLeft(30);
    setIsDeclined(false);
    setStatusText('Oyuncudan yanıt bekleniyor...');

    // Subscribe to invite changes
    const unsub = listenToOutgoingInvite(inviteId, (inv) => {
      if (!inv) return;
      if (inv.status === 'accepted' && inv.gameId) {
        onAccepted(inv.gameId);
      } else if (inv.status === 'declined') {
        setIsDeclined(true);
        setStatusText('Davet reddedildi veya zaman aşımına uğradı.');
        setTimeout(() => {
          onDeclined();
        }, 2200);
      }
    });

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          cancelGameInvite(inviteId);
          setIsDeclined(true);
          setStatusText('Zaman aşımına uğradı (Yanıt gelmedi).');
          setTimeout(() => {
            onDeclined();
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      unsub();
    };
  }, [inviteId]);

  if (!inviteId) return null;

  const handleCancelClick = async () => {
    await cancelGameInvite(inviteId);
    onCancel();
  };

  const gameTitle = gameType === 'uc-tas' ? 'Üç Taş' : 'Dokuz Taş';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="bg-[#FFFDF9] border-2 border-[#7A4219]/40 rounded-3xl w-full max-w-sm sm:max-w-md p-6 shadow-2xl relative overflow-hidden flex flex-col items-center text-center text-[#2C1810]">
        
        {/* Animated Spinner & Swords */}
        <div className="relative mb-4 mt-2 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7A4219] to-[#D4AF37] text-white flex items-center justify-center shadow-lg shadow-[#7A4219]/25">
            <Swords className="w-8 h-8 text-[#FFF8E7]" />
          </div>
          {!isDeclined && (
            <div className="absolute -inset-2 border-2 border-dashed border-[#D4AF37] rounded-3xl animate-spin duration-3000 pointer-events-none" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black font-serif text-[#2C1810] tracking-tight">
          {isDeclined ? 'Davet Sonuçlandı' : 'Meydan Okuma Gönderildi'}
        </h3>

        {/* Target Info */}
        <div className="w-full my-4 p-4 rounded-2xl bg-[#FAF6F0] border border-[#7A4219]/20 flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-[#8B5A2B]">Davet Edilen Oyuncu</span>
          <span className="text-lg font-black text-[#2C1810] tracking-wide">
            {targetName}
          </span>
          <span className="mt-1 px-2.5 py-0.5 rounded-lg bg-[#7A4219]/10 text-[#7A4219] text-xs font-bold">
            {gameTitle} Maçı
          </span>
        </div>

        {/* Status Message */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#8B5A2B] mb-4">
          {!isDeclined ? (
            <>
              <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
              <span>{statusText}</span>
            </>
          ) : (
            <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{statusText}</span>
            </div>
          )}
        </div>

        {/* Timer Bar */}
        {!isDeclined && (
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
                className="h-full bg-gradient-to-r from-amber-500 to-[#7A4219] transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Cancel Button */}
        <button
          onClick={handleCancelClick}
          className="w-full py-3 px-4 rounded-2xl border-2 border-[#7A4219]/20 bg-[#FAF6F0] hover:bg-[#7A4219]/10 text-[#7A4219] font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <X className="w-4 h-4 text-[#8B5A2B]" />
          <span>İptal Et</span>
        </button>

      </div>
    </div>
  );
};
