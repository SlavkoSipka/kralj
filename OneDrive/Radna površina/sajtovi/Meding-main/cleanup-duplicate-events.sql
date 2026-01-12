-- ============================================
-- CLEANUP: Obriši duplicate analytics evente
-- ============================================
-- Ova skripta će obrisati sve duplicate evente
-- i ostaviti samo najnoviji event za svaki product_id + event_type + query kombinaciju

-- 1. PREGLEDAJ DUPLICATE EVENTE (opciono - za informaciju)
-- Okomentiraj ovo ako ne želiš da vidiš duplicate-e
SELECT 
  product_id, 
  event_type, 
  query, 
  COUNT(*) as count,
  MIN(created_at) as first_event,
  MAX(created_at) as last_event
FROM product_analytics
WHERE product_id IS NOT NULL
GROUP BY product_id, event_type, query
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 2. OBRIŠI DUPLICATE EVENTE (zadrži samo najnoviji)
-- Ovo će obrisati sve osim najnovijeg eventa za svaku kombinaciju
DELETE FROM product_analytics
WHERE id NOT IN (
  SELECT MAX(id)
  FROM product_analytics
  GROUP BY product_id, event_type, query, DATE_TRUNC('minute', created_at)
);

-- 3. PORUKA
SELECT 'Duplicate events cleaned up! Sada svaki event treba da bude jedinstven.' as status;

