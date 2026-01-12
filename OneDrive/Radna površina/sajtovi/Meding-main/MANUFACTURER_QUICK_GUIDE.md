# 🚀 Manufacturer Management - QUICK GUIDE

## ⚡ BRZI PRISTUP

**URL:** `http://localhost:5174/admin/manufacturers`

**Admin Panel:** Klikni karticu **"🏭 Proizvođači"**

---

## 📝 OSNOVNE OPERACIJE

### **1️⃣ DODAJ PROIZVOĐAČA**
```
[+ Dodaj Novog Proizvođača] → Popuni formu → [Dodaj]
```
- **Obavezno:** Samo Naziv
- **Auto-generate:** slug, active (true)
- **Default:** Država = "Srbija"

### **2️⃣ PRETRAŽI**
```
🔍 [Pretraži proizvođače...] → Unesi termin → Enter
```
- Pretraga: name, manufacturer, city, country, email, url
- Auto-filter dok kucaš
- Prikazuje broj rezultata

### **3️⃣ SORTIRAJ**
```
[Sortiraj po: ID | Naziv ↑] → Klikni dugme
```
- **Prvo klikni:** Ascending ↑
- **Drugo klikni:** Descending ↓
- **Alternativa:** Klikni header u tabeli

### **4️⃣ PAGINATION**
```
[Prikaži: 50 ▼] → Izaberi (25/50/100/200)
[← Prethodna] [1] [2] [3] [Sledeća →]
```
- **Top:** U sekciji "Sortiraj po"
- **Bottom:** Ispod tabele
- **Auto scroll to top** pri promeni

### **5️⃣ IZMENI**
```
[✎] → Izmeni podatke → [Sačuvaj Izmene]
```

### **6️⃣ BLOKIRAJ/AKTIVIRAJ** 🌟
```
[🚫] → Potvrdi → Blokiran
[✓] → Potvrdi → Aktivan
```
- **Žuto 🚫** = Block (za aktivne)
- **Zeleno ✓** = Unblock (za blokirane)
- **Blokiran red** = bledi

### **7️⃣ OBRIŠI**
```
[×] → Potvrdi → Obrisan
```
⚠️ Proizvodi **NEĆE** biti obrisani!

---

## 🎨 TABELA KOLONE

| Kolona     | Pretraga | Sortiranje |
|------------|----------|------------|
| ID         | ❌       | ✅         |
| Naziv      | ✅       | ✅         |
| Proizvođač | ✅       | ❌         |
| Email      | ✅       | ❌         |
| Website    | ✅       | ❌         |
| Država     | ✅       | ❌         |
| Grad       | ✅       | ❌         |
| Status     | ❌       | ❌         |

---

## 🎯 STATUS INDIKATORI

| Status     | Badge  | Boja   | Dugme | Red    |
|------------|--------|--------|-------|--------|
| Aktivan    | Zeleni | 🟢     | 🚫 Žuto| Normal |
| Blokiran   | Crveni | 🔴     | ✓ Zeleno| Bledi  |

---

## 🔑 KEYBOARD SHORTCUTS

| Akcija            | Shortcut        |
|-------------------|-----------------|
| Focus Search      | `/` (slash)     |
| Clear Search      | `Esc`           |
| Close Modal       | `Esc`           |
| Submit Form       | `Ctrl+Enter`    |

---

## ⚠️ VALIDACIJE

