-- Fix RLS to allow viewing farmer profiles publicly (for business marketplace)
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policies on profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Allow public read of farmer profiles (for business marketplace)
DROP POLICY IF EXISTS "Public can view farmers" ON profiles;
CREATE POLICY "Public can view farmers" 
  ON profiles FOR SELECT 
  TO public
  USING (role = 'farmer');

-- Allow public read of business profiles (for farmer marketplace)
DROP POLICY IF EXISTS "Public can view businesses" ON profiles;
CREATE POLICY "Public can view businesses" 
  ON profiles FOR SELECT 
  TO public
  USING (role = 'business');

-- Allow authenticated users to insert their profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);
