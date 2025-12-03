# 📊 Analytics Helper - Brzi Vodič

## 🚀 Kako koristiti

### Import funkcija

```typescript
import {
  trackLeadGeneration,
  trackCTAClick,
  trackPortfolioClick,
  trackContactInfoClick,
  trackNavigationClick,
  trackLanguageChange,
  trackVideoPlay
} from './utils/analytics';
```

---

## 📋 Primeri korišćenja

### 1. ⭐ Lead Generation (Već implementirano u Contact formama)

```typescript
// Automatski se poziva kada korisnik uspešno pošalje kontakt formu
trackLeadGeneration('contact_page', userName, language);
```

---

### 2. 🎯 CTA Buttons (Call-to-Action dugmad)

**Gde implementirati:**
- "Zakažite Besplatnu Konsultaciju"
- "Saznaj Više"
- "Razgovarajmo o Vašem Projektu"

```typescript
// Primer za dugme "Saznaj Više" u Services sekciji
<button
  onClick={() => {
    trackCTAClick('Saznaj Više - Web Dizajn', 'services_section', language);
    navigate('/contact');
  }}
  className="group px-8 py-4..."
>
  Saznaj Više
</button>
```

```typescript
// Primer za dugme "Zakažite Konsultaciju" u Hero sekciji
<button
  onClick={() => {
    trackCTAClick('Zakažite Besplatnu Konsultaciju', 'hero_section', language);
    navigate('/contact');
  }}
>
  Zakažite Besplatnu Konsultaciju
</button>
```

---

### 3. 🖼️ Portfolio Projects

**Gde implementirati:**
- U `PortfolioCard.tsx` komponenti

```typescript
// U PortfolioCard komponenti
const handleClick = () => {
  trackPortfolioClick(title, link, language);
};

<a
  href={link}
  onClick={handleClick}
  target="_blank"
  rel="noopener noreferrer"
>
  {/* Portfolio card content */}
</a>
```

---

### 4. 📧 Contact Info (Email & Phone links)

**Gde implementirati:**
- Footer sekcija
- Contact stranica
- Svuda gde ima email/telefon linkovi

```typescript
// Email link
<a
  href="mailto:office@aisajt.com"
  onClick={() => trackContactInfoClick('email', 'office@aisajt.com', language)}
>
  office@aisajt.com
</a>

// Phone link
<a
  href="tel:+381613091583"
  onClick={() => trackContactInfoClick('phone', '+381613091583', language)}
>
  +381 61 3091583
</a>
```

---

### 5. 🧭 Navigation Menu

**Gde implementirati:**
- Top navigation bar
- Side navigation
- Footer navigation

```typescript
// Primer za navigaciju ka Services sekciji
<button
  onClick={() => {
    trackNavigationClick('Services', language);
    scrollToSection('services');
  }}
>
  {t.services}
</button>

// Primer za navigaciju ka Contact stranici
<button
  onClick={() => {
    trackNavigationClick('Contact Page', language);
    navigate('/contact');
  }}
>
  {t.contact}
</button>
```

---

### 6. 🌐 Language Switch

**Gde implementirati:**
- Language switcher dugmad (SR/EN)

```typescript
// Primer za language switcher
<button
  onClick={() => {
    const oldLanguage = language;
    setLanguage('en');
    trackLanguageChange(oldLanguage, 'en');
  }}
  className={language === 'en' ? 'active' : ''}
>
  EN
</button>
```

---

### 7. 🎥 Video Play

**Gde implementirati:**
- YouTube video komponenta
- Bilo koji video player

```typescript
// U YouTubeVideo komponenti
const handlePlay = () => {
  trackVideoPlay('Upoznajte naš tim i način rada', videoId, language);
};

// React Player primer
<ReactPlayer
  url={videoUrl}
  onPlay={handlePlay}
/>
```

---

## 🎨 Primer: Kompletna HomePage sa tracking-om

```typescript
import { trackCTAClick, trackNavigationClick, trackLanguageChange } from '../../utils/analytics';

export function HomePage() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div>
      {/* Navigation */}
      <button
        onClick={() => {
          trackNavigationClick('Services', language);
          scrollToSection('services');
        }}
      >
        Services
      </button>

      {/* Hero CTA */}
      <button
        onClick={() => {
          trackCTAClick('Kontaktirajte nas - Hero', 'hero_section', language);
          navigate('/contact');
        }}
      >
        Kontaktirajte nas
      </button>

      {/* Language Switcher */}
      <button
        onClick={() => {
          trackLanguageChange(language, 'en');
          setLanguage('en');
        }}
      >
        EN
      </button>
    </div>
  );
}
```

---

## 📊 Šta se može pratiti:

| Event | Parametri | Značaj |
|-------|-----------|--------|
| `generate_lead` | source, name, language | ⭐⭐⭐ Najvažniji - novi lead |
| `form_interaction` | field, location, language | ⭐⭐ Zainteresovan korisnik |
| `cta_click` | label, location, language | ⭐⭐ Interakcija sa dugmadima |
| `portfolio_click` | project, url, language | ⭐ Interesovanje za projekte |
| `contact_info_click` | type, value, language | ⭐ Direktan kontakt |
| `navigation_click` | destination, language | ⭐ Navigacija kroz sajt |
| `language_change` | from, to | Preferencija korisnika |
| `video_play` | title, id, language | Engagement sa sadržajem |

---

## ✅ Best Practices:

1. **Uvek dodajte language parametar** - važno za analizu po jeziku
2. **Koristite jasne labels** - npr "Saznaj Više - Web Dizajn" umesto samo "Saznaj Više"
3. **Tracking-ujte svaki CTA** - svako dugme koje vodi ka konverziji
4. **Ne šaljite PII** (Personally Identifiable Information) - email, telefon, itd.
5. **Testirajte u konzoli** - helper funkcije loguju uspešne tracking-ove

---

## 🐛 Debug Mode:

Sve funkcije automatski loguju u konzolu kada se pozovu:

```
✅ Lead tracked: { source: 'contact_page', userName: 'Marko', language: 'sr' }
```

Otvorite **Browser Console** (F12) da vidite da li se eventi šalju.

---

## 🔄 Next Steps:

1. ✅ Lead Generation - **DONE** (implementirano u Contact formama)
2. ⏳ CTA Buttons - **TODO** (dodati u HomePage.tsx)
3. ⏳ Portfolio Clicks - **TODO** (dodati u PortfolioCard.tsx)
4. ⏳ Contact Info - **TODO** (dodati u Footer)
5. ⏳ Navigation - **TODO** (dodati u NavBar)
6. ⏳ Language Switch - **TODO** (dodati u LanguageSwitcher)
7. ⏳ Video Play - **TODO** (dodati u YouTubeVideo)

---

**Happy Tracking! 📊🎯**

