# Anadolu Taş Oyunları (Üç Taş & Dokuz Taş)

Geleneksel Türk zeka ve strateji oyunları **Üç Taş** ve **Dokuz Taş**'ın modern, responsive ve yapay zeka destekli web uyarlaması.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwindcss&logoColor=white)

---

## 🌟 Özellikler (Features)

- **🎮 İki Oyun Bir Arada**:
  - **Üç Taş (Three Men's Morris)**: 3 taş yerleştirme ve kaydırma evresi, kazanma çizgisi vurgusu ve geri alma (Undo).
  - **Dokuz Taş (Nine Men's Morris)**: 9 taş dizilimi, 3'lü sıra yapınca rakip taşı kaldırma (Mill), taş kaydırma ve 3 taş kalınca uçma (Flying) evreleri.
- **🤖 Akıllı Yapay Zeka (3 Zorluk Seviyesi)**:
  - **Kolay (Easy)**: Rastgele ve temel hamleler.
  - **Orta (Medium)**: Engelleme ve stratejik dizilim.
  - **İmkansız (Master)**: Minimax algoritması ile rakibin hamlelerini önceden analiz eden yenilmez bot.
- **📱 %100 Mobil Uyumlu (Tek Ekran & Zero-Scroll)**:
  - Kaydırma (scroll) gerektirmeyen `100dvh` mobil uyumlu tasarım.
  - Genişletilmiş dokunmatik alanlar (hit-box) ile taşların üzerinde pürüzsüz dokunma kontrolü.
- **🎨 3 Görsel Tema**:
  - **Geleneksel Ahşap Oyma (Wood)**
  - **Saray Mermeri (Marble)**
  - **Siber Neon (Neon)**
- **💡 Hamle İpucu & Geri Al**: Stratejik en iyi hamle önerisi ve sınırsız hamle geri alma imkanı.
- **🔊 Ses & Efektler**: Web Audio API ile yapılmış taş yerleştirme/kaldırma sesleri ve zafer konfetisi.
- **⏱ Zafer Ekranı Geri Sayımı**: Oyun bittiğinde taşların son halini kapatmadan üstte 5 saniyelik geri sayım ile otomatik yeniden başlatma.
- **🌐 Türkçe & İngilizce Dil Desteği**

---

## 🚀 Kurulum ve Çalıştırma (Getting Started)

Proprojeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

```bash
# 1. Depoyu klonlayın
git clone https://github.com/KULLANICI_ADI/uc-tas-dokuz-tas.git

# 2. Proje dizinine gidin
cd uc-tas-dokuz-tas

# 3. Bağımlılıkları yükleyin
npm install

# 4. Gelistirme sunucusunu başlatın
npm run dev
```

Uygulama taranızda `http://localhost:3000` adresinde açılacaktır.

### 📦 Derleme (Production Build)

```bash
npm run build
```

---

## 🛠 Kullanılan Teknolojiler (Tech Stack)

- **UI Framework**: React 19 & TypeScript
- **Derleme Aracı**: Vite 6
- **Stil**: Tailwind CSS v4 & Lucide React İkonları
- **Animasyonlar**: Motion (Framer Motion)
- **Kutlama Efekti**: Canvas Confetti

---

## 📜 Lisans (License)

MIT License - Dilediğiniz gibi geliştirebilir ve paylaşabilirsiniz.
