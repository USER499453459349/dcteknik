# 📧 EmailJS Kurulum Rehberi
**DC TEKNİK - İletişim Formu Email Entegrasyonu**

---

## 🚀 Hızlı Kurulum

### Adım 1: EmailJS Hesabı Oluştur

1. **EmailJS.com'a git**: https://www.emailjs.com
2. **Ücretsiz hesap oluştur** (100 email/ay ücretsiz)
3. **Email servisinizi ekle** (Gmail, Outlook, vb.)
4. **Service ID'yi kopyala**

---

### Adım 2: Email Template Oluştur

1. EmailJS Dashboard → **Email Templates**
2. **Create New Template** tıkla
3. Aşağıdaki template'i kullan:

```
Subject: DC TEKNİK - Yeni İletişim Formu

İletişim Formu Mesajı:

İsim: {{from_name}}
Email: {{from_email}}
Telefon: {{phone}}
Konu: {{subject}}
Mesaj: {{message}}

Hizmet Tipi: {{service_type}}

Gönderilme Zamanı: {{timestamp}}
Website: {{website}}

--
DC TEKNİK - Dinamocu Serdar
dctenık.com
```

4. **Template ID'yi kopyala**

---

### Adım 3: Auto-Reply Template (Opsiyonel)

1. Yeni template oluştur: **Auto-Reply**
2. Aşağıdaki template'i kullan:

```
Subject: DC TEKNİK - Mesajınız Alındı

Merhaba {{to_name}},

Mesajınızı aldık. En kısa sürede size geri dönüş yapacağız.

İletişim Bilgilerimiz:
Telefon: 0535 356 24 69
Email: serdaraltan890@gmail.com
Website: dctenık.com

Saygılarımızla,
DC TEKNİK - Dinamocu Serdar
```

---

### Adım 4: Public Key Al

1. EmailJS Dashboard → **Account** → **General**
2. **Public Key**'i kopyala

---

### Adım 5: Kodda Ayarla

`js/email-service.js` dosyasını aç ve şu değerleri değiştir:

```javascript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Adım 1'den
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Adım 2'den
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Adım 4'ten
```

**Örnek:**
```javascript
const EMAILJS_SERVICE_ID = 'service_abc123';
const EMAILJS_TEMPLATE_ID = 'template_xyz789';
const EMAILJS_PUBLIC_KEY = 'abcdefghijklmnop';
```

---

## 🔄 Alternatif: Formspree (EmailJS olmadan)

Eğer EmailJS kullanmak istemezseniz:

### Formspree Kurulumu:

1. **Formspree.io'ya git**: https://formspree.io
2. **Ücretsiz hesap oluştur**
3. **Yeni form oluştur**
4. **Form ID'yi kopyala**

`js/email-service.js` dosyasında:

```javascript
const FormspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';
```

---

## ✅ Test Etme

1. Sitedeki formu doldur
2. **Gönder** butonuna tıkla
3. Email'inizi kontrol et
4. Console'da hata var mı kontrol et

---

## 📊 Monitoring

### Analytics Tracking:
Form gönderildiğinde otomatik olarak Google Analytics'e event gönderilir:
- `form_submit` - Form gönderildi
- `email_service_used` - Email servisi kullanıldı

### Console Logs:
- ✅ Email sent successfully
- ❌ Email sending failed

---

## 🆘 Sorun Giderme

### Email gelmiyor:
1. EmailJS servisi aktif mi?
2. Public Key doğru mu?
3. Template ID doğru mu?
4. Email servisi bağlı mı? (Gmail, Outlook, vb.)
5. Spam klasörünü kontrol et

### Form gönderilmiyor:
1. Console'da hata var mı?
2. EmailJS script yüklendi mi?
3. Rate limiting var mı?

---

## 💰 Fiyatlandırma

### EmailJS:
- **Ücretsiz**: 100 email/ay
- **Başlangıç**: $15/ay - 1000 email
- **Profesyonel**: $50/ay - 5000 email

### Formspree:
- **Ücretsiz**: 50 submission/ay
- **Başlangıç**: $12/ay - 250 submission

---

## 📝 Notlar

- EmailJS ücretsiz plan yeterli olabilir (100 email/ay)
- Otomatik yanıt (auto-reply) opsiyoneldir
- Formspree fallback olarak çalışır
- Tüm email'ler `serdaraltan890@gmail.com` adresine gider

---

**Kurulum tamamlandıktan sonra test edin!**

