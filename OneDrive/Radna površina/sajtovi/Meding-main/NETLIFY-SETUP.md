# 🚀 Netlify Deployment Setup - VAŽNO!

## Problem

Aplikacija radi na `localhost` ali na Netlify ne prikazuje proizvode jer **environment varijable nisu konfigurisane**.

## Rešenje - Postavi Environment Varijable na Netlify

### Korak 1: Prikupi Supabase podatke

1. Idi na [Supabase Dashboard](https://app.supabase.com)
2. Otvori svoj projekat
3. Klikni na **Settings** (ikona zupčanika) → **API**
4. Kopiraj:
   - **Project URL** (npr. `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public** key (dugačak string koji počinje sa `eyJ...`)

### Korak 2: Postavi varijable na Netlify

1. Idi na [Netlify Dashboard](https://app.netlify.com)
2. Izaberi svoj sajt
3. Klikni na **Site configuration** → **Environment variables**
4. Klikni **Add a variable** i dodaj sledeće:

| Variable Name | Value |
|--------------|-------|
| `VITE_SUPABASE_URL` | Tvoj Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Tvoj Supabase anon key |

**VAŽNO:** Ime varijable mora biti **TAČNO OVAKO** (sa `VITE_` prefiksom)!

### Korak 3: Redeploy

Nakon što dodaš varijable:

1. Idi na **Deploys** tab
2. Klikni **Trigger deploy** → **Deploy site**
3. Sačekaj par minuta da se build završi

## ✅ Provera

Nakon deploy-a:
1. Otvori svoj sajt
2. Uloguj se kao admin
3. Idi na **Admin Panel** → **Proizvodi**
4. Sada bi trebalo da vidiš sve proizvode!

## 🔍 Dodatno - Algolia Search (Opciono)

Ako koristiš Algolia za pretragu, dodaj i ove varijable:

| Variable Name | Value | Napomena |
|--------------|-------|----------|
| `VITE_ALGOLIA_APP_ID` | Tvoj Algolia App ID | Za search |
| `VITE_ALGOLIA_SEARCH_KEY` | Tvoj Search-Only API Key | Za frontend search |
| `VITE_ALGOLIA_ADMIN_KEY` | Tvoj Admin API Key | Za sync generics (samo za admin) |
| `VITE_ALGOLIA_INDEX_NAME` | `products` | Ime products index-a |

**VAŽNO:** 
- `SEARCH_KEY` se koristi na frontend-u (javni)
- `ADMIN_KEY` se koristi samo za admin panel sync (privatni)
- **NE MEŠAJ** ova dva key-a!

## 🆘 Ako još ne radi

1. **Proveri u browser konzoli** (F12 → Console) za greške
2. **Proveri RLS policies** u Supabase:
   - Da li su enable-ovane za `products` tabelu?
   - Da li admin korisnik ima pristup?
3. **Proveri da li si ulogovan** kao admin (ne kao vendor ili običan korisnik)

## 📝 Lokalno Testiranje

Za lokalno testiranje, napravi `.env` fajl u root folderu:

\`\`\`env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
\`\`\`

**NAPOMENA:** `.env` fajl je već dodat u `.gitignore` i neće biti push-ovan na GitHub.

---

**Napravljeno: ${new Date().toLocaleDateString('sr-RS')}**
