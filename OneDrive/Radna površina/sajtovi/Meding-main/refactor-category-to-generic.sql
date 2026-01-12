-- ====================================================
-- REFACTOR: Categories → Generic → Products
-- ====================================================
-- Generic postaje najniža kategorija (leaf node)
-- Products su povezani sa Generic
-- Generic je povezan sa Categories (parent hijerarhija)
-- ====================================================

-- 1. Dodaj category_id u generic tabelu
ALTER TABLE public.generic
ADD COLUMN category_id integer;

-- 2. Dodaj foreign key constraint
ALTER TABLE public.generic
ADD CONSTRAINT generic_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES public.categories(idcategory);

-- 3. (OPCIONO) Migriraj postojeće podatke iz products.category_id → generic.category_id
-- Ovo ažurira generic.category_id na osnovu prvog proizvoda koji ima taj generic
UPDATE public.generic g
SET category_id = (
  SELECT p.category_id
  FROM public.products p
  WHERE p.idgeneric = g.idgeneric
  AND p.category_id IS NOT NULL
  LIMIT 1
);

-- 4. Ukloni foreign key constraint sa products
ALTER TABLE public.products
DROP CONSTRAINT IF EXISTS products_category_id_fkey;

-- 5. Ukloni category_id kolonu iz products
ALTER TABLE public.products
DROP COLUMN IF EXISTS category_id;

-- ====================================================
-- REZULTAT:
-- ====================================================
-- ✅ generic.category_id → categories.idcategory (parent hijerarhija)
-- ✅ products.idgeneric → generic.idgeneric (leaf node)
-- ✅ categories mogu imati parent_category (hijerarhija)
-- ====================================================

-- PROVERA:
SELECT 
  c.name as category_name,
  g.name as generic_name,
  p.name as product_name
FROM categories c
LEFT JOIN generic g ON g.category_id = c.idcategory
LEFT JOIN products p ON p.idgeneric = g.idgeneric
ORDER BY c.name, g.name
LIMIT 10;
