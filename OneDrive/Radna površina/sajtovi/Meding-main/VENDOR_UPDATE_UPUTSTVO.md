# 🔄 Vendor Management Update - Uputstvo

## ✅ Šta je Ažurirano

1. ✅ **Mesto dropdown** - Izbor mesta iz tabele umesto ručnog unosa
2. ✅ **Auto-populate city** - Grad se automatski popunjava
3. ✅ **Country default "Srbija"** - Default vrednost za nové vendore
4. ✅ **Više kolona u tabeli** - PIB, MB, Website
5. ✅ **Novi dizajn** - Red boje kao na homepage-u (umesto purple)

---

## 🗄️ 1. UPDATE BAZE (OBAVEZNO!)

### Pokreni SQL u Supabase:

1. Idi na: **Supabase Dashboard** → **SQL Editor**
2. Otvori fajl: `update-vendors-country.sql`
3. Kopiraj i pokreni SQL:

```sql
-- Update svih vendora gde je country NULL ili prazan
UPDATE vendor
SET 
  country = 'Srbija',
  updated_at = NOW()
WHERE country IS NULL OR country = '' OR TRIM(country) = '';
```

4. Proveri rezultate:

```sql
-- Proveri koliko je ažurirano
SELECT COUNT(*) as updated_count
FROM vendor
WHERE country = 'Srbija';

-- Prikaži sve vendore
SELECT idvendor, name, city, country
FROM vendor
ORDER BY name;
```

---

## 🎨 2. Nove Funkcionalnosti

### **Mesto Dropdown**
- Umesto ručnog unosa ZIP koda, sada imaš **dropdown sa svim mestima**
- Lista se učitava iz `mesto` tabele (pttbroj + naziv mesta)
- Sortirana abecedno po nazivu mesta

### **Auto-populate City**
Kada izabereš mesto iz dropdown-a:
1. **ZIP (PTT broj)** se automatski popunjava
2. **Grad (City)** se automatski popunjava iz tabele
3. Grad polje je **read-only** (ne može se ručno menjati)

### **Country Default**
- Novi vendori imaju automatski **"Srbija"** kao default
- Može se promeniti ako treba drugačije

### **Proširena Tabela**
Tabela sada prikazuje:
- ID
- Naziv
- Kontakt Osoba
- Telefon
- Email
- Grad
- **PIB** ✨ (novo)
- **MB** ✨ (novo)
- **Website** ✨ (novo sa linkom)
- Akcije (Edit/Delete)

---

## 🎨 3. Novi Dizajn

