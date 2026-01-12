-- ============================================
-- ANALYTICS DASHBOARD QUERIES
-- Koristi ove upite da vidiš statistiku
-- ============================================

-- 📊 1. TOP 20 NAJPOPULARNIJIH PROIZVODA
-- ============================================
SELECT * FROM top_products;

-- ili detaljnije:
SELECT 
  p.idproducts,
  p.name,
  p.manufacturer_name,
  p.vendor_name,
  pp.views,
  pp.clicks,
  pp.autocomplete_clicks,
  pp.purchases,
  pp.popularity_score,
  pp.weekly_activity
FROM product_popularity pp
JOIN products p ON p.idproducts = pp.product_id
ORDER BY pp.popularity_score DESC
LIMIT 20;


-- 🔍 2. TOP SEARCHES (Poslednih 30 dana)
-- ============================================
SELECT * FROM top_searches;

-- ili:
SELECT 
  query,
  COUNT(*) as search_count,
  COUNT(DISTINCT DATE(created_at)) as days_searched,
  MAX(created_at) as last_searched
FROM product_analytics
WHERE event_type = 'search' 
  AND created_at > NOW() - INTERVAL '30 days'
  AND query IS NOT NULL
GROUP BY query
ORDER BY search_count DESC
LIMIT 50;


-- ❌ 3. FAILED SEARCHES (Poslednje nedelje - VAŽNO!)
-- ============================================
SELECT * FROM failed_searches;

-- Ovo ti pokazuje šta ljudi traže a ne postoji!
-- Možeš dodati te proizvode u bazu ili kreirati sinonime


-- 📈 4. CLICK-THROUGH RATE (CTR) Po Proizvodu
-- ============================================
SELECT * FROM product_ctr LIMIT 20;

-- Proizvodi sa visokim CTR = dobro rangirани
-- Proizvodi sa niskim CTR = možda loš opis ili slika


-- 📅 5. DNEVNA STATISTIKA
-- ============================================
SELECT 
  DATE(created_at) as date,
  COUNT(*) FILTER (WHERE event_type = 'search') as searches,
  COUNT(*) FILTER (WHERE event_type = 'view') as views,
  COUNT(*) FILTER (WHERE event_type = 'click') as clicks,
  COUNT(DISTINCT product_id) as unique_products_viewed
FROM product_analytics
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;


-- 🕒 6. AKTIVNOST PO SATU (Kad su najaktivniji korisnici?)
-- ============================================
SELECT 
  EXTRACT(HOUR FROM created_at) as hour,
  COUNT(*) as events,
  COUNT(*) FILTER (WHERE event_type = 'search') as searches
FROM product_analytics
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY EXTRACT(HOUR FROM created_at)
ORDER BY hour;


-- 🏢 7. TOP PROIZVOĐAČI (Po popularnosti)
-- ============================================
SELECT 
  p.manufacturer_name,
  COUNT(DISTINCT pa.product_id) as unique_products,
  SUM(CASE WHEN pa.event_type = 'view' THEN 1 ELSE 0 END) as total_views,
  SUM(CASE WHEN pa.event_type = 'click' THEN 1 ELSE 0 END) as total_clicks
FROM product_analytics pa
JOIN products p ON p.idproducts = pa.product_id
WHERE pa.created_at > NOW() - INTERVAL '30 days'
  AND pa.product_id IS NOT NULL
  AND p.manufacturer_name IS NOT NULL
  AND p.manufacturer_name != ''
GROUP BY p.manufacturer_name
ORDER BY total_clicks DESC
LIMIT 20;


-- 🚚 8. TOP DOBAVLJAČI (Po popularnosti)
-- ============================================
SELECT 
  p.vendor_name,
  COUNT(DISTINCT pa.product_id) as unique_products,
  SUM(CASE WHEN pa.event_type = 'view' THEN 1 ELSE 0 END) as total_views,
  SUM(CASE WHEN pa.event_type = 'click' THEN 1 ELSE 0 END) as total_clicks
FROM product_analytics pa
JOIN products p ON p.idproducts = pa.product_id
WHERE pa.created_at > NOW() - INTERVAL '30 days'
  AND pa.product_id IS NOT NULL
  AND p.vendor_name IS NOT NULL
  AND p.vendor_name != ''
GROUP BY p.vendor_name
ORDER BY total_clicks DESC
LIMIT 20;


-- 📊 9. KONVERZIJA (Koliko % pretraga vodi do klika?)
-- ============================================
SELECT 
  COUNT(*) FILTER (WHERE event_type = 'search') as total_searches,
  COUNT(*) FILTER (WHERE event_type = 'click') as total_clicks,
  COUNT(*) FILTER (WHERE event_type = 'purchase') as total_purchases,
  ROUND(
    COUNT(*) FILTER (WHERE event_type = 'click')::NUMERIC / 
    NULLIF(COUNT(*) FILTER (WHERE event_type = 'search'), 0) * 100,
    2
  ) as search_to_click_rate,
  ROUND(
    COUNT(*) FILTER (WHERE event_type = 'purchase')::NUMERIC / 
    NULLIF(COUNT(*) FILTER (WHERE event_type = 'click'), 0) * 100,
    2
  ) as click_to_purchase_rate
FROM product_analytics
WHERE created_at > NOW() - INTERVAL '30 days';


-- 🔥 10. TRENDING PRODUCTS (Proizvodi koji trenutno rastu u popularnosti)
-- ============================================
WITH weekly_stats AS (
  SELECT 
    product_id,
    COUNT(*) as this_week
  FROM product_analytics
  WHERE created_at > NOW() - INTERVAL '7 days'
    AND product_id IS NOT NULL
  GROUP BY product_id
),
monthly_stats AS (
  SELECT 
    product_id,
    COUNT(*) as last_month
  FROM product_analytics
  WHERE created_at BETWEEN NOW() - INTERVAL '30 days' AND NOW() - INTERVAL '7 days'
    AND product_id IS NOT NULL
  GROUP BY product_id
)
SELECT 
  p.idproducts,
  p.name,
  p.manufacturer_name,
  ws.this_week,
  COALESCE(ms.last_month, 0) as previous_weeks,
  ws.this_week - COALESCE(ms.last_month, 0) as growth,
  ROUND(
    (ws.this_week - COALESCE(ms.last_month, 0))::NUMERIC / 
    NULLIF(ms.last_month, 1) * 100,
    2
  ) as growth_percentage
FROM weekly_stats ws
LEFT JOIN monthly_stats ms ON ms.product_id = ws.product_id
JOIN products p ON p.idproducts = ws.product_id
WHERE ws.this_week > 5 -- Minimum activity
ORDER BY growth_percentage DESC NULLS LAST
LIMIT 20;


-- ============================================
-- UTILITY QUERIES
-- ============================================

-- Obriši stare analytics podatke (starije od 1 godine)
-- DELETE FROM product_analytics WHERE created_at < NOW() - INTERVAL '1 year';

-- Ručno ažuriraj popularity scores
-- SELECT update_popularity_scores();

-- Proveri koliko ima tracking podataka
-- SELECT 
--   event_type, 
--   COUNT(*) 
-- FROM product_analytics 
-- GROUP BY event_type;