### **Add/Edit Form:**
- ✅ **Naziv:** Obavezan (ne sme biti prazan)
- ✅ **Email:** Format validacija (email@example.com)
- ✅ **URL:** Format validacija (https://example.com)
- ✅ **Slug:** Auto-generate iz naziva

### **Block/Unblock:**
- ✅ Confirm dialog pre promene
- ✅ Ne može se blokirati već blokiran
- ✅ Ne može se aktivirati već aktivan

### **Delete:**
- ✅ Confirm dialog pre brisanja
- ⚠️ Proizvodi ostaju u sistemu!

---

## 🎭 USER FLOWS

### **Flow 1: Dodaj Proizvođača**
```
1. Klikni [+ Dodaj Novog Proizvođača]
2. Unesi Naziv (npr. "Hemofarm")
3. (Opciono) Popuni ostala polja
4. Klikni [Dodaj Proizvođača]
5. ✅ Proizvođač kreiran sa active: true
```

### **Flow 2: Blokiraj Proizvođača**
```
1. Nađi proizvođača u tabeli
2. Proveri Status badge → [Aktivan] (zeleno)
3. Klikni [🚫] žuto dugme
4. Potvrdi "Da li ste sigurni da želite da blokirate..."
5. ✅ Status → [Blokiran] (crveno)
6. ✅ Red postaje bledi
7. ✅ Dugme → [✓] zeleno
```

### **Flow 3: Pretraži i Izmeni**
```
1. Unesi termin u search (npr. "Hemofarm")
2. ✅ Prikazuje samo proizvođače sa "Hemofarm"
3. Klikni [✎ Edit] na željenom proizvođaču
4. Izmeni email ili url
5. Klikni [Sačuvaj Izmene]
6. ✅ Proizvođač ažuriran
```

### **Flow 4: Brzo Listanje**
```
1. Promeni [Prikaži: 50 ▼] na "200"
2. ✅ Sada vidiš 200 proizvođača po stranici
3. Klikni "Sledeća →" na vrhu
4. ✅ Automatski scroll na vrh
5. ✅ Prikazuje sledeću stranicu
```

---

## 🐛 TROUBLESHOOTING

### **Problem: Search ne radi**
**Rešenje:**
1. Proveri da li imaš proizvođače u bazi
2. Clear search dugme (×)
3. Refresh stranicu (F5)

### **Problem: Pagination prikazuje prazno**
**Rešenje:**
1. Proveri broj ukupnih proizvođača
2. Smanji items per page (25 umesto 200)
3. Klikni [1] da odeš na prvu stranicu

### **Problem: Block dugme ne radi**
**Rešenje:**
1. Proveri da li je proizvođač već blokiran
2. Proveri da li si admin
3. Check browser console za errore

### **Problem: Modal se ne zatvara**
**Rešenje:**
1. Klikni [×] dugme u gornjem desnom uglu
2. Klikni van modala (na pozadinu)
3. Press `Esc` key

---

## 💡 BEST PRACTICES

### **✅ DO:**
- ✅ Potvrdi uvek Block/Delete akcije
- ✅ Koristi Search pre nego što skroluješ
- ✅ Blokiraj umesto da brišeš (reverzibilno!)
- ✅ Popuni što više polja u formi
- ✅ Proveri Slug pre dodavanja

### **❌ DON'T:**
- ❌ Ne briši proizvođača ako ima proizvode
- ❌ Ne ostavljaj prazno Email i URL polja
- ❌ Ne blokiraj sve proizvođače odjednom
- ❌ Ne zaboravi da popuniš Naziv (obavezno!)

---

## 📊 QUICK STATS

**U Admin Panel kartici:**
```
Ukupno proizvođača: 45
```

**U Search Results:**
```
Pronađeno: 12 proizvođača
```

**U Pagination Info:**
```
Prikazano: 1-50 od 120
```

---

## 🎯 CHEATSHEET

| Šta želim?                  | Kako?                          |
|-----------------------------|--------------------------------|
| Dodaj proizvođača           | `[+]` dugme                    |
| Pretraži                    | Search bar                     |
| Sortiraj po ID              | Klikni `[ID]`                  |
| Sortiraj po Nazivu          | Klikni `[Naziv]`               |
| Promeni broj po stranici    | Dropdown `[50 ▼]`              |
| Idi na stranicu 5           | Klikni broj `[5]`              |
| Blokiraj proizvođača        | Žuto dugme `[🚫]`              |
| Aktiviraj proizvođača       | Zeleno dugme `[✓]`             |
| Izmeni proizvođača          | `[✎]` dugme                    |
| Obriši proizvođača          | `[×]` dugme                    |
| Vrati se na Admin Panel     | `← Nazad` link                 |

---

## 🚀 QUICK TEST

**5-minutni test:**
```
1. ✅ Dodaj proizvođača "Test Corp"
2. ✅ Pretraži "Test"
3. ✅ Sortiraj po Nazivu
4. ✅ Blokiraj "Test Corp"
5. ✅ Proveri status badge → [Blokiran]
6. ✅ Aktiviraj "Test Corp"
7. ✅ Proveri status badge → [Aktivan]
8. ✅ Izmeni Email na "test@example.com"
9. ✅ Obriši "Test Corp"
10. ✅ Potvrdi da je obrisan
```

**Ako sve radi → 🎉 GOTOVO!**

---

## 📱 MOBILE TIPS

**Na telefonu:**
- Swipe tabelu levo/desno za sve kolone
- Top pagination kontrole su centriran
- Modal je full-screen
- Dugmad su veća za lakši klik

---

## 🎊 SUMMARY

**Manufacturer Management ima:**
- ✅ CRUD (Create, Read, Update, Delete)
- ✅ Search & Filter
- ✅ Pagination (25/50/100/200)
- ✅ Sorting (ID, Name)
- ✅ **Block/Unblock** 🌟
- ✅ Responsive Design
- ✅ Zero Errors

**URL:** `http://localhost:5174/admin/manufacturers`

**Enjoy! 🚀**

---

**Updated: 19. Decembar 2025 - 00:55**
**Status: ✅ READY TO USE**
