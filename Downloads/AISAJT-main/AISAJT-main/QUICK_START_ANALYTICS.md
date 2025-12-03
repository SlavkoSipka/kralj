# 🚀 Quick Start - Google Analytics Lead Tracking

## ⚡ 5-Minutni Pregled

### Šta je urađeno?
✅ **Lead tracking** je implementiran na kontakt formama  
✅ **Automatski prati** kada neko pošalje kontakt formu  
✅ **Google Analytics + Facebook Pixel** integrisani  

---

## 🎯 Glavni Event - `generate_lead`

### Kada se okida?
Kada korisnik **uspešno pošalje kontakt formu** na:
- Contact stranici (`/contact`)
- Home stranici (forma na dnu)

### Šta prati?
```javascript
{
  event_name: 'generate_lead',          // ⭐ Najvažniji event
  event_category: 'Lead Generation',
  event_label: 'Contact Form - Success',
  value: 1,                             // Vrednost lead-a
  currency: 'EUR',
  lead_source: 'contact_page',          // Ili 'home_page'
  language: 'sr',                       // Ili 'en'
  user_name: 'Ime korisnika'
}
```

---

## 🧪 Brzi Test

### 1. Lokalno testiranje:
```bash
# Startujte dev server
npm run dev

# Otvorite: http://localhost:5173/contact
```

### 2. Testirajte formu:
1. Popunite ime, email, telefon
2. Kliknite "Pošalji"
3. Otvorite Browser Console (F12)
4. Trebalo bi da vidite:
   ```
   ✅ Lead tracked: { 
     source: 'contact_page', 
     userName: 'Test', 
     language: 'sr' 
   }
   ```

### 3. Proverite u GA4:
1. Idite na [Google Analytics](https://analytics.google.com)
2. Izaberite property: **G-6C046QS9HG**
3. **Reports → Realtime**
4. Za ~10 sekundi videćete event: **`generate_lead`**

---

## 📊 Gde videti rezultate?

### Google Analytics 4:
```
Reports → Engagement → Events → Traži "generate_lead"
```

### Facebook Events Manager:
```
Business Manager → Events Manager → Pixel ID: 861131543475701
```

---

## 🔧 Fajlovi koji su izmenjeni:

```
✅ src/components/pages/ContactPage.tsx      - Contact forma tracking
✅ src/components/sections/Contact.tsx       - Home forma tracking
✅ src/utils/analytics.ts                    - Helper funkcije
```

### Novi fajlovi - Dokumentacija:
```
📖 ANALYTICS_IMPLEMENTATION.md               - Kompletna dokumentacija
📖 GOOGLE_ANALYTICS_EVENTS.md                - Svi eventi
📖 TESTING_ANALYTICS.md                      - Test instrukcije
📖 src/utils/README_ANALYTICS.md             - Helper guide
📖 QUICK_START_ANALYTICS.md                  - Ovaj fajl
```

---

## ⚙️ Google Analytics Setup (GA4)

### Property Info:
- **Property ID:** G-6C046QS9HG
- **Sajt:** https://aisajt.com
- **Facebook Pixel ID:** 861131543475701

### Kreiranje Konverzije:
1. GA4 → **Configure** → **Events**
2. Pronađite event: **`generate_lead`**
3. Kliknite **"Mark as conversion"** ✅
4. Sačuvajte

Sad možete pratiti lead konverzije kao **Goal**!

---

## 📈 Šta možete pratiti?

| Metrika | Gde | Značaj |
|---------|-----|--------|
| **Broj lead-ova** | Reports → Events | Koliko kontakt formi je poslato |
| **Lead source** | Custom report | Contact page vs Home page |
| **Language** | Custom report | Srpski vs Engleski |
| **Conversion rate** | Conversions | % posetilaca koji postanu lead-ovi |
| **Form abandonment** | Funnel analysis | Ko počne formu ali ne pošalje |

---

## 🎨 Kako dodati novi tracking?

### Primer: Tracking CTA dugmeta

```typescript
import { trackCTAClick } from '../../utils/analytics';

<button
  onClick={() => {
    trackCTAClick('Saznaj Više - Web Dizajn', 'services', language);
    navigate('/contact');
  }}
>
  Saznaj Više
</button>
```

**Više primera:** Pogledajte `src/utils/README_ANALYTICS.md`

---

## 🐛 Problem? Debug vodič:

### Korak 1: Provera konzole
```javascript
// U Browser Console (F12):
console.log('GA loaded:', typeof window.gtag !== 'undefined');
console.log('FB loaded:', typeof window.fbq !== 'undefined');
```

### Korak 2: Manual test event
```javascript
// Pošaljite test event ručno:
window.gtag('event', 'test_event', { test: 'value' });
```

### Korak 3: Proverite Ad Blocker
- Isključite **AdBlock/uBlock**
- Isključite **Privacy Badger**
- U **Brave** browser-u isključite Shields

### Korak 4: Sačekajte
- GA4 Real-Time je **5-30 sekundi** delay
- Standardi reporti su **24-48 sati** delay

---

## ✅ Pre-Production Checklist

Provera prije nego što ide live:

- [x] GA Property ID: G-6C046QS9HG
- [x] FB Pixel ID: 861131543475701
- [x] Lead tracking na Contact page
- [x] Lead tracking na Home page
- [ ] Testirano na produkciji
- [ ] Konverzija kreirana u GA4
- [ ] Prvi lead testiran ✨

---

## 📞 Kontakt za pitanja

Za pitanja ili probleme:
- Email: office@aisajt.com
- Telefon: +381 61 3091583

---

## 📚 Dodatna dokumentacija

- **Kompletan guide:** `ANALYTICS_IMPLEMENTATION.md`
- **Svi eventi:** `GOOGLE_ANALYTICS_EVENTS.md`
- **Test scenarios:** `TESTING_ANALYTICS.md`
- **Helper API:** `src/utils/README_ANALYTICS.md`

---

**🎉 To je to! Tracking je aktivan i radi! 🎉**

**Sledeći korak:** Testirajte formu i proverite u GA4 Real-Time. 🚀

---

**Updated:** 2025-01-XX  
**Version:** 1.0

