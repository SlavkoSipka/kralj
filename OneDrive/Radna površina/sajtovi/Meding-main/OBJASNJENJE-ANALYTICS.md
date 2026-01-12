# 📊 ANALYTICS - ŠTA SVE RADI I KAKO?

## 🎯 **ŠTA IMAŠ I ZAŠTO?**

### **1. `product_analytics` TABELA** ⭐ **GLAVNA!**
**Šta radi:** Čuva SVE događaje korisnika (svaki klik, view, search)

**Primeri:**
```
| id | product_id | event_type | query     | created_at          |
|----|------------|------------|-----------|---------------------|
| 1  | 1234       | view       | aspirin   | 2025-12-11 10:30:00 |
| 2  | 1234       | click      | aspirin   | 2025-12-11 10:29:55 |
| 3  | NULL       | search     | aspirin   | 2025-12-11 10:29:50 |
| 4  | 5678       | purchase   | NULL      | 2025-12-11 11:00:00 |
```

**Zašto ti treba:** Da znaš šta korisnici traže, klikću, kupuju!

---

### **2. `no_results_searches` TABELA** ⚠️
**Šta radi:** Čuva pretrage koje nisu vratile rezultate

**Primer:**
```
| id | query              | created_at          |
|----|--------------------|---------------------|
| 1  | brufen 500mg       | 2025-12-11 10:30:00 |
| 2  | aspirinnnnn        | 2025-12-11 11:00:00 |
```

**Zašto ti treba:** Da dodaš proizvode koje korisnici traže ali nemaš!

---

### **3. `product_popularity` VIEW** 📈 (AUTOMATSKI)
**Šta radi:** Automatski RAČUNA koliko je koji proizvod popularan

**Primer:**
```
| product_id | views | clicks | purchases | popularity_score |
|------------|-------|--------|-----------|------------------|
| 1234       | 50    | 10     | 2         | 50*1 + 10*5 + 2*20 = 140 |
| 5678       | 100   | 20     | 5         | 100*1 + 20*5 + 5*20 = 300 |
```

**Zašto ti treba:** Da rangiraš proizvode po popularnosti u search rezultatima!

---

### **4. VIEWS za Analytics Dashboard** 📊 (Opciono - za admina)

#### `top_products` - Top 20 proizvoda
```sql
SELECT * FROM top_products;
```
Vidiš: Koji proizvodi su najpopularniji

#### `top_searches` - Šta ljudi najviše traže
```sql
SELECT * FROM top_searches;
```
Vidiš: Top 50 search upita

#### `failed_searches` - Pretrage bez rezultata
```sql
SELECT * FROM failed_searches;
```
Vidiš: Šta ljudi traže a nema

#### `product_ctr` - Click-Through Rate
```sql
SELECT * FROM product_ctr;
```
Vidiš: Koji proizvodi imaju dobar CTR (koliko % ljudi klikne kad ga vidi)

---

## 🔄 **KAKO SVE RADI ZAJEDNO?**

### **SCENARIO: Korisnik traži "aspirin"**

1. **Korisnik kuca "aspirin"** → `SimpleSearch.tsx`
   - Event: `product_analytics` → `event_type='search'`, `query='aspirin'`

2. **Prikazuju se rezultati** → `ResultsPage.tsx`
   - Proizvod #1234 je na poziciji 1
   - Proizvod #5678 je na poziciji 2

3. **Korisnik klikne na proizvod #1234**
   - Event: `product_analytics` → `event_type='click'`, `product_id=1234`, `query='aspirin'`

4. **Otvara se product page** → `ProductPage.tsx`
   - Event: `product_analytics` → `event_type='view'`, `product_id=1234`

5. **Sutra ujutru u 2:00** (Cron job)
   - Funkcija `update_popularity_scores()` se automatski pokreće
   - Ažurira `products.popularity_score` za SVE proizvode
   - Proizvod #1234 dobija +1 view, +5 click = +6 bodova

6. **Trigger šalje update u Algolia**
   - Algolia ažurira `popularity_score` za proizvod #1234
   - Sledeći put kad neko traži "aspirin", proizvod #1234 će biti VIŠI u rezultatima!

---

## 🎯 **ŠTA TI JE STVARNO POTREBNO?**

### ✅ **OBAVEZNO (mora da radi):**
1. `product_analytics` - Tracking svih događaja
2. `product_popularity` - Kalkulacija score-a
3. `products.popularity_score` - Kolona u products tabeli
4. Cron job - Svakodnevni update score-a
5. Algolia trigger - Automatska sinhronizacija

### 🟡 **OPCIONO (za Analytics Dashboard - KASNIJE!):**
1. `no_results_searches` - Da vidiš šta fali
2. `top_products` view - Top proizvodi
3. `top_searches` view - Top pretrage
4. `failed_searches` view - Failed pretrage
5. `product_ctr` view - CTR analitika

---

## ⚙️ **DA LI SI POKRENUO SETUP?**

Da bi sve ovo radilo, moraš da:

### **1. Pokreneš SQL u Supabase:**
- Otvori Supabase Dashboard
- SQL Editor
- Copy-paste `supabase-analytics-setup.sql`
- Run

### **2. Pokreneš Cron job (kasnije):**
- Copy-paste `supabase-cron-setup.sql`
- Run

### **3. Re-sync Algolia:**
```bash
npm run sync-algolia
```

---

## 🧪 **KAKO DA TESTIRAŠ?**

### **TEST 1: Da li se eventi loguju?**
1. Otvori sajt
2. Pretraži nešto
3. Klikni na proizvod
4. Idi u Supabase → Table Editor → `product_analytics`
5. **Trebalo bi da vidiš novi red!**

### **TEST 2: Da li VIEW radi?**
U Supabase SQL Editor:
```sql
SELECT * FROM product_popularity ORDER BY popularity_score DESC LIMIT 10;
```
**Trebalo bi da vidiš proizvode sa score-om!**

### **TEST 3: Da li se score update-uje?**
U Supabase SQL Editor:
```sql
SELECT update_popularity_scores();
```
Onda proveri:
```sql
SELECT idproducts, name, popularity_score FROM products ORDER BY popularity_score DESC LIMIT 10;
```
**Trebalo bi da vidiš nove score-ove!**

---

## 🚀 **ŠTA DALJE?**

1. **Prvo:** Proveri da li si pokrenuo SQL setup
2. **Drugo:** Testiraj da li se eventi loguju
3. **Treće:** Ručno pokreni `update_popularity_scores()` da vidiš promene
4. **Kasnije:** Cron job će raditi automatski svaki dan

**VIEW-ove za dashboard ne moraš da koristiš odmah - oni su tu za budućnost!**

---

## 💡 **PITANJA?**

- "Zašto score ne raste odmah?" → Jer cron job update-uje jednom dnevno
- "Mogu li da forsiram update?" → Da! `SELECT update_popularity_scores();`
- "Šta ako ne želim sve ovo?" → Minimalno ti trebaju tabele 1-3, ostalo opciono
- "Kako vidim analitiku?" → VIEW-ovi u SQL Editoru, kasnije možeš napraviti admin panel

---

**JEL SAD JASNIJE?** 😊

