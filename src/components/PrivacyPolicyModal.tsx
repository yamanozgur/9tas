import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Globe, Lock, UserCheck, Smartphone, Database, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const [lang, setLang] = useState<'tr' | 'en'>('tr');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-2xl bg-[#FFFDF9] border-2 border-[#7A4219] rounded-2xl text-[#2C1810] p-4 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#D4C3B3] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#7A4219]/10 rounded-xl border border-[#7A4219]/30 text-[#7A4219]">
              <ShieldCheck className="w-6 h-6 text-[#7A4219]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#7A4219] font-serif">
                {lang === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
              </h2>
              <p className="text-[11px] sm:text-xs text-[#6E4223] font-medium">
                {lang === 'tr' ? 'Son güncelleme: 21/08/2026' : 'Last updated: 21/08/2026'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex bg-[#FAF6F0] p-0.5 rounded-xl border border-[#D4C3B3] text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang('tr')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  lang === 'tr'
                    ? 'bg-[#7A4219] text-[#FFF8E7] shadow-xs'
                    : 'text-[#6E4223] hover:text-[#2C1810]'
                }`}
              >
                TR
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#7A4219] text-[#FFF8E7] shadow-xs'
                    : 'text-[#6E4223] hover:text-[#2C1810]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#E8DFD5] text-[#2C1810] transition-colors cursor-pointer border border-[#D4C3B3]"
              title={lang === 'tr' ? 'Kapat' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="py-4 overflow-y-auto space-y-4 text-xs font-medium pr-1.5 leading-relaxed text-[#2C1810]">
          
          {lang === 'tr' ? (
            /* ==================== TÜRKÇE GİZLİLİK POLİTİKASI ==================== */
            <div className="space-y-4">
              <div className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#D4C3B3] text-xs leading-relaxed text-[#4A2612]">
                Bu Gizlilik Politikası, <strong>"Dokuz Taş"</strong> ("Uygulama") mobil/web uygulamasını kullanırken toplanan, işlenen ve saklanan kişisel verilerinize ilişkin bilgilendirme amacıyla hazırlanmıştır. Uygulamayı kullanarak bu politikada açıklanan veri işleme faaliyetlerini kabul etmiş sayılırsınız.
              </div>

              {/* 1. Veri Sorumlusu */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <UserCheck className="w-4 h-4 text-[#7A4219]" />
                  <h3>1. Veri Sorumlusu</h3>
                </div>
                <p className="text-xs text-[#2C1810]">
                  Uygulama, <strong>Özgür YAMAN</strong> tarafından geliştirilmekte ve işletilmektedir.
                </p>
                <p className="text-xs text-[#6E4223] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#7A4219]" />
                  <span>İletişim: </span>
                  <a href="mailto:yamanozgur@gmail.com" className="text-[#7A4219] font-bold underline hover:text-[#8B5A2B]">
                    yamanozgur@gmail.com
                  </a>
                </p>
              </div>

              {/* 2. Toplanan Veriler */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <Database className="w-4 h-4 text-[#7A4219]" />
                  <h3>2. Toplanan Veriler</h3>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-[#7A4219] block mb-0.5">Hesap Bilgileri (kayıtlı kullanıcılar için):</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-[#4A2612] pl-1">
                      <li>E-posta adresi</li>
                      <li>Kullanıcı adı / görünen ad</li>
                      <li>Google hesabı ile giriş yapılması durumunda Google tarafından sağlanan temel profil bilgileri (ad, e-posta, profil fotoğrafı)</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-[#7A4219] block mb-0.5">Oyun ve Kullanım Verileri:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-[#4A2612] pl-1">
                      <li>Oyun istatistikleri (kazanma/kaybetme sayısı, oynanan oyun sayısı)</li>
                      <li>Çevrimiçi durum bilgisi (aktif/çevrimdışı)</li>
                      <li>Çevrimiçi oyun eşleştirme ve rakip bilgileri (kullanıcı adı düzeyinde)</li>
                    </ul>
                  </div>

                  <div className="bg-[#FAF6F0] p-2.5 rounded-lg border border-[#E8DFD5]">
                    <strong className="text-[#7A4219] block mb-0.5">Misafir Kullanıcılar:</strong>
                    <p className="text-[#4A2612]">
                      Hesap oluşturmadan "Misafir" olarak oynayan kullanıcılar için kişisel veri toplanmaz; oyun verileri yalnızca cihazda (local storage) tutulur ve sunucularımıza aktarılmaz. Misafir kullanıcılar çevrimiçi rekabetli oyun moduna ve skor tablosuna (leaderboard) erişemez.
                    </p>
                  </div>

                  <div>
                    <strong className="text-[#7A4219] block mb-0.5">Satın Alma Bilgisi:</strong>
                    <p className="text-[#4A2612]">
                      "Reklamları Kaldır" satın alımı yapıldığında, satın alma durumu hesabınızla (veya cihazınızla, misafir kullanıcıda) ilişkilendirilerek saklanır. Ödeme bilgileriniz (kart numarası vb.) tarafımızca görülmez veya saklanmaz; ödeme işlemi tamamen Google Play / Apple App Store altyapısı üzerinden gerçekleşir.
                    </p>
                  </div>

                  <div>
                    <strong className="text-[#7A4219] block mb-0.5">Otomatik Toplanan Veriler:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-[#4A2612] pl-1">
                      <li>Cihaz tanımlayıcı bilgileri (reklam kimliği dahil)</li>
                      <li>Uygulama kullanım/etkileşim verileri</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. Verilerin Kullanım Amaçları */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-2 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <CheckCircle2 className="w-4 h-4 text-[#7A4219]" />
                  <h3>3. Verilerin Kullanım Amaçları</h3>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#4A2612] pl-1">
                  <li>Hesap oluşturma, giriş ve kimlik doğrulama işlemlerinin sağlanması</li>
                  <li>Çevrimiçi çok oyunculu oyun deneyiminin (rakip eşleştirme, davet sistemi) sunulması</li>
                  <li>Oyun istatistiklerinin ve skor tablosunun (leaderboard) oluşturulması</li>
                  <li>Reklamların gösterilmesi ve "reklamsız" satın alım durumunun takibi</li>
                  <li>Uygulamanın teknik olarak sürdürülmesi, hata tespiti ve iyileştirilmesi</li>
                </ul>
              </div>

              {/* 4. Üçüncü Taraf Hizmet Sağlayıcılar */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <Globe className="w-4 h-4 text-[#7A4219]" />
                  <h3>4. Üçüncü Taraf Hizmet Sağlayıcılar</h3>
                </div>
                <p className="text-xs text-[#4A2612]">
                  Uygulama aşağıdaki üçüncü taraf hizmetleri kullanır:
                </p>
                <div className="space-y-2">
                  <div className="bg-[#FAF6F0] p-2.5 rounded-lg border border-[#E8DFD5]">
                    <span className="font-bold text-[#7A4219] block">Google Firebase:</span>
                    <span className="text-[#4A2612] block text-[11px]">
                      Kimlik doğrulama, veritabanı, gerçek zamanlı oyun senkronizasyonu.
                    </span>
                    <a
                      href="https://firebase.google.com/support/privacy"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#7A4219] font-bold underline mt-1 hover:text-[#8B5A2B]"
                    >
                      <span>Firebase Gizlilik Politikası</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="bg-[#FAF6F0] p-2.5 rounded-lg border border-[#E8DFD5]">
                    <span className="font-bold text-[#7A4219] block">Google AdMob:</span>
                    <span className="text-[#4A2612] block text-[11px]">
                      Reklam gösterimi. AdMob, reklamları kişiselleştirmek amacıyla cihaz reklam kimliği ve kullanım verisi toplayabilir.
                    </span>
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#7A4219] font-bold underline mt-1 hover:text-[#8B5A2B]"
                    >
                      <span>Google Gizlilik Politikası</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <p className="text-[11px] text-[#6E4223] italic">
                  Bu hizmet sağlayıcılar, kendi gizlilik politikaları çerçevesinde veri işleyebilir; bu işlemler üzerinde doğrudan kontrolümüz sınırlıdır.
                </p>
              </div>

              {/* 5. Verilerin Saklanma Süresi */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <Database className="w-4 h-4 text-[#7A4219]" />
                  <h3>5. Verilerin Saklanma Süresi</h3>
                </div>
                <p className="text-xs text-[#4A2612]">
                  Hesap verileriniz, hesabınız aktif olduğu sürece saklanır. Hesabınızı silmek istemeniz halinde, aşağıdaki iletişim kanalından talepte bulunabilirsiniz; talebiniz makul bir süre içinde işleme alınır.
                </p>
              </div>

              {/* 6. Kullanıcı Hakları */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-2 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <ShieldCheck className="w-4 h-4 text-[#7A4219]" />
                  <h3>6. Kullanıcı Hakları (KVKK ve ilgili mevzuat kapsamında)</h3>
                </div>
                <p className="text-xs text-[#4A2612]">
                  6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında şu haklara sahipsiniz:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#4A2612] pl-1">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>İşlenen verileriniz hakkında bilgi talep etme</li>
                  <li>Verilerinizin düzeltilmesini veya silinmesini talep etme</li>
                  <li>İşlemenin kısıtlanmasını talep etme</li>
                  <li>Verilerinizin aktarıldığı üçüncü kişileri öğrenme</li>
                </ul>
                <p className="text-xs text-[#6E4223] pt-1">
                  Bu haklarınızı kullanmak için <a href="mailto:yamanozgur@gmail.com" className="text-[#7A4219] font-bold underline">yamanozgur@gmail.com</a> adresinden bizimle iletişime geçebilirsiniz.
                </p>
              </div>

              {/* 7. Çocukların Gizliliği */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <UserCheck className="w-4 h-4 text-[#7A4219]" />
                  <h3>7. Çocukların Gizliliği</h3>
                </div>
                <p className="text-xs text-[#4A2612]">
                  Uygulama genel kitleye yöneliktir. 13 yaş altı çocuklardan bilerek kişisel veri toplanmamaktadır. Ebeveyn veya vasi olarak, 13 yaş altı bir çocuğunuzun bize kişisel veri sağladığını düşünüyorsanız lütfen bizimle iletişime geçin; ilgili verileri sileriz.
                </p>
              </div>

              {/* 8. Veri Güvenliği */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <Lock className="w-4 h-4 text-[#7A4219]" />
                  <h3>8. Veri Güvenliği</h3>
                </div>
                <p className="text-xs text-[#4A2612]">
                  Verilerinizin güvenliğini sağlamak amacıyla makul teknik ve idari önlemler alınmaktadır. Ancak internet üzerinden hiçbir veri iletiminin veya elektronik saklamanın %100 güvenli olduğu garanti edilemez.
                </p>
              </div>

              {/* 9. Politika Değişiklikleri */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <ChevronRight className="w-4 h-4 text-[#7A4219]" />
                  <h3>9. Politika Değişiklikleri</h3>
                </div>
                <p className="text-xs text-[#4A2612]">
                  Bu Gizlilik Politikası zaman zaman güncellenebilir. Önemli değişiklikler olması halinde, uygulama içinde bilgilendirme yapılacaktır. Güncel politika her zaman bu sayfada yayınlanır.
                </p>
              </div>

              {/* 10. İletişim */}
              <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#7A4219]/30 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <Mail className="w-4 h-4 text-[#7A4219]" />
                  <h3>10. İletişim</h3>
                </div>
                <p className="text-xs text-[#2C1810]">
                  Gizlilik politikasıyla ilgili sorularınız için:
                </p>
                <p className="text-xs font-bold text-[#7A4219]">
                  E-posta:{' '}
                  <a href="mailto:yamanozgur@gmail.com" className="underline hover:text-[#8B5A2B]">
                    yamanozgur@gmail.com
                  </a>
                </p>
              </div>
            </div>
          ) : (
            /* ==================== ENGLISH PRIVACY POLICY ==================== */
            <div className="space-y-4">
              <div className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#D4C3B3] text-xs leading-relaxed text-[#4A2612]">
                This Privacy Policy explains how the <strong>"Dokuz Taş"</strong> ("the App") collects, uses, and stores your personal data.
              </div>

              {/* 1. Data Controller */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <UserCheck className="w-4 h-4 text-[#7A4219]" />
                  <h3>1. Data Controller</h3>
                </div>
                <p className="text-xs text-[#2C1810]">
                  The App is developed and operated by <strong>Özgür YAMAN</strong>.
                </p>
                <p className="text-xs text-[#6E4223] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#7A4219]" />
                  <span>Contact: </span>
                  <a href="mailto:yamanozgur@gmail.com" className="text-[#7A4219] font-bold underline hover:text-[#8B5A2B]">
                    yamanozgur@gmail.com
                  </a>
                </p>
              </div>

              {/* 2. Data We Collect */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <Database className="w-4 h-4 text-[#7A4219]" />
                  <h3>2. Data We Collect</h3>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-[#7A4219] block mb-0.5">Account Information (registered users):</strong>
                    <p className="text-[#4A2612]">
                      Email address, display name, basic Google profile info if signing in with Google.
                    </p>
                  </div>

                  <div>
                    <strong className="text-[#7A4219] block mb-0.5">Gameplay Data:</strong>
                    <p className="text-[#4A2612]">
                      Win/loss statistics, games played count, online presence status, matchmaking/opponent info (username level).
                    </p>
                  </div>

                  <div className="bg-[#FAF6F0] p-2.5 rounded-lg border border-[#E8DFD5]">
                    <strong className="text-[#7A4219] block mb-0.5">Guest Users:</strong>
                    <p className="text-[#4A2612]">
                      No personal data is collected for guests; game data is stored locally on-device only. Guests cannot access ranked online play or the leaderboard.
                    </p>
                  </div>

                  <div>
                    <strong className="text-[#7A4219] block mb-0.5">Purchase Data:</strong>
                    <p className="text-[#4A2612]">
                      "Remove Ads" purchase status is linked to your account/device. Payment details are handled entirely by Google Play / Apple App Store; we never see or store card information.
                    </p>
                  </div>

                  <div>
                    <strong className="text-[#7A4219] block mb-0.5">Automatically Collected Data:</strong>
                    <p className="text-[#4A2612]">
                      Device identifiers (including advertising ID), app usage/interaction data.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. How We Use Your Data */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-2 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <CheckCircle2 className="w-4 h-4 text-[#7A4219]" />
                  <h3>3. How We Use Your Data</h3>
                </div>
                <p className="text-xs text-[#4A2612]">
                  To provide account creation and authentication, enable online multiplayer (matchmaking, invites), maintain statistics and leaderboards, serve ads and track ad-free purchase status, and maintain/improve the App.
                </p>
              </div>

              {/* 4. Third-Party Services */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <Globe className="w-4 h-4 text-[#7A4219]" />
                  <h3>4. Third-Party Services</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-[#FAF6F0] p-2.5 rounded-lg border border-[#E8DFD5]">
                    <span className="font-bold text-[#7A4219] block">Google Firebase:</span>
                    <span className="text-[#4A2612] block text-[11px]">Authentication, database, real-time sync.</span>
                    <a
                      href="https://firebase.google.com/support/privacy"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#7A4219] font-bold underline mt-1 hover:text-[#8B5A2B]"
                    >
                      <span>https://firebase.google.com/support/privacy</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="bg-[#FAF6F0] p-2.5 rounded-lg border border-[#E8DFD5]">
                    <span className="font-bold text-[#7A4219] block">Google AdMob:</span>
                    <span className="text-[#4A2612] block text-[11px]">Advertising.</span>
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#7A4219] font-bold underline mt-1 hover:text-[#8B5A2B]"
                    >
                      <span>https://policies.google.com/privacy</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* 5. Data Retention */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <Database className="w-4 h-4 text-[#7A4219]" />
                  <h3>5. Data Retention</h3>
                </div>
                <p className="text-xs text-[#4A2612]">
                  Account data is retained while your account is active. You may request deletion at any time via the contact email below.
                </p>
              </div>

              {/* 6. Your Rights */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <ShieldCheck className="w-4 h-4 text-[#7A4219]" />
                  <h3>6. Your Rights</h3>
                </div>
                <p className="text-xs text-[#4A2612]">
                  Depending on your jurisdiction (including under Turkish KVKK / EU GDPR where applicable), you may have the right to access, correct, delete, or restrict processing of your data, and to learn which third parties it is shared with. Contact us to exercise these rights.
                </p>
              </div>

              {/* 7. Children's Privacy */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <UserCheck className="w-4 h-4 text-[#7A4219]" />
                  <h3>7. Children's Privacy</h3>
                </div>
                <p className="text-xs text-[#4A2612]">
                  The App is intended for a general audience. We do not knowingly collect personal data from children under 13. If you believe a child has provided us personal data, please contact us and we will delete it.
                </p>
              </div>

              {/* 8. Data Security */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <Lock className="w-4 h-4 text-[#7A4219]" />
                  <h3>8. Data Security</h3>
                </div>
                <p className="text-xs text-[#4A2612]">
                  We take reasonable technical and organizational measures to protect your data. No method of transmission or storage is 100% secure.
                </p>
              </div>

              {/* 9. Changes to This Policy */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#D4C3B3] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <ChevronRight className="w-4 h-4 text-[#7A4219]" />
                  <h3>9. Changes to This Policy</h3>
                </div>
                <p className="text-xs text-[#4A2612]">
                  This policy may be updated periodically. Material changes will be communicated in-app. The current version is always available on this page.
                </p>
              </div>

              {/* 10. Contact */}
              <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#7A4219]/30 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A4219]">
                  <Mail className="w-4 h-4 text-[#7A4219]" />
                  <h3>10. Contact</h3>
                </div>
                <p className="text-xs font-bold text-[#7A4219]">
                  Email:{' '}
                  <a href="mailto:yamanozgur@gmail.com" className="underline hover:text-[#8B5A2B]">
                    yamanozgur@gmail.com
                  </a>
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#D4C3B3] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#A89280]">
            Dokuz Taş © 2026 • Özgür YAMAN
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#7A4219] hover:bg-[#8B5A2B] text-[#FFF8E7] font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            {lang === 'tr' ? 'Anladım' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
