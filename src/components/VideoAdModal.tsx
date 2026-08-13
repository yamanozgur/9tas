import React, { useState, useEffect } from 'react';
import { Play, Volume2, VolumeX, SkipForward, Tv, CheckCircle2, Sparkles } from 'lucide-react';

interface VideoAdModalProps {
  isOpen: boolean;
  gameCount: number;
  onClose: () => void;
}

export const VideoAdModal: React.FC<VideoAdModalProps> = ({ isOpen, gameCount, onClose }) => {
  const [countdown, setCountdown] = useState<number>(5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setProgress(0);
      return;
    }

    // Countdown timer for skip button (5 seconds)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Progress bar animation (10 seconds total video duration)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 200);

    return () => {
      clearInterval(timer);
      clearInterval(progressInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#1E140E] border-2 border-[#7A4219] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col relative text-[#FAF6F0]">
        
        {/* Top Header Bar */}
        <div className="bg-[#2C1810] px-4 py-2.5 border-b border-[#522F18] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-extrabold text-xs tracking-wide text-[#FAF6F0]">
              SPONSORLU VİDEO REKLAM
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7A4219]/40 border border-[#D4AF37]/30 text-[#D4AF37]">
            {gameCount}. Oyun Reklamı
          </span>
        </div>

        {/* Video Player Screen Simulation */}
        <div className="relative w-full aspect-video bg-gradient-to-br from-[#0F0B08] via-[#251810] to-[#0F0B08] flex flex-col items-center justify-center overflow-hidden p-6 text-center">
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-radial from-[#7A4219]/20 to-transparent animate-pulse pointer-events-none" />

          {/* Sound Wave / Video Visualizer */}
          <div className="w-16 h-16 rounded-full bg-[#7A4219]/30 border-2 border-[#D4AF37] flex items-center justify-center mb-3 shadow-lg relative z-10">
            <Play className="w-8 h-8 text-[#D4AF37] fill-[#D4AF37] translate-x-0.5 animate-bounce" />
          </div>

          <h3 className="font-black text-lg text-[#FFF8E7] mb-1 relative z-10 drop-shadow-md">
            Türkiye Zeka Oyunları Şampiyonası 2026
          </h3>
          <p className="text-xs text-[#D4C3B3] max-w-xs mb-3 relative z-10">
            Dokuz Taş, Mangala ve Satranç turnuvalarına kaydolun, büyük ödülleri kazanın!
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2C1810]/80 rounded-full border border-[#D4AF37]/30 text-[11px] text-[#D4AF37] font-bold relative z-10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sponsorlu Oyun İçi Gösterim</span>
          </div>

          {/* Top Right Sound Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer z-20"
            title={isMuted ? "Sesi Aç" : "Sesi Kapat"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Progress Bar at Bottom of Video */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/60">
            <div
              className="h-full bg-gradient-to-r from-[#7A4219] via-[#D4AF37] to-[#E6C687] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#2C1810] p-4 flex items-center justify-between border-t border-[#522F18]">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#D4C3B3] font-medium">
              Her 5 oyunda bir kısa sponsor reklamı gösterilir.
            </span>
            <span className="text-[10px] text-[#A89280]">
              Oyun geliştirilmesini desteklediğiniz için teşekkür ederiz.
            </span>
          </div>

          {/* Skip Ad Button */}
          {countdown > 0 ? (
            <button
              disabled
              className="px-4 py-2 bg-[#1A100B] border border-[#522F18] text-[#A89280] font-bold text-xs rounded-xl flex items-center gap-2 opacity-80 cursor-not-allowed"
            >
              <span>{countdown}s sonra Reklamı Geç</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E6C687] text-[#2C1810] font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 animate-pulse"
            >
              <span>Reklamı Geç</span>
              <SkipForward className="w-4 h-4 fill-[#2C1810]" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
