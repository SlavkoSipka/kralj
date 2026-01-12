-- ============================================
-- PRODUCT VARIANTS SYSTEM
-- Kompletan SQL za kreiranje variants sistema
-- ============================================

-- ============================================
-- 1. Kreiraj product_variants tabelu
-- ============================================
CREATE TABLE IF NOT EXISTS product_variants (
  id_variant SERIAL PRIMARY KEY,
  id_product INTEGER NOT NULL REFERENCES products(idproducts) ON DELETE CASCADE,
  
  -- Varijanta info
  variant_name VARCHAR(255) NOT NULL,    -- "2mm", "3mm", "5mm", "Plava", itd.
  variant_type VARCHAR(100),             -- "size", "color", "length", "weight", itd.
  
  -- Inventory & Pricing (može override-ovati parent)
  sku VARCHAR(255) UNIQUE,               -- "IGO-21G-2MM"
  price NUMERIC(10,2),                   -- Ako NULL, koristi parent price
  quantity INTEGER DEFAULT 0,            -- Zasebne zalihe po varijanti
  instock BOOLEAN DEFAULT true,
  
  -- Sort order (za prikaz u dropdown-u na frontend-u)
  sort_order INTEGER DEFAULT 0,
  
  -- Active/Inactive
  active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. Kreiraj indexes za performance
-- ============================================
CREATE INDEX idx_product_variants_product ON product_variants(id_product);
CREATE INDEX idx_product_variants_active ON product_variants(active);
CREATE INDEX idx_product_variants_sku ON product_variants(sku) WHERE sku IS NOT NULL;
CREATE INDEX idx_product_variants_sort ON product_variants(id_product, sort_order);

-- ============================================
-- 3. Drop idparent_product kolonu iz products
-- ============================================
-- NAPOMENA: Ako imaš postojeće podatke u idparent_product,
-- možeš prvo da ih migruješ u product_variants!
-- Ovo će izbrisati kolonu i sve povezane podatke.

ALTER TABLE products DROP COLUMN IF EXISTS idparent_product CASCADE;
ALTER TABLE products DROP COLUMN IF EXISTS parent_product_name;

-- ============================================
-- 4. Update order_detail tabelu (za korpu)
-- ============================================
-- Dodaj variant_id kolonu da možeš čuvati koja varijanta je naručena
ALTER TABLE order_detail
ADD COLUMN IF NOT EXISTS variant_id INTEGER REFERENCES product_variants(id_variant) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_order_detail_variant ON order_detail(variant_id);

-- ============================================
-- 5. Kreiraj view za brzi pregled (opciono)
-- ============================================
CREATE OR REPLACE VIEW product_variants_with_parent AS
SELECT 
  pv.*,
  p.name AS parent_product_name,
  p.sku AS parent_sku,
  p.price AS parent_price,
  COALESCE(pv.price, p.price) AS effective_price
FROM product_variants pv
JOIN products p ON pv.id_product = p.idproducts;

-- ============================================
-- 6. Enable RLS (Row Level Security)
-- ============================================
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON product_variants;
DROP POLICY IF EXISTS "Enable insert for admin users" ON product_variants;
DROP POLICY IF EXISTS "Enable update for admin users" ON product_variants;
DROP POLICY IF EXISTS "Enable delete for admin users" ON product_variants;

-- Read: All users (public access for active variants)
CREATE POLICY "Enable read access for all users" 
ON product_variants FOR SELECT 
USING (
  active = true 
  OR 
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.auth_id = auth.uid() 
    AND user_roles.role = 'admin' 
    AND user_roles.active = true
  )
);

-- Insert: Admin only
CREATE POLICY "Enable insert for admin users" 
ON product_variants FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.auth_id = auth.uid() 
    AND user_roles.role = 'admin' 
    AND user_roles.active = true
  )
);

-- Update: Admin only
CREATE POLICY "Enable update for admin users" 
ON product_variants FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.auth_id = auth.uid() 
    AND user_roles.role = 'admin' 
    AND user_roles.active = true
  )
);

-- Delete: Admin only
CREATE POLICY "Enable delete for admin users" 
ON product_variants FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.auth_id = auth.uid() 
    AND user_roles.role = 'admin' 
    AND user_roles.active = true
  )
);

-- ============================================
-- 7. Test queries
-- ============================================

-- Proveri da li je tabela kreirana
SELECT * FROM product_variants LIMIT 1;

-- Proveri policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'product_variants';

-- Proveri da li je idparent_product obrisan
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name IN ('idparent_product', 'parent_product_name');

-- ============================================
-- 8. Primer unosa (opciono - za testiranje)
-- ============================================
-- Dodaj nekoliko test varijanti za proizvod ID 1
/*
INSERT INTO product_variants (id_product, variant_name, variant_type, sku, price, quantity, sort_order, active)
VALUES 
  (1, '2mm', 'size', 'TEST-2MM', 150.00, 50, 1, true),
  (1, '3mm', 'size', 'TEST-3MM', 160.00, 30, 2, true),
  (1, '5mm', 'size', 'TEST-5MM', 170.00, 20, 3, true);

-- Proveri unos
SELECT * FROM product_variants WHERE id_product = 1;
*/

-- ============================================
-- GOTOVO!
-- ============================================
-- Sledeći koraci:
-- 1. Pokreni ovaj SQL u Supabase SQL Editor
-- 2. Proveri da je sve OK
-- 3. Update frontend (ProductManagement, novi ProductVariantsManagement)
