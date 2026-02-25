-- ============================================
-- AGRIANCE COMPLETE DATABASE SETUP
-- Run ALL of this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone_number TEXT,
  role TEXT CHECK (role IN ('farmer', 'business', 'bank')),
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  land_size DECIMAL,
  location TEXT,
  gps_coordinates TEXT,
  crops_history TEXT[],
  company_name TEXT,
  gst_number TEXT,
  business_type TEXT,
  business_name TEXT,
  bank_name TEXT,
  bank_account TEXT,
  ifsc_code TEXT,
  rbi_license_number TEXT,
  branch_details JSONB,
  trust_score INTEGER DEFAULT 50,
  onboarding_completed BOOLEAN DEFAULT false,
  crop_history TEXT[],
  registration_number TEXT,
  date_of_birth DATE,
  gender TEXT,
  father_name TEXT,
  village TEXT,
  district TEXT,
  state TEXT,
  pincode TEXT,
  rating DECIMAL DEFAULT 0,
  aadhaar_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 2. CONTRACTS TABLE
-- ============================================
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
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled', 'accepted')),
  contract_content TEXT,
  selected_clauses TEXT[],
  progress INTEGER DEFAULT 0,
  crop_category TEXT,
  crop_variety TEXT,
  quality_standards TEXT,
  payment_terms TEXT,
  delivery_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 3. LOAN_APPLICATIONS TABLE
-- ============================================
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
  risk_category TEXT,
  collateral_type TEXT,
  collateral_value DECIMAL,
  approved_interest_rate DECIMAL,
  reviewed_by UUID REFERENCES profiles(id),
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 4. KYC_DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  document_type TEXT NOT NULL CHECK (document_type IN ('aadhaar', 'pan', 'gst', 'license')),
  document_number TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  document_name TEXT,
  front_image_url TEXT,
  back_image_url TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 5. CONVERSATIONS TABLE (for chat)
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 UUID REFERENCES profiles(id) NOT NULL,
  participant_2 UUID REFERENCES profiles(id) NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 6. MESSAGES TABLE (for chat)
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 7. FILE_METADATA TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS file_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  encryption_iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  salt TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 8. ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_metadata ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 9. RLS POLICIES
-- ============================================

-- PROFILES POLICIES
DROP POLICY IF EXISTS "profiles_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_marketplace" ON profiles;

CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_select_marketplace" ON profiles FOR SELECT TO anon, authenticated USING (true);

-- CONTRACTS POLICIES
DROP POLICY IF EXISTS "contracts_select" ON contracts;
DROP POLICY IF EXISTS "contracts_insert" ON contracts;
DROP POLICY IF EXISTS "contracts_update" ON contracts;

CREATE POLICY "contracts_select" ON contracts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "contracts_insert" ON contracts FOR INSERT TO authenticated WITH CHECK (auth.uid() = business_id OR auth.uid() = farmer_id);
CREATE POLICY "contracts_update" ON contracts FOR UPDATE TO authenticated USING (auth.uid() = business_id OR auth.uid() = farmer_id);

-- LOAN_APPLICATIONS POLICIES
DROP POLICY IF EXISTS "loans_select" ON loan_applications;
DROP POLICY IF EXISTS "loans_insert" ON loan_applications;
DROP POLICY IF EXISTS "loans_select_all" ON loan_applications;

CREATE POLICY "loans_select" ON loan_applications FOR SELECT TO authenticated USING (applicant_id = auth.uid());
CREATE POLICY "loans_insert" ON loan_applications FOR INSERT TO authenticated WITH CHECK (applicant_id = auth.uid());
CREATE POLICY "loans_select_all" ON loan_applications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'bank')
);

-- KYC_POLICIES
DROP POLICY IF EXISTS "kyc_select" ON kyc_documents;
DROP POLICY IF EXISTS "kyc_insert" ON kyc_documents;

CREATE POLICY "kyc_select" ON kyc_documents FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "kyc_insert" ON kyc_documents FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- CONVERSATIONS POLICIES
DROP POLICY IF EXISTS "conversations_select" ON conversations;
DROP POLICY IF EXISTS "conversations_insert" ON conversations;

CREATE POLICY "conversations_select" ON conversations FOR SELECT TO authenticated USING (participant_1 = auth.uid() OR participant_2 = auth.uid());
CREATE POLICY "conversations_insert" ON conversations FOR INSERT TO authenticated WITH CHECK (participant_1 = auth.uid() OR participant_2 = auth.uid());

-- MESSAGES POLICIES
DROP POLICY IF EXISTS "messages_select" ON messages;
DROP POLICY IF EXISTS "messages_insert" ON messages;

CREATE POLICY "messages_select" ON messages FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
  )
);
CREATE POLICY "messages_insert" ON messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());

-- FILE_METADATA POLICIES
DROP POLICY IF EXISTS "files_select" ON file_metadata;
DROP POLICY IF EXISTS "files_insert" ON file_metadata;

CREATE POLICY "files_select" ON file_metadata FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "files_insert" ON file_metadata FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ============================================
-- 10. STORAGE SETUP
-- ============================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "documents_insert" ON storage.objects;
DROP POLICY IF EXISTS "documents_select" ON storage.objects;

CREATE POLICY "documents_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
CREATE POLICY "documents_select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'documents');

-- ============================================
-- 11. UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_contracts_updated_at ON contracts;
DROP TRIGGER IF EXISTS update_loan_applications_updated_at ON loan_applications;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loan_applications_updated_at BEFORE UPDATE ON loan_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 12. VERIFY SETUP
-- ============================================
SELECT 'Tables created:' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name NOT LIKE 'pg_%';

SELECT 'RLS enabled:' as status;
SELECT relname, relrowsecurity FROM pg_class WHERE relkind = 'r' AND relname IN ('profiles', 'contracts', 'loan_applications', 'kyc_documents', 'conversations', 'messages', 'file_metadata');

SELECT 'Policies count:' as status;
SELECT tablename, count(*) as policies FROM pg_policies WHERE schemaname = 'public' GROUP BY tablename;

-- ============================================
-- DONE!
-- ============================================
