-- Fix RLS for all tables

-- Enable RLS on contracts table
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own contracts" ON contracts;
DROP POLICY IF EXISTS "Users can insert contracts" ON contracts;
DROP POLICY IF EXISTS "Public can view contracts" ON contracts;

CREATE POLICY "Users can view own contracts" ON contracts FOR SELECT TO authenticated USING (business_id = auth.uid() OR farmer_id = auth.uid());
CREATE POLICY "Users can insert contracts" ON contracts FOR INSERT TO authenticated WITH CHECK (business_id = auth.uid() OR farmer_id = auth.uid());
CREATE POLICY "Public can view contracts" ON contracts FOR SELECT TO public USING (true);

-- Enable RLS on loan_applications table
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own loans" ON loan_applications;
DROP POLICY IF EXISTS "Users can insert loans" ON loan_applications;
DROP POLICY IF EXISTS "Public can view loans" ON loan_applications;

CREATE POLICY "Users can view own loans" ON loan_applications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert loans" ON loan_applications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Public can view loans" ON loan_applications FOR SELECT TO public USING (true);

-- Enable RLS on kyc_documents table
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own kyc" ON kyc_documents;
DROP POLICY IF EXISTS "Users can insert kyc" ON kyc_documents;

CREATE POLICY "Users can view own kyc" ON kyc_documents FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert kyc" ON kyc_documents FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
