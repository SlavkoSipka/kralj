-- ============================================
-- CRON JOB SETUP - Automatski update popularity scores
-- ============================================

-- Prvo enable pg_cron ekstenziju (ako nije već)
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Schedule job: Update popularity scores svaki dan u 2 AM
SELECT cron.schedule(
  'update-popularity-daily',
  '0 2 * * *', -- Cron syntax: minute hour day month weekday (2 AM svaki dan)
  $$SELECT update_popularity_scores()$$
);

-- Opciono: Schedule job za cleanup starih podataka (jednom nedeljno)
SELECT cron.schedule(
  'cleanup-old-analytics',
  '0 3 * * 0', -- Svake nedelje u 3 AM
  $$DELETE FROM product_analytics WHERE created_at < NOW() - INTERVAL '1 year'$$
);

-- ============================================
-- USEFUL CRON MANAGEMENT QUERIES
-- ============================================

-- Vidi sve scheduled jobs
SELECT * FROM cron.job;

-- Vidi job run history
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- Obriši job (ako treba)
-- SELECT cron.unschedule('update-popularity-daily');

-- Ručno pokreni job (za testiranje)
-- SELECT update_popularity_scores();

-- ============================================
-- NAPOMENA: 
-- pg_cron može da ne radi na Supabase free tier.
-- Alternativa: koristi GitHub Actions ili Vercel Cron
-- ============================================

