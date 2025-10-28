# DC TEKNİK - Changelog

## [v1.7.0] - 2025-01-15 - Analytics & Performance Upgrade

### ✨ Analytics Entegrasyonu
- **Google Analytics 4 aktifleştirildi**
  - Measurement ID: G-N1Z05DJ9B4
  - Custom dimensions eklendi (hero_variant, geo_region, geo_area, geo_district, service_type, contact_method)
  - Conversion events tanımlandı (whatsapp_contact, phone_call, form_submit, appointment_booking, service_inquiry)

### 📊 Conversion Tracking
- **WhatsApp Contact Tracking**
  - `whatsapp_contact` event'i aktif
  - Hero variant dimension ile tracking
  - Conversion value: 50 TRY
- **Phone Call Tracking**
  - `phone_call` event'i aktif
  - Hero variant dimension ile tracking
  - Conversion value: 75 TRY
- **Form Submit Tracking**
  - `form_submit` event'i eklendi
  - UTM parametreleri ile birlikte tracking
  - Conversion value: 100 TRY

### 🎯 Hero Variant Sistemi (A/B Testing)
- Hero section için A/B test desteği
- Random variant assignment (50/50 split)
- LocalStorage ile variant persistence
- GA4'te hero_variant dimension tracking

### 📈 UTM Parameter Tracking
- UTM parametreleri tracking (source, medium, campaign, content, term)
- SessionStorage ile UTM persistence
- GA4'te UTM parametreleri custom dimensions olarak gönderim

### ⚡ Core Web Vitals Tracking
- LCP (Largest Contentful Paint) tracking
- FID (First Input Delay) tracking
- CLS (Cumulative Layout Shift) tracking
- Performance Observer API ile otomatik tracking

### 🔧 PWA İyileştirmeleri
- Service Worker aktifleştirildi (v1.7.0)
- Offline functionality hazır
- Cache strategisi güncellendi
- PWA manifest optimize edildi

### 🚀 Performance Optimizasyonları
- Lazy loading için hazır yapı
- Image optimization desteği
- Preload critical resources
- Scroll event throttling

### 📝 Teknik Güncellemeler
- Package.json versiyonu: v1.7.0
- Service Worker cache version: v1.7.0
- JavaScript analytics modülleri eklendi
- Error handling iyileştirildi

### 🎯 Sonraki Adımlar
- GA4 Admin panelinde conversion events'i mark as conversion yap
- Looker Studio raporlarını oluştur
- Hero variant A/B testini başlat
- Performance metriklerini izle

---

## [v1.5.0] - 2025-01-15 - Professional Reviews Update

### ✨ Yeni Özellikler
- **Profesyonel Müşteri Yorumları Bölümü**
  - İstatistik kartları (4.9 puan, 247 yorum, 98% memnuniyet)
  - Gerçek fotoğraflar (Unsplash'ten profesyonel fotoğraflar)
  - Doğrulama rozetleri (yeşil tik işareti)
  - Detaylı müşteri bilgileri (tam ad, araç bilgileri, konum)
  - Hizmet kategorileri (Dinamo Tamiri, Alternatör Servisi, vb.)
  - Daha uzun ve detaylı yorumlar
  - Beğeni butonları (👍 12, 8, 15, vb.)

### 🎨 Görsel İyileştirmeler
- Yeşil doğrulama çizgisi (kartların üstünde)
- Hover efektleri ve animasyonlar
- Profesyonel tipografi
- Responsive tasarım iyileştirmeleri

### 🔧 İnteraktif Özellikler
- "Beğen" butonları - tıklanabilir ve sayaç artırır
- "Yorum Bırak" butonu - WhatsApp'a yönlendirir
- "Tüm Yorumları Gör" butonu - bilgilendirme mesajı
- Google Analytics entegrasyonu

### 📱 Mobil Uyumluluk
- Mobil cihazlarda tek sütun düzeni
- Dokunmatik optimizasyonu
- Responsive butonlar

### 🚀 Teknik Güncellemeler
- CSS versiyonu: v20250115v1
- JavaScript versiyonu: v20250115v1
- HTML versiyonu: v1.5.0
- Netlify konfigürasyonu eklendi
- Cache optimizasyonları

### 📊 SEO İyileştirmeleri
- Meta tagları güncellendi
- Yapılandırılmış veri eklendi
- Sayfa hızı optimizasyonları

---

## [v1.6.0] - 2025-10-21 - AI/SEO & Local SEO Upgrade

### 🤖 AI & SEO
- robots.txt: GPTBot, Google-Extended, Applebot-Extended, ClaudeBot, PerplexityBot, CCBot açık izin
- .well-known/ai.txt: AI policy, sitemap ve iletişim bilgisi eklendi
- index.html: LocalBusiness JSON-LD’ye geo, serviceArea, areaServed eklendi; WebSite SearchAction eklendi; hreflang ve geo meta eklendi
- FAQ/Product/ItemList JSON-LD gözden geçirildi

### 📍 Local SEO
- Yeni landing pages: `sultanbeyli.html`, `anadolu-yakasi.html` (NAP tutarlı)
- `sitemap.xml` güncellendi (yeni sayfalar, lastmod)

### 📊 Analytics
- GA4 event’leri: `whatsapp_contact`, `phone_call` → hero_variant ve geo param’ları ile gönderim
- ANALYTICS.md güncellendi (Measurement ID, custom dimensions, DebugView)

### 🚀 Performans
- Service Worker versiyon artırıldı ve yeni sayfalar precache’e alındı
- Lazy-load ve fetchpriority iyileştirmeleri mevcut kurulumla uyumlu

### 🧪 QA
- Konsol hataları kontrol edildi; yapılandırılmış veri uyarıları temizlendi


## [v1.4.1] - 2025-01-01 - Previous Version
- Temel site yapısı
- Dinamocu servisi içeriği
- İletişim formları
- Google Maps entegrasyonu

---

**Not:** Bu güncellemeler [https://dcteknik.netlify.app/](https://dcteknik.netlify.app/) adresinde canlı olarak görüntülenebilir.