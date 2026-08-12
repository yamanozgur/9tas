// Game Rules Modal Component
import React from 'react';
import { X, Award, PlayCircle, ShieldAlert } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-lg bg-[#FFFDF9] border-2 border-[#7A4219] rounded-2xl text-[#2C1810] p-6 overflow-hidden max-h-[90vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D4C3B3]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#7A4219]/10 rounded-xl border border-[#7A4219]/30 text-[#7A4219]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#7A4219] font-serif">
                Dokuz Taş Kuralları
              </h2>
              <p className="text-xs text-[#6E4223] font-medium">
                Geleneksel Türk Strateji Oyunu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#E8DFD5] text-[#2C1810] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 overflow-y-auto space-y-4 text-xs font-medium pr-1">
          
          <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#D4C3B3] space-y-2">
            <h3 className="font-bold text-[#7A4219] flex items-center gap-2 text-sm">
              <PlayCircle className="w-4 h-4 text-[#7A4219]" />
              Oyunun Amacı
            </h3>
            <p className="text-[#2C1810] leading-relaxed">
              3 iç içe kareden oluşan 24 kesişim noktalı tahtada oynanır. Her oyuncunun 9 taşı vardır. Amaç rakibin taş sayısını 2 adede düşürmek veya rakibi hamlesiz bırakmaktır.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3 items-start bg-[#FAF6F0] p-3.5 rounded-xl border border-[#D4C3B3]">
              <div className="w-6 h-6 rounded-lg bg-[#7A4219] text-[#FFF8E7] font-extrabold flex items-center justify-center shrink-0 text-xs">
                1
              </div>
              <div className="text-xs leading-relaxed">
                <span className="font-bold text-[#7A4219]">Dizilim & Üçlü (Coda): </span>
                <span className="text-[#2C1810]">
                  Oyuncular ellerindeki 9 taşı teker teker boş noktalara koyarlar. Aynı çizgi üzerinde 3 taşını yan yana dizen oyuncu "Üçlü" yapar ve rakibin 1 taşını tahtadan çıkarır.
                </span>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-[#FAF6F0] p-3.5 rounded-xl border border-[#D4C3B3]">
              <div className="w-6 h-6 rounded-lg bg-[#7A4219] text-[#FFF8E7] font-extrabold flex items-center justify-center shrink-0 text-xs">
                2
              </div>
              <div className="text-xs leading-relaxed">
                <span className="font-bold text-[#7A4219]">Taş Taşıma Evresi: </span>
                <span className="text-[#2C1810]">
                  Tüm taşlar konduktan sonra oyuncular sırayla bir taşını bağlı komşu boş noktaya kaydırır. Yeniden 3'lü dizilim oluşturan oyuncu her defasında rakip taş çıkarır.
                </span>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-[#FAF6F0] p-3.5 rounded-xl border border-[#D4C3B3]">
              <div className="w-6 h-6 rounded-lg bg-[#7A4219] text-[#FFF8E7] font-extrabold flex items-center justify-center shrink-0 text-xs">
                3
              </div>
              <div className="text-xs leading-relaxed">
                <span className="font-bold text-[#7A4219]">Uçma Kuralı: </span>
                <span className="text-[#2C1810]">
                  Bir oyuncunun tahtada yalnızca 3 taşı kaldığında, taşları "uçma" yeteneği kazanır. İstediği herhangi bir boş noktaya sıçrayabilir!
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#7A4219]/10 p-3.5 rounded-xl border border-[#7A4219]/30 flex gap-2.5 items-center text-xs">
            <ShieldAlert className="w-5 h-5 text-[#7A4219] shrink-0" />
            <span className="text-[#7A4219] font-bold">
              İpucu: Üçlü gruptaki rakip taşlar, tahtada üçlüde olmayan başka taş varsa korunur!
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#D4C3B3] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#7A4219] text-[#FFF8E7] font-extrabold text-xs hover:bg-[#8B5A2B] transition-colors cursor-pointer"
          >
            Kapat ve Oyuna Dön
          </button>
        </div>
      </div>
    </div>
  );
};
