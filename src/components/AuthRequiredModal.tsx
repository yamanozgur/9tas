import React, { useState } from 'react';
import { ShieldCheck, LogIn, UserPlus, X, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { loginWithGoogle, UserProfile } from '../lib/firebase';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToAuthScreen: () => void;
  onSuccessLogin: (user: UserProfile) => void;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  onGoToAuthScreen,
  onSuccessLogin,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const profile = await loginWithGoogle();
      if (profile) {
        onSuccessLogin(profile);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/operation-not-allowed') {
        setErrorMsg('Google ile giriş bu Firebase projesinde etkinleştirilmemiş.');
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Giriş penceresi kapatıldı.');
      } else {
        setErrorMsg('Google ile giriş yapılırken bir sorun oluştu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="bg-[#FFFDF9] border-2 border-[#7A4219]/30 rounded-3xl w-full max-w-sm sm:max-w-md p-6 shadow-2xl relative overflow-hidden flex flex-col items-center text-center text-[#2C1810]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8B5A2B] hover:text-[#2C1810] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
          title="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Icon Emblem */}
        <div className="relative mb-3 mt-1">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7A4219] via-[#8B5A2B] to-[#D4AF37] text-white flex items-center justify-center shadow-lg shadow-[#7A4219]/25">
            <ShieldCheck className="w-9 h-9 text-[#FFF8E7]" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#7A4219] text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Üyelik Gereklidir</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black font-serif text-[#2C1810] tracking-tight">
          Çevrimiçi Oyna & Yarış
        </h3>

        <p className="text-xs text-[#6E4223] font-medium leading-relaxed my-3 px-2">
          Çevrimiçi çok oyunculu eşleşme, arkadaş davetleri ve skor tablosu için lütfen ücretsiz üye olun veya giriş yapın. 
          <br /><span className="text-[11px] text-[#8B5A2B] italic mt-1 block">Misafir kullanıcılar sadece Çevrimdışı (Yapay Zeka & 2 Kişilik) modları deneyebilir.</span>
        </p>

        {errorMsg && (
          <div className="w-full mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 mt-2">
          {/* Quick Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl border-2 border-[#7A4219]/25 bg-[#FAF6F0] hover:bg-[#7A4219]/10 text-[#2C1810] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#7A4219]" />
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google ile Hızlı Giriş</span>
              </>
            )}
          </button>

          {/* Email Login/Register -> redirects to Splash Auth Screen */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToAuthScreen();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7A4219] via-[#8B5A2B] to-[#63330F] text-[#FFF8E7] font-black text-xs shadow-md hover:scale-[1.01] active:scale-[0.99] transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#D4AF37]" />
            <span>E-posta ile Üye Ol / Giriş Yap</span>
          </button>

          {/* Cancel button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-[#8B5A2B] hover:text-[#2C1810] transition-colors cursor-pointer mt-1"
          >
            Vazgeç (Çevrimdışı Kal)
          </button>
        </div>

      </div>
    </div>
  );
};
