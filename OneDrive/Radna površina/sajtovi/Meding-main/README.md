# Meding - Pretraga Medicinskih Proizvoda

Moderna web aplikacija za pretragu medicinskih proizvoda sa preko 52,000 artikala iz Supabase baze, napravljena sa React, TypeScript i Algolia search engine.

![Meding Search Interface](https://img.shields.io/badge/React-19.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Algolia](https://img.shields.io/badge/Algolia-5.46-purple) ![Supabase](https://img.shields.io/badge/Supabase-2.87-green)

## 🚀 Funkcionalnosti

### Frontend (Korisnici)
- ⚡ **Bljeskavik brza pretraga** - Algolia search engine (< 2ms)
- 🔍 **Napredno pretraživanje** - Ime, SKU, ALIMS naziv, proizvođač, generički naziv
- 🎯 **Napredno filtriranje:**
  - Dostupnost (na stanju / nema na stanju)
  - Proizvođač (pretraga proizvođača)
  - Kategorija (pretraga kategorija)
  - Dobavljač (pretraga dobavljača)
  - Klasa (I, IIa, IIb, III, A, Is, Ir, Ostala IVD)
  - Tip proizvoda
  - Raspon cena (od-do)
- 📄 **Paginacija** - 20/40/60 proizvoda po stranici
- 📱 **Responsive dizajn** - Radi na svim uređajima
- 🔄 **Real-time sync** - Sinhronizacija Supabase → Algolia

### Admin Panel
- 🏢 **Vendor Management** - Upravljanje vendorima/dobavljačima
- 🏭 **Manufacturer Management** - Upravljanje proizvođačima
- 💊 **Generic Management** - Upravljanje generičkim nazivima
- 📦 **Product Management** - Upravljanje proizvodima i cenama
- 🔀 **Product Variants** - Varijante proizvoda (veličine, boje, itd.)
- 📊 **Excel Import** ✨ **NEW!** - Bulk import proizvoda iz Excel fajlova

## 📦 Tehnologije

### Frontend
- **React 19.2** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool
- **React InstantSearch 7.21** - Algolia UI komponente

### Backend & Search
- **Supabase 2.87** - PostgreSQL baza podataka
- **Algolia 5.46** - Search engine
- **Node.js** - Runtime za sync script

## 🗄️ Struktura Baze Podataka

```sql
-- Glavne tabele:
products (52,000+ artikala)
  - idproducts (PK)
  - name, sku, alimsname
  - idmanufacturer (FK → manufacturer)
  - idvendor (FK → vendor)
  - idgeneric (FK → generic)
  - category_id (FK → categories)
  - price, quantity, instock
  - published, class, type
  
manufacturer - Proizvođači
vendor - Dobavljači
generic - Generički nazivi
categories - Kategorije proizvoda
```

## 🛠️ Instalacija

### 1. Kloniraj repozitorijum

```bash
git clone https://github.com/tvoj-repo/meding.git
cd meding
```

### 2. Instaliraj dependencies

```bash
npm install
```

### 3. Konfiguriši environment varijable

Kreiraj `.env` fajl u root folderu (koristi `env.example.txt` kao template):

```bash
# Supabase Configuration (OBAVEZNO!)
VITE_SUPABASE_URL=https://tvoj-project.supabase.co
VITE_SUPABASE_ANON_KEY=tvoj_anon_key_ovde

# Algolia Configuration (opciono)
VITE_ALGOLIA_APP_ID=1AREX1PYWX
VITE_ALGOLIA_SEARCH_KEY=10115486e2d5961392ad1ee03383cc60
```

📖 **Vidi `KAKO-PROVERITI-ENV.md` za detaljno uputstvo!**

### 4. Konfiguriši Algolia sync script

Otvori `scripts/sync-algolia.mjs` i ažuriraj:

```javascript
const SUPABASE_URL = 'https://tvoj-project.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'tvoj_service_role_key';
```

### 5. Kreiraj Algolia Index

1. Idi na [Algolia Dashboard](https://www.algolia.com/)
2. Klikni na **Search** → **Create Index**
3. Ime: **`products`**
4. Klikni **Create**

### 6. Sinhronizuj podatke

```bash
npm run sync-algolia
```

Ovo će:
- ✅ Preuzeti sve proizvode iz Supabase
- ✅ Transformisati ih za Algolia
- ✅ Upload-ovati ih u Algolia index
- ✅ Konfigurisati search settings

### 7. Pokreni aplikaciju

```bash
npm run dev
```

Otvori browser: `http://localhost:5173/`

## 📁 Struktura Projekta

```
meding/
├── src/
│   ├── components/
│   │   ├── ProductSearch.tsx      # Glavna search komponenta
│   │   └── ProductSearch.css      # Stilovi
│   ├── lib/
│   │   ├── algolia.ts             # Algolia konfiguracija
│   │   └── supabase.ts            # Supabase konfiguracija
│   ├── App.tsx                    # Main app komponenta
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global stilovi
├── scripts/
│   └── sync-algolia.mjs           # Script za sinhronizaciju
├── .env.local                     # Environment varijable (ne commit-uj!)
├── package.json
└── README.md
```

## 🔧 Algolia Konfiguracija

### Searchable Attributes (po prioritetu)

1. `name` - Naziv proizvoda
2. `alimsname` - ALIMS naziv
3. `sku` - SKU broj
4. `generic_name` - Generički naziv
5. `manufacturer_name` - Proizvođač
6. `description` - Opis
7. `category_name` - Kategorija
8. `vendor_name` - Dobavljač

### Facet Attributes (filteri)

- `manufacturer_name` (searchable)
- `vendor_name` (searchable)
- `category_name` (searchable)
- `instock` (boolean)
- `published` (boolean)
- `class` (string)
- `type` (string)
- `category_id` (filterOnly)

### Custom Ranking

1. `desc(published)` - Prioritet objavljenim proizvodima
2. `desc(instock)` - Prioritet proizvodima na stanju
3. `desc(quantity)` - Prioritet po količini
4. `asc(price)` - Prioritet jeftinijim proizvodima

## 📊 Algolia Index Struktura

```typescript
{
  objectID: string,          // idproducts
  sku: string,
  name: string,
  description: string,
  price: number,
  published: boolean,
  instock: boolean,
  quantity: number,
  class: string,            // I, IIa, IIb, III, A, Is, Ir, Ostala IVD
  alimsname: string,        // ALIMS naziv
  type: string,
  category_id: number,
  manufacturer_name: string, // Denormalizovano iz manufacturer tabele
  vendor_name: string,      // Denormalizovano iz vendor tabele
  generic_name: string,     // Denormalizovano iz generic tabele
  category_name: string,    // Denormalizovano iz categories tabele
  image: string,
  slug: string
}
```

## 🔄 Sinhronizacija Podataka

### Inicijalna Sinhronizacija

```bash
npm run sync-algolia
```

### Automatska Sinhronizacija (Buduća Implementacija)

**Opcije:**

1. **Supabase Database Webhooks** - Real-time update na INSERT/UPDATE/DELETE
2. **Supabase Edge Functions** - Serverless funkcije za sinhronizaciju
3. **Cron Job** - Periodična sinhronizacija (npr. svakih 1h)

**Primer Supabase Webhook:**

```sql
-- Kreiraj funkciju koja poziva webhook
CREATE OR REPLACE FUNCTION notify_algolia()
RETURNS trigger AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://tvoja-domena.com/api/sync-algolia',
    body := json_build_object(
      'action', TG_OP,
      'id', NEW.idproducts
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Kreiraj trigger
CREATE TRIGGER products_algolia_sync
AFTER INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION notify_algolia();
```

## 🎨 Customizacija

### Promena broja rezultata po stranici

U `src/components/ProductSearch.tsx`:

```typescript
<Configure
  hitsPerPage={20}  // Promeni na 40, 60, itd.
/>
```

### Dodavanje novih filtera

```typescript
<div className="filter-section">
  <h3>Novi Filter</h3>
  <RefinementList
    attribute="novo_polje"
    searchable
    showMore
    limit={5}
  />
</div>
```

### Promena prioriteta searchable atributa

U `scripts/sync-algolia.mjs`:

```javascript
searchableAttributes: [
  'novo_polje',  // Dodaj na vrh za najviši prioritet
  'name',
  'alimsname',
  // ...
]
```

## 📈 Performanse

- **Search latencija:** < 2ms
- **Učitavanje stranice:** < 500ms
- **Kapacitet:** 52,000+ proizvoda
- **Algolia Free Tier:** 10,000 searches/mesec

## 🐛 Debugging

### Console poruke

```bash
# Proveri Algolia konekciju
console.log(searchClient);

# Proveri Supabase konekciju
const { data, error } = await supabase.from('products').select('count');
console.log(data, error);
```

### Česte greške

**Greška: "No results found"**
- Proveri da li je `published` filter postavljen
- Proveri da li su podaci sinhronizovani u Algolia

**Greška: "Invalid API key"**
- Proveri `.env.local` fajl
- Proveri da li koristiš **Search-Only API Key** (ne Admin!)

**Greška: "CORS error"**
- Algolia automatski dozvoljava sve domene za search-only key

## 📊 Excel Import (Admin Feature)

Nova funkcionalnost za bulk import proizvoda iz Excel fajlova!

### Karakteristike:
- ✅ Upload `.xlsx` i `.xls` fajlova
- ✅ Automatsko poređenje sa postojećim proizvodima
- ✅ Prikaz samo NOVIH proizvoda (prevencija duplikata)
- ✅ Automatsko mapiranje proizvođača, generičkih naziva i kategorija
- ✅ Batch dodavanje više proizvoda odjednom
- ✅ Download Excel template-a

### Dokumentacija:
- 📖 **EXCEL-IMPORT-UPUTSTVO.md** - Detaljna uputstva za korišćenje
- 📄 **EXCEL-IMPORT-SUMMARY.md** - Tehnički summary

### Kako koristiti:
1. Uloguj se kao admin
2. Idi na **Admin Panel** → **Excel Import**
3. Izaberi vendora
4. Upload Excel fajl sa proizvodima
5. Uporedi sa bazom
6. Izaberi proizvode i dodaj ih!

**Vidi:** `EXCEL-IMPORT-UPUTSTVO.md` za detaljne instrukcije.

---

## 🚀 Deployment na Netlify

### Problem: Radi lokalno, ali ne na Netlify?

**Rešenje:** Verovatno nisi postavio environment varijable na Netlify!

📖 **Detaljno uputstvo: `BRZI-FIX-NETLIFY.md`**

### Brzo Rešenje:

1. Otvori [Netlify Dashboard](https://app.netlify.com) → Tvoj sajt
2. **Site configuration** → **Environment variables**
3. Dodaj:
   - `VITE_SUPABASE_URL` = tvoj Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = tvoj Supabase anon key
4. **Deploys** → **Trigger deploy**
5. Sačekaj 2-3 minuta

**Dodatni resursi:**
- 📄 `NETLIFY-SETUP.md` - Kompletan Netlify setup
- 📄 `KAKO-PROVERITI-ENV.md` - Kako proveriti environment varijable
- 📄 `BRZI-FIX-NETLIFY.md` - Brzi fix za deployment probleme

---

## 📄 Licenca

MIT License - Slobodno za upotrebu u komercijalnim projektima.

## 🤝 Doprinos

Pull requests su dobrodošli! Za velike promene, molimo prvo otvori issue.

## 📞 Kontakt

Za pitanja i podršku:
- Email: tvoj@email.com
- GitHub Issues: [github.com/tvoj-repo/meding/issues](https://github.com)

---

**Napravljeno sa ❤️ za medicinsku industriju u Srbiji**
