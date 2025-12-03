# 📊 Google Analytics & Facebook Pixel - Kompletna Implementacija

## ✅ Šta je implementirano

### ⭐ GLAVNI LEAD TRACKING (Najvažnije!)

Event **`generate_lead`** se šalje kada korisnik **uspešno pošalje kontakt formu**.

**Lokacije:**
- ✅ **Contact Page** (`/contact`)
- ✅ **Home Page** (kontakt forma na dnu)

**Šta se prati:**
- Ime korisnika
- Izvor lead-a (Contact page ili Home page)
- Jezik (Srpski ili Engleski)
- Vrednost lead-a (1 EUR)

**Dodatno:**
- ✅ Paralelno se šalje i **Facebook Pixel Lead** event
- ✅ Svi parametri se loguju u browser konzoli za debug

---

## 📂 Struktura projekta

```
AISAJT-main/
├── src/
│   ├── components/
│   │   ├── pages/
│   │   │   └── ContactPage.tsx          ✅ Lead tracking implementiran
│   │   └── sections/
│   │       └── Contact.tsx              ✅ Lead tracking implementiran
│   └── utils/
│       ├── analytics.ts                 ✅ Helper funkcije za tracking
│       └── README_ANALYTICS.md          📖 Dokumentacija helper funkcija
│
├── GOOGLE_ANALYTICS_EVENTS.md           📊 Svi implementirani eventi
├── TESTING_ANALYTICS.md                 🧪 Kako testirati evenimente
└── ANALYTICS_IMPLEMENTATION.md          📋 Ovaj fajl
```

---

## 🎯 Implementirani Eventi

### 1. ⭐ `generate_lead` - GLAVNI EVENT
**Kada:** Uspešno poslata kontakt forma  
**Gde:** Contact Page & Home Page  
**Parametri:**
```javascript
{
  event_category: 'Lead Generation',
  event_label: 'Contact Form - Success',
  value: 1,
  currency: 'EUR',
  lead_source: 'contact_page' | 'home_page',
  language: 'sr' | 'en',
  user_name: 'Ime korisnika'
}
```

### 2. `form_interaction`
**Kada:** Korisnik počne da popunjava formu  
**Gde:** Contact Page & Home Page  
**Parametri:**
```javascript
{
  event_category: 'Lead Generation',
  event_label: 'Contact Form - Started Filling name/email/phone',
  language: 'sr' | 'en'
}
```

### 3. `form_submit_attempt`
**Kada:** Korisnik klikne "Pošalji" dugme  
**Gde:** Contact Page & Home Page  
**Parametri:**
```javascript
{
  event_category: 'Lead Generation',
  event_label: 'Contact Form - Submit Clicked',
  language: 'sr' | 'en',
  page_path: '/contact' | '/'
}
```

### 4. `form_submit_error`
**Kada:** Greška pri slanju forme  
**Gde:** Contact Page & Home Page  
**Parametri:**
```javascript
{
  event_category: 'Lead Generation',
  event_label: 'Contact Form - Error',
  language: 'sr' | 'en',
  error_message: 'Opis greške'
}
```

---

## 🔧 Tehnička implementacija

### Analytics Helper (`src/utils/analytics.ts`)

Kreiran je centralni helper modul sa funkcijama:

```typescript
// Glavni lead event
trackLeadGeneration(source, userName, language)

// Form interakcije
trackFormInteraction(fieldName, formLocation, language)
trackFormSubmitAttempt(formLocation, language)
trackFormError(formLocation, language, errorMessage)

// Dodatni eventi (spremni za upotrebu)
trackCTAClick(buttonLabel, location, language)
trackPortfolioClick(projectName, projectUrl, language)
trackContactInfoClick(contactType, value, language)
trackNavigationClick(destination, language)
trackLanguageChange(from, to)
trackVideoPlay(videoTitle, videoId, language)
```

### Type Definitions

```typescript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}
```

---

## 🚀 Kako se koristi

### U ContactPage.tsx:

```typescript
import { 
  trackLeadGeneration, 
  trackFormInteraction, 
  trackFormSubmitAttempt, 
  trackFormError 
} from '../../utils/analytics';

// Kada korisnik počne da piše
const handleChange = (e) => {
  // ... form logic
  if (value && !formData[name]) {
    trackFormInteraction(name, 'contact_page', language);
  }
};

// Kada korisnik klikne Pošalji
const handleSubmit = async (e) => {
  trackFormSubmitAttempt('contact_page', language);
  
  try {
    const result = await emailjs.send(...);
    
    if (result.status === 200) {
      // ⭐ GLAVNI EVENT
      trackLeadGeneration('contact_page', formData.name, language);
    }
  } catch (error) {
    trackFormError('contact_page', language, String(error));
  }
};
```

---

## 🎯 Setup u Google Analytics 4

