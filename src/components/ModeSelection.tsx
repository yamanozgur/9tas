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
  Check, 
  ArrowRight,
  ChevronRight,
  Award,
  Zap,
  Trophy
} from 'lucide-react';
import { UserProfile, loginWithGoogle } from '../lib/firebase';
import { GameMode, AIDifficulty } from '../types';

interface ModeSelectionProps {
  currentUser: UserProfile | null;
  onUpdateUserName: (name: string) => Promise<void>;
  onStartOfflineGame: (mode: GameMode, difficulty?: AIDifficulty) => void;
  onCreateOnlineRoom: () => void;
  onJoinOnlineRoom: (code: string) => void;
  onQuickMatch: () => void;
  onOpenRules: () => void;
  onOpenLeaderboard: () => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({
  currentUser,
  onUpdateUserName,
  onStartOfflineGame,
  onCreateOnlineRoom,
  onJoinOnlineRoom,
  onQuickMatch,
  onOpenRules,
  onOpenLeaderboard,
}) => {
  const [selectedTab, setSelectedTab] = useState<'offline' | 'online'>('offline');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('impossible');
  const [offlineType, setOfflineType] = useState<'vs-ai' | 'pass-and-play'>('vs-ai');
  const [guestNameInput, setGuestNameInput] = useState<string>(currentUser?.displayName || 'Oyuncu 1');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);

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
                  <h3 className="text-base font-bold text-[#2C1810] truncate">
                    {currentUser?.displayName || 'Misafir Oyuncu'}
                  </h3>
                )}
              </div>
            </div>

            {!isEditingName && (
              <button
                onClick={() => setIsEditingName(true)}
                className="text-xs text-[#7A4219] font-extrabold px-3 py-1.5 bg-[#8B5A2B]/10 border border-[#8B5A2B]/30 rounded-xl hover:bg-[#8B5A2B]/20 transition-colors cursor-pointer shrink-0"
              >
                İsim Değiştir
              </button>
            )}
          </div>

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
                onClick={onQuickMatch}
                className="w-full py-3 rounded-xl bg-[#7A4219] hover:bg-[#8B5A2B] text-[#FFF8E7] font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <span>Eşleşme Ara</span>
                <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </div>

            {/* Room Creation & Joining */}
            <div className="bg-[#FFFDF9] border border-[#D4C3B3] rounded-2xl p-4 flex flex-col gap-3 shadow-md">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#7A4219]" />
                <span className="font-extrabold text-sm text-[#2C1810]">Özel Oda (Arkadaşınla Oyna)</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  onClick={onCreateOnlineRoom}
                  className="p-3.5 rounded-xl border-2 border-[#D4C3B3] bg-[#FAF6F0] hover:border-[#7A4219] hover:bg-[#7A4219]/10 text-[#2C1810] flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5 text-[#7A4219]" />
                  <span className="font-bold text-xs">Oda Oluştur</span>
                </button>

                <button
                  onClick={() => setShowJoinModal(true)}
                  className="p-3.5 rounded-xl border-2 border-[#D4C3B3] bg-[#FAF6F0] hover:border-[#7A4219] hover:bg-[#7A4219]/10 text-[#2C1810] flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogIn className="w-5 h-5 text-[#7A4219]" />
                  <span className="font-bold text-xs">Odaya Katıl</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer Links (Leaderboard & Rules) */}
        <div className="flex items-center justify-center gap-4 pt-2">
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
        </div>

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
