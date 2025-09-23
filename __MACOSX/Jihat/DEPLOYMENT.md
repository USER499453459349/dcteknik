# 🚀 Deployment Rehberi

Bu belgede DC TEKNİK web sitesinin canlı sunucuya yüklenmesi için gerekli adımlar anlatılmaktadır.

## 📋 Ön Gereksinimler

### 🌐 Domain ve Hosting
- ✅ Domain: `dcteknik.com` (alındı)
- ✅ Hosting paketi aktif
- ✅ FTP/SFTP erişim bilgileri
- ✅ cPanel/DirectAdmin panel erişimi

### 📁 Yüklenecek Dosyalar
```
Jihat/
├── index.html          # Ana sayfa
├── blog.html           # Blog sayfası  
├── style.css           # Stil dosyası
├── script.js           # JavaScript
├── sitemap.xml         # Site haritası
├── robots.txt          # Robot dosyası
├── logo.svg            # Ana logo
├── logo-footer.svg     # Footer logo
└── favicon.ico         # Site ikonu
```

## 🔧 Deployment Adımları

### 1. Dosya Hazırlama
```bash
# Dosyaları kontrol et
ls -la Jihat/

# Dosya boyutlarını kontrol et
du -h Jihat/*
```

### 2. Hosting'e Yükleme

#### FTP ile Yükleme
```bash
# FTP bilgileri
Host: ftp.dcteknik.com
Port: 21
Username: [hosting_username]
Password: [hosting_password]
```

#### cPanel File Manager
1. cPanel'e giriş yap
2. **File Manager** aç
3. **public_html** klasörü seç
4. Tüm dosyaları yükle

### 3. Domain DNS Ayarları
```
A Record: @ → [server_ip]
CNAME: www → dcteknik.com
```

### 4. SSL Sertifikası
- **Let's Encrypt** ücretsiz SSL
- cPanel'den **SSL/TLS** kurulumu
- **Force HTTPS** aktif et

## 🔍 Test ve Doğrulama

### Sayfa Testleri
- ✅ Ana sayfa: `https://dcteknik.com`
- ✅ Blog sayfası: `https://dcteknik.com/blog.html`
- ✅ Sitemap: `https://dcteknik.com/sitemap.xml`
- ✅ Robots: `https://dcteknik.com/robots.txt`

### İşlevsellik Testleri
- 📱 **Responsive test:** Mobile, tablet, desktop
- 📞 **Telefon linklerİ:** Otomatik arama çalışıyor mu?
- 💬 **WhatsApp:** Mesaj linki doğru mu?
- 📧 **E-posta formu:** Mail yönlendirmesi çalışıyor mu?
- 🔗 **Sosyal medya:** Facebook linki doğru mu?

### Performans Testleri
- ⚡ **PageSpeed Insights:** Google speed test
- 🔍 **GTmetrix:** Detaylı performans analizi
- 📱 **Mobile-Friendly Test:** Google mobile test

## 🔍 SEO Kurulumu

### Google Search Console
1. **Mülkiyet doğrulama:**
   - Meta tag yöntemi
   - DNS doğrulama
   - HTML dosya yükleme

2. **Sitemap gönderimi:**
   ```
   https://dcteknik.com/sitemap.xml
   ```

3. **URL denetimi:**
   - Ana sayfa test et
   - "Dizine eklenmesini iste"

### Google Analytics (Opsiyonel)
```html
<!-- Global site tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 📱 Google My Business

### İşletme Profili Kurulumu
1. **Google My Business** hesap oluştur
2. İşletme bilgilerini ekle:
   - **Ad:** DC TEKNİK - Dinamocu Serdar
   - **Kategori:** Otomotiv Servisi
   - **Adres:** Atatürk Cad. No:312, Sultanbeyli
   - **Telefon:** 0535 356 24 69
   - **Website:** https://dcteknik.com
   - **Çalışma saatleri:** Pazartesi-Cumartesi 08:00-18:00

3. **Doğrulama:** SMS veya posta kodu ile

## 🚨 Olası Sorunlar ve Çözümler

### DNS Yayılımı
- **Süre:** 24-48 saat
- **Kontrol:** `nslookup dcteknik.com`
- **Çözüm:** Bekleme, ISS DNS cache temizleme

### SSL Sertifikası Hatası
- **Sebep:** Henüz aktif olmamış
- **Süre:** 1-24 saat
- **Çözüm:** Hosting desteği ile iletişim

### Dosya İzinleri
```bash
# Dosya izinleri (hosting'de)
chmod 644 *.html *.css *.js *.xml *.txt
chmod 755 klasor_adi/
```

### Cache Sorunu
- **Tarayıcı cache:** Ctrl+F5 (hard refresh)
- **CDN cache:** Hosting panelinden temizle
- **DNS cache:** `ipconfig /flushdns` (Windows)

## 📞 Acil Durum İletişim

### Hosting Desteği
- **Telefon:** [hosting_provider_phone]
- **E-posta:** support@[hosting_provider].com
- **Ticket sistemi:** cPanel üzerinden

### Domain Sağlayıcı
- **Panel:** Domain yönetim paneli
- **DNS yönetimi:** A record, CNAME ayarları

## ✅ Go-Live Checklist

- [ ] Tüm dosyalar yüklendi
- [ ] DNS ayarları yapıldı
- [ ] SSL sertifikası aktif
- [ ] Ana sayfa açılıyor
- [ ] Blog sayfası çalışıyor
- [ ] İletişim formu test edildi
- [ ] Telefon/WhatsApp linkleri çalışıyor
- [ ] Sitemap.xml erişilebilir
- [ ] robots.txt doğru
- [ ] Google Search Console'a eklendi
- [ ] Google My Business kuruldu
- [ ] Facebook sayfası güncelleNdi

---

**🎉 Deployment tamamlandıktan sonra 24-48 saat içinde site tamamen aktif olacaktır!** 