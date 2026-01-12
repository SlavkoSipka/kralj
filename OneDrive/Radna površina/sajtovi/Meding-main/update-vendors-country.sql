-- ═══════════════════════════════════════════════════════════
-- UPDATE VENDORS - Dodaj "Srbija" za sve prazne country
-- Pokreni ovo u Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- Update svih vendora gde je country NULL ili prazan string
UPDATE vendor
SET 
  country = 'Srbija',
  updated_at = NOW()
WHERE country IS NULL OR country = '' OR TRIM(country) = '';

-- Proveri koliko redova je ažurirano
SELECT COUNT(*) as updated_count
FROM vendor
WHERE country = 'Srbija';

-- Prikaži sve vendore sa country
SELECT idvendor, name, city, country
FROM vendor
ORDER BY name;
