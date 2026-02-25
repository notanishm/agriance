-- ============================================
-- COMPLETE DATABASE FIX
-- Run this to create all missing tables and fix RLS
-- ============================================

-- Drop existing policies for profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile 2" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable read for users own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for users own profile" ON profiles;
DROP POLICY IF EXISTS "Enable public read for marketplace" ON profiles;

-- Create contracts table if not exists
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES profiles(id) NOT NULL,
  farmer_id UUID REFERENCES profiles(id),
  contract_number TEXT UNIQUE NOT NULL,
  crop_name TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT DEFAULT 'Quintals',
  price DECIMAL NOT NULL,
  total_value DECIMAL NOT NULL,
  delivery_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  contract_content TEXT,
  selected_clauses TEXT[],
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS for contracts
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Drop existing contracts policies
DROP POLICY IF EXISTS "Farmers can view their contracts" ON contracts;
DROP POLICY IF EXISTS "Businesses can view their contracts" ON contracts;
DROP POLICY IF EXISTS "Businesses can create contracts" ON contracts;
DROP POLICY IF EXISTS "Users can view own contracts" ON contracts;
DROP POLICY IF EXISTS "Users can insert contracts" ON contracts;
DROP POLICY IF EXISTS "Public can view contracts" ON contracts;

-- Contracts policies
CREATE POLICY "Users can view own contracts" ON contracts FOR SELECT TO authenticated USING (business_id = auth.uid() OR farmer_id = auth.uid());
CREATE POLICY "Users can insert contracts" ON contracts FOR INSERT TO authenticated WITH CHECK (business_id = auth.uid() OR farmer_id = auth.uid());
CREATE POLICY "Public can view pending contracts" ON contracts FOR SELECT TO public USING (status = 'pending');

-- Create loan_applications table if not exists
CREATE TABLE IF NOT EXISTS loan_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID REFERENCES profiles(id),
  application_number TEXT UNIQUE NOT NULL,
  loan_amount DECIMAL NOT NULL,
  tenure_months INTEGER NOT NULL,
  purpose TEXT,
  bank_name TEXT,
  contract_id UUID REFERENCES contracts(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  risk_score INTEGER,
  applicant_type TEXT DEFAULT 'farmer',
  reviewed_by UUID REFERENCES profiles(id),
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS for loans
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing loan policies
DROP POLICY IF EXISTS "Users can view their own loan applications" ON loan_applications;
DROP POLICY IF EXISTS "Users can create loan applications" ON loan_applications;
DROP POLICY IF EXISTS "Banks can view all loan applications" ON loan_applications;
DROP POLICY IF EXISTS "Users can view own loans" ON loan_applications;
DROP POLICY IF EXISTS "Users can insert loans" ON loan_applications;

-- Loan policies
CREATE POLICY "Users can view own loans" ON loan_applications FOR SELECT TO authenticated USING (applicant_id = auth.uid());
CREATE POLICY "Users can insert loans" ON loan_applications FOR INSERT TO authenticated WITH CHECK (applicant_id = auth.uid());
CREATE POLICY "Public can view pending loans" ON loan_applications FOR SELECT TO public USING (status = 'pending');

-- Create kyc_documents table if not exists
CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  document_type TEXT NOT NULL CHECK (document_type IN ('aadhaar', 'pan', 'gst', 'license')),
  document_number TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS for KYC
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own KYC documents" ON kyc_documents;
DROP POLICY IF EXISTS "Users can upload own KYC documents" ON kyc_documents;
DROP POLICY IF EXISTS "Users can view own kyc" ON kyc_documents;
DROP POLICY IF EXISTS "Users can insert kyc" ON kyc_documents;

CREATE POLICY "Users can view own kyc" ON kyc_documents FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert kyc" ON kyc_documents FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Verify tables created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
