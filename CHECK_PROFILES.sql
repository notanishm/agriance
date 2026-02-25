-- Check what roles exist
SELECT DISTINCT role, count(*) as total FROM profiles GROUP BY role;

-- Show all profiles with roles
SELECT id, role, full_name, email FROM profiles;
