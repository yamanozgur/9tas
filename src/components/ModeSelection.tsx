// Game Mode Selection View
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  Users, 
  Globe, 
  User, 
  PlusCircle, 
  LogIn, 
  LogOut,
  Check, 
  ArrowRight,
  ChevronRight,
  Award,
  Zap,
  Trophy,
  ShieldCheck,
  Search,
  Swords,
  Loader2,
  Crown,
  Sparkles
} from 'lucide-react';
import { UserProfile, loginWithGoogle, searchUsersByName, formatLastSeen, isUserAdmin } from '../lib/firebase';
import { GameMode, AIDifficulty } from '../types';
import { BannerAd } from './BannerAd';
import { ADMOB_CONFIG, isAdFreeLocally } from '../lib/admob';

interface ModeSelectionProps {
  currentUser: UserProfile | null;
  onUpdateUserName: (name: string) => Promise<void>;
  onStartOfflineGame: (mode: GameMode, difficulty?: AIDifficulty) => void;
  onCreateOnlineRoom: () => void;
  onJoinOnlineRoom: (code: string) => void;
  onQuickMatch: () => void;
  onChallengeUser?: (targetUser: UserProfile, gameType: 'dokuz-tas' | 'uc-tas') => void;
  onRequireAuth?: () => void;
  onOpenRules: () => void;
  onOpenLeaderboard: () => void;
  onLogout?: () => void;
  onOpenAdmin?: () => void;
  onOpenAdFreeModal?: () => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({
  currentUser,
  onUpdateUserName,
  onStartOfflineGame,
  onCreateOnlineRoom,
  onJoinOnlineRoom,
  onQuickMatch,
  onChallengeUser,
  onRequireAuth,
  onOpenRules,
  onOpenLeaderboard,
  onLogout,
  onOpenAdmin,
  onOpenAdFreeModal,
}) => {
  const [selectedTab, setSelectedTab] = useState<'offline' | 'online'>('offline');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('impossible');
  const [offlineType, setOfflineType] = useState<'vs-ai' | 'pass-and-play'>('vs-ai');
  const [guestNameInput, setGuestNameInput] = useState<string>(currentUser?.displayName || 'Oyuncu 1');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);

  // Opponent Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const isGuest = !currentUser?.email;

  const handleProtectedAction = (action: () => void) => {
    if (isGuest) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    action();
  };


  const handleSearchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchUsersByName(query.trim(), currentUser?.uid);
      setSearchResults(results);
      setHasSearched(true);
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const isAdmin = isUserAdmin(currentUser);

