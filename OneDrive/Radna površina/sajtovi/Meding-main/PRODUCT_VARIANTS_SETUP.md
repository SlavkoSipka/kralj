# 🎯 PRODUCT VARIANTS SYSTEM - Kompletan Setup

## ✅ ŠTA JE URAĐENO:

### 1. **SQL Skripta (`create-product-variants.sql`)**
- ✅ Kreirana `product_variants` tabela
- ✅ Dodati indexi za performance
- ✅ RLS policies za sigurnost
- ✅ Update `order_detail` - dodata `variant_id` kolona
- ✅ Obrisana `idparent_product` kolona iz `products`
- ✅ View za brz pregled varijanti

### 2. **Frontend Komponente**
- ✅ `ProductManagement.tsx` - Dodata "Varijante" kolona sa linkovima
- ✅ `ProductVariantsManagement.tsx` - Nova stranica za CRUD varijanti
- ✅ `ProductVariantsManagement.css` - Stilovi
- ✅ `App.tsx` - Dodat route za `/admin/products/:productId/variants`

---

## 📋 KORACI ZA AKTIVACIJU:

### **KORAK 1: Pokreni SQL Skriptu**

1. Idi na **Supabase Dashboard**: https://app.supabase.com
2. Odaberi **SQL Editor**
3. Otvori fajl: `create-product-variants.sql`
4. **Copy-paste** ceo sadržaj u SQL Editor
5. Klikni **RUN** (ili Ctrl+Enter)
6. Proveri da nema grešaka

**Očekivani output:**
```
✅ CREATE TABLE
✅ CREATE INDEX (4x)
✅ ALTER TABLE (3x)
✅ CREATE POLICY (4x)
```

---

### **KORAK 2: Proveri da li je sve OK**

Pokreni u SQL Editor-u:

```sql
-- 1. Proveri da li postoji tabela
SELECT * FROM product_variants LIMIT 1;

-- 2. Proveri da li je idparent_product obrisan
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name = 'idparent_product';
-- (Trebalo bi da vrati 0 redova)

-- 3. Proveri policies
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'product_variants';
-- (Trebalo bi da vrati 4 policy-ja)
```

---

### **KORAK 3: Testiraj Frontend**

1. **Pokreni dev server** (ako već nije pokrenut):
   ```bash
   npm run dev
   ```

2. **Otvori browser**: http://localhost:5173

3. **Testiraj flow**:
   - Uloguj se u Admin Panel
   - Idi na **Proizvode**
   - **Vidi novu kolonu "Varijante"** (trebalo bi da piše "Nema" za sve)
   - **Klikni "➕ Add"** na nekom proizvodu
   - Otvara se **nova stranica** sa variants management-om
   - **Klikni "Dodaj Novu Varijantu"**
   - Popuni formu (npr. naziv: "2mm", tip: "size", cena: 150, količina: 50)
   - Klikni **"Sačuvaj Varijantu"**
   - **Proveri** da li se varijanta pojavljuje u tabeli
   - Vrati se na **Products** stranicu
   - **Proveri** da li piše "1 varijanta" umesto "Nema"

---

## 🎨 KAKO IZGLEDA U ADMIN PANELU:

### **Products Management stranica:**

```
┌────┬──────────────┬──────────┬────────┬──────────────┬──────────────┐
│ ID │ Naziv        │ SKU      │ Cena   │ Varijante    │ Akcije       │
├────┼──────────────┼──────────┼────────┼──────────────┼──────────────┤
│ 1  │ Igla 21G     │ IGO-21G  │ 150    │ 3 varijante  │ Edit Delete  │
│    │              │          │        │ 👁️ Variants   │              │
├────┼──────────────┼──────────┼────────┼──────────────┼──────────────┤
│ 2  │ Aspirin      │ ASP-500  │ 200    │ Nema         │ Edit Delete  │
│    │              │          │        │ ➕ Add       │              │
└────┴──────────────┴──────────┴────────┴──────────────┴──────────────┘
```

