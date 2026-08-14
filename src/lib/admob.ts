/**
 * Google AdMob / AdSense Configuration & Utility Module
 * 
 * Bu dosya reklam kimliklerini (AdMob Unit ID) ve reklam yapılandırma kurallarını yönetir.
 * Gerçek Google AdMob hesabınızı açtıktan sonra aşağıdaki TEST ID'lerini kendi AdMob ID'lerinizle değiştirebilirsiniz.
 */

export interface AdMobConfig {
  // Google AdMob App ID
  appId: string;
  // Banner Reklam Alanı Test ID'si (Android / iOS / Web)
  bannerAdUnitId: string;
  // Geçiş (Interstitial) Video Reklam Alanı Test ID'si
  interstitialAdUnitId: string;
  // Reklamsız satın alma ücreti (TL)
  adFreePriceText: string;
  adFreePriceNumeric: number;
  // Kaç oyunda bir interstitial reklam gösterilecek
  interstitialGameThreshold: number;
}

export const ADMOB_CONFIG: AdMobConfig = {
  // Test AdMob App ID (Gerçek ID ile değiştirin: örn. ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY)
  appId: 'ca-app-pub-3940256099942544~3347511713',

  // Standart Google AdMob Banner Test ID'si (Gerçek ID ile değiştirin: örn. ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY)
  bannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111',

  // Standart Google AdMob Interstitial Video Test ID'si
  interstitialAdUnitId: 'ca-app-pub-3940256099942544/1033173712',

  // Tek seferlik Reklamları Kaldır fiyatı
  adFreePriceText: '49,90 ₺',
  adFreePriceNumeric: 49.90,

  // Kaç oyun bitiminde geçiş reklamı açılacak
  interstitialGameThreshold: 5,
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  PLAYED_GAMES_COUNT: 'dokuztas_played_games_count',
  IS_AD_FREE_PURCHASED: 'guest_is_ad_free',
  LOCAL_USER: 'local_email_user',
};

/**
 * Get current played games counter
 */
export function getPlayedGamesCount(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.PLAYED_GAMES_COUNT);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

/**
 * Increment game counter by 1. If it hits threshold (5), returns true to indicate ad should trigger and resets counter.
 */
export function incrementGameCountAndCheckAd(): { count: number; shouldShowAd: boolean } {
  try {
    const current = getPlayedGamesCount();
    const next = current + 1;
    
    if (next >= ADMOB_CONFIG.interstitialGameThreshold) {
      localStorage.setItem(STORAGE_KEYS.PLAYED_GAMES_COUNT, '0');
      return { count: 0, shouldShowAd: true };
    } else {
      localStorage.setItem(STORAGE_KEYS.PLAYED_GAMES_COUNT, next.toString());
      return { count: next, shouldShowAd: false };
    }
  } catch {
    return { count: 0, shouldShowAd: false };
  }
}

/**
 * Checks if user is ad-free from local cache
 */
export function isAdFreeLocally(): boolean {
  try {
    if (localStorage.getItem(STORAGE_KEYS.IS_AD_FREE_PURCHASED) === 'true') {
      return true;
    }
    const localUser = localStorage.getItem(STORAGE_KEYS.LOCAL_USER);
    if (localUser) {
      const parsed = JSON.parse(localUser);
      if (parsed?.isAdFree) return true;
    }
  } catch {}
  return false;
}

/**
 * Persists Ad-Free purchase locally
 */
export function saveAdFreeLocally(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.IS_AD_FREE_PURCHASED, 'true');
    const localUser = localStorage.getItem(STORAGE_KEYS.LOCAL_USER);
    if (localUser) {
      const parsed = JSON.parse(localUser);
      parsed.isAdFree = true;
      localStorage.setItem(STORAGE_KEYS.LOCAL_USER, JSON.stringify(parsed));
    }
  } catch (err) {
    console.error('Failed to save ad-free locally:', err);
  }
}
