# DC TEKNİK - Changelog

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