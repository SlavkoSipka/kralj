# 🔍 Algolia Setup: Generics Index

## Pregled

Za prikaz generičkih naziva u search rezultatima, trebate kreirati novi **`generics`** index u Algolia-i.

## 📋 Korak 1: Kreiranje Generics Index-a

### 1.1 Ulogujte se na Algolia Dashboard
```
https://www.algolia.com/dashboard
```

### 1.2 Kreirajte novi Index
- Kliknite na **"Indices"** u levom meniju
- Kliknite **"Create Index"**
- Ime index-a: `generics`

## 🚀 Korak 2A: BRZI NAČIN - Admin Panel (PREPORUČENO)

### 2A.1 Setup Environment Variables
Dodaj u `.env` fajl:

```env
VITE_ALGOLIA_APP_ID=your_app_id
VITE_ALGOLIA_SEARCH_KEY=your_search_key
VITE_ALGOLIA_ADMIN_KEY=your_admin_api_key  # NOVO! Za sync
```

**Gde naći Admin Key:**
1. https://www.algolia.com/dashboard
2. Settings → API Keys
3. Kopiraj **Admin API Key**

### 2A.2 Pokreni Sync iz Admin Panel-a
1. Idi na Admin Panel → **"Algolia: Sync Generics"**
2. Klikni **"🔄 Sync Generics sa Algolia"**
3. Čekaj progress bar (može trajati 1-2 minuta)
4. Gotovo! ✅

**Prednosti:**
- ✅ Nema ručnog export/import
- ✅ Automatski broji proizvode
- ✅ Konfiguriše index settings
- ✅ Progress bar
- ✅ Error handling

---

## 📊 Korak 2B: RUČNI NAČIN - SQL Export (Alternativa)

### 2.1 Supabase SQL Query za Export - OPTIMIZOVANO
Izvucite podatke iz Supabase `generic` tabele (sa JOINovima za brzinu):

```sql
-- OPTIMIZOVANO: Koristi LEFT JOINove umesto subqueries
SELECT 
  g.idgeneric as objectID,
  g.idgeneric,
  g.name,
  g.alimsname,
  g.category_id,
  c.name as category_name,
  COALESCE(COUNT(p.idproducts), 0) as product_count
FROM generic g
LEFT JOIN categories c ON c.idcategory = g.category_id
LEFT JOIN products p ON p.idgeneric = g.idgeneric
WHERE g.name IS NOT NULL
GROUP BY g.idgeneric, g.name, g.alimsname, g.category_id, c.name
ORDER BY g.name;
```

**Ako i dalje timeout (previše podataka), podeli u batch-eve:**

```sql
-- BATCH 1: Prvi 1000 generika
SELECT 
  g.idgeneric as objectID,
  g.idgeneric,
  g.name,
  g.alimsname,
  g.category_id,
  c.name as category_name,
  COALESCE(COUNT(p.idproducts), 0) as product_count
FROM generic g
LEFT JOIN categories c ON c.idcategory = g.category_id
LEFT JOIN products p ON p.idgeneric = g.idgeneric
WHERE g.name IS NOT NULL
GROUP BY g.idgeneric, g.name, g.alimsname, g.category_id, c.name
ORDER BY g.name
LIMIT 1000 OFFSET 0;

-- BATCH 2: Sledećih 1000 (promeni OFFSET)
-- LIMIT 1000 OFFSET 1000;

-- BATCH 3: Sledećih 1000
-- LIMIT 1000 OFFSET 2000;
-- ... i tako dalje
```

### 2.2 Export u JSON
1. Pokrenite gore navedeni SQL u Supabase SQL Editor
2. Kliknite **"Export Results"** → **"JSON"**
3. Sačuvajte kao `generics.json`

### 2.3 Upload u Algolia
1. Idite na **Indices** → **generics**
2. Kliknite **"Upload record(s)"**
3. Izaberite `generics.json`
4. Kliknite **"Upload"**

## ⚙️ Korak 3: Konfiguracija Index Settings

### 3.1 Searchable Attributes
```json
{
  "searchableAttributes": [
    "name",
    "alimsname",
    "category_name"
  ]
}
```

### 3.2 Attributes for Faceting
```json
{
  "attributesForFaceting": [
    "category_name",
    "product_count"
  ]
}
```

### 3.3 Custom Ranking (Optional)
```json
{
  "customRanking": [
    "desc(product_count)"
  ]
}
```
*Ovo rangira generike sa više proizvoda iznad ostalih*

### 3.4 Replicas (Optional - za sortiranje)
```json
{
  "replicas": [
    "generics_product_count_desc",
    "generics_name_asc"
  ]
}
```

