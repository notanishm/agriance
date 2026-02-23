-- ============================================
-- ADD MISSING COLUMNS TO PROFILES TABLE
-- Run this in Supabase SQL Editor to fix the error
-- ============================================

-- Add bank_account column for businesses
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bank_account TEXT;

-- Add ifsc_code column for businesses
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS ifsc_code TEXT;

-- Add bank_name column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bank_name TEXT;

-- Add business_gst column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS business_gst TEXT;

-- Add registration_number column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS registration_number TEXT;

-- Add business_type column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS business_type TEXT;

-- Add business_name column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS business_name TEXT;

-- Add full_name column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Add phone_number column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Add aadhaar_number column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS aadhaar_number TEXT;

-- Add date_of_birth column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Add gender column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS gender TEXT;

-- Add father_name column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS father_name TEXT;

-- Add village, district, state, pincode
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS village TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pincode TEXT;

-- Add missing columns to contracts  
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS crop_category TEXT;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS crop_variety TEXT;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS quality_standards TEXT;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS payment_terms TEXT;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS delivery_location TEXT;

-- Add missing columns to loan_applications
ALTER TABLE loan_applications ADD COLUMN IF NOT EXISTS applicant_type TEXT;
ALTER TABLE loan_applications ADD COLUMN IF NOT EXISTS risk_category TEXT;
ALTER TABLE loan_applications ADD COLUMN IF NOT EXISTS collateral_type TEXT;
ALTER TABLE loan_applications ADD COLUMN IF NOT EXISTS collateral_value DECIMAL;
ALTER TABLE loan_applications ADD COLUMN IF NOT EXISTS approved_interest_rate DECIMAL;

-- Add missing columns to kyc_documents
ALTER TABLE kyc_documents ADD COLUMN IF NOT EXISTS document_name TEXT;
ALTER TABLE kyc_documents ADD COLUMN IF NOT EXISTS front_image_url TEXT;
ALTER TABLE kyc_documents ADD COLUMN IF NOT EXISTS back_image_url TEXT;

-- Verify columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY column_name;
