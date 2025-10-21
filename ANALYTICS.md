# Analytics & Reporting Setup

Bu doküman GA4 event/param yapılandırması ve Looker Studio rapor adımlarını içerir.

## 1) GA4 – Event’ler

- hero_cta_click
  - event_category: ab
  - event_label: A veya B (A/B varyantı)
- whatsapp_contact
  - event_category: conversion
- phone_call
  - event_category: conversion
- form_submit (opsiyonel)
  - event_category: conversion

Not: UTM (utm_source/utm_medium/utm_campaign) oturum bazında tutulur ve WhatsApp linklerine eklenir.

### 1.1 Custom Definitions
GA4 → Admin → Custom definitions → Create custom dimension:
- Name: hero_variant | Scope: Event | Event parameter: event_label

### 1.2 Conversions
GA4 → Admin → Conversions → New conversion event:
- whatsapp_contact, phone_call, (opsiyonel) form_submit

## 2) Looker Studio – Rapor
1. Yeni rapor → Veri kaynağı: GA4 mülkünüz
2. Sayfa 1: Trafik & Dönüşüm
   - Tablo: Dimensions → Session source/medium, Session campaign
   - Metrics → Users, Sessions, Event count
   - Filter → Event name IN hero_cta_click, whatsapp_contact, phone_call
3. Sayfa 2: WhatsApp
   - Dimension → Session campaign
   - Metric → Event count | Filter → Event name = whatsapp_contact
4. Sayfa 3: Hero A/B
   - Dimension → Event label (hero_variant)
   - Metric → Event count | Filter → Event name = hero_cta_click

## 3) Test
- URL: https://dcteknik.netlify.app/?utm_source=test&utm_medium=cpc&utm_campaign=deneme
- Tıklayın: Hero CTA → hero_cta_click | WhatsApp → whatsapp_contact | Telefon → phone_call

## 4) İsteğe Bağlı
- Event param: component (hero/sticky/nav) → Custom dimension
- Randevu: form_submit event’i ekleyin
- UTM sayfası: Dimension → Session campaign; Metrics → Users, Event count; Filter → Event name IN whatsapp_contact, phone_call
