-- ═══════════════════════════════════════════════════════════
-- UPDATE VENDORS ZIP - Dodaj 11000 za Beograd
-- Pokreni ovo u Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- Update svih vendora gde grad sadrži "Beograd"
UPDATE vendor
SET 
  zip = 11000,
  updated_at = NOW()
WHERE LOWER(city) LIKE '%beograd%' OR city ILIKE '%beograd%';

-- Proveri koliko redova je ažurirano
SELECT COUNT(*) as updated_count
FROM vendor
WHERE zip = 11000 AND (LOWER(city) LIKE '%beograd%' OR city ILIKE '%beograd%');

-- Prikaži sve vendore sa Beogradom
SELECT idvendor, name, address, city, zip, country
FROM vendor
WHERE LOWER(city) LIKE '%beograd%' OR city ILIKE '%beograd%'
ORDER BY name;

-- ═══════════════════════════════════════════════════════════
-- DODATNI UPITI (Opciono)
-- ═══════════════════════════════════════════════════════════

-- Novi Sad → 21000
-- UPDATE vendor
-- SET zip = 21000, updated_at = NOW()
-- WHERE LOWER(city) LIKE '%novi sad%' OR city ILIKE '%novi sad%';

-- Niš → 18000
-- UPDATE vendor
-- SET zip = 18000, updated_at = NOW()
-- WHERE LOWER(city) LIKE '%niš%' OR LOWER(city) LIKE '%nis%';

-- Kragujevac → 34000
-- UPDATE vendor
-- SET zip = 34000, updated_at = NOW()
-- WHERE LOWER(city) LIKE '%kragujevac%';

-- Subotica → 24000
-- UPDATE vendor
-- SET zip = 24000, updated_at = NOW()
-- WHERE LOWER(city) LIKE '%subotica%';

-- Prikaži sve vendore sa ZIP i gradom
SELECT city, zip, COUNT(*) as vendor_count
FROM vendor
WHERE city IS NOT NULL AND city != ''
GROUP BY city, zip
ORDER BY vendor_count DESC, city;