### Korak 1: Provera da li eventi stižu
1. Idite na [Google Analytics](https://analytics.google.com)
2. Property: **G-6C046QS9HG**
3. **Reports → Realtime**
4. Testirajte formu i pratite eventi u real-time

### Korak 2: Kreiranje Konverzije
1. **Configure → Events**
2. Pronađite `generate_lead`
3. Kliknite **"Mark as conversion"** ✅
4. Sada možete pratiti lead konverzije u dashboard-u

### Korak 3: Kreiranje Custom Report-a
1. **Explore → Blank**
2. Dimensions:
   - Event name
   - Language (custom parameter)
   - Lead source (custom parameter)
3. Metrics:
   - Event count
   - Total users
4. Filter: Event name = "generate_lead"

---

## 📱 Facebook Pixel Setup

### Event Mapping:

| GA4 Event | FB Pixel Event | Parametri |
|-----------|----------------|-----------|
| `generate_lead` | `Lead` | content_name, value, currency |
| `form_interaction` | - | Nije mapiran |
| `form_submit_attempt` | - | Nije mapiran |

### Provera:
1. [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Pixel ID: **861131543475701**
3. Test Event → Pošaljite formu
4. Videćete **Lead** event u real-time

---

## 📊 Metrics i KPI-ovi

### 1. Lead Generation Rate
```
Lead Rate = (generate_lead / page_view na /contact) × 100%
```

**Ciljana vrednost:** 5-10% je odlično za B2B

### 2. Form Abandonment Rate
```
Abandonment = ((form_start / 3) - leads) / (form_start / 3) × 100%
```

**Ciljana vrednost:** < 50% je dobro

### 3. Lead Source Comparison
- Contact Page: koliko % lead-ova?
- Home Page: koliko % lead-ova?

### 4. Language Performance
- Srpski korisnici: conversion rate
- Engleski korisnici: conversion rate

### 5. Error Rate
```
Error Rate = form_submit_error / form_submit_attempt × 100%
```

**Ciljana vrednost:** < 5%

---

## 🧪 Testiranje

### Quick Test:
1. Otvorite sajt: `http://localhost:5173/contact`
2. Otvorite Browser Console (F12)
3. Popunite formu
4. Kliknite "Pošalji"
5. Videćete u konzoli:
   ```
   ✅ Lead tracked: { 
     source: 'contact_page', 
     userName: 'Test User', 
     language: 'sr' 
   }
   ```

### Detaljno testiranje:
Pogledajte fajl: **`TESTING_ANALYTICS.md`**

---

## 🔐 Privacy & Compliance

### GDPR Compliant:
- ✅ Ne čuvamo email adrese u GA parametrima
- ✅ Ime korisnika je **custom parameter**, ne PII
- ✅ Koristimo **first-party cookies**
- ✅ IP anonimizacija je uključena (GA4 default)

### Cookie Consent:
Ako želite da dodate Cookie Consent banner:
```typescript
// Primer sa cookieyes.com ili onetrust.com
if (userConsentGiven) {
  trackLeadGeneration(...);
}
```

---

## 🚀 Sledeći koraci (opciono)

### Dodatni eventi koje možete dodati:

1. **CTA Button Tracking**
   - "Zakažite Besplatnu Konsultaciju"
   - "Saznaj Više" dugmad
   - "Razgovarajmo o Vašem Projektu"

2. **Portfolio Project Clicks**
   - Svaki klik na portfolio projekat
   - Tracking koji projekat privlači najviše pažnje

3. **Contact Info Clicks**
   - Email link klikovi
   - Phone link klikovi

4. **Navigation Tracking**
   - Klikovi na meni stavke
   - Scroll depth (koliko daleko korisnik scrolluje)

5. **Video Engagement**
   - YouTube video play
   - Video completion rate

6. **Language Switch**
   - Koliko korisnika menja jezik
   - Da li menjanje jezika utiče na konverzije

**Sve ove funkcije su već spremne u `analytics.ts` helper-u!**

Pogledajte: **`src/utils/README_ANALYTICS.md`**

---

## 📞 Support & Pitanja

Ako imate pitanja ili probleme:

1. **Dokumentacija:**
   - `GOOGLE_ANALYTICS_EVENTS.md` - Svi eventi
   - `TESTING_ANALYTICS.md` - Testiranje
   - `src/utils/README_ANALYTICS.md` - Korišćenje helper-a

2. **Debug:**
   - Otvorite Browser Console (F12)
   - Svi eventi se loguju sa ✅ emoji

3. **GA4 Help:**
   - [GA4 Documentation](https://support.google.com/analytics/answer/9322688)
   - [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)

---

## 📈 Očekivani rezultati

Nakon implementacije, očekujte:

- ✅ **Transparentnost:** Tačno znate koliko lead-ova dolazi
- ✅ **Optimizacija:** Možete A/B testirati različite verzije formi
- ✅ **ROI Tracking:** Povezujete marketing troškove sa lead-ovima
- ✅ **Funnel Analysis:** Vidite gde korisnici odustaju
- ✅ **Language Insights:** Znate koji jezik bolje konvertuje

---

## ✅ Checklist - Pre produkcije

Pre nego što sajt ide live:

- [x] Google Analytics ID konfigurisan: **G-6C046QS9HG**
- [x] Facebook Pixel ID konfigurisan: **861131543475701**
- [x] Lead tracking implementiran na Contact Page
- [x] Lead tracking implementiran na Home Page
- [x] Helper funkcije kreirane i testirane
- [x] TypeScript type definitions dodati
- [x] Console logging za debug
- [ ] Testirano u produkciji (na aisajt.com)
- [ ] Konverzija kreirana u GA4
- [ ] Custom report kreiran za praćenje lead-ova
- [ ] Email notifikacija postavljena (opciono)

---

## 📝 Changelog

### v1.0 - 2025-01-XX
- ✅ Implementiran `generate_lead` event (glavni event)
- ✅ Implementiran `form_interaction` event
- ✅ Implementiran `form_submit_attempt` event
- ✅ Implementiran `form_submit_error` event
- ✅ Facebook Pixel Lead event integrisan
- ✅ Helper funkcije kreirane u `utils/analytics.ts`
- ✅ TypeScript type definitions
- ✅ Dokumentacija kreirana

---

**🎉 Gotovo! Lead tracking je sada aktivan na vašem sajtu! 🎉**

---

**Autor:** AISajt Development Team  
**Datum:** 2025-01-XX  
**Verzija:** 1.0  
**License:** Proprietary

