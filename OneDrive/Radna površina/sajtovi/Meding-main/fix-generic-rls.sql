-- FIX RLS for generic table
-- Enable RLS and create policies for admin users

-- Enable RLS
ALTER TABLE generic ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON generic;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON generic;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON generic;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON generic;

-- Create policies
-- Read: All authenticated users
CREATE POLICY "Enable read access for authenticated users" 
ON generic FOR SELECT 
TO authenticated 
USING (true);

-- Insert: Admin only
CREATE POLICY "Enable insert for admin users" 
ON generic FOR INSERT 
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
ON generic FOR UPDATE 
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
ON generic FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.auth_id = auth.uid() 
    AND user_roles.role = 'admin' 
    AND user_roles.active = true
  )
);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'generic';

-- Test data
SELECT COUNT(*) as total_generics FROM generic;
SELECT * FROM generic ORDER BY name LIMIT 10;
