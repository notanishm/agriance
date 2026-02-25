-- Fix RLS for profiles table to allow businesses to view farmers

-- Enable RLS on profiles if not already
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Public can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Businesses can view farmers" ON profiles;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON profiles 
FOR SELECT TO authenticated 
USING (id = auth.uid());

-- Allow businesses to view farmer profiles
CREATE POLICY "Businesses can view farmers" ON profiles 
FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles p2 
        WHERE p2.id = auth.uid() 
        AND p2.role = 'business'
    )
    AND role = 'farmer'
);

-- Allow public read for testing (optional - remove in production)
CREATE POLICY "Public can view profiles" ON profiles 
FOR SELECT TO public 
USING (true);
