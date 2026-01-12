-- ═══════════════════════════════════════════════════════════════════════════
-- FIX MANUFACTURER TABLE - Enable RLS and Create Policies
-- Pokreni ovo u Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Enable RLS (ako nije već enabled)
ALTER TABLE manufacturer ENABLE ROW LEVEL SECURITY;

-- 2. Drop postojeće politike (ako postoje)
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON manufacturer;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON manufacturer;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON manufacturer;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON manufacturer;

-- 3. Kreiraj nove politike za READ (svi authenticated)
CREATE POLICY "Enable read access for authenticated users" 
ON manufacturer 
FOR SELECT 
TO authenticated 
USING (true);

-- 4. Kreiraj politike za INSERT, UPDATE, DELETE (samo admin)
-- Provera: da li user ima admin role u user_roles tabeli
CREATE POLICY "Enable insert for admin users" 
ON manufacturer 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.auth_id = auth.uid() 
    AND user_roles.role = 'admin' 
    AND user_roles.active = true
  )
);

CREATE POLICY "Enable update for admin users" 
ON manufacturer 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.auth_id = auth.uid() 
    AND user_roles.role = 'admin' 
    AND user_roles.active = true
  )
);

CREATE POLICY "Enable delete for admin users" 
ON manufacturer 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.auth_id = auth.uid() 
    AND user_roles.role = 'admin' 
    AND user_roles.active = true
  )
);

-- 5. Proveri da li su politike kreirane
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'manufacturer';

-- ═══════════════════════════════════════════════════════════════════════════
-- ALTERNATIVA: Ako gore ne radi, koristi ovu jednostavnu politiku
-- (omogućava pristup svim authenticated users)
-- ═══════════════════════════════════════════════════════════════════════════

-- Obriši sve politike
-- DROP POLICY IF EXISTS "Enable all access for authenticated users" ON manufacturer;

-- Kreiraj jednu politiku za sve operacije
-- CREATE POLICY "Enable all access for authenticated users" 
-- ON manufacturer 
-- FOR ALL 
-- TO authenticated 
-- USING (true) 
-- WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- TEST: Proveri koliko ima proizvođača u tabeli
-- ═══════════════════════════════════════════════════════════════════════════

SELECT COUNT(*) as total_manufacturers FROM manufacturer;
SELECT * FROM manufacturer ORDER BY name LIMIT 10;

-- ═══════════════════════════════════════════════════════════════════════════
