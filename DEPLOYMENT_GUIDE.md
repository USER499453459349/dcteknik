# 🚀 DC TEKNİK - Güvenli Deployment Rehberi
**Versiyon**: v1.7.1  
**Son Güncelleme**: 15 Ocak 2025

---

## 📋 Hızlı Başlangıç

### 1 Komutla Hazırlık
```bash
npm run deploy-safe
```

Bu komut otomatik olarak:
- ✅ Tüm dosyaları kontrol eder
- ✅ Cache version günceller
- ✅ Deployment paketi oluşturur
- ✅ Transfer talimatları hazırlar
- ✅ Health check script'i oluşturur

---

## 🎯 Adım Adım Deployment Süreci

### AŞAMA 1: Pre-Deployment Kontrolü

#### Manuel Kontrol:
```bash
npm run validate
# veya
node pre-deploy-check.js
```

**Kontrol Edilenler:**
- ✅ Tüm gerekli dosyalar mevcut mu?
- ✅ HTML yapısı geçerli mi?
- ✅ JavaScript hataları var mı?
- ✅ Güvenlik yapılandırmaları doğru mu?
- ✅ Dosya boyutları uygun mu?

**Hata Varsa:**
- Hataları düzeltin
- Tekrar kontrol edin
- Deployment'a geçmeden önce tüm hatalar giderilmeli

---

### AŞAMA 2: Cache Version Güncelleme

```bash
npm run cache-bust
```

**Ne Yapar:**
- Service Worker cache version günceller
- HTML meta tag'ini günceller
- Yeni deployment için unique cache oluşturur

**Sonuç:**
- `sw.js` güncellenir
- `index.html` meta tag güncellenir
- Deployment hazır

---

### AŞAMA 3: Deployment Paketi Hazırlama

```bash
npm run deploy-safe
```

**Oluşturulan Dosyalar:**
- `deployment-package.json` - Dosya listesi ve boyutları
- `DEPLOYMENT_INSTRUCTIONS.md` - Transfer talimatları
- `DEPLOYMENT_CHECKLIST.md` - Kontrol listesi
- `health-check.js` - Post-deployment test script'i
- `backup-list.json` - Backup bilgileri

---

### AŞAMA 4: Dosyaları Transfer Etme

#### Seçenek 1: Netlify (Önerilen)

**Git ile:**
```bash
git add .
git commit -m "Deploy: v1.7.1"
git push origin main
```

**Manuel Upload:**
1. Netlify Dashboard'a girin
2. Site seçin → Deploys
3. "Deploy site" → "Upload files"
4. Tüm dosyaları seç ve yükle

#### Seçenek 2: FTP/SFTP

**Transfer Edilecek Dosya/Dizinler:**
```
✓ index.html
✓ style.css
✓ script.js
✓ sw.js
✓ manifest.webmanifest
✓ package.json
✓ netlify.toml
✓ _headers
✓ build-cache-bust.js
✓ js/ (tüm içerik)
✓ .well-known/ (tüm içerik)
```

**Önemli:**
- Dizin yapısını koruyun
- `.well-known/` klasörü 755 izni
- Dosyalar 644 izni

#### Seçenek 3: ZIP Upload

1. Tüm dosyaları ZIP'le
2. Dizin yapısını koruyarak
3. Sunucuya yükle
4. ZIP'i çıkart

---

### AŞAMA 5: Post-Deployment Kontrolü

#### Otomatik Health Check:

1. Siteyi tarayıcıda açın
2. F12 → Console'u açın
3. `health-check.js` içeriğini kopyalayın
4. Console'a yapıştırın ve Enter'a basın

**Kontrol Edilenler:**
- ✅ Error Handler aktif mi?
- ✅ Security sistemler yüklendi mi?
- ✅ Service Worker kayıtlı mı?
- ✅ Analytics çalışıyor mu?
- ✅ Formlar çalışıyor mu?
- ✅ Console'da hata var mı?

#### Manuel Kontrol Listesi:

- [ ] Site yükleniyor mu?
- [ ] Console'da hata var mı?
- [ ] Service Worker aktif mi? (Application → Service Workers)
- [ ] Security headers var mı? (Network → Headers)
- [ ] HTTPS zorunlu mu?
- [ ] Formlar çalışıyor mu?
- [ ] Mobil uyumlu mu?
- [ ] Analytics tracking çalışıyor mu?

---

## 🔍 Hata Giderme

### Site Yüklenmiyor

**Kontrol:**
1. Dosya izinleri doğru mu? (644 files, 755 dirs)
2. `.htaccess` veya server config doğru mu?
3. Console'da hata var mı?
4. Network tab'da failed request var mı?

**Çözüm:**
```bash
# Linux/Mac
chmod 644 *.html *.css *.js
chmod 755 js/ .well-known/
```

### Service Worker Çalışmıyor

**Kontrol:**
1. `sw.js` erişilebilir mi?
2. HTTPS aktif mi?
3. Console'da SW hatası var mı?

