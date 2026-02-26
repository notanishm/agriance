// Mock data for when network fails
const MOCK_FARMERS = [
  { id: '1', full_name: 'Ramesh Kumar', phone_number: '9876543210', location: 'Madhya Pradesh', kyc_status: 'verified', role: 'farmer' },
  { id: '2', full_name: 'Suresh Patel', phone_number: '9876543211', location: 'Gujarat', kyc_status: 'verified', role: 'farmer' },
  { id: '3', full_name: 'Vikram Singh', phone_number: '9876543212', location: 'Maharashtra', kyc_status: 'pending', role: 'farmer' },
  { id: '4', full_name: 'Raj Kumar', phone_number: '9876543213', location: 'Punjab', kyc_status: 'verified', role: 'farmer' },
  { id: '5', full_name: 'Amit Sharma', phone_number: '9876543214', location: 'Haryana', kyc_status: 'verified', role: 'farmer' },
];

const MOCK_BUSINESSES = [
  { id: '1', full_name: 'AgriCorp Foods', company_name: 'AgriCorp Foods', phone_number: '9876543210', location: 'Mumbai', kyc_status: 'verified', role: 'business' },
  { id: '2', full_name: 'Fresh Farms Ltd', company_name: 'Fresh Farms Ltd', phone_number: '9876543211', location: 'Delhi', kyc_status: 'verified', role: 'business' },
];

// Cache service for offline-first data loading
const CACHE_PREFIX = 'agriance_cache_';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

const cacheService = {
  set(key, data) {
    const cacheData = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
  },

  get(key) {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;
    try {
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
      if (isExpired) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  },

  remove(key) {
    localStorage.removeItem(CACHE_PREFIX + key);
  },

  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  },
};

import { supabase } from '../lib/supabase';

const handleError = (error, context) => {
  console.error(`${context}:`, error);
  return null;
};

export const fetchService = {
  async getFarmers(limit = 20, useCache = true) {
    const cacheKey = `farmers_${limit}`;
    
    if (useCache) {
      const cached = cacheService.get(cacheKey);
      if (cached) {
        console.log('Loading farmers from cache');
        return cached;
      }
    }
    
    console.log('Fetching farmers from database...');
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone_number, location, kyc_status, role')
        .eq('role', 'farmer')
        .limit(limit);
      
      if (error) {
        console.log('Database error, using mock data');
        return MOCK_FARMERS.slice(0, limit);
      }
      
      const result = data || [];
      cacheService.set(cacheKey, result);
      console.log('Farmers cached');
      return result;
    } catch (err) {
      console.log('Network error, using mock data');
      return MOCK_FARMERS.slice(0, limit);
    }
  },

  async getBusinesses(limit = 20, useCache = true) {
    const cacheKey = `businesses_${limit}`;
    
    if (useCache) {
      const cached = cacheService.get(cacheKey);
      if (cached) return cached;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone_number, location, kyc_status, role, company_name, business_name')
        .eq('role', 'business')
        .limit(limit);
      
      if (error) return MOCK_BUSINESSES.slice(0, limit);
      
      const result = data || [];
      cacheService.set(cacheKey, result);
      return result;
    } catch (err) {
      return MOCK_BUSINESSES.slice(0, limit);
    }
  },

  async getMyProfile(userId, useCache = true) {
    if (!userId) return null;
    const cacheKey = `profile_${userId}`;
    
    if (useCache) {
      const cached = cacheService.get(cacheKey);
      if (cached) return cached;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) return null;
      
      cacheService.set(cacheKey, data);
      return data;
    } catch (err) {
      return null;
    }
  },

  async getContracts(userId, role = 'business', useCache = true) {
    if (!userId) return [];
    const cacheKey = `contracts_${userId}_${role}`;
    
    if (useCache) {
      const cached = cacheService.get(cacheKey);
      if (cached) return cached;
    }
    
    try {
      const column = role === 'business' ? 'business_id' : 'farmer_id';
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq(column, userId)
        .order('created_at', { ascending: false });
      
      if (error) return handleError(error, 'getContracts');
      const result = data || [];
      cacheService.set(cacheKey, result);
      return result;
    } catch (err) {
      return handleError(err, 'getContracts');
    }
  },

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
  },

  async refreshFarmers(limit = 20) {
    return this.getFarmers(limit, false);
  },

  clearCache() {
    cacheService.clear();
  },
};

export default fetchService;
