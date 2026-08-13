import React, { useState, useEffect } from 'react';
import { ExternalLink, Info, Volume2, VolumeX, Sparkles, ShieldAlert } from 'lucide-react';

interface BannerAdProps {
  placement?: 'dashboard' | 'game';
  className?: string;
  isAdFree?: boolean;
}

const SAMPLE_ADS = [
  {
    id: 1,
    title: 'Akıl & Zeka Oyunları Festivali 2026',
    desc: 'Türkiye geneli Dokuz Taş ve Mangala Turnuvası kayıtları başladı!',
    tag: 'SPONSORLU',
    buttonText: 'Hemen Katıl',
    color: 'from-[#7A4219] to-[#8B5A2B]',
    bgPattern: 'bg-[#FFFDF9]',
    icon: '🏆',
  },
  {
    id: 2,
    title: 'El Yapımı Ahşap Dokuz Taş Takımı',
    desc: 'Doğal ceviz ağacından özel işleme nostaljik oyun tahtaları %20 indirimde.',
    tag: 'REKLAM',
    buttonText: 'İncele',
    color: 'from-[#6E4223] to-[#522F18]',
    bgPattern: 'bg-[#FAF6F0]',
    icon: '🪵',
  },
  {
    id: 3,
    title: 'Zeka & Strateji Akademi',
    desc: 'Çocuklar ve yetişkinler için online satranç ve strateji eğitimleri.',
    tag: 'SPONSORLU',
    buttonText: 'Detaylı Bilgi',
    color: 'from-[#2C1810] to-[#7A4219]',
    bgPattern: 'bg-[#FFFDF9]',
    icon: '🧠',
  },
];

export const BannerAd: React.FC<BannerAdProps> = ({ placement = 'dashboard', className = '', isAdFree = false }) => {
  const [adIndex, setAdIndex] = useState(0);

  // Rotate ad every 12 seconds
  useEffect(() => {
    if (isAdFree) return;
    const timer = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % SAMPLE_ADS.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [isAdFree]);

  if (isAdFree) {
    return null;
  }

  const currentAd = SAMPLE_ADS[adIndex];

  return (
    <div
      className={`w-full max-w-lg mx-auto bg-[#FFFDF9] border border-[#D4C3B3] rounded-2xl p-2.5 sm:p-3 shadow-xs relative overflow-hidden transition-all ${className}`}
    >
      {/* Small Ad Header Badge */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black tracking-wider text-[#7A4219]/80 bg-[#7A4219]/10 border border-[#7A4219]/20 px-1.5 py-0.5 rounded-md uppercase">
            {currentAd.tag}
          </span>
          <span className="text-[10px] text-[#6E4223] font-medium">
            {placement === 'dashboard' ? 'Sponsorlu Alan' : 'Oyun İçi Reklam'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#A89280]" title="Reklam Seçenekleri">
          <Info className="w-3 h-3 cursor-pointer hover:text-[#7A4219] transition-colors" />
        </div>
      </div>

      {/* Ad Content Banner */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FAF6F0] to-[#E8DFD5] border border-[#D4C3B3] flex items-center justify-center text-xl shrink-0 shadow-xs">
            {currentAd.icon}
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="font-extrabold text-xs text-[#2C1810] truncate leading-tight">
              {currentAd.title}
            </h4>
            <p className="text-[11px] text-[#6E4223] truncate leading-tight mt-0.5">
              {currentAd.desc}
            </p>
          </div>
        </div>

        <a
          href="#ad-click"
          onClick={(e) => {
            e.preventDefault();
            alert(`"${currentAd.title}" reklam bağlantısına tıklandı.`);
          }}
          className="px-3 py-1.5 bg-[#7A4219] hover:bg-[#8B5A2B] text-[#FFF8E7] font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-xs active:scale-95"
        >
          <span>{currentAd.buttonText}</span>
          <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
        </a>
      </div>
    </div>
  );
};
