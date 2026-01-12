# 📢 ČITAJ ME PRVO!

## 🔴 Problem: Proizvodi ne rade na Netlify

Ako ti **Admin Panel → Proizvodi** radi lokalno ali **ne radi na Netlify** (piše "Nema proizvoda u sistemu"), evo šta treba da uradiš:

---

## ✅ BRZO REŠENJE (5 minuta)

### 📄 Otvori: `BRZI-FIX-NETLIFY.md`

Taj fajl sadrži **step-by-step uputstvo** kako da:
1. Prikupiš Supabase podatke
2. Postaviš environment varijable na Netlify
3. Redeploy-uješ sajt
4. Testiraš da li radi

---

## 📚 Dodatni Resursi

### Ako još ne radi:

1. **`KAKO-PROVERITI-ENV.md`**
   - Kako proveriti da li su environment varijable postavljene
   - Kako prikupiti Supabase podatke
   - Česte greške i njihova rešenja

2. **`NETLIFY-SETUP.md`**
   - Kompletan Netlify deployment guide
   - Provera RLS politika u Supabase
   - Provera admin pristupa

3. **`env.example.txt`**
   - Template za `.env` fajl
   - Lista svih potrebnih environment varijabli

---

## 🎯 Šta je Problem?

Tvoja aplikacija koristi **Supabase** za bazu podataka.  
Lokalno, verovatno imaš environment varijable postavljene nekako.  
Ali na **Netlify-ju**, te varijable **ne postoje**, pa aplikacija ne može da se poveže na bazu.

**Rešenje:** Postavi varijable na Netlify (vidi `BRZI-FIX-NETLIFY.md`)

---

## ⚙️ Tehnički Detalji

### Environment varijable koje su potrebne:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Gde ih postaviti:

**Netlify:**
- Site configuration → Environment variables

**Lokalno (za testiranje):**
- Kreiraj `.env` fajl u root folderu
- Kopiraj sadržaj iz `env.example.txt`
- Popuni sa pravim vrednostima

---

## 🆘 Još Pitanja?

1. **Proveri `BRZI-FIX-NETLIFY.md`** - 90% problema će biti rešeno ovde
2. **Proveri `KAKO-PROVERITI-ENV.md`** - Dodatne provere
3. **Otvori browser console** (F12) i vidi grešku
4. **Proveri Supabase RLS politike** - možda je problem u permissions

---

## 📋 Quick Checklist

Proveri ovo **redom**:

- [ ] **Supabase varijable postavljene na Netlify** (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] **Trigger deploy** nakon dodavanja varijabli
- [ ] **Sačekao 2-3 minuta** za build
- [ ] **Ulogovao se kao admin** (ne kao vendor ili običan korisnik)
- [ ] **RLS politike** su enable-ovane za `products` tabelu u Supabase
- [ ] **Moj user ima** `role = 'admin'` i `active = true` u `user_roles` tabeli

---

## 🎬 Započni Ovde

### Korak 1: Otvori `BRZI-FIX-NETLIFY.md`

### Korak 2: Prati uputstvo korak-po-korak

### Korak 3: Testiranje

### Korak 4: ✅ Gotovo!

---

**Napravljeno: ${new Date().toLocaleDateString('sr-RS')}**

**Dobro ti došlo na Meding! 🚀**
