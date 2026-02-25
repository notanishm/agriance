-- ============================================
-- SIMPLE FIX: Make profiles fully readable
-- Run this in Supabase SQL Editor
-- ============================================

-- Disable RLS on profiles (simplest fix for marketplace)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Verify data exists
SELECT 'Current profiles count:' as info, count(*) FROM profiles;

-- Check if any farmers exist
SELECT 'Farmer count:' as info, count(*) FROM profiles WHERE role = 'farmer';

-- List all profiles
SELECT id, email, role, full_name FROM profiles LIMIT 10;
