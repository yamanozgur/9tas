// Splash Screen & Authentication Entry Component
import React, { useState } from 'react';
import { 
  LogIn, 
  LogOut,
  UserPlus, 
  User, 
  Play, 
  Shield, 
  Mail, 
  Lock, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  X,
  Sparkles,
  Clock
} from 'lucide-react';
import { 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  loginAsGuest, 
  resetPasswordEmail,
  UserProfile 
} from '../lib/firebase';

interface SplashScreenProps {
  currentUser?: UserProfile | null;
  onStart: () => void;
  onUserAuthenticated?: (user: UserProfile) => void;
  onLogout?: () => void;
  onOpenPrivacyPolicy?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  currentUser,
  onStart,
  onUserAuthenticated,
  onLogout,
  onOpenPrivacyPolicy,
}) => {
  const [authTab, setAuthTab] = useState<'register' | 'login' | 'guest'>('register');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('Oyuncu 1');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Forgot Password State
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [isResetLoading, setIsResetLoading] = useState<boolean>(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetError('Lütfen e-posta adresinizi girin.');
      return;
    }
    setResetError(null);
    setResetSuccess(null);
    setIsResetLoading(true);
    try {
      await resetPasswordEmail(resetEmail.trim());
      setResetSuccess('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.');
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-email') {
        setResetError('Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı veya e-posta geçersiz.');
      } else {
        setResetError('Şifre sıfırlama e-postası gönderilemedi. Lütfen adresi kontrol edin.');
      }
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleAuthSuccess = (user: UserProfile) => {
    if (onUserAuthenticated) {
      onUserAuthenticated(user);
    }
    onStart();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Lütfen e-posta adresinizi ve şifrenizi girin.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const profile = await loginWithEmail(email.trim(), password);
      handleAuthSuccess(profile);
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password' || err?.message?.includes('hatalı')) {
        setErrorMsg('E-posta adresi veya şifre hatalı.');
      } else if (err?.code === 'auth/invalid-email') {
        setErrorMsg('Geçersiz bir e-posta adresi girdiniz.');
      } else {
        setErrorMsg(err?.message || 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Lütfen e-posta adresinizi ve şifrenizi girin.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const name = displayName.trim() || 'Oyuncu';
      const profile = await registerWithEmail(email.trim(), password, name);
      handleAuthSuccess(profile);
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/email-already-in-use' || err?.message?.includes('zaten var')) {
        setErrorMsg('Bu e-posta adresi zaten başka bir hesap tarafından kullanılıyor.');
      } else if (err?.code === 'auth/invalid-email') {
        setErrorMsg('Lütfen geçerli bir e-posta adresi girin.');
      } else if (err?.code === 'auth/weak-password') {
        setErrorMsg('Şifreniz en az 6 karakter olmalıdır.');
      } else {
        setErrorMsg(err?.message || 'Üyelik oluşturulurken bir hata oluştu. Tekrar deneyin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const profile = await loginWithGoogle();
      if (profile) {
        handleAuthSuccess(profile);
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

  const handleGuestEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalGuestName = guestName.trim() || 'Misafir Oyuncu';
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const profile = await loginAsGuest(finalGuestName);
      handleAuthSuccess(profile);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Misafir girişi yapılamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] text-[#2C1810] flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-y-auto">
      {/* Background Subtle Soft Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#B8860B]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md my-auto py-6 flex flex-col items-center z-10">
        
        {/* Top Header Badge & Emblem */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5A2B]/10 border border-[#8B5A2B]/20 text-[#7A4219] text-xs font-bold tracking-widest uppercase shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            Geleneksel Strateji Oyunu
          </span>
        </div>

        {/* Hero Title & Emblem */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-28 h-28 mb-3 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#B8860B]/10 rounded-2xl blur-lg animate-pulse" />
            <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-md">
              <rect x="20" y="20" width="160" height="160" fill="none" stroke="#7A4219" strokeWidth="4.5" rx="12" />
              <rect x="50" y="50" width="100" height="100" fill="none" stroke="#A06836" strokeWidth="3.5" rx="8" />
              <rect x="80" y="80" width="40" height="40" fill="none" stroke="#B8860B" strokeWidth="2.5" rx="4" />
              <line x1="100" y1="20" x2="100" y2="80" stroke="#A06836" strokeWidth="3.5" />
              <line x1="180" y1="100" x2="120" y2="100" stroke="#A06836" strokeWidth="3.5" />
              <line x1="100" y1="180" x2="100" y2="120" stroke="#A06836" strokeWidth="3.5" />
              <line x1="20" y1="100" x2="80" y2="100" stroke="#A06836" strokeWidth="3.5" />
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

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#2C1810] mb-1 font-serif">
            DOKUZ TAŞ
          </h1>
          <p className="text-xs sm:text-sm text-[#6E4223] font-medium max-w-xs leading-snug">
            Hamleni yap, üçlü dizilim oluştur, stratejini konuştur!
          </p>
        </div>

        {/* Existing Authenticated User Banner */}
        {currentUser && (
          <div className="w-full bg-[#FFFDF9] border-2 border-[#7A4219]/25 rounded-2xl p-4 mb-4 shadow-md text-center">
            <div className="flex items-center justify-center gap-2 mb-2 text-[#7A4219] font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Giriş Yapıldı: {currentUser.displayName}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onStart}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#7A4219] via-[#8B5A2B] to-[#63330F] text-[#FFF8E7] font-black text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Oyuna Başla (Dashboard)</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="py-3 px-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold text-xs hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Çıkış</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Auth Box Card */}
        <div className="w-full bg-[#FFFDF9] border-2 border-[#7A4219]/20 rounded-2xl p-5 sm:p-6 shadow-xl relative">
          
          {/* Navigation Segmented Control Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#FAF6F0] rounded-xl border border-[#7A4219]/15 mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthTab('register'); setErrorMsg(null); }}
              className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                authTab === 'register'
                  ? 'bg-[#7A4219] text-[#FFF8E7] shadow-sm'
                  : 'text-[#6E4223] hover:bg-[#7A4219]/10'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Üye Ol</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthTab('login'); setErrorMsg(null); }}
              className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                authTab === 'login'
                  ? 'bg-[#7A4219] text-[#FFF8E7] shadow-sm'
                  : 'text-[#6E4223] hover:bg-[#7A4219]/10'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Giriş Yap</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthTab('guest'); setErrorMsg(null); }}
              className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                authTab === 'guest'
                  ? 'bg-[#7A4219] text-[#FFF8E7] shadow-sm'
                  : 'text-[#6E4223] hover:bg-[#7A4219]/10'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Misafir</span>
            </button>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: GİRİŞ YAP */}
          {authTab === 'login' && (
            <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-[#7A4219] mb-1">E-posta Adresi</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5A2B]/60" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#7A4219]/25 bg-[#FFFDF9] text-sm text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#7A4219]/50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#7A4219]">Şifre</label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setResetError(null);
                      setResetSuccess(null);
                      setShowResetModal(true);
                    }}
                    className="text-[11px] font-bold text-[#8B5A2B] hover:text-[#7A4219] hover:underline cursor-pointer"
                  >
                    Şifremi Unuttum?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5A2B]/60" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#7A4219]/25 bg-[#FFFDF9] text-sm text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#7A4219]/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5A2B]/70 hover:text-[#7A4219] p-0.5 cursor-pointer"
                    title={showPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7A4219] via-[#8B5A2B] to-[#63330F] text-[#FFF8E7] font-black text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition-transform flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-[#D4AF37]" />
                    <span>Giriş Yap ve Dashboard'a Geç</span>
                  </>
                )}
              </button>

              <div className="relative my-2 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#7A4219]/15"></div>
                </div>
                <span className="relative px-3 bg-[#FFFDF9] text-[11px] font-bold text-[#8B5A2B]/70 uppercase">veya</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-[#7A4219]/20 bg-[#FAF6F0] text-[#2C1810] font-bold text-xs hover:bg-[#7A4219]/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google ile Giriş Yap</span>
              </button>
            </form>
          )}

          {/* TAB 2: ÜYE OL */}
          {authTab === 'register' && (
            <form onSubmit={handleEmailRegister} className="flex flex-col gap-3">
              {/* 24-Hour Ad-Free Bonus Highlight */}
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 text-emerald-950 flex items-start gap-2">
                <div className="p-1 bg-emerald-100 rounded-lg text-emerald-700 shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-black text-emerald-900 block">Hoş Geldin Hediyesi: 24 Saat Reklamsız!</span>
                  <span className="text-emerald-800/90 font-medium">Şimdi üye olun, ilk 24 saat boyunca hiçbir reklam veya bekleme süresi olmadan oynayın.</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A4219] mb-1">Oyuncu Adı</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5A2B]/60" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Adınız veya Rumuzunuz"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#7A4219]/25 bg-[#FFFDF9] text-sm text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#7A4219]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A4219] mb-1">E-posta Adresi</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5A2B]/60" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#7A4219]/25 bg-[#FFFDF9] text-sm text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#7A4219]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A4219] mb-1">Şifre</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5A2B]/60" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#7A4219]/25 bg-[#FFFDF9] text-sm text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#7A4219]/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5A2B]/70 hover:text-[#7A4219] p-0.5 cursor-pointer"
                    title={showPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7A4219] via-[#8B5A2B] to-[#63330F] text-[#FFF8E7] font-black text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition-transform flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                    <span>Üye Ol ve Dashboard'a Geç</span>
                  </>
                )}
              </button>

              <div className="relative my-2 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#7A4219]/15"></div>
                </div>
                <span className="relative px-3 bg-[#FFFDF9] text-[11px] font-bold text-[#8B5A2B]/70 uppercase">veya</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-[#7A4219]/20 bg-[#FAF6F0] text-[#2C1810] font-bold text-xs hover:bg-[#7A4219]/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google ile Kaydol</span>
              </button>
            </form>
          )}

          {/* TAB 3: MİSAFİR GİRİŞİ */}
          {authTab === 'guest' && (
            <form onSubmit={handleGuestEntry} className="flex flex-col gap-3">
              <p className="text-xs text-[#6E4223] font-medium leading-relaxed bg-[#FAF6F0] p-3 rounded-xl border border-[#7A4219]/15">
                Hesap oluşturmadan hızlıca oyuna dahil olabilirsiniz. Misafir skorlarınız bu cihazda saklanır.
              </p>

              <div>
                <label className="block text-xs font-bold text-[#7A4219] mb-1">Misafir Takma Adınız</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5A2B]/60" />
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Örn: Oyuncu 1"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#7A4219]/25 bg-[#FFFDF9] text-sm text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#7A4219]/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7A4219] via-[#8B5A2B] to-[#63330F] text-[#FFF8E7] font-black text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition-transform flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-[#D4AF37]" />
                    <span>Misafir Olarak Başla (Dashboard)</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Şifremi Unuttum Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFDF9] border-2 border-[#7A4219]/30 rounded-2xl w-full max-w-sm p-5 sm:p-6 shadow-2xl relative flex flex-col gap-4 text-[#2C1810]">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-[#8B5A2B] hover:text-[#7A4219] p-1 rounded-lg hover:bg-[#FAF6F0] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#7A4219] font-black text-base border-b border-[#7A4219]/15 pb-3">
              <KeyRound className="w-5 h-5 text-[#D4AF37]" />
              <span>Şifremi Unuttum</span>
            </div>

            <p className="text-xs text-[#6E4223] leading-relaxed">
              Hesabınıza kayıtlı e-posta adresinizi girin. Size şifre sıfırlama bağlantısı içeren bir e-posta göndereceğiz.
            </p>

            {resetError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="flex flex-col gap-3 mt-1">
              <div>
                <label className="block text-xs font-bold text-[#7A4219] mb-1">E-posta Adresiniz</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5A2B]/60" />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#7A4219]/25 bg-[#FAF6F0] text-sm text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#7A4219]/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#7A4219]/25 bg-[#FAF6F0] text-[#7A4219] font-bold text-xs hover:bg-[#7A4219]/10 transition-colors cursor-pointer"
                >
                  İptal
                </button>

                <button
                  type="submit"
                  disabled={isResetLoading}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#7A4219] to-[#8B5A2B] text-[#FFF8E7] font-extrabold text-xs shadow-md hover:scale-[1.01] transition-transform flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isResetLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  ) : (
                    <span>Sıfırlama Gönder</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
