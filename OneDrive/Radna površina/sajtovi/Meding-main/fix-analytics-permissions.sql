-- ============================================
-- FIX: RLS Permissions za Analytics Tabele
-- ============================================
-- Problem: Tabele postoje ali anon users ne mogu da insert-uju
-- Rešenje: Enable public insert permisije

-- 1. OMOGUĆI RLS (Row Level Security)
ALTER TABLE product_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE no_results_searches ENABLE ROW LEVEL SECURITY;

-- 2. KREIRAJ POLICY za INSERT (dozvolji svima da insert-uju)
DROP POLICY IF EXISTS "Allow public insert on product_analytics" ON product_analytics;
CREATE POLICY "Allow public insert on product_analytics"
  ON product_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert on no_results_searches" ON no_results_searches;
CREATE POLICY "Allow public insert on no_results_searches"
  ON no_results_searches
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 3. OPCIONO: KREIRAJ POLICY za SELECT (ako želiš da admin može da čita)
DROP POLICY IF EXISTS "Allow authenticated select on product_analytics" ON product_analytics;
CREATE POLICY "Allow authenticated select on product_analytics"
  ON product_analytics
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated select on no_results_searches" ON no_results_searches;
CREATE POLICY "Allow authenticated select on no_results_searches"
  ON no_results_searches
  FOR SELECT
  TO authenticated
  USING (true);

-- PORUKA
SELECT 'Analytics permissions fixed! Sada možeš da insert-uješ događaje!' as status;