  const handleSaveName = async () => {
    if (!guestNameInput.trim()) return;
    setIsLoadingAuth(true);
    try {
      await onUpdateUserName(guestNameInput.trim());
      setIsEditingName(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoadingAuth(true);
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-light-theme text-[#2C1810] flex flex-col items-center p-4 sm:p-6 overflow-y-auto select-none">
      <div className="w-full max-w-lg mx-auto flex flex-col gap-6 py-4">
        
        {/* Header Title */}
        <div className="text-center pt-2">
          <h2 className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight font-serif">
            DOKUZ TAŞ
          </h2>
          <p className="text-xs sm:text-sm text-[#7A4219] font-semibold mt-1">
            Giriş Yap ve Oyun Modunu Seç
          </p>
        </div>

        {/* User Profile Bar (Kullanıcı Girişi) */}
        <div className="bg-[#FFFDF9] border-2 border-[#D4C3B3] rounded-2xl p-4 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5A2B] to-[#5C3210] text-[#FFF8E7] font-extrabold flex items-center justify-center text-lg shrink-0 border border-[#FFF]/40 shadow-sm">
                {currentUser?.displayName?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#7A4219] uppercase tracking-widest font-bold block">
                  Oyuncu Profili
                </span>
                {isEditingName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={guestNameInput}
                      onChange={(e) => setGuestNameInput(e.target.value)}
                      maxLength={18}
                      className="bg-[#F5ECE0] border border-[#8B5A2B]/50 rounded-lg px-2.5 py-1 text-xs text-[#2C1810] font-bold focus:outline-none focus:border-[#7A4219] w-36"
                      placeholder="İsminiz..."
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isLoadingAuth}
                      className="p-1.5 rounded-lg bg-[#7A4219] text-[#FFF8E7] font-bold text-xs hover:bg-[#8B5A2B] cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-[#2C1810] truncate">
                      {currentUser?.displayName || 'Misafir Oyuncu'}
                    </h3>
                    {currentUser?.isAdFree && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-black text-[10px] shadow-2xs">
                        <Sparkles className="w-3 h-3 text-amber-600 fill-amber-300" />
                        <span>VIP Reklamsız</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {isAdmin && onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="text-xs text-[#2C1810] font-black px-2.5 py-1.5 bg-[#D4AF37] border border-[#B8860B] rounded-xl hover:bg-[#B8860B] hover:text-white transition-colors cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                  title="Yönetici Paneli"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}
              {!isEditingName && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-xs text-[#7A4219] font-extrabold px-2.5 py-1.5 bg-[#8B5A2B]/10 border border-[#8B5A2B]/30 rounded-xl hover:bg-[#8B5A2B]/20 transition-colors cursor-pointer shrink-0"
                >
                  İsim Değiştir
                </button>
              )}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="text-xs text-red-700 font-extrabold px-2.5 py-1.5 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Çıkış Yap</span>
                </button>
              )}
            </div>
          </div>

          {/* Ad-Free Upgrade Banner (If not ad-free) */}
          {!currentUser?.isAdFree && !isAdFreeLocally() && onOpenAdFreeModal && (
            <div className="pt-2 border-t border-[#E8DFD5]">
              <button
                type="button"
                onClick={onOpenAdFreeModal}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-[#2C1810] via-[#5C3210] to-[#2C1810] text-[#FFF8E7] shadow-sm hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between border border-[#D4AF37]/40 group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-[#2C1810] shadow-xs shrink-0">
                    <Crown className="w-4 h-4 fill-[#2C1810]/20" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black text-[#FFF8E7] block leading-tight">
                      Reklamları Kaldır
                    </span>
                    <span className="text-[10px] text-[#D4AF37] font-semibold block">
                      Kesintisiz oyun keyfi için tek seferlik ödeme
                    </span>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black text-xs shadow-xs border border-yellow-200/40 shrink-0 group-hover:scale-105 transition-transform">
                  {ADMOB_CONFIG.adFreePriceText}
                </div>
              </button>
            </div>
          )}

          {/* Optional Google Login Button */}
          {!currentUser?.email && (
            <div className="pt-2 border-t border-[#E8DFD5] flex items-center justify-between gap-2">
              <span className="text-xs text-[#6E4223] font-medium">Çevrimiçi başarım ve davetler için:</span>
              <button
                onClick={handleGoogleLogin}
                disabled={isLoadingAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7A4219]/10 hover:bg-[#7A4219]/20 border border-[#7A4219]/30 text-xs font-bold text-[#7A4219] transition-all cursor-pointer shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Google ile Gir</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Selection: Çevrimdışı / Çevrimiçi */}
        <div className="grid grid-cols-2 p-1.5 bg-[#EFE7DC] border border-[#D4C3B3] rounded-2xl gap-2 shadow-inner">
          <button
            onClick={() => setSelectedTab('offline')}
            className={`py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedTab === 'offline'
                ? 'bg-gradient-to-r from-[#7A4219] to-[#8B5A2B] text-[#FFF8E7] shadow-md'
                : 'text-[#6E4223] hover:text-[#2C1810]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Çevrimdışı Oyna</span>
          </button>

          <button
            onClick={() => setSelectedTab('online')}
            className={`py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedTab === 'online'
                ? 'bg-gradient-to-r from-[#7A4219] to-[#8B5A2B] text-[#FFF8E7] shadow-md'
                : 'text-[#6E4223] hover:text-[#2C1810]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Çevrimiçi Oyna</span>
          </button>
        </div>

        {/* Tab 1 Content: Çevrimdışı Oyna */}
        {selectedTab === 'offline' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            {/* Mode selection: AI vs 2-Player */}
            <div className="bg-[#FFFDF9] border border-[#D4C3B3] rounded-2xl p-4 flex flex-col gap-3 shadow-md">
              <span className="text-xs font-bold text-[#7A4219] uppercase tracking-wider">
                1. Rakip Seçin
              </span>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOfflineType('vs-ai')}
                  className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                    offlineType === 'vs-ai'
                      ? 'border-[#7A4219] bg-[#7A4219]/10 text-[#2C1810] shadow-sm'
                      : 'border-[#D4C3B3] bg-[#FAF6F0] text-[#6E4223] hover:border-[#7A4219]/50'
                  }`}
                >
                  <Bot className="w-6 h-6 text-[#7A4219]" />
                  <div>
                    <div className="font-extrabold text-sm text-[#2C1810]">Yapay Zeka</div>
                    <div className="text-[10px] text-[#6E4223] font-medium">Bilgisayara karşı</div>
                  </div>
                </button>

                <button
                  onClick={() => setOfflineType('pass-and-play')}
                  className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                    offlineType === 'pass-and-play'
                      ? 'border-[#7A4219] bg-[#7A4219]/10 text-[#2C1810] shadow-sm'
                      : 'border-[#D4C3B3] bg-[#FAF6F0] text-[#6E4223] hover:border-[#7A4219]/50'
                  }`}
                >
                  <Users className="w-6 h-6 text-[#7A4219]" />
                  <div>
                    <div className="font-extrabold text-sm text-[#2C1810]">2 Kişilik</div>
                    <div className="text-[10px] text-[#6E4223] font-medium">Aynı cihazda</div>
                  </div>
                </button>
              </div>

              {/* Difficulty selection if vs AI */}
              {offlineType === 'vs-ai' && (
                <div className="mt-2 pt-3 border-t border-[#E8DFD5] flex flex-col gap-2">
                  <span className="text-xs font-bold text-[#7A4219] uppercase tracking-wider">
                    2. Zorluk Derecesi
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setAiDifficulty('easy')}
                      className={`py-2 px-3 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                        aiDifficulty === 'easy'
                          ? 'bg-[#7A4219] text-[#FFF8E7] border-[#7A4219]'
                          : 'bg-[#FAF6F0] text-[#6E4223] border-[#D4C3B3] hover:border-[#7A4219]'
                      }`}
                    >
                      Kolay
                    </button>
                    <button
                      onClick={() => setAiDifficulty('impossible')}
                      className={`py-2 px-3 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                        aiDifficulty === 'impossible'
                          ? 'bg-[#7A4219] text-[#FFF8E7] border-[#7A4219]'
                          : 'bg-[#FAF6F0] text-[#6E4223] border-[#D4C3B3] hover:border-[#7A4219]'
                      }`}
                    >
                      Zor (Usta)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Start Offline Game Action Button */}
            <button
              onClick={() => onStartOfflineGame(offlineType, offlineType === 'vs-ai' ? aiDifficulty : undefined)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#7A4219] via-[#8B5A2B] to-[#63330F] text-[#FFF8E7] font-extrabold text-base shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all cursor-pointer border border-[#FFF8E7]/30"
            >
              <span>Oyunu Başlat</span>
              <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
            </button>
          </motion.div>
        )}

        {/* Tab 2 Content: Çevrimiçi Oyna */}
        {selectedTab === 'online' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            {/* Guest Restricted Warning Banner */}
            {isGuest && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#7A4219]/10 to-amber-500/10 border border-[#7A4219]/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-[#7A4219] text-[#FFF8E7] flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-[#2C1810] block">
                      Çevrimiçi Modlar Kayıtlı Üyelere Özeldir
                    </span>
                    <span className="text-[11px] text-[#6E4223] font-medium block">
                      Hızlı eşleşme, canlı meydan okuma ve skor tablosu için lütfen giriş yapın.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRequireAuth && onRequireAuth()}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#7A4219] hover:bg-[#8B5A2B] text-[#FFF8E7] font-black text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Giriş Yap / Üye Ol</span>
                </button>
              </div>
            )}

            {/* Quick Matchmaking */}
            <div className="bg-[#FFFDF9] border border-[#D4C3B3] rounded-2xl p-4 flex flex-col gap-3 shadow-md">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#7A4219]" />
                <span className="font-extrabold text-sm text-[#2C1810]">Hızlı Eşleşme</span>
              </div>
              <p className="text-xs text-[#6E4223]">
                Şu an çevrimiçi olan rastgele bir rakiple anında Dokuz Taş maçı yapın.
              </p>
              <button
                onClick={() => handleProtectedAction(onQuickMatch)}
                className="w-full py-3 rounded-xl bg-[#7A4219] hover:bg-[#8B5A2B] text-[#FFF8E7] font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <span>Eşleşme Ara</span>
                <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </div>

            {/* Özel Oda Kur / Katıl */}
            <div className="bg-[#FFFDF9] border border-[#D4C3B3] rounded-2xl p-4 flex flex-col gap-3 shadow-md">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#7A4219]" />
                <span className="font-extrabold text-sm text-[#2C1810]">Özel Oda İle Oyna</span>
              </div>
              <p className="text-xs text-[#6E4223]">
                Arkadaşınızla oynamak için bir oda kurun veya arkadaşınızın oda kodunu girin.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleProtectedAction(onCreateOnlineRoom)}
                  className="py-2.5 px-3 rounded-xl bg-[#FAF6F0] hover:bg-[#7A4219]/10 border border-[#7A4219]/30 text-[#7A4219] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Oda Oluştur</span>
                </button>
                <button
                  onClick={() => handleProtectedAction(() => setShowJoinModal(true))}
                  className="py-2.5 px-3 rounded-xl bg-[#FAF6F0] hover:bg-[#7A4219]/10 border border-[#7A4219]/30 text-[#7A4219] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Koda Katıl</span>
                </button>
              </div>
            </div>

            {/* Rakip Ara (Kullanıcı Adı veya E-posta) */}
            <div className="bg-[#FFFDF9] border border-[#D4C3B3] rounded-2xl p-4 flex flex-col gap-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#7A4219]" />
                  <span className="font-extrabold text-sm text-[#2C1810]">Rakip Ara & Meydan Oku</span>
                </div>
                <span className="text-[11px] text-[#6E4223] font-medium">Kullanıcı adı / e-posta</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearchUsers(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearchUsers(searchQuery);
                    }}
                    placeholder="Kayıtlı oyuncu adı veya e-posta girin..."
                    className="w-full bg-[#FAF6F0] border border-[#D4C3B3] rounded-xl py-2.5 pl-3 pr-8 text-xs font-bold text-[#2C1810] focus:outline-none focus:border-[#7A4219]"
                  />
                  {isSearching && (
                    <Loader2 className="w-4 h-4 text-[#7A4219] animate-spin absolute right-2.5 top-3" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleSearchUsers(searchQuery)}
                  className="px-3.5 py-2.5 bg-[#7A4219] hover:bg-[#8B5A2B] text-[#FFF8E7] font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Ara</span>
                </button>
              </div>

              {/* Arama Sonuçları */}
              {searchResults.length > 0 && (
                <div className="flex flex-col gap-2 mt-1 max-h-52 overflow-y-auto pr-1">
                  {searchResults.map((user) => (
                    <div
                      key={user.uid}
                      className="flex items-center justify-between p-2.5 bg-[#FAF6F0] border border-[#E8DFD5] rounded-xl hover:border-[#7A4219]/40 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#7A4219]/10 border border-[#7A4219]/20 flex items-center justify-center font-bold text-xs text-[#7A4219] shrink-0">
                          {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'OY'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-[#2C1810] truncate">
                              {user.displayName}
                            </span>
                            {user.isOnline ? (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Çevrimiçi" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" title={`Son görülme: ${formatLastSeen(user.lastSeen)}`} />
                            )}
                          </div>
                          <span className="text-[10px] text-[#6E4223] truncate flex items-center gap-1">
                            {user.isOnline ? (
                              <span className="text-emerald-700 font-semibold">Çevrimiçi</span>
                            ) : (
                              <span>{formatLastSeen(user.lastSeen)}</span>
                            )}
                            {user.email && <span>• {user.email}</span>}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleProtectedAction(() => {
                            if (onChallengeUser) {
                              onChallengeUser(user, 'dokuz-tas');
                            } else {
                              onCreateOnlineRoom();
                            }
                          })
                        }
                        className="px-3 py-1.5 bg-[#7A4219] hover:bg-[#8B5A2B] text-[#FFF8E7] font-extrabold text-xs rounded-lg shadow-xs flex items-center gap-1 transition-all cursor-pointer shrink-0"
                      >
                        <Swords className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Meydan Oku</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {hasSearched && searchResults.length === 0 && !isSearching && (
                <p className="text-xs text-center text-[#6E4223] italic py-2">
                  "{searchQuery}" aramasına uygun kayıtlı oyuncu bulunamadı.
                </p>
              )}
            </div>
          </motion.div>
        )}


        {/* Footer Links (Leaderboard, Rules & Admin) */}
        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          <button
            onClick={onOpenLeaderboard}
            className="text-xs font-bold text-[#7A4219] hover:text-[#5C3210] bg-[#FFFDF9] border border-[#D4C3B3] px-3 py-1.5 rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Trophy className="w-4 h-4 text-[#D4AF37]" />
            <span>Liderlik Tablosu</span>
          </button>

          <button
            onClick={onOpenRules}
            className="text-xs font-bold text-[#7A4219] hover:text-[#5C3210] bg-[#FFFDF9] border border-[#D4C3B3] px-3 py-1.5 rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Award className="w-4 h-4 text-[#7A4219]" />
            <span>Kurallar</span>
          </button>

          {isAdmin && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-xs font-black text-[#2C1810] bg-[#D4AF37] border border-[#B8860B] px-3 py-1.5 rounded-xl shadow-sm inline-flex items-center gap-1.5 cursor-pointer hover:bg-[#B8860B] hover:text-white transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Paneli</span>
            </button>
          )}
        </div>

        {/* Dashboard Banner Ad Slot */}
        <BannerAd 
          placement="dashboard" 
          className="mt-3" 
          isAdFree={Boolean(currentUser?.isAdFree || isAdFreeLocally())} 
          onOpenAdFreeModal={onOpenAdFreeModal}
        />

      </div>

      {/* Join Room Modal Dialog */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FFFDF9] border-2 border-[#7A4219] rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 text-[#2C1810] shadow-2xl">
            <h3 className="text-xl font-black text-[#7A4219] text-center font-serif">
              Odaya Katıl
            </h3>
            <p className="text-xs text-[#6E4223] text-center font-medium">
              Arkadaşınızın oluşturduğu Oda Kodunu aşağıya girin:
            </p>

            <input
              type="text"
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value)}
              placeholder="Oda Kodunu Girin..."
              className="bg-[#FAF6F0] border border-[#7A4219]/50 rounded-xl p-3 text-center text-sm font-bold tracking-widest text-[#2C1810] uppercase focus:outline-none focus:border-[#7A4219]"
            />

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#E8DFD5] text-xs font-bold text-[#2C1810] hover:bg-[#D4C3B3] transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  if (roomCodeInput.trim()) {
                    onJoinOnlineRoom(roomCodeInput.trim());
                    setShowJoinModal(false);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#7A4219] text-[#FFF8E7] text-xs font-extrabold hover:bg-[#8B5A2B] transition-colors cursor-pointer"
              >
                Katıl
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