**Klik na "👁️ Variants" ili "➕ Add"** → Redirect na `/admin/products/1/variants`

---

### **Variants Management stranica:**

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Nazad na Proizvode                                          │
├─────────────────────────────────────────────────────────────────┤
│  Varijante proizvoda                                           │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Igla 21G                                              │   │
│  │  SKU: IGO-21G  |  Cena: 150.00 RSD  |  Zalihe: 100   │   │
│  └────────────────────────────────────────────────────────┘   │
│  Ukupno varijanti: 3                                           │
│                                                                 │
│  [➕ Dodaj Novu Varijantu]                                     │
├─────────────────────────────────────────────────────────────────┤
│  Pretraga: [____________]  Sort: [Naziv ▼]  [↑ Rastuće]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───┬──────┬──────┬─────────────┬──────┬────────┬────────────┐│
│  │ID │Naziv │Tip   │SKU          │Cena  │Količina│Akcije      ││
│  ├───┼──────┼──────┼─────────────┼──────┼────────┼────────────┤│
│  │ 1 │ 2mm  │size  │IGO-21G-2MM  │150   │   50   │✏️ 👁️ 🗑️   ││
│  │ 2 │ 3mm  │size  │IGO-21G-3MM  │160   │   30   │✏️ 👁️ 🗑️   ││
│  │ 3 │ 5mm  │size  │IGO-21G-5MM  │170   │   20   │✏️ 👁️ 🗑️   ││
│  └───┴──────┴──────┴─────────────┴──────┴────────┴────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔥 FUNKCIONALNOSTI:

### **Admin Panel:**

1. ✅ **Dodavanje varijanti** - Modal sa svim poljima
2. ✅ **Editovanje varijanti** - Sva polja editabilna
3. ✅ **Brisanje varijanti** - Sa confirmation dialog-om
4. ✅ **Toggle Active/Inactive** - Aktiviraj/deaktiviraj varijantu
5. ✅ **Search** - Po nazivu, SKU, tipu
6. ✅ **Sort** - Po ID, nazivu, ceni
7. ✅ **Pagination** - Server-side (50/100/200 per page)
8. ✅ **Empty state** - Lepa poruka kad nema varijanti

### **Polja u formi:**

- **Naziv varijante** - "2mm", "Plava", itd.
- **Tip varijante** - Size, Color, Length, Weight, Volume, Other
- **SKU** - Opciono, unikatni SKU
- **Cena** - Opciono (ako prazno, koristi parent cenu)
- **Količina** - Zasebne zalihe
- **Sort Order** - Redosled u dropdown-u na sajtu
- **Na stanju** - Checkbox
- **Aktivna** - Checkbox (vidljiva na sajtu)

---

## 🌐 SLEDEĆI KORAK: Frontend (ProductPage)

**Još NIJE implementirano** (to je sledeći zadatak):

### **ProductPage.tsx - Prikaz varijanti korisnicima**

Treba dodati:
1. Učitavanje varijanti za proizvod
2. Dropdown za selekciju varijante
3. Disable "Dodaj u korpu" dok nije selektovana varijanta
4. Update cene kada se selektuje varijanta

**Primer koda:**

```typescript
// ProductPage.tsx
const [variants, setVariants] = useState([]);
const [selectedVariant, setSelectedVariant] = useState(null);
const [hasVariants, setHasVariants] = useState(false);

useEffect(() => {
  async function loadVariants() {
    const { data } = await supabase
      .from('product_variants')
      .select('*')
      .eq('id_product', productId)
      .eq('active', true)
      .eq('instock', true)
      .order('sort_order', { ascending: true });
    
    setVariants(data || []);
    setHasVariants(data && data.length > 0);
  }
  loadVariants();
}, [productId]);

// U JSX-u:
{hasVariants && (
  <div className="variant-selector">
    <label>Izaberi varijantu:</label>
    <select 
      value={selectedVariant?.id_variant || ''} 
      onChange={(e) => {
        const variant = variants.find(v => v.id_variant === parseInt(e.target.value));
        setSelectedVariant(variant);
      }}
    >
      <option value="">-- Izaberi --</option>
      {variants.map(v => (
        <option key={v.id_variant} value={v.id_variant}>
          {v.variant_name} - {v.price || product.price} RSD
        </option>
      ))}
    </select>
  </div>
)}

<button 
  onClick={handleAddToCart} 
  disabled={hasVariants && !selectedVariant}
>
  Dodaj u korpu
</button>
```

