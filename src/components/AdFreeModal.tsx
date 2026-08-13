import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  VolumeX, 
  Crown, 
  Lock,
  Loader2
} from 'lucide-react';
import { toggleUserAdFreeStatus, UserProfile } from '../lib/firebase';

interface AdFreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onAdFreeActivated: () => void;
}

export const AdFreeModal: React.FC<AdFreeModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAdFreeActivated,
}) => {
  const [cardName, setCardName] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvc, setCvc] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFormatCardNumber = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  const handleFormatExpiry = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic validation
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setErrorMsg('Lütfen 16 haneli geçerli bir kart numarası giriniz.');
      return;
    }
    if (!cardName.trim()) {
      setErrorMsg('Lütfen kart üzerindeki ismi giriniz.');
      return;
    }
    if (expiry.length < 5) {
      setErrorMsg('Lütfen geçerli bir son kullanma tarihi giriniz (AA/YY).');
      return;
    }
    if (cvc.length < 3) {
      setErrorMsg('Lütfen 3 haneli CVC kodunu giriniz.');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const uid = currentUser?.uid || 'guest_user';
      if (currentUser?.uid) {
        await toggleUserAdFreeStatus(currentUser.uid, true);
      }

      // Update local storage for guest or local user persistence
      const storedLocalUser = localStorage.getItem('local_email_user');
      if (storedLocalUser) {
        try {
          const parsed = JSON.parse(storedLocalUser);
          parsed.isAdFree = true;
          localStorage.setItem('local_email_user', JSON.stringify(parsed));
        } catch (err) {}
      } else {
        localStorage.setItem('guest_is_ad_free', 'true');
      }

      setIsSuccess(true);
      onAdFreeActivated();
    } catch (err) {
      console.error('Payment processing error:', err);
      setErrorMsg('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-[#FFFDF9] border-2 border-[#7A4219] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-[#2C1810] relative">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#2C1810] via-[#5C3210] to-[#2C1810] text-[#FFF8E7] p-5 border-b border-[#D4AF37]/30 relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-[#FFF8E7] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-[#2C1810] shadow-lg mb-2 border border-yellow-200">
            <Crown className="w-7 h-7 fill-[#2C1810]/20" />
          </div>

          <h3 className="text-xl font-black font-serif tracking-wide text-[#FFF8E7]">
            REKLAMSIZ ÜYELİK
          </h3>
          <p className="text-xs text-[#D4AF37] font-semibold mt-0.5">
            Ömür Boyu Tek Seferlik Ödeme
          </p>

          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-yellow-200 font-extrabold text-lg shadow-inner">
            <span className="text-2xl font-black text-amber-300">29.90 ₺</span>
            <span className="text-[10px] uppercase font-bold text-yellow-100/80 tracking-wider">/ Tek Sefer</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-scale-up">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400 shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-[#2C1810]">Ödeme Başarılı!</h4>
                <p className="text-xs text-[#7A4219] font-medium max-w-xs mx-auto">
                  Tebrikler! Reklamsız üyeliğiniz hesabınıza tanımlandı. Artık hiçbir reklam görmeden kesintisiz oynayabilirsiniz.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7A4219] via-[#8B5A2B] to-[#63330F] text-[#FFF8E7] font-black text-sm shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer"
              >
                Oynamaya Başla
              </button>
            </div>
          ) : (
            <>
              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#7A4219]/15 flex items-start gap-2">
                  <VolumeX className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black text-[#2C1810]">Sıfır Reklam</h5>
                    <p className="text-[10px] text-[#7A4219]">Banner ve video reklamlar engellenir.</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#7A4219]/15 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black text-[#2C1810]">Kesintisiz Akış</h5>
                    <p className="text-[10px] text-[#7A4219]">Maç aralarında takılmadan devam edin.</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#7A4219]/15 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black text-[#2C1810]">VIP Rozet</h5>
                    <p className="text-[10px] text-[#7A4219]">Profilinizde ayrıcalıklı rozet görünür.</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#7A4219]/15 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black text-[#2C1810]">Süresiz Erişim</h5>
                    <p className="text-[10px] text-[#7A4219]">Aylık abonelik yok, tek seferlik ödeme.</p>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePaymentSubmit} className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#7A4219] pb-1 border-b border-[#7A4219]/15">
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" /> Ödeme Bilgileri (29.90 ₺)
                  </span>
                  <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> 256-Bit SSL Güvenli
                  </span>
                </div>

                {errorMsg && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-[#6E4223] mb-1">
                    Kart Üzerindeki İsim
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Ahmet Yılmaz"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#D4C3B3] text-xs font-bold text-[#2C1810] focus:outline-none focus:border-[#7A4219]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6E4223] mb-1">
                    Kart Numarası
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => handleFormatCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#D4C3B3] text-xs font-bold text-[#2C1810] font-mono tracking-wider focus:outline-none focus:border-[#7A4219]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6E4223] mb-1">
                      Son Kullanma (AA/YY)
                    </label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => handleFormatExpiry(e.target.value)}
                      placeholder="12/28"
                      maxLength={5}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#D4C3B3] text-xs font-bold text-[#2C1810] font-mono text-center focus:outline-none focus:border-[#7A4219]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6E4223] mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      required
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="123"
                      maxLength={3}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#D4C3B3] text-xs font-bold text-[#2C1810] font-mono text-center focus:outline-none focus:border-[#7A4219]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-[#7A4219] via-[#8B5A2B] to-[#63330F] text-[#FFF8E7] font-black text-sm shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all cursor-pointer border border-[#FFF8E7]/30 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      <span>Güvenli Ödeme Yapılıyor...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#D4AF37]" />
                      <span>29.90 ₺ Öde ve Reklamları Kaldır</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-[#8B5A2B] font-medium pt-1">
                  💡 Ödeme gerçekleştikten sonra reklamsız üyelik süresiz aktif olur.
                </p>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
