# 📊 Google Analytics Events - Dokumentacija

Ovaj dokument sadrži sve implementirane Google Analytics i Facebook Pixel eventove za praćenje korisničke interakcije i generisanja lead-ova.

## ⭐ GLAVNI LEAD EVENT (Najbitniji!)

### `generate_lead`
**Opis:** Prati uspešno poslate kontakt forme - ovo je **najvažniji event za praćenje lead-ova**!

**Kada se okida:**
- ✅ Kada korisnik uspešno pošalje kontakt formu na **Contact stranici**
- ✅ Kada korisnik uspešno pošalje kontakt formu na **Home stranici**

**Parametri:**
```javascript
{
  event_category: 'Lead Generation',
  event_label: 'Contact Form - Success' | 'Home Contact Form - Success',
  value: 1,
  currency: 'EUR',
  lead_source: 'contact_page' | 'home_page',
  language: 'sr' | 'en',
  user_name: 'Ime korisnika'
}
```

**Facebook Pixel:**
Takođe se šalje i `Lead` event na Facebook Pixel sa sledećim parametrima:
```javascript
{
  content_name: 'Contact Form Submission' | 'Home Form Submission',
  content_category: 'Lead Generation',
  value: 1,
  currency: 'EUR'
}
```

---

## 📝 Form Interaction Events

### `form_interaction`
**Opis:** Prati kada korisnik počne da popunjava formu (svaki field posebno).

**Kada se okida:**
- Kada korisnik unese prvu vrednost u **Name** polje
- Kada korisnik unese prvu vrednost u **Email** polje
- Kada korisnik unese prvu vrednost u **Phone** polje

**Parametri:**
```javascript
{
  event_category: 'Lead Generation',
  event_label: 'Contact Form - Started Filling name/email/phone',
  language: 'sr' | 'en'
}
```

---

### `form_submit_attempt`
**Opis:** Prati kada korisnik klikne "Pošalji" dugme (pre nego što se forma zapravo pošalje).

**Kada se okida:**
- Kada korisnik klikne "Pošalji" dugme na kontakt formi

**Parametri:**
```javascript
{
  event_category: 'Lead Generation',
  event_label: 'Contact Form - Submit Clicked',
  language: 'sr' | 'en',
  page_path: '/contact' | '/'
}
```

---

### `form_submit_error`
**Opis:** Prati greške prilikom slanja forme.

**Kada se okida:**
- Kada dođe do greške pri slanju EmailJS poruke

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

## 🔧 Helper Functions - `src/utils/analytics.ts`

### Osnovne funkcije:

#### `trackLeadGeneration(source, userName, language)`
Glavni lead event - poziva se kad se forma uspešno pošalje.
```typescript
trackLeadGeneration('contact_page', 'Marko Marković', 'sr');
```

#### `trackFormInteraction(fieldName, formLocation, language)`
Prati interakciju sa poljima forme.
```typescript
trackFormInteraction('email', 'contact_page', 'sr');
```

#### `trackFormSubmitAttempt(formLocation, language)`
Prati pokušaj slanja forme.
```typescript
trackFormSubmitAttempt('contact_page', 'sr');
```

#### `trackFormError(formLocation, language, errorMessage)`
Prati greške pri slanju.
```typescript
trackFormError('contact_page', 'sr', 'Network error');
```

---

## 🎯 Dodatne funkcije spremne za upotrebu:

### `trackCTAClick(buttonLabel, location, language)`
Za praćenje CTA dugmadi (Call-to-Action).
```typescript
trackCTAClick('Zakažite Besplatnu Konsultaciju', 'hero_section', 'sr');
```

### `trackPortfolioClick(projectName, projectUrl, language)`
Za praćenje klikova na portfolio projekte.
```typescript
trackPortfolioClick('Kralj Residence', 'https://kraljresidence.rs', 'sr');
```

### `trackContactInfoClick(contactType, value, language)`
Za praćenje klikova na email i telefon linkove.
```typescript
trackContactInfoClick('email', 'office@aisajt.com', 'sr');
trackContactInfoClick('phone', '+381613091583', 'sr');
```

