// Splash Screen Animation Component
import React from 'react';
import { motion } from 'motion/react';
import { Play, Shield } from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen w-full bg-light-theme text-[#2C1810] flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Background Subtle Soft Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#B8860B]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-6 text-center"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B5A2B]/10 border border-[#8B5A2B]/25 text-[#7A4219] text-xs font-bold tracking-widest uppercase shadow-sm">
          <Shield className="w-3.5 h-3.5" />
          Geleneksel Strateji Oyunu
        </span>
      </motion.div>

      {/* Center Hero Logo & Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex flex-col items-center text-center max-w-md my-auto py-10"
      >
        {/* SVG Dokuz Taş Geometric Emblem */}
        <div className="relative w-44 h-44 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#B8860B]/10 rounded-3xl blur-xl animate-pulse" />
          <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-md">
            {/* Concentric Squares */}
            <rect x="20" y="20" width="160" height="160" fill="none" stroke="#7A4219" strokeWidth="4.5" rx="12" />
            <rect x="50" y="50" width="100" height="100" fill="none" stroke="#A06836" strokeWidth="3.5" rx="8" />
            <rect x="80" y="80" width="40" height="40" fill="none" stroke="#B8860B" strokeWidth="2.5" rx="4" />
            {/* Cross Lines */}
            <line x1="100" y1="20" x2="100" y2="80" stroke="#A06836" strokeWidth="3.5" />
            <line x1="180" y1="100" x2="120" y2="100" stroke="#A06836" strokeWidth="3.5" />
            <line x1="100" y1="180" x2="100" y2="120" stroke="#A06836" strokeWidth="3.5" />
            <line x1="20" y1="100" x2="80" y2="100" stroke="#A06836" strokeWidth="3.5" />
            {/* Decorative Ivory Gold & Ebony Stones */}
            <circle cx="20" cy="20" r="9.5" fill="#D4AF37" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="100" cy="20" r="9.5" fill="#2C1810" stroke="#D4AF37" strokeWidth="1.5" />
            <circle cx="180" cy="20" r="9.5" fill="#D4AF37" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="180" cy="100" r="9.5" fill="#2C1810" stroke="#D4AF37" strokeWidth="1.5" />
            <circle cx="180" cy="180" r="9.5" fill="#D4AF37" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="100" cy="180" r="9.5" fill="#2C1810" stroke="#D4AF37" strokeWidth="1.5" />
            <circle cx="20" cy="180" r="9.5" fill="#D4AF37" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="20" cy="100" r="9.5" fill="#2C1810" stroke="#D4AF37" strokeWidth="1.5" />
          </svg>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#2C1810] mb-3 font-serif drop-shadow-sm">
          DOKUZ TAŞ
        </h1>
        <p className="text-sm sm:text-base text-[#6E4223] font-semibold max-w-xs leading-relaxed">
          Asırlık zeka ve taktik mirası. Hamleni yap, üçlü dizilim oluştur, rakibin taşlarını topla!
        </p>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
          className="mt-8 w-full max-w-xs py-4 px-8 rounded-2xl bg-gradient-to-r from-[#7A4219] via-[#8B5A2B] to-[#63330F] text-[#FFF8E7] font-extrabold text-lg shadow-xl shadow-[#7A4219]/25 flex items-center justify-center gap-3 transition-all hover:brightness-110 active:scale-98 cursor-pointer border border-[#FFF8E7]/30"
        >
          <Play className="w-6 h-6 fill-current text-[#D4AF37]" />
          <span>Oyuna Başla</span>
        </motion.button>
      </motion.div>
    </div>
  );
};