## 🔄 Korak 4: Automatsko Sinhronizovanje (Opciono)

### 4.1 Supabase Edge Function za Sync
Kreirajte Edge Function koja će sync-ovati generics sa Algolia-om:

```typescript
// supabase/functions/sync-generics-to-algolia/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import algoliasearch from 'https://esm.sh/algoliasearch@4'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const algoliaClient = algoliasearch(
    Deno.env.get('ALGOLIA_APP_ID') ?? '',
    Deno.env.get('ALGOLIA_ADMIN_KEY') ?? ''
  )

  const index = algoliaClient.initIndex('generics')

  // Fetch all generics with product count
  const { data: generics, error } = await supabaseClient
    .from('generic')
    .select(`
      idgeneric,
      name,
      alimsname,
      category_id,
      categories:category_id (name)
    `)

  if (error) throw error

  // Count products for each generic
  const genericsWithCount = await Promise.all(
    generics.map(async (generic) => {
      const { count } = await supabaseClient
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('idgeneric', generic.idgeneric)

      return {
        objectID: generic.idgeneric.toString(),
        idgeneric: generic.idgeneric,
        name: generic.name,
        alimsname: generic.alimsname,
        category_id: generic.category_id,
        category_name: (generic.categories as any)?.name || null,
        product_count: count || 0
      }
    })
  )

  // Save to Algolia
  await index.saveObjects(genericsWithCount)

  return new Response(
    JSON.stringify({ success: true, count: genericsWithCount.length }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

### 4.2 Supabase Database Trigger (Advanced)
Kreirajte trigger koji poziva Edge Function kada se generic kreira/update-uje:

```sql
-- Kreiranje funkcije za webhook
CREATE OR REPLACE FUNCTION notify_generic_change()
RETURNS trigger AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://YOUR-PROJECT.supabase.co/functions/v1/sync-generics-to-algolia',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
    body := '{}'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Kreiranje trigger-a
CREATE TRIGGER generic_changed
AFTER INSERT OR UPDATE OR DELETE ON generic
FOR EACH STATEMENT
EXECUTE FUNCTION notify_generic_change();
```

## 🎯 Korak 5: Testiranje

### 5.1 Test u Algolia Dashboard
1. Idite na **Indices** → **generics**
2. Kliknite **"Search Preview"**
3. Unesite test query (npr. "Aspirin")
4. Proverite rezultate

### 5.2 Test u Aplikaciji
1. Pokrenite dev server: `npm run dev`
2. Idite na home page
3. Počnite da kucate u search bar
4. Trebalo bi da vidite **Generic kartice** iznad proizvoda

## 📝 Struktura Algolia Record-a

```json
{
  "objectID": "123",
  "idgeneric": 123,
  "name": "Acetylsalicylic acid",
  "alimsname": "ASPIRIN",
  "category_id": 5,
  "category_name": "Analgesics",
  "product_count": 45
}
```

## 🎨 UI Rezultat

Kada korisnik pretražuje, videti će:

```
┌─────────────────────────────────────────────────┐
│ 🏷️ GENERIČKI NAZIVI                            │
├─────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐                │
│ │ 💊 Aspirin  │ │ 💊 Paracet. │                │
│ │ ASPIRIN     │ │ PARACETAMOL │                │
│ │ 45 proizvoda│ │ 120 proizvod│                │
│ └─────────────┘ └─────────────┘                │
├─────────────────────────────────────────────────┤
│ 📦 PROIZVODI                                    │
├─────────────────────────────────────────────────┤
│ 🔍 Aspirin 100mg Bayer                         │
│     Bayer • ASPIRIN                            │
├─────────────────────────────────────────────────┤
│ 🔍 Aspirin Cardio 300mg                        │
│     Bayer • ASPIRIN                            │
└─────────────────────────────────────────────────┘
```

## 🚀 Prednosti Ovog Pristupa

✅ **Brza pretraga** - Algolia je optimizovan za speed
✅ **Multi-index search** - Pretražuje generics + products paralelno
✅ **UX kao veliki sajtovi** - Amazon/eBay stil kategorija
✅ **Product count** - Prikazuje koliko proizvoda ima generic
✅ **Klikabilne kartice** - Vode ka filtered results
✅ **Highlighting** - Algolia highlighting (ako konfiguriš)
✅ **Fuzzy search** - Toleriše greške u kucanju

## 📚 Korisni Linkovi

- [Algolia Documentation](https://www.algolia.com/doc/)
- [Multi-Index Search](https://www.algolia.com/doc/guides/managing-results/refine-results/filtering/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

**Pitanja?** Proveri dokumentaciju ili kontaktiraj tim! 🎉

