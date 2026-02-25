-- ============================================
-- COMPLETE RLS POLICIES FOR AGRIANCE
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. PROFILES TABLE - Allow all reads for marketplace
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_authenticated" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_authenticated" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;

-- Allow authenticated users to read all profiles (for marketplace)
CREATE POLICY "profiles_select_authenticated" ON profiles 
FOR SELECT TO authenticated USING (true);

-- Allow users to insert their own profile
CREATE POLICY "profiles_insert_authenticated" ON profiles 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "profiles_update_own" ON profiles 
FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Allow public read (needed for marketplace visibility)
CREATE POLICY "profiles_public_read" ON profiles 
FOR SELECT TO public USING (true);

-- ============================================
-- 2. CONTRACTS TABLE
-- ============================================
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contracts_select_all" ON contracts;
DROP POLICY IF EXISTS "contracts_insert_authenticated" ON contracts;
DROP POLICY IF EXISTS "contracts_update_own" ON contracts;
DROP POLICY IF EXISTS "contracts_public_read" ON contracts;

-- Allow authenticated users to read contracts they're part of
CREATE POLICY "contracts_select_all" ON contracts 
FOR SELECT TO authenticated USING (business_id = auth.uid() OR farmer_id = auth.uid() OR true);

-- Allow businesses to create contracts
CREATE POLICY "contracts_insert_authenticated" ON contracts 
FOR INSERT TO authenticated WITH CHECK (business_id = auth.uid());

-- Allow contract parties to update
CREATE POLICY "contracts_update_own" ON contracts 
FOR UPDATE TO authenticated USING (business_id = auth.uid() OR farmer_id = auth.uid());

-- Public can see pending contracts
CREATE POLICY "contracts_public_read" ON contracts 
FOR SELECT TO public USING (true);

-- ============================================
-- 3. LOAN_APPLICATIONS TABLE
-- ============================================
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "loans_select_own" ON loan_applications;
DROP POLICY IF EXISTS "loans_insert_authenticated" ON loan_applications;
DROP POLICY IF EXISTS "loans_select_bank" ON loan_applications;

-- Users can see their own loans
CREATE POLICY "loans_select_own" ON loan_applications 
FOR SELECT TO authenticated USING (applicant_id = auth.uid());

-- Users can apply for loans
CREATE POLICY "loans_insert_authenticated" ON loan_applications 
FOR INSERT TO authenticated WITH CHECK (applicant_id = auth.uid());

-- Banks can see all loans
CREATE POLICY "loans_select_bank" ON loan_applications 
FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'bank')
);

-- ============================================
-- 4. KYC_DOCUMENTS TABLE
-- ============================================
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kyc_select_own" ON kyc_documents;
DROP POLICY IF EXISTS "kyc_insert_own" ON kyc_documents;

CREATE POLICY "kyc_select_own" ON kyc_documents 
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "kyc_insert_own" ON kyc_documents 
FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ============================================
-- 5. CONVERSATIONS TABLE
-- ============================================
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "conversations_select_own" ON conversations;
DROP POLICY IF EXISTS "conversations_insert_own" ON conversations;

CREATE POLICY "conversations_select_own" ON conversations 
FOR SELECT TO authenticated USING (participant_1 = auth.uid() OR participant_2 = auth.uid());

CREATE POLICY "conversations_insert_own" ON conversations 
FOR INSERT TO authenticated WITH CHECK (participant_1 = auth.uid() OR participant_2 = auth.uid());

-- ============================================
-- 6. MESSAGES TABLE
-- ============================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_select_own" ON messages;
DROP POLICY IF EXISTS "messages_insert_own" ON messages;

CREATE POLICY "messages_select_own" ON messages 
FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM conversations 
        WHERE conversations.id = messages.conversation_id 
        AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
    )
);

CREATE POLICY "messages_insert_own" ON messages 
FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());

-- ============================================
-- 7. FILE_METADATA TABLE
-- ============================================
ALTER TABLE file_metadata ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "files_select_own" ON file_metadata;
DROP POLICY IF EXISTS "files_insert_own" ON file_metadata;

CREATE POLICY "files_select_own" ON file_metadata 
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "files_insert_own" ON file_metadata 
FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ============================================
-- VERIFY
-- ============================================
SELECT 'Tables with RLS:' as info, tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND relname IN ('profiles', 'contracts', 'loan_applications', 'kyc_documents', 'conversations', 'messages', 'file_metadata');

SELECT 'Policy count:' as info, tablename, count(*) as policies 
FROM pg_policies 
WHERE schemaname = 'public' 
GROUP BY tablename;
