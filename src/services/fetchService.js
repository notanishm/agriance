// Database service for fetching data with proper RLS handling
import { supabase } from '../lib/supabase';

const handleError = (error, context) => {
    console.error(`${context}:`, error);
    return null;
};

export const fetchService = {
    // Fetch farmers for business dashboard/marketplace
    async getFarmers(limit = 20) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, phone_number, location, kyc_status, role')
                .eq('role', 'farmer')
                .limit(limit);
            
            if (error) return handleError(error, 'getFarmers');
            return data || [];
        } catch (err) {
            return handleError(err, 'getFarmers');
        }
    },

    // Fetch businesses for farmer dashboard
    async getBusinesses(limit = 20) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, phone_number, location, kyc_status, role, company_name, business_name')
                .eq('role', 'business')
                .limit(limit);
            
            if (error) return handleError(error, 'getBusinesses');
            return data || [];
        } catch (err) {
            return handleError(err, 'getBusinesses');
        }
    },

    // Fetch user's own profile
    async getMyProfile(userId) {
        if (!userId) return null;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (error) return handleError(error, 'getMyProfile');
            return data;
        } catch (err) {
            return handleError(err, 'getMyProfile');
        }
    },

    // Fetch contracts for a user
    async getContracts(userId, role = 'business') {
        if (!userId) return [];
        try {
            const column = role === 'business' ? 'business_id' : 'farmer_id';
            const { data, error } = await supabase
                .from('contracts')
                .select('*')
                .eq(column, userId)
                .order('created_at', { ascending: false });
            
            if (error) return handleError(error, 'getContracts');
            return data || [];
        } catch (err) {
            return handleError(err, 'getContracts');
        }
    },

    // Fetch loans for a user
    async getLoans(userId) {
        if (!userId) return [];
        try {
            const { data, error } = await supabase
                .from('loan_applications')
                .select('*')
                .eq('applicant_id', userId)
                .order('created_at', { ascending: false });
            
            if (error) return handleError(error, 'getLoans');
            return data || [];
        } catch (err) {
            return handleError(err, 'getLoans');
        }
    },

    // Fetch all pending loans (for banks)
    async getAllPendingLoans() {
        try {
            const { data, error } = await supabase
                .from('loan_applications')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });
            
            if (error) return handleError(error, 'getAllPendingLoans');
            return data || [];
        } catch (err) {
            return handleError(err, 'getAllPendingLoans');
        }
    },

    // Search farmers
    async searchFarmers(searchTerm) {
        try {
            let query = supabase
                .from('profiles')
                .select('id, full_name, phone_number, location, kyc_status')
                .eq('role', 'farmer');
            
            if (searchTerm) {
                query = query.or(`full_name.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`);
            }
            
            const { data, error } = await query.limit(20);
            if (error) return handleError(error, 'searchFarmers');
            return data || [];
        } catch (err) {
            return handleError(err, 'searchFarmers');
        }
    }
};

export default fetchService;
