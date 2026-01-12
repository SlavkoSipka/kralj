# 🔍 Kako Proveriti Environment Varijable

## Na Netlify-ju (Online)

### Način 1: Kroz Netlify Dashboard

1. Idi na https://app.netlify.com
2. Izaberi svoj sajt
3. **Site configuration** → **Environment variables**
4. Trebalo bi da vidiš:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

Ako ih **NEMA**, dodaj ih! Pogledaj `BRZI-FIX-NETLIFY.md`

### Način 2: Kroz Browser Console

1. Otvori svoj sajt na Netlify-ju
2. Pritisni `F12` (DevTools)
3. Idi na **Console** tab
4. Ukucaj:

\`\`\`javascript
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'POSTAVLJENO ✓' : 'NEDOSTAJE ✗');
\`\`\`

**Ako vidiš `undefined`** → Varijable nisu postavljene!

---

## Lokalno (Localhost)

### Način 1: Proveri .env fajl

U root folderu projekta:

1. Proveri da li postoji `.env` fajl
2. Otvori ga i proveri da ima:

\`\`\`env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
\`\`\`

**Ako NEMA** `.env` fajla:
1. Kopiraj `env.example.txt` kao `.env`
2. Popuni sa pravim vrednostima iz Supabase

### Način 2: Proveri u kodu

Otvori `src/lib/supabase.ts` - sada ima proveru:

```typescript
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ GREŠKA: Supabase environment varijable nisu postavljene!');
  // ...
}
```

Ako vidiš ovu grešku u konzoli → varijable nisu postavljene.

---

## Prikupljanje Supabase Podataka

### Korak-po-Korak:

1. **Otvori Supabase**: https://app.supabase.com
2. **Izaberi projekat**: Klikni na svoj projekat
3. **Settings**: Klikni na ikonu zupčanika levo dole
4. **API**: U meniju izaberi "API"
5. **Kopiraj**:
   - **Project URL**: 
     ```
     https://xxxxxxxxxxxxx.supabase.co
     ```
   - **anon public** key (iz "Project API keys" sekcije):
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...
     ```

⚠️ **PAZI**: Koristi **anon** key, NE **service_role** key!

---

## Česte Greške

### ❌ Greška 1: "Cannot read properties of undefined"
**Uzrok**: Environment varijable nisu postavljene  
**Fix**: Dodaj varijable na Netlify i trigger deploy

### ❌ Greška 2: "Invalid API key"
**Uzrok**: Pogrešno kopiran key ili koristi service_role key  
**Fix**: Kopiraj ponovo **anon public** key

### ❌ Greška 3: "RLS policy violation"
**Uzrok**: Nemaš admin pristup ili RLS nije pravilno podešen  
**Fix**: Proveri `user_roles` tabelu i RLS politike

### ❌ Greška 4: Radi lokalno, ne radi na Netlify
**Uzrok**: Environment varijable nisu postavljene na Netlify  
**Fix**: Dodaj varijable na Netlify (vidi `BRZI-FIX-NETLIFY.md`)

---

## Deployment Checklist

Pre nego što push-uješ na Git:

- [ ] `.env` fajl je u `.gitignore` (ne push-uj ga!)
- [ ] `env.example.txt` postoji (template za druge)
- [ ] `netlify.toml` postoji

Pre nego što testirate na Netlify:

- [ ] Environment varijable postavljene na Netlify
- [ ] Trigger deploy nakon dodavanja varijabli
- [ ] Sačekaj 2-3 minuta za build
- [ ] Proveri browser console za greške

---

**Ako ništa ne radi, pošalji:**
1. Screenshot Netlify env variables (zamaglji key-eve!)
2. Screenshot browser console (F12 → Console)
3. Screenshot Supabase API settings

---
Napravljeno: ${new Date().toLocaleDateString('sr-RS')}
