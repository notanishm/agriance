// Fetch service - uses local data by default (no network required)
import { localDb } from './localDb';

export const fetchService = {
  // Get farmers
  async getFarmers(limit = 20) {
    const farmers = localDb.getFarmers();
    return farmers.slice(0, limit);
  },

  // Get businesses
  async getBusinesses(limit = 20) {
    const businesses = localDb.getBusinesses();
    return businesses.slice(0, limit);
  },

  // Get my profile
  async getMyProfile(userId) {
    if (!userId) return null;
    return localDb.getProfile(userId);
  },

  // Get contracts
  async getContracts(userId, role = 'business') {
    if (!userId) return [];
    return localDb.getContracts(userId, role);
  },

  // Create contract
  async createContract(contractData) {
    return localDb.createContract(contractData);
  },

  // Update profile
  async updateProfile(userId, updates) {
    return localDb.updateProfile(userId, updates);
  },

  // Get loans
  async getLoans(userId) {
    return [];
  },

  // Get all pending loans
  async getAllPendingLoans() {
    return [];
  },

  // Search farmers
  async searchFarmers(searchTerm) {
    const farmers = localDb.getFarmers();
    if (!searchTerm) return farmers;
    const term = searchTerm.toLowerCase();
    return farmers.filter(f => 
      f.full_name?.toLowerCase().includes(term) ||
      f.phone_number?.includes(term)
    );
  },

  // Refresh farmers
  async refreshFarmers(limit = 20) {
    return this.getFarmers(limit);
  },

  // Clear cache (not needed for local)
  clearCache() {},
};

export default fetchService;
