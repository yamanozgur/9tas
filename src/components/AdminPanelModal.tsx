import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Search, 
  RefreshCw, 
  X, 
  Award, 
  Activity, 
  Mail, 
  UserCheck, 
  Copy, 
  Check,
  UserX,
  Crown,
  Trophy
} from 'lucide-react';
import { fetchAllUsersAdmin, UserProfile } from '../lib/firebase';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAdminEmail?: string;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  currentAdminEmail = 'yamanozgur@gmail.com',
}) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'online' | 'email' | 'guest'>('all');
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllUsersAdmin();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users for admin:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  // Filtered users calculation
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !term ||
      (u.displayName && u.displayName.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      u.uid.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (filterType === 'online') return u.isOnline;
    if (filterType === 'email') return !!u.email;
    if (filterType === 'guest') return !u.email;
    return true;
  });

  const totalUsers = users.length;
  const onlineCount = users.filter((u) => u.isOnline).length;
  const emailUsersCount = users.filter((u) => u.email).length;
  const guestUsersCount = users.filter((u) => !u.email).length;
  const totalGamesPlayed = users.reduce((acc, u) => {
    const dtWins = u.stats?.dokuzTasWins || 0;
    const dtLosses = u.stats?.dokuzTasLosses || 0;
    const utWins = u.stats?.ucTasWins || 0;
    const utLosses = u.stats?.ucTasLosses || 0;
    return acc + dtWins + dtLosses + utWins + utLosses;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFDF9] border-2 border-[#7A4219] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-[#2C1810]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#2C1810] via-[#4A2818] to-[#2C1810] text-[#FFF8E7] flex items-center justify-between border-b border-[#7A4219]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-serif text-[#FFF8E7] tracking-wide">
                  Yönetici (Admin) Paneli
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#2C1810] text-[10px] font-black uppercase tracking-wider">
                  Sistem
                </span>
              </div>
              <p className="text-xs text-[#D4AF37]/90 font-medium flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3 h-3 text-[#D4AF37]" />
                <span>Giriş Yapan Yetkili: {currentAdminEmail}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadUsers}
              disabled={isLoading}
              className="p-2 rounded-xl bg-[#FFF8E7]/10 hover:bg-[#FFF8E7]/20 text-[#FFF8E7] transition-colors cursor-pointer disabled:opacity-50"
              title="Yenile"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#FFF8E7]/10 hover:bg-red-500/20 text-[#FFF8E7] hover:text-red-300 transition-colors cursor-pointer"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Stats Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#FAF6F0] border border-[#7A4219]/20 p-3.5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between text-[#8B5A2B] text-xs font-bold mb-1">
                <span>Toplam Kullanıcı</span>
                <Users className="w-4 h-4 text-[#7A4219]" />
              </div>
              <div className="text-2xl font-black text-[#2C1810] font-serif">{totalUsers}</div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between text-emerald-700 text-xs font-bold mb-1">
                <span>Aktif Çevrimiçi</span>
                <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
              </div>
              <div className="text-2xl font-black text-emerald-900 font-serif">{onlineCount}</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-1">
                <span>E-posta / Misafir</span>
                <UserCheck className="w-4 h-4 text-amber-700" />
              </div>
              <div className="text-xl font-black text-amber-900 font-serif">
                {emailUsersCount} <span className="text-xs font-normal text-amber-700">/ {guestUsersCount}</span>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between text-purple-800 text-xs font-bold mb-1">
                <span>Oynanan Maçlar</span>
                <Trophy className="w-4 h-4 text-purple-700" />
              </div>
              <div className="text-2xl font-black text-purple-900 font-serif">{totalGamesPlayed}</div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-[#FAF6F0] p-3 rounded-xl border border-[#7A4219]/15">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5A2B]/60" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="İsim, E-posta veya UID ile ara..."
                className="w-full pl-9 pr-3 py-2 bg-[#FFFDF9] border border-[#7A4219]/25 rounded-lg text-xs text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#7A4219]/50"
              />
            </div>

            {/* Segmented Filter Buttons */}
            <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto text-xs font-bold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterType === 'all'
                    ? 'bg-[#7A4219] text-[#FFF8E7]'
                    : 'bg-[#FFFDF9] text-[#6E4223] hover:bg-[#7A4219]/10 border border-[#7A4219]/20'
                }`}
              >
                Tümü ({totalUsers})
              </button>
              <button
                onClick={() => setFilterType('online')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterType === 'online'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#FFFDF9] text-[#6E4223] hover:bg-emerald-50 border border-[#7A4219]/20'
                }`}
              >
                Çevrimiçi ({onlineCount})
              </button>
              <button
                onClick={() => setFilterType('email')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterType === 'email'
                    ? 'bg-amber-800 text-white'
                    : 'bg-[#FFFDF9] text-[#6E4223] hover:bg-amber-50 border border-[#7A4219]/20'
                }`}
              >
                Üyeler ({emailUsersCount})
              </button>
              <button
                onClick={() => setFilterType('guest')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterType === 'guest'
                    ? 'bg-stone-700 text-white'
                    : 'bg-[#FFFDF9] text-[#6E4223] hover:bg-stone-100 border border-[#7A4219]/20'
                }`}
              >
                Misafirler ({guestUsersCount})
              </button>
            </div>
          </div>

          {/* User List Table */}
          <div className="border border-[#7A4219]/20 rounded-xl overflow-hidden bg-[#FFFDF9] shadow-sm">
            {isLoading ? (
              <div className="p-8 text-center text-[#8B5A2B] flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-[#7A4219]" />
                <span className="text-xs font-bold">Kullanıcı verileri yükleniyor...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-[#8B5A2B] flex flex-col items-center gap-2">
                <UserX className="w-8 h-8 text-[#8B5A2B]/40" />
                <span className="text-xs font-bold">Kriterlere uygun kullanıcı bulunamadı.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF6F0] border-b border-[#7A4219]/15 text-[#7A4219] font-black uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Kullanıcı / Durum</th>
                      <th className="py-3 px-4">E-posta</th>
                      <th className="py-3 px-4">UID</th>
                      <th className="py-3 px-4 text-center">Dokuz Taş (G/M)</th>
                      <th className="py-3 px-4 text-center">Üç Taş (G/M)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#7A4219]/10">
                    {filteredUsers.map((u) => {
                      const dtWins = u.stats?.dokuzTasWins || 0;
                      const dtLosses = u.stats?.dokuzTasLosses || 0;
                      const utWins = u.stats?.ucTasWins || 0;
                      const utLosses = u.stats?.ucTasLosses || 0;
                      const isAdmin = u.email === 'yamanozgur@gmail.com';

                      return (
                        <tr key={u.uid} className="hover:bg-[#FAF6F0]/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-[#2C1810]">
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                {u.photoURL ? (
                                  <img 
                                    src={u.photoURL} 
                                    alt={u.displayName} 
                                    className="w-7 h-7 rounded-full object-cover border border-[#7A4219]/30"
                                  />
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-[#8B5A2B]/15 text-[#7A4219] font-black flex items-center justify-center text-xs">
                                    {u.displayName ? u.displayName[0].toUpperCase() : 'U'}
                                  </div>
                                )}
                                <span 
                                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                    u.isOnline ? 'bg-emerald-500' : 'bg-gray-300'
                                  }`} 
                                  title={u.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="flex items-center gap-1">
                                  {u.displayName || 'İsimsiz Oyuncu'}
                                  {isAdmin && (
                                    <span title="Admin">
                                      <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
                                    </span>
                                  )}
                                </span>
                                <span className="text-[10px] text-[#8B5A2B]/70 font-normal">
                                  {u.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-[#5C3210]">
                            {u.email ? (
                              <span className="font-medium">{u.email}</span>
                            ) : (
                              <span className="italic text-[#8B5A2B]/50">Misafir</span>
                            )}
                          </td>

                          <td className="py-3 px-4 font-mono text-[11px] text-[#7A4219]">
                            <div className="flex items-center gap-1">
                              <span className="truncate max-w-[100px]">{u.uid}</span>
                              <button
                                onClick={() => handleCopy(u.uid)}
                                className="p-1 hover:bg-[#7A4219]/10 rounded text-[#8B5A2B] transition-colors cursor-pointer"
                                title="UID Kopyala"
                              >
                                {copiedUid === u.uid ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-center font-bold">
                            <span className="text-emerald-700">{dtWins}G</span> / <span className="text-red-700">{dtLosses}M</span>
                          </td>

                          <td className="py-3 px-4 text-center font-bold">
                            <span className="text-emerald-700">{utWins}G</span> / <span className="text-red-700">{utLosses}M</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-[#FAF6F0] border-t border-[#7A4219]/15 flex items-center justify-between text-xs text-[#8B5A2B]">
          <span>Görüntülenen: {filteredUsers.length} / {totalUsers} Kullanıcı</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#7A4219] text-[#FFF8E7] font-bold hover:bg-[#8B5A2B] transition-colors cursor-pointer shadow-sm"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