### `trackNavigationClick(destination, language)`
Za praćenje navigacije kroz meni.
```typescript
trackNavigationClick('Services', 'sr');
```

### `trackLanguageChange(from, to)`
Za praćenje promene jezika.
```typescript
trackLanguageChange('sr', 'en');
```

### `trackVideoPlay(videoTitle, videoId, language)`
Za praćenje reprodukcije videa.
```typescript
trackVideoPlay('Upoznajte naš tim', 'Adq2OJ_F24I', 'sr');
```

---

## 📈 Kako proveriti u Google Analytics 4?

1. Idite na **Google Analytics 4** dashboard
2. Idite na **Reports** → **Engagement** → **Events**
3. Tražite event: **`generate_lead`** - ovo je vaš glavni event za praćenje lead-ova
4. Možete kreirati **Conversion** od ovog eventa:
   - Idite na **Configure** → **Events**
   - Pronađite `generate_lead`
   - Kliknite **Mark as conversion**

### Kreiranje Custom Reports:

Da vidite koliko lead-ova dobijate možete kreirati:
- **Exploration Report** sa `generate_lead` eventom
- Filtere po `lead_source` da vidite da li više lead-ova dolazi sa Contact page ili Home page
- Filter po `language` da vidite da li srpski ili engleski korisnici više konvertuju

---

## 🚀 Kako dodati nove eventove?

### Primer: Dodavanje tracking-a za CTA dugme

```typescript
import { trackCTAClick } from '../../utils/analytics';

// U komponenti:
<button
  onClick={() => {
    trackCTAClick('Saznaj Više - Web Dizajn', 'services_section', language);
    navigate('/contact');
  }}
>
  Saznaj Više
</button>
```

### Primer: Dodavanje tracking-a za portfolio klik

```typescript
import { trackPortfolioClick } from '../../utils/analytics';

// U PortfolioCard komponenti:
<a
  href={link}
  onClick={() => trackPortfolioClick(title, link, language)}
  target="_blank"
  rel="noopener noreferrer"
>
  View Project
</a>
```

---

## ✅ Što je implementirano:

- ✅ **Lead Generation tracking** (glavni event za forme)
- ✅ **Form Interaction tracking** (kada korisnik počne da popunjava)
- ✅ **Form Submit Attempt tracking** (kada klikne dugme)
- ✅ **Form Error tracking** (kada dođe do greške)
- ✅ **Facebook Pixel Lead tracking** (paralelno sa GA4)
- ✅ **Helper functions** za laku upotrebu
- ✅ **Type definitions** za TypeScript

---

## 📊 Očekivani podaci:

Sa ovim eventovima možete pratiti:
- 📈 **Conversion Rate** - procenat posetilaca koji šalju formu
- 🎯 **Lead Source** - da li više lead-ova dolazi sa home ili contact page
- 🌍 **Language preference** - da li srpski ili engleski korisnici više konvertuju
- 📉 **Form Abandonment** - koliko ljudi počne da popunjava ali ne pošalje
- ⚠️ **Error Rate** - koliko često dolazi do grešaka pri slanju

---

## 🔐 Privacy & GDPR Compliance:

- ✅ Evente šaljemo **anonimno** (bez email adresa u event parametre)
- ✅ Koristimo samo **first-party cookies**
- ✅ Podaci se šalju **samo na Google Analytics i Facebook**
- ✅ User name se šalje samo kao **dodatni parametar** (ne PII)

---

## 💡 Tips:

1. **Redovno proveravajte** GA4 dashboard da vidite da li evente dolaze
2. **Kreirajte konverzije** od `generate_lead` eventa
3. **Postavite notifikacije** kad dobijete novi lead
4. **A/B testirajte** različite verzije formi i pratite rezultate
5. **Analizirajte funnel** - koliko ljudi počne formu vs koliko je pošalje

---

**Poslednja izmena:** 2025-01-XX  
**Autor:** AISajt Tim  
**Verzija:** 1.0

