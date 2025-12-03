# 🧪 Testiranje Google Analytics Eventova

## 🎯 Brzi Test - Da li eventi rade?

### 1. Otvorite Browser Console
- Pritisnite **F12** ili **Ctrl+Shift+I** (Windows/Linux)
- Pritisnite **Cmd+Option+I** (Mac)
- Izaberite **Console** tab

### 2. Otvorite sajt
- Idite na `http://localhost:5173` (development)
- Ili na produkciju: `https://aisajt.com`

### 3. Testirajte Contact Form
1. Idite na **Contact stranicu** (`/contact`)
2. Počnite da popunjavate formu:
   - Unesite ime → Treba da vidite u konzoli: ✅ tracking log
   - Unesite email → Treba da vidite u konzoli: ✅ tracking log
   - Unesite telefon → Treba da vidite u konzoli: ✅ tracking log
3. Kliknite **"Pošalji"**:
   - Treba da vidite: `form_submit_attempt` event
   - Nakon uspešnog slanja: `✅ Lead tracked:` log
   - **OVO JE NAJVAŽNIJI EVENT!** 🎉

---

## 📊 Provera u Google Analytics Real-Time

### Korak 1: Otvorite GA4
1. Idite na [Google Analytics](https://analytics.google.com)
2. Izaberite vaš property: **G-6C046QS9HG**

### Korak 2: Real-Time Reports
1. U levom meniju kliknite **Reports**
2. Kliknite **Realtime**
3. Scroll down do **Event count by Event name**

### Korak 3: Testirajte
1. U drugom browser window-u otvorite sajt
2. Popunite i pošaljite kontakt formu
3. Za **5-10 sekundi** treba da vidite eventi u Real-Time:
   - `form_interaction` (3 puta - name, email, phone)
   - `form_submit_attempt` (1 put)
   - **`generate_lead`** ⭐ (1 put - **GLAVNI EVENT!**)

---

## 🔍 Provera Parametara Eventa

### U GA4 Real-Time View:
1. Kliknite na **Event name** (npr. `generate_lead`)
2. Videćete parametare:
   - `event_category`: "Lead Generation"
   - `event_label`: "Contact Form - Success"
   - `lead_source`: "contact_page" ili "home_page"
   - `language`: "sr" ili "en"
   - `user_name`: ime korisnika
   - `value`: 1
   - `currency`: "EUR"

---

## 🐛 Troubleshooting - Ako eventi ne rade

### Problem 1: Ne vidim ništa u konzoli
**Rešenje:**
```javascript
// Proverite da li je gtag definisan
console.log('gtag defined:', typeof window.gtag !== 'undefined');
console.log('fbq defined:', typeof window.fbq !== 'undefined');
```

### Problem 2: Konzola pokazuje tracking ali GA ne prima
**Mogući uzroci:**
1. **Ad Blocker** - isključite AdBlock ili uBlock
2. **Privacy Badger** - isključite privacy ekstenzije
3. **Brave Browser** - isključite Shields
4. **VPN/Proxy** - privremeno isključite

**Test:**
```javascript
// Ručno pošaljite test event u konzoli
if (window.gtag) {
  window.gtag('event', 'test_event', {
    test_param: 'test_value'
  });
  console.log('Test event sent!');
}
```

### Problem 3: Eventi se vide u konzoli ali ne u GA Real-Time
**Rešenje:**
- Sačekajte **15-30 sekundi** (nije instant)
- Proverite da li je Property ID tačan: **G-6C046QS9HG**
- Proverite da li ste ulogovani u pravi GA account

### Problem 4: Facebook Pixel ne radi
**Rešenje:**
```javascript
// Test FB Pixel u konzoli
if (window.fbq) {
  window.fbq('track', 'PageView');
  console.log('FB Pixel works!');
} else {
  console.error('FB Pixel not loaded!');
}
```

---

## 📱 Test Scenario - Kompletna Lead Journey

### Scenario: Korisnik šalje kontakt formu

1. **Korisnik otvara Contact page**
   - Event: `page_view` (automatski od GA)

2. **Korisnik počinje da piše ime**
   - Event: `form_interaction`
   - Label: "Contact Form - Started Filling name"

3. **Korisnik piše email**
   - Event: `form_interaction`
   - Label: "Contact Form - Started Filling email"

4. **Korisnik piše telefon**
   - Event: `form_interaction`
   - Label: "Contact Form - Started Filling phone"

5. **Korisnik klikne "Pošalji"**
   - Event: `form_submit_attempt`
   - Label: "Contact Form - Submit Clicked"

6. **✅ Forma uspešno poslata**
   - Event: **`generate_lead`** ⭐
   - Label: "Contact Form - Success"
   - FB Pixel Event: **`Lead`**

**Ukupno eventova:** 6 (5 GA + 1 FB)

---

## 🎯 Test Case za različite scenarije

### Test 1: Uspešna forma sa Contact Page
```bash
1. Navigate to /contact
2. Fill in: Name = "Test User"
3. Fill in: Email = "test@example.com"
4. Fill in: Phone = "+381611234567"
5. Click "Pošalji"
6. Wait for success message

Expected Events:
✅ form_interaction (name)
✅ form_interaction (email)
✅ form_interaction (phone)
✅ form_submit_attempt
✅ generate_lead (lead_source: "contact_page")
✅ FB Pixel Lead
```

### Test 2: Uspešna forma sa Home Page
```bash
1. Navigate to /
2. Scroll to Contact section at bottom
3. Fill in form
4. Click "Pošalji"

Expected Events:
✅ generate_lead (lead_source: "home_page")
```

### Test 3: Greška pri slanju
```bash
1. Temporarily disconnect internet
2. Try to submit form

Expected Events:
✅ form_submit_attempt
✅ form_submit_error
```

### Test 4: Započeta ali ne poslata forma
```bash
1. Start filling form
2. Fill only Name field
3. Close page without submitting

Expected Events:
✅ form_interaction (name)
❌ generate_lead (ne treba da se okine)
```

---

## 📈 KPI Metrics koje možete pratiti

Nakon implementacije, u GA4 možete pratiti:

### 1. **Conversion Rate**
```
Conversion Rate = (generate_lead eventi / page_view na /contact) × 100%
```

### 2. **Form Abandonment Rate**
```
Abandonment = ((form_interaction / 3) - generate_lead) / (form_interaction / 3) × 100%
```

### 3. **Lead Source Performance**
- Contact Page leads: `lead_source: "contact_page"`
- Home Page leads: `lead_source: "home_page"`

### 4. **Language Performance**
- Serbian leads: `language: "sr"`
- English leads: `language: "en"`

### 5. **Error Rate**
```
Error Rate = form_submit_error / form_submit_attempt × 100%
```

---

## 🔔 Notifikacije kada dobijete Lead

### Opcija 1: GA4 Custom Alert (besplatno)
1. GA4 → **Configure** → **Custom Definitions**
2. Kreirajte alert za `generate_lead` event
3. Pošaljite email kada se event okine

### Opcija 2: Zapier Integration
1. Konektujte GA4 sa Zapier-om
2. Trigger: Novi `generate_lead` event
3. Action: Pošalji Slack/Email notifikaciju

### Opcija 3: Google Tag Manager Container Notification
1. GTM → Triggeri → Event = "generate_lead"
2. Tag → HTTP Request → Webhook URL (vaš Slack/Discord)

---

## ✅ Pre-launch Checklist

Prije nego što sajt ide live, proverite:

- [ ] GA Property ID je tačan: **G-6C046QS9HG**
- [ ] FB Pixel ID je tačan: **861131543475701**
- [ ] Testirano slanje forme sa Contact page
- [ ] Testirano slanje forme sa Home page
- [ ] Eventi se vide u GA4 Real-Time
- [ ] FB Pixel eventi se vide u Events Manager
- [ ] Testirano na različitim browser-ima (Chrome, Firefox, Safari)
- [ ] Testirano na mobilnom
- [ ] Testirano sa i bez Ad Blocker-a
- [ ] Debug mode log-ovi rade u konzoli

---

## 🎓 Dodatni resursi

### Google Analytics 4:
- [GA4 Events Overview](https://support.google.com/analytics/answer/9322688)
- [GA4 Conversion Tracking](https://support.google.com/analytics/answer/9267568)

### Facebook Pixel:
- [FB Pixel Events Reference](https://developers.facebook.com/docs/meta-pixel/reference)
- [FB Events Manager](https://business.facebook.com/events_manager2)

### Testing Tools:
- [Google Tag Assistant](https://tagassistant.google.com/)
- [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/)

---

**Srećno testiranje! 🚀📊**

Ako imate problema ili pitanja, kontaktirajte developera.

