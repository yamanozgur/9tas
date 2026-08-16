import React from 'react';
import { Sparkles, Clock, Crown, ArrowRight, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { ADMOB_CONFIG } from '../lib/admob';

interface BonusExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdFreeModal: () => void;
}

export const BonusExpiredModal: React.FC<BonusExpiredModalProps> = ({
  isOpen,
  onClose,
  onOpenAdFreeModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="bg-[#FFFDF9] border-2 border-[#7A4219] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-[#2C1810] relative">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#2C1810] via-[#5C3210] to-[#2C1810] text-[#FFF8E7] p-5 border-b border-[#D4AF37]/30 relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-[#FFF8E7] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-inner mb-2">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>

          <h3 className="text-lg sm:text-xl font-black font-serif tracking-wide text-[#FFF8E7]">
            24 Saatlik Reklamsız Süreniz Doldu
          </h3>
          <p className="text-xs text-[#D4AF37] font-semibold mt-0.5">
            İlk Üyelere Özel Hoş Geldin Hediyesi
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-950 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-black">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>İlk üyelere özel 24 saatlik reklamsız oynama bonusunuzun süresi dolmuştur.</span>
            </div>
            <p className="text-[11px] text-amber-900/80 font-medium">
              Dokuz Taş keyfini hiçbir reklam ve bekleme süresi olmadan ömür boyu sürdürmek isterseniz tek seferlik avantajlı paketi inceleyebilirsiniz.
            </p>
          </div>

          {/* Value Proposition Box */}
          <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#7A4219]/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#2C1810]">Ömür Boyu Kalıcı Reklamsız</span>
              <span className="text-xs font-black text-amber-700">{ADMOB_CONFIG.adFreePriceText}</span>
            </div>
            <ul className="text-[11px] text-[#6E4223] space-y-1">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tek seferlik ödeme — abonelik yok</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Banner ve video geçiş reklamları tamamen kalkar</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                onClose();
                onOpenAdFreeModal();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7A4219] via-[#8B5A2B] to-[#63330F] text-[#FFF8E7] font-black text-sm shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all cursor-pointer border border-[#FFF8E7]/30"
            >
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              <span>Reklamları Kalıcı Olarak Kaldır ({ADMOB_CONFIG.adFreePriceText})</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-transparent hover:bg-[#FAF6F0] text-[#7A4219] font-bold text-xs transition-colors cursor-pointer"
            >
              Standart Oynamaya Devam Et (Reklamlı)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
