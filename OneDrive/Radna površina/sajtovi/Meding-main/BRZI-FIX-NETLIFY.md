# ⚡ BRZI FIX - Proizvodi ne rade na Netlify

## 🔴 Problem
Na `localhost` radi, na Netlify piše "Nema proizvoda u sistemu"

## ✅ Rešenje (5 minuta)

### 1️⃣ Prikupi Supabase podatke

Otvori https://app.supabase.com → Tvoj projekat → **Settings** → **API**

Kopiraj:
```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```

### 2️⃣ Idi na Netlify

https://app.netlify.com → Tvoj sajt → **Site configuration** → **Environment variables**

### 3️⃣ Dodaj ove 2 varijable:

**VARIJABLA 1:**
```
Key: VITE_SUPABASE_URL
Value: [tvoj Project URL iz koraka 1]
```

**VARIJABLA 2:**
```
Key: VITE_SUPABASE_ANON_KEY
Value: [tvoj anon key iz koraka 1]
```

⚠️ **PAZI:** Imena moraju biti **TAČNO** ovako napisana (sa `VITE_` prefiksom)!

### 4️⃣ Redeploy

Idi na **Deploys** → **Trigger deploy** → **Deploy site**

Sačekaj 2-3 minuta.

### 5️⃣ Testiranje

Posle deploy-a:
1. Otvori sajt
2. Uloguj se kao admin
3. Idi na Admin Panel → Proizvodi
4. Trebalo bi da vidiš proizvode! 🎉

---

## 🆘 Još ne radi?

### Provera u browseru:
1. Pritisni `F12` (otvori DevTools)
2. Idi na **Console** tab
3. Vidi da li piše:
   - ❌ "GREŠKA: Supabase environment varijable nisu postavljene" → Nisi dobro postavio varijable na Netlify
   - ❌ "RLS policy violated" → Problem sa Supabase permissions

### Provera RLS u Supabase:

Idi na Supabase → SQL Editor → pokreni:

\`\`\`sql
-- Provera RLS politika
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'products';

-- Provera ima li proizvoda
SELECT COUNT(*) as ukupno FROM products;

-- Provera autentifikovanog korisnika
SELECT auth.uid();
\`\`\`

### Provera admin pristupa:

\`\`\`sql
-- Provera tvog role-a
SELECT * FROM user_roles WHERE auth_id = auth.uid();

-- Trebalo bi da vidiš: role = 'admin' i active = true
\`\`\`

---

## 📋 Checklist

- [ ] Dodao `VITE_SUPABASE_URL` na Netlify
- [ ] Dodao `VITE_SUPABASE_ANON_KEY` na Netlify
- [ ] Trigger deploy na Netlify
- [ ] Sačekao 2-3 minuta za deploy
- [ ] Ulogovao se kao **admin** (ne vendor!)
- [ ] RLS politike su enable-ovane za `products` tabelu
- [ ] Moj user ima `role = 'admin'` i `active = true` u `user_roles`

---

**Ako ništa ne pomaže, posalji screenshot sa:**
1. Netlify environment variables (zamaglji key-eve)
2. Browser Console (F12 → Console tab)
3. Rezultat SQL query-ja iz Supabase

---
Napravljeno: ${new Date().toLocaleDateString('sr-RS')}
