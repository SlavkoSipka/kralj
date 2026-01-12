# 📊 Meding Analytics Setup - Korak po Korak

Kompletna analytics infrastruktura za tracking i optimizaciju pretrage! 🚀

---

## ✅ **ŠTA SMO IMPLEMENTIRALI:**

1. **Event Tracking** - Prati sve akcije korisnika
2. **Popularity Scoring** - Rangira proizvode po popularnosti
3. **Analytics Dashboard** - SQL queries za izveštaje
4. **Automated Updates** - Auto-update popularity scores
5. **No Results Tracking** - Prati šta korisnici traže a ne postoji

---

## 🔧 **INSTALACIJA - 5 MINUTA**

### **KORAK 1: Napravi Analytics Tabele**

1. Otvori **Supabase Dashboard** → https://supabase.com/dashboard
2. Klikni na **tvoj projekat**
3. Idi na **SQL Editor** (leva strana)
4. Klikni **"+ New query"**
5. Otvori fajl **`supabase-analytics-setup.sql`** (u root folderu projekta)
6. **Copy-paste KOMPLETAN sadržaj** u SQL Editor
7. Klikni **"Run"** (ili Ctrl+Enter)
8. Trebalo bi da vidiš: ✅ **"Analytics setup completed successfully!"**

**✅ GOTOVO!** Tabele su kreirane!

---

### **KORAK 2: Ažuriraj Algolia Index (sa popularity)**

U terminalu pokreni:

```bash
npm run sync-algolia
```

Ovo će:
- ✅ Re-sync svih 52K proizvoda
- ✅ Dodati `popularity_score` kolonu (trenutno sve 0)
- ✅ Podesiti ranking da koristi popularity

**Sačekaj 2-3 minuta** dok se završi.

---

### **KORAK 3: [OPCIONO] Setup Cron Job**

Ako želiš automatski daily update popularity scores:

1. Otvori **SQL Editor** u Supabase
2. Otvori fajl **`supabase-cron-setup.sql`**
3. **Copy-paste** u SQL Editor
4. Klikni **"Run"**

**Napomena:** `pg_cron` možda neće raditi na free tier. Ako ne radi, popularity će se update-ovati svaki put kad pokreneš `npm run sync-algolia`.

---

## 📈 **KAKO KORISTITI**

### **Automatsko Tracking (Već Radi!)** ✅

Sistem automatski prati:
- 🔍 **Svaku pretragu** korisnika
- 👁️ **Svaki view** proizvoda
- 🖱️ **Svaki click** na proizvod
- ❌ **Searches bez rezultata**

**Ništa ne trebaš da radiš - sve radi automatski!**

---

### **Gledaj Statistiku (SQL Queries)**

#### **1. Top Proizvodi**

```sql
SELECT * FROM top_products;
```

Vidiš:
- Najpopularnije proizvode
- Koliko puta pregledani/kliknuti
- Popularity score

#### **2. Top Searches**

```sql
SELECT * FROM top_searches;
```

Vidiš:
- Šta ljudi najčešće traže
- Koliko puta

#### **3. Failed Searches (VAŽNO!)**

```sql
SELECT * FROM failed_searches;
```

Vidiš:
- Šta ljudi traže a NE POSTOJI
- **Dodaj te proizvode** ili napravi **sinonime**!

#### **4. Click-Through Rate**

```sql
SELECT * FROM product_ctr LIMIT 20;
```

Vidiš:
- Koji proizvodi imaju dobar CTR
- Koji imaju loš CTR (popraviti opis/sliku)

---

## 🔄 **Kako Popularity Radi**

### **Formula:**

```
popularity_score = 
  views × 1 +
  clicks × 5 +
  autocomplete_clicks × 3 +
  purchases × 20 +
  weekly_activity × 2
```

### **Primer:**

Proizvod sa:
- 100 views
- 20 clicks
- 5 autocomplete clicks
- 2 purchases
- 50 weekly activity

= 100×1 + 20×5 + 5×3 + 2×20 + 50×2 = **355 bodova**

Proizvodi sa većim score-om **rangiraju se PRVO** u pretrazi! 🏆

---

## ⏰ **Auto-Update Popularity**

### **Opcija 1: Cron Job (ako pg_cron radi)**

Automatski se update-uje svaki dan u 2 AM.

Proveri da li radi:

```sql
SELECT * FROM cron.job;
```

