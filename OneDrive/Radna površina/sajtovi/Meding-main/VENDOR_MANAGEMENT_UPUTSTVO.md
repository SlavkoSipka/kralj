# 🏢 Vendor Management - Uputstvo za Korišćenje

## ✅ Šta je Implementirano

Kompletno funkcionalan sistem za upravljanje vendorima (dobavljačima) u admin panelu sa svim CRUD operacijama.

## 🚀 Kako Pristupiti

1. **Pokrenite aplikaciju:**
   ```bash
   npm run dev
   ```

2. **Prijavite se kao admin:**
   - Idi na: `http://localhost:5173/admin/login`
   - Unesi admin kredencijale

3. **Otvori Vendor Management:**
   - U Admin Panelu klikni na karticu **"🏢 Vendori"**
   - Ili direktno: `http://localhost:5173/admin/vendors`

---

## 📋 Funkcionalnosti

### 1. **Pregled Svih Vendora**
- Tabela sa svim vendorima iz baze
- Prikazuje: ID, Naziv, Kontakt osobu, Telefon, Email, Grad, Državu
- Automatsko sortiranje po nazivu (A-Z)

### 2. **Pretraga i Filtriranje**
- **Search bar** za brzu pretragu
- Pretraga radi kroz:
  - Naziv vendora
  - Grad
  - Državu
  - Email
  - Kontakt osobu
- Real-time rezultati (pretraga dok kucaš)
- Prikazuje broj pronađenih rezultata
- Dugme za brisanje pretrage (X)

### 3. **Dodavanje Novog Vendora**
- Klikni na **"Dodaj Novog Vendora"** dugme
- Otvara se modal forma sa poljima:

#### Obavezna Polja:
- **Naziv Vendora*** (required)

#### Opciona Polja:
- Kontakt Osoba
- Telefon
- Email
- Adresa
- Grad
- PTT Broj
- Država
- PIB (VAT)
- Matični Broj
- Website

- Klikni **"Dodaj Vendora"** za čuvanje
- Automatski refresh tabele nakon dodavanja

### 4. **Izmena Postojećeg Vendora**
- Klikni na **✏️ Edit** dugme pored vendora
- Otvara se modal sa popunjenim postojećim podacima
- Izmeni potrebna polja
- Klikni **"Sačuvaj Izmene"**
- Automatski refresh tabele nakon izmene

### 5. **Brisanje Vendora**
- Klikni na **🗑️ Delete** dugme pored vendora
- Pojavljuje se konfirmacioni dialog
- Potvrdi brisanje
- **NAPOMENA:** Proizvodi povezani sa vendorom NEĆE biti obrisani (ostaju u bazi)

---

## 🎨 Design Features

- **Moderan UI** sa gradient pozadinom (purple)
- **Responsive dizajn** - radi na svim uređajima
- **Animacije** na hover i klik
- **Loading stanja** tokom učitavanja i čuvanja
- **Error handling** sa jasnim porukama
- **Modal overlay** za dodavanje/izmenu
- **Smooth transitions**

---

## 🗄️ Podaci u Bazi

### Vendor Tabela Struktura:

```sql
vendor (
  idvendor: integer PRIMARY KEY,
  name: varchar NOT NULL,
  address: text,
  zip: bigint (FK → mesto.pttbroj),
  city: varchar,
  country: varchar,
  vat: varchar (PIB),
  mb: varchar (Matični broj),
  phone: varchar,
  contact_person: varchar,
  email: varchar,
  website: varchar,
  created_at: timestamp,
  updated_at: timestamp
)
```

---

## 🔐 Bezbednost

- ✅ Zahteva admin autentifikaciju
- ✅ Automatsko preusmeravanje na login ako nisi prijavljen
- ✅ Provera role pre svakog API poziva
- ✅ Validacija podataka pre čuvanja

---

## 🐛 Troubleshooting

### Problem: "Greška pri učitavanju vendora"
**Rešenje:** 
- Proveri da li je Supabase URL i ANON_KEY pravilno podešen u `.env.local`
- Proveri da li `vendor` tabela postoji u bazi

### Problem: "Greška pri čuvanju vendora"
**Rešenje:**
- Proveri da li je naziv vendora unet (obavezno polje)
- Proveri Supabase Row Level Security (RLS) policies

### Problem: Modal se ne otvara
**Rešenje:**
- Refresh stranicu (Ctrl+R)
- Proveri konzolu za JavaScript greške

---

## 📊 Statistika

Nakon implementacije, možeš videti:
- Ukupan broj vendora (u headeru)
- Broj rezultata pretrage (ako koristiš search)

---

## 🔄 Sledeći Koraci (Opciono)

Možeš dalje proširiti sistem sa:

1. **Bulk operacije:**
   - Mass delete (brisanje više vendora odjednom)
   - Export u CSV/Excel

2. **Filteri:**
   - Filter po državi
   - Filter po gradu

3. **Paginacija:**
   - Kada imaš 100+ vendora

4. **Povezani proizvodi:**
   - Link ka proizvodima tog vendora
   - Prikaz broja proizvoda po vendoru

5. **Import:**
   - Upload CSV/Excel za bulk import vendora

---

## ✅ Testiranje

**Šta testirati:**

1. ✅ Dodaj novog vendora sa svim podacima
2. ✅ Dodaj vendora samo sa nazivom (minimalno)
3. ✅ Izmeni postojećeg vendora
4. ✅ Pretraži vendore po različitim kriterijumima
5. ✅ Obriši vendora
6. ✅ Testira responsive dizajn (smanji browser)
7. ✅ Testira error handling (npr. pokušaj sačuvati prazno ime)

---

## 📞 Kontakt

Za pitanja ili probleme, kontaktiraj developera.

---

**Napravljeno sa ❤️ za Meding projekat**
