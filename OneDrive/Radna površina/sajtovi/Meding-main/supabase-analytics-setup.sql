-- ============================================
-- MEDING ANALYTICS SETUP - ISPRAVLJENO
-- Kompletna analytics infrastruktura
-- SAMO DODAJE nove tabele i popularity_score kolonu
-- NIŠTA NE BRIŠE iz postojeće baze!
-- ============================================

-- 1. ANALYTICS TABELA - Glavni tracking
-- ============================================
CREATE TABLE IF NOT EXISTS product_analytics (
  id BIGSERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(idproducts) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'search', 'view', 'click', 'purchase', 'autocomplete_click'
  query VARCHAR(255), -- Šta je korisnik tražio
  user_id UUID, -- Za personalizaciju (opciono)
  metadata JSONB, -- Dodatni podaci (position, price, itd)
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexi za brže upite
CREATE INDEX IF NOT EXISTS idx_product_analytics_product ON product_analytics(product_id);
CREATE INDEX IF NOT EXISTS idx_product_analytics_event ON product_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_product_analytics_created ON product_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_product_analytics_query ON product_analytics(query);

-- 2. NO RESULTS SEARCHES - Searches sa 0 rezultata
-- ============================================
CREATE TABLE IF NOT EXISTS no_results_searches (
  id BIGSERIAL PRIMARY KEY,
  query VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_no_results_query ON no_results_searches(query);
CREATE INDEX IF NOT EXISTS idx_no_results_created ON no_results_searches(created_at);

-- 3. POPULARITY VIEW - Automatski kalkulisan score
-- ============================================
CREATE OR REPLACE VIEW product_popularity AS
SELECT 
  product_id,
  COUNT(*) FILTER (WHERE event_type = 'view') as views,
  COUNT(*) FILTER (WHERE event_type = 'click') as clicks,
  COUNT(*) FILTER (WHERE event_type = 'autocomplete_click') as autocomplete_clicks,
  COUNT(*) FILTER (WHERE event_type = 'purchase') as purchases,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as recent_activity,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as weekly_activity,
  -- Popularity score (weighted formula)
  (
    COUNT(*) FILTER (WHERE event_type = 'view') * 1 +
    COUNT(*) FILTER (WHERE event_type = 'click') * 5 +
    COUNT(*) FILTER (WHERE event_type = 'autocomplete_click') * 3 +
    COUNT(*) FILTER (WHERE event_type = 'purchase') * 20 +
    -- Bonus za recent activity
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') * 2
  ) as popularity_score
FROM product_analytics
WHERE product_id IS NOT NULL
GROUP BY product_id;

-- 4. DODAJ POPULARITY_SCORE KOLONU u PRODUCTS (jedina izmena postojeće tabele!)
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'popularity_score'
  ) THEN
    ALTER TABLE products ADD COLUMN popularity_score INTEGER DEFAULT 0;
    RAISE NOTICE 'Dodata kolona popularity_score u products tabelu';
  ELSE
    RAISE NOTICE 'Kolona popularity_score već postoji';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_popularity ON products(popularity_score DESC);

-- 5. FUNKCIJA ZA AŽURIRANJE POPULARITY SCORE
-- ============================================
CREATE OR REPLACE FUNCTION update_popularity_scores()
RETURNS void AS $$
BEGIN
  -- Update popularity_score za sve proizvode koji imaju analytics
  UPDATE products p
  SET popularity_score = pp.popularity_score
  FROM product_popularity pp
  WHERE p.idproducts = pp.product_id;
  
  RAISE NOTICE 'Popularity scores updated successfully';
END;
$$ LANGUAGE plpgsql;

-- 6. AŽURIRAJ ALGOLIA TRIGGER da uključi popularity_score
-- ============================================
CREATE OR REPLACE FUNCTION sync_product_to_algolia()
RETURNS trigger AS $$
DECLARE
  algolia_url TEXT;
  algolia_app_id TEXT := '1AREX1PYWX';
  algolia_admin_key TEXT := 'b227880cead50f9836981470ddcae831';
  product_json JSONB;
  manufacturer_name TEXT;
  vendor_name TEXT;
  generic_alimsname TEXT;
  category_name TEXT;
BEGIN
  -- Uzmi denormalizovane podatke sa JOIN-ovima
  SELECT m.manufacturer INTO manufacturer_name 
  FROM manufacturer m 
  WHERE m.idmanufacturer = NEW.idmanufacturer;
  
  SELECT v.name INTO vendor_name 
  FROM vendor v 
  WHERE v.idvendor = NEW.idvendor;
  
  SELECT g.alimsname INTO generic_alimsname 
  FROM generic g 
  WHERE g.idgeneric = NEW.idgeneric;
  
  SELECT c.name INTO category_name 
  FROM categories c 
  WHERE c.idcategory = NEW.category_id;
  
  algolia_url := 'https://' || algolia_app_id || '-dsn.algolia.net/1/indexes/products/' || NEW.idproducts::TEXT;
  
  -- Pripremi JSON sa SVIM podacima uključujući popularity_score
  SELECT jsonb_build_object(
    'objectID', NEW.idproducts::TEXT,
    'sku', COALESCE(NEW.sku, ''),
    'name', COALESCE(NEW.name, ''),
    'description', COALESCE(NEW.description, ''),
    'price', COALESCE(NEW.price, 0),
    'published', COALESCE(NEW.published, false),
    'instock', COALESCE(NEW.instock, false),
    'quantity', COALESCE(NEW.quantity, 0),
    'class', COALESCE(NEW.class, ''),
    'alimsname', COALESCE(NEW.alimsname, ''),
    'type', COALESCE(NEW.type, ''),
    'category_id', NEW.category_id,
    'image', COALESCE(NEW.image, ''),
    'slug', COALESCE(NEW.slug, ''),
    'manufacturer_name', COALESCE(manufacturer_name, ''),
    'vendor_name', COALESCE(vendor_name, ''),
    'generic_name', COALESCE(generic_alimsname, ''),
    'category_name', COALESCE(category_name, ''),
    'popularity_score', COALESCE(NEW.popularity_score, 0)
  ) INTO product_json;
  
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    PERFORM extensions.http((
      'PUT',
      algolia_url,
      ARRAY[
        extensions.http_header('X-Algolia-API-Key', algolia_admin_key),
        extensions.http_header('X-Algolia-Application-Id', algolia_app_id),
        extensions.http_header('Content-Type', 'application/json')
      ],
      'application/json',
      product_json::TEXT
    )::extensions.http_request);
  END IF;
  
  IF (TG_OP = 'DELETE') THEN
    algolia_url := 'https://' || algolia_app_id || '-dsn.algolia.net/1/indexes/products/' || OLD.idproducts::TEXT;
    PERFORM extensions.http((
      'DELETE',
      algolia_url,
      ARRAY[
        extensions.http_header('X-Algolia-API-Key', algolia_admin_key),
        extensions.http_header('X-Algolia-Application-Id', algolia_app_id)
      ],
      NULL,
      NULL
    )::extensions.http_request);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kreiraj trigger za INSERT i UPDATE (ako već ne postoji)
DROP TRIGGER IF EXISTS products_sync_algolia_insert_update ON products;
CREATE TRIGGER products_sync_algolia_insert_update
AFTER INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION sync_product_to_algolia();

-- Kreiraj trigger za DELETE
DROP TRIGGER IF EXISTS products_sync_algolia_delete ON products;
CREATE TRIGGER products_sync_algolia_delete
AFTER DELETE ON products
FOR EACH ROW
EXECUTE FUNCTION sync_product_to_algolia();

-- 7. DASHBOARD VIEWS - SA JOIN-ovima (ne pretpostavljaju postojanje kolona!)
-- ============================================

-- View 1: Top Products (SA JOIN-om da uzme manufacturer.manufacturer)
CREATE OR REPLACE VIEW top_products AS
SELECT 
  p.idproducts,
  p.name,
  m.manufacturer as manufacturer_name,
  v.name as vendor_name,
  pp.views,
  pp.clicks,
  pp.purchases,
  pp.popularity_score,
  pp.weekly_activity
FROM product_popularity pp
JOIN products p ON p.idproducts = pp.product_id
LEFT JOIN manufacturer m ON m.idmanufacturer = p.idmanufacturer
LEFT JOIN vendor v ON v.idvendor = p.idvendor
ORDER BY pp.popularity_score DESC
LIMIT 20;

-- View 2: Top Searches
CREATE OR REPLACE VIEW top_searches AS
SELECT 
  query,
  COUNT(*) as search_count,
  COUNT(DISTINCT DATE(created_at)) as days_searched
FROM product_analytics
WHERE event_type = 'search' 
  AND created_at > NOW() - INTERVAL '30 days'
  AND query IS NOT NULL
  AND LENGTH(query) > 2
GROUP BY query
ORDER BY search_count DESC
LIMIT 50;

-- View 3: Failed Searches
CREATE OR REPLACE VIEW failed_searches AS
SELECT 
  query,
  COUNT(*) as count,
  MAX(created_at) as last_searched
FROM no_results_searches
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY query
ORDER BY count DESC
LIMIT 30;

-- View 4: Product CTR (SA JOIN-om)
CREATE OR REPLACE VIEW product_ctr AS
SELECT 
  p.idproducts,
  p.name,
  m.manufacturer as manufacturer_name,
  COUNT(*) FILTER (WHERE pa.event_type = 'view') as views,
  COUNT(*) FILTER (WHERE pa.event_type = 'click') as clicks,
  ROUND(
    COUNT(*) FILTER (WHERE pa.event_type = 'click')::NUMERIC / 
    NULLIF(COUNT(*) FILTER (WHERE pa.event_type = 'view'), 0) * 100,
    2
  ) as ctr_percentage
FROM product_analytics pa
JOIN products p ON p.idproducts = pa.product_id
LEFT JOIN manufacturer m ON m.idmanufacturer = p.idmanufacturer
WHERE pa.created_at > NOW() - INTERVAL '30 days'
  AND pa.product_id IS NOT NULL
GROUP BY p.idproducts, p.name, m.manufacturer
HAVING COUNT(*) FILTER (WHERE pa.event_type = 'view') > 5
ORDER BY ctr_percentage DESC;

-- ============================================
-- GOTOVO! Analytics setup kompletiran.
-- ============================================

SELECT 'Analytics setup completed successfully!' as status;