### **Opcija 2: Ručno Update (kad god hoćeš)**

```sql
SELECT update_popularity_scores();
```

Pokreni ovaj query kad god hoćeš da ažuriraš popularity scores.

### **Opcija 3: Sync Script**

```bash
npm run sync-algolia
```

Ovo će takođe ažurirati popularity scores u Algoliji.

---

## 📊 **Dashboard Vizualizacije**

### **Besplatni Tools:**

1. **Supabase Studio** (Built-in):
   - SQL Editor → Pokreni analytics queries
   - Vidi rezultate u tabeli

2. **Algolia Dashboard**:
   - Idi na https://www.algolia.com/dashboard
   - **Analytics** tab → Vidi search analytics
   - **A/B Testing** → Testiraj ranking strategije

3. **Grafana/Metabase (Advanced)**:
   - Poveži sa Supabase
   - Kreiraj custom dashboards
   - Vizualizuj trendings

---

## 🎯 **Kako Optimizovati Na Osnovu Podataka**

### **1. Searches bez rezultata:**

```sql
SELECT * FROM failed_searches;
```

**Akcija:** Dodaj te proizvode ili kreiraj **synonyms** u Algoliji.

**Primer:** Ako ljudi traže "špric" ali ti imaš "syringe", dodaj synonym:

U Algolia Dashboard → Index Settings → Synonyms:
```
špric => syringe
игла => needle
```

### **2. Proizvodi sa niskim CTR:**

```sql
SELECT * FROM product_ctr WHERE ctr_percentage < 5 LIMIT 20;
```

**Akcija:** 
- Popraviti naziv proizvoda (biti više deskriptivan)
- Dodati slike
- Popraviti opis

### **3. Trending proizvodi:**

```sql
-- Query 10 iz analytics-queries.sql
```

**Akcija:**
- Stavi ih u "Featured" sekciju
- Ponudi promocije
- Osiguraji dostupnost

---

## 🔥 **Advanced: Personalizacija**

### **Kako dodati:**

1. Čuvaj user preferences u localStorage/cookies
2. Track koje proizvođače korisnik najčešće gleda
3. Boost te proizvođače u search rezultatima:

```typescript
// U Algolia query:
{
  optionalFilters: [
    `manufacturer_name:${preferredManufacturer}<score=10>`,
    `vendor_name:${preferredVendor}<score=5>`
  ]
}
```

---

## 📊 **Monitoring Dashboard (BONUS)**

Možeš napraviti Admin Panel u aplikaciji:

```tsx
// src/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Učitaj statistiku
    Promise.all([
      supabase.from('top_products').select('*').limit(10),
      supabase.from('top_searches').select('*').limit(10),
      supabase.from('failed_searches').select('*').limit(10),
    ]).then(([products, searches, failed]) => {
      setStats({ products, searches, failed });
    });
  }, []);

  // Prikaži nice dashboard sa grafovima
  return (
    <div className="admin-dashboard">
      <h1>Analytics Dashboard</h1>
      {/* ... prikaži stats ... */}
    </div>
  );
}
```

---

## 🎓 **Best Practices**

1. **Proveri analytics svake nedelje** - optimizuj na osnovu podataka
2. **Dodaj sinonime** za failed searches
3. **Update proizvode** sa niskim CTR
4. **Featured section** za trending proizvode
5. **A/B test** različite ranking strategije

---

## 📞 **Troubleshooting**

### **Problem: Popularity score ostaje 0**

```sql
-- Proveri da li ima tracking podataka
SELECT COUNT(*) FROM product_analytics;

-- Ručno ažuriraj scores
SELECT update_popularity_scores();

-- Re-sync Algolia
```

### **Problem: Tracking ne radi**

- Proveri browser console za greške
- Proveri Supabase Logs
- Proveri da li su tabele kreirane

---

## ✅ **Checklist**

- [ ] ✅ Pokrenut `supabase-analytics-setup.sql`
- [ ] ✅ Pokrenut `npm run sync-algolia`
- [ ] ✅ Testirana pretraga (otvori sajt i pretraži)
- [ ] ✅ Proveri `product_analytics` tabelu (vidi da li se loguje)
- [ ] [OPCIONO] Setup cron job
- [ ] [OPCIONO] Napravi admin dashboard

---

**Sve je spremno! Samo prati korake i biće savršeno!** 🎉

