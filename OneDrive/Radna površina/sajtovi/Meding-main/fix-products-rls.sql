-- FIX RLS for products table
-- Enable RLS and create policies for admin users

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON products;

-- Create policies
-- Read: All users (public access for published products, admins see all)
CREATE POLICY "Enable read access for all users" 
ON products FOR SELECT 
USING (
  published = true 
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
ON products FOR INSERT 
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
ON products FOR UPDATE 
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
ON products FOR DELETE 
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
WHERE tablename = 'products';

-- Test data
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as published_products FROM products WHERE published = true;
SELECT * FROM products ORDER BY name LIMIT 10;