---

## 📊 DATABASE DIJAGRAM:

```
┌─────────────────────────┐
│      products           │
│─────────────────────────│
│ idproducts (PK)        │◄───┐
│ name                    │    │
│ sku                     │    │
│ price                   │    │
│ quantity                │    │
│ ...                     │    │
└─────────────────────────┘    │
                               │
                               │ (1:N)
                               │
┌─────────────────────────┐    │
│  product_variants       │    │
│─────────────────────────│    │
│ id_variant (PK)        │    │
│ id_product (FK)        │────┘
│ variant_name            │
│ variant_type            │
│ sku                     │
│ price (nullable)        │
│ quantity                │
│ instock                 │
│ sort_order              │
│ active                  │
└─────────────────────────┘
```

---

## 🧪 TESTIRANJE:

### **Test Case 1: Dodaj varijantu**
1. Otvori proizvod (npr. ID 1)
2. Klikni "➕ Add" u Varijante koloni
3. Dodaj varijantu "2mm" sa cenom 150 RSD
4. Proveri da li se pojavljuje u tabeli
5. Vrati se na Products page
6. Proveri da li piše "1 varijanta"

### **Test Case 2: Edit varijantu**
1. Otvori variants stranicu
2. Klikni Edit na varijanti
3. Promeni cenu na 160 RSD
4. Sačuvaj
5. Proveri da li je promenjena

### **Test Case 3: Toggle Active**
1. Klikni "👁️" dugme (eye icon)
2. Potvrdi deaktivaciju
3. Red postaje proziran
4. Status badge: "Neaktivna"

### **Test Case 4: Delete varijantu**
1. Klikni "🗑️" dugme
2. Potvrdi brisanje
3. Varijanta nestaje iz tabele
4. Vrati se na Products page - count se smanjuje

---

## 🚀 DEPLOY NA NETLIFY:

Nakon što sve testiraš i bude OK:

```bash
git add .
git commit -m "Feature: Product Variants Management System

- Kreirana product_variants tabela
- Admin panel: dodavanje/editovanje/brisanje varijanti
- Server-side pagination za variants
- Link iz Products stranice na Variants management
- Full CRUD funkcionalnost za variants"

git push origin master
```

Netlify će automatski deploy-ovati nove izmene! 🎉

---

## 📝 NAPOMENE:

- **Parent proizvod** se prikazuje na vrhu Variants stranice
- **Cena varijante** je opciona - ako je NULL, koristi se parent cena
- **SKU varijante** je opciono - može biti NULL
- **Sort order** kontroliše redosled u dropdown-u na sajtu (manji broj = veći prioritet)
- **Active** flag - samo aktivne varijante su vidljive korisnicima

---

## ⚠️ VAŽNO:

Ako imaš postojeće podatke u `idparent_product` koloni pre brisanja, možeš ih migrirati u `product_variants`:

```sql
-- Migracija postojećih parent-child relacija u variants
INSERT INTO product_variants (id_product, variant_name, sku, price, quantity, instock, sort_order, active)
SELECT 
  p_parent.idproducts AS id_product,
  p_child.name AS variant_name,
  p_child.sku,
  p_child.price,
  p_child.quantity,
  p_child.instock,
  0 AS sort_order,
  true AS active
FROM products p_child
JOIN products p_parent ON p_child.idparent_product = p_parent.idproducts
WHERE p_child.idparent_product IS NOT NULL;
```

**ALI** ovo pokreni **PRE** nego što obrišeš `idparent_product` kolonu!

---

## ✅ GOTOVO!

Sada imaš kompletan Variants Management sistem! 🎉