**Çözüm:**
- HTTPS zorunlu (Service Worker için)
- Browser cache'i temizle
- SW'i unregister edip tekrar register et

### Security Headers Yok

**Kontrol:**
1. `_headers` dosyası yüklendi mi?
2. Netlify'da `_headers` destekleniyor mu?
3. Server config'de headers ayarlı mı?

**Çözüm:**
- `_headers` dosyasını kontrol et
- Netlify: Otomatik çalışır
- Apache: `.htaccess` ekle
- Nginx: Config'e ekle

### Forms Çalışmıyor

**Kontrol:**
1. JavaScript dosyaları yüklendi mi?
2. Console'da error var mı?
3. Network tab'da failed request var mı?

**Çözüm:**
- Tüm `js/` dosyalarının yüklendiğini kontrol et
- Console hatalarını incele
- Error handler aktif mi kontrol et

---

## 📦 Dosya Yapısı

```
dctenık.com/
├── index.html              # Ana sayfa
├── style.css              # Stiller
├── script.js              # Ana JavaScript
├── sw.js                  # Service Worker
├── manifest.webmanifest   # PWA Manifest
├── package.json           # Proje yapılandırması
├── netlify.toml          # Netlify config (opsiyonel)
├── _headers              # Security headers
├── build-cache-bust.js   # Cache güncelleme script'i
├── pre-deploy-check.js   # Deployment kontrol script'i
├── deploy-safe.js        # Güvenli deployment script'i
├── health-check.js       # Post-deployment test
├── js/
│   ├── error-handler.js
│   ├── security-firewall.js
│   ├── security-logger.js
│   ├── advanced-security.js
│   └── security-monitor.js
└── .well-known/
    └── security.txt      # Security contact
```

---

## ⚡ Hızlı Komutlar

```bash
# Pre-deployment kontrolü
npm run validate

# Cache version güncelle
npm run cache-bust

# Güvenli deployment hazırlık
npm run deploy-safe

# Tüm işlemler (validation + cache + deploy prep)
npm run deploy-safe
```

---

## 🎯 Deployment Senaryoları

### Senaryo 1: Netlify (Git ile)
```bash
npm run deploy-safe
git add .
git commit -m "Deploy: v1.7.1"
git push origin main
```
✅ Netlify otomatik deploy eder

### Senaryo 2: Netlify (Manuel)
```bash
npm run deploy-safe
# ZIP oluştur ve Netlify'a yükle
```

### Senaryo 3: FTP/SFTP
```bash
npm run deploy-safe
# DEPLOYMENT_INSTRUCTIONS.md'ye göre dosyaları transfer et
```

### Senaryo 4: VPS/Server
```bash
npm run deploy-safe
# rsync veya scp ile dosyaları kopyala
rsync -avz . user@server:/var/www/html/
```

---

## 🔐 Güvenlik Kontrol Listesi

Post-deployment güvenlik kontrolü:

- [ ] HTTPS zorunlu mu?
- [ ] CSP headers aktif mi?
- [ ] Security scripts yüklendi mi?
- [ ] Error handler aktif mi?
- [ ] Console'da güvenlik uyarısı var mı?
- [ ] Service Worker güvenli mi?

**Güvenlik Test:**
```javascript
// Browser console'da çalıştır
console.log('CSP:', document.querySelector('meta[http-equiv="Content-Security-Policy"]'));
console.log('HTTPS:', window.location.protocol === 'https:');
console.log('Error Handler:', typeof window.safeError !== 'undefined');
console.log('Security Firewall:', typeof window.SecurityFirewall !== 'undefined');
```

---

## 📊 Deployment Özeti

### Başarılı Deployment İşaretleri:
✅ Site yükleniyor  
✅ Console temiz (hata yok)  
✅ Service Worker aktif  
✅ Security headers mevcut  
✅ Forms çalışıyor  
✅ Analytics tracking aktif  

### Hata Durumunda:
1. Pre-deploy-check.js çalıştır
2. Hataları düzelt
3. Tekrar validate et
4. Deployment'ı tekrarla

---

## 🆘 Destek

**Dokümantasyon:**
- `DEPLOYMENT_INSTRUCTIONS.md` - Detaylı transfer talimatları
- `DEPLOYMENT_CHECKLIST.md` - Kontrol listesi
- `HATA_IYILESTIRME_RAPORU.md` - Hata çözüm rehberi
- `VERI_AKTARIM_OPTIMIZASYONU.md` - Performance optimizasyonları

**Kontrol Script'leri:**
- `pre-deploy-check.js` - Pre-deployment validation
- `deploy-safe.js` - Güvenli deployment hazırlık
- `health-check.js` - Post-deployment health check

---

**Son Güncelleme**: 15 Ocak 2025  
**Versiyon**: v1.7.1  
**Durum**: ✅ **PRODUCTION READY**

