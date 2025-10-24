# Looker Studio Dashboard Setup Guide - DC TEKNİK

## 📊 Dashboard Overview

Bu rehber DC TEKNİK için Looker Studio dashboard'larının kurulumu için hazırlanmıştır.

## 🎯 Dashboard'lar

### 1. Conversion Funnel Analysis
**Amaç:** Kullanıcıların landing'den conversion'a kadar olan yolculuğunu takip etmek

**Metrikler:**
- Sessions
- Users  
- WhatsApp Conversions
- Phone Call Conversions
- Form Submissions
- Appointment Bookings

**Boyutlar:**
- UTM Source
- UTM Medium
- UTM Campaign
- Hero Variant
- Geographic District

**Filtreler:**
- Date Range: Last 30 days
- Conversion Events: All conversion events

### 2. Traffic Sources & Performance
**Amaç:** Trafik kaynaklarını ve conversion performanslarını analiz etmek

**Metrikler:**
- Sessions
- Users
- Page Views
- Conversion Rate
- Conversion Value (TRY)

**Boyutlar:**
- UTM Source
- UTM Medium
- UTM Campaign
- UTM Content
- UTM Term

### 3. Geographic Performance
**Amaç:** Coğrafi konuma göre performans analizi

**Metrikler:**
- Sessions
- Users
- Conversions
- Conversion Value (TRY)

**Boyutlar:**
- Geographic Region
- Geographic Area
- Geographic District

### 4. User Engagement Metrics
**Amaç:** Kullanıcı engagement ve davranış analizi

**Metrikler:**
- Sessions
- Users
- Page Views
- Scroll Depth (%)
- Time on Page (s)
- Bounce Rate (%)

**Boyutlar:**
- Page Title
- Hero Variant
- Device Category
- Browser

### 5. Conversion Attribution
**Amaç:** Conversion attribution'ı touchpoint'ler arasında takip etmek

**Metrikler:**
- Conversions
- Conversion Value (TRY)
- Cost per Conversion
- Return on Ad Spend (ROAS)

**Boyutlar:**
- UTM Source
- UTM Medium
- UTM Campaign
- Contact Method
- Service Type

## 🔧 Setup Adımları

### Adım 1: Google Analytics 4 Bağlantısı
1. Looker Studio'ya giriş yapın
2. "Create" > "Data Source" seçin
3. "Google Analytics 4" seçin
4. DC TEKNİK property'sini seçin
5. Custom dimensions ve metrics'leri ekleyin

### Adım 2: Custom Dimensions Kurulumu
GA4'te aşağıdaki custom dimensions'ları oluşturun:

```
hero_variant: Hero Variant
geo_region: Geographic Region
geo_area: Geographic Area
geo_district: Geographic District
utm_source: UTM Source
utm_medium: UTM Medium
utm_campaign: UTM Campaign
utm_content: UTM Content
utm_term: UTM Term
service_type: Service Type
contact_method: Contact Method
```

### Adım 3: Custom Metrics Kurulumu
GA4'te aşağıdaki custom metrics'leri oluşturun:

```
conversion_value: Conversion Value (TRY)
page_load_time: Page Load Time (ms)
scroll_depth: Scroll Depth (%)
time_on_page: Time on Page (s)
bounce_rate: Bounce Rate (%)
```

### Adım 4: Conversion Events Kurulumu
GA4'te aşağıdaki events'leri conversion olarak işaretleyin:

- whatsapp_contact
- phone_call
- form_submit
- appointment_booking
- service_inquiry

### Adım 5: Dashboard Oluşturma
1. Her dashboard için ayrı report oluşturun
2. Yukarıdaki metrik ve boyutları ekleyin
3. Filtreleri uygulayın
4. Görselleştirmeleri optimize edin

## 📈 KPI'lar ve Hedefler

### Primary KPIs
- **Conversion Rate:** > 3%
- **Cost per Conversion:** < 50 TRY
- **Return on Ad Spend:** > 300%

### Secondary KPIs
- **Page Load Time:** < 3 saniye
- **Bounce Rate:** < 60%
- **Scroll Depth:** > 50%

### Monthly Targets
- **WhatsApp Conversions:** 50+
- **Phone Call Conversions:** 30+
- **Form Submissions:** 20+
- **Appointment Bookings:** 15+

## 🔍 Monitoring ve Alerting

### Daily Monitoring
- Conversion rate trends
- Traffic source performance
- Geographic performance
- User engagement metrics

### Weekly Reporting
- Conversion funnel analysis
- UTM campaign performance
- Hero variant A/B test results
- Geographic expansion opportunities

### Monthly Analysis
- ROI analysis
- Customer acquisition cost
- Lifetime value analysis
- Competitive benchmarking

## 📊 Dashboard Templates

### Template 1: Executive Summary
- High-level KPIs
- Conversion trends
- Revenue metrics
- Geographic performance

### Template 2: Marketing Performance
- UTM campaign analysis
- Traffic source performance
- Conversion attribution
- Cost analysis

### Template 3: User Experience
- Engagement metrics
- Page performance
- User journey analysis
- Technical metrics

## 🚀 Optimization Recommendations

### Short-term (1-2 weeks)
1. UTM tracking implementation
2. Conversion goals setup
3. Basic dashboard creation
4. Alerting configuration

### Medium-term (1-2 months)
1. Advanced segmentation
2. Attribution modeling
3. Predictive analytics
4. Automated reporting

### Long-term (3-6 months)
1. Machine learning insights
2. Customer lifetime value
3. Advanced attribution
4. Cross-device tracking

## 📞 Support

Dashboard setup ile ilgili sorularınız için:
- Email: serdaraltan890@gmail.com
- WhatsApp: +90 535 356 24 69

## 🔄 Updates

Bu doküman düzenli olarak güncellenecektir. Son güncelleme: 2025-01-20