### Promene:
- ❌ **Purple gradient** (staro)
- ✅ **White/Gray background** (novo)
- ✅ **Red primary color** (#E31E24)
- ✅ **Clean professional look**
- ✅ **Konzistentan sa homepage-om**

### Boje:
- **Primary:** `--primary-red` (#E31E24)
- **Hover:** `--primary-red-hover` (#C41A1F)
- **Background:** `--neutral-gray-50` (#F9FAFB)
- **Cards:** `--neutral-white` (#FFFFFF)

---

## 📋 4. Kako Koristiti Nove Funkcionalnosti

### **Dodavanje Novog Vendora:**

1. Klikni **"Dodaj Novog Vendora"**
2. Popuni **Naziv** (obavezno)
3. **Izaberi Mesto** iz dropdown-a:
   - Otvori dropdown "Mesto (PTT)"
   - Izaberi npr. "11000 - Beograd"
   - ✅ ZIP i Grad se automatski popunjavaju!
4. Država je već "Srbija" (može se promeniti)
5. Popuni ostale podatke (PIB, MB, telefon...)
6. Klikni **"Dodaj Vendora"**

### **Izmena Vendora:**

1. Klikni ✏️ **Edit** ikonu
2. Promeni podatke (sva polja se mogu menjati osim grada)
3. Za promenu grada:
   - Promeni **Mesto (PTT)** iz dropdown-a
   - Grad će se automatski ažurirati
4. Klikni **"Sačuvaj Izmene"**

---

## 🔍 5. Pretraga

Pretraga sada radi kroz:
- Naziv vendora
- Grad
- Država
- Email
- Kontakt osoba
- **PIB** ✨ (novo)
- **MB** ✨ (novo)

---

## 📊 6. Database Schema (Ažurirano)

```sql
vendor (
  idvendor         INTEGER PRIMARY KEY,
  name             VARCHAR NOT NULL,
  address          TEXT,
  zip              BIGINT,           -- FK → mesto.pttbroj ✨
  city             VARCHAR,          -- Auto iz mesto.mesto ✨
  country          VARCHAR,          -- Default: "Srbija" ✨
  vat              VARCHAR,          -- PIB - prikazuje se u tabeli ✨
  mb               VARCHAR,          -- MB - prikazuje se u tabeli ✨
  phone            VARCHAR,
  contact_person   VARCHAR,
  email            VARCHAR,
  website          VARCHAR,          -- Prikazuje se kao link ✨
  created_at       TIMESTAMP,
  updated_at       TIMESTAMP
)

mesto (
  pttbroj          BIGINT PRIMARY KEY,
  mesto            TEXT              -- Naziv mesta
)
```

---

## ✅ 7. Testiranje

### Test Scenario 1: Dodaj Novog Vendora
1. Otvori `/admin/vendors`
2. Klikni "Dodaj Novog Vendora"
3. Uneși naziv: "Test Vendor"
4. Izaberi mesto: "11000 - Beograd"
5. ✅ Proveri da li se grad automatski popunio sa "Beograd"
6. Unesi PIB: "123456789"
7. Unesi MB: "12345678"
8. Unesi website: "https://test.com"
9. Klikni "Dodaj Vendora"
10. ✅ Proveri da li se vendor pojavljuje u tabeli sa svim podacima

### Test Scenario 2: Izmeni Postojećeg Vendora
1. Pronađi vendora u tabeli
2. Klikni ✏️ Edit
3. Promeni mesto na "21000 - Novi Sad"
4. ✅ Proveri da li se grad promenio na "Novi Sad"
5. Izmeni PIB i MB
6. Klikni "Sačuvaj Izmene"
7. ✅ Proveri da li su izmene vidljive u tabeli

### Test Scenario 3: Pretraga po PIB
1. U search bar unesi PIB broj (npr. "123456789")
2. ✅ Proveri da li se prikazuje vendor sa tim PIB-om

### Test Scenario 4: Website Link
1. Pronađi vendora sa website-om u tabeli
2. Klikni na "Link" u Website koloni
3. ✅ Proveri da li se otvara website u novom tabu

---

## 🐛 8. Troubleshooting

### Problem: "Nema mesta u dropdown-u"
**Rešenje:**
- Proveri da li `mesto` tabela ima podatke u Supabase
- Proveri SQL query: `SELECT * FROM mesto ORDER BY mesto LIMIT 10;`

### Problem: "Grad se ne popunjava automatski"
**Rešenje:**
- Proveri da li je PTT broj validan u `mesto` tabeli
- Refresh stranicu i pokušaj ponovo

### Problem: "Country je prazan na starim vendorima"
**Rešenje:**
- Pokreni SQL update (pogledaj sekciju 1)
- Ili ručno izmeni svakog vendora i dodaj "Srbija"

---

## 📞 9. Support

Za pitanja ili probleme:
- Proveri `VENDOR_MANAGEMENT_UPUTSTVO.md` za osnovnu dokumentaciju
- Proveri `VENDOR_MANAGEMENT_README.md` za tehnički pregled

---

## 🎊 Gotovo!

Sve nove funkcionalnosti su implementirane i spremne za upotrebu! 🚀

**Next Steps:**
1. ✅ Pokreni SQL update za country
2. ✅ Testiraj nove funkcionalnosti
3. ✅ Uživaj u novom dizajnu! 😊

---

**Updated: 18. Decembar 2025**
