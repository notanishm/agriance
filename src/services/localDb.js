// Local data store - works without network
const LOCAL_DATA_KEY = 'agriance_local_data';

const initialData = {
  profiles: [],
  contracts: [],
  conversations: [],
  messages: [],
};

export const localDb = {
  // Initialize or get data
  getData() {
    const stored = localStorage.getItem(LOCAL_DATA_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Seed with sample data
    const data = {
      profiles: [
        { id: '1', email: 'ramesh@farmer.com', full_name: 'Ramesh Kumar', phone_number: '9876543210', location: 'Madhya Pradesh', kyc_status: 'verified', role: 'farmer', land_size: 5 },
        { id: '2', email: 'suresh@farmer.com', full_name: 'Suresh Patel', phone_number: '9876543211', location: 'Gujarat', kyc_status: 'verified', role: 'farmer', land_size: 3 },
        { id: '3', email: 'vikram@farmer.com', full_name: 'Vikram Singh', phone_number: '9876543212', location: 'Maharashtra', kyc_status: 'pending', role: 'farmer', land_size: 8 },
        { id: '4', email: 'raj@farmer.com', full_name: 'Raj Kumar', phone_number: '9876543213', location: 'Punjab', kyc_status: 'verified', role: 'farmer', land_size: 10 },
        { id: '5', email: 'amit@farmer.com', full_name: 'Amit Sharma', phone_number: '9876543214', location: 'Haryana', kyc_status: 'verified', role: 'farmer', land_size: 6 },
        { id: 'b1', email: 'business@agricorp.com', full_name: 'AgriCorp Foods', company_name: 'AgriCorp Foods', phone_number: '9123456789', location: 'Mumbai', kyc_status: 'verified', role: 'business' },
        { id: 'b2', email: 'business@freshfarms.com', full_name: 'Fresh Farms Ltd', company_name: 'Fresh Farms Ltd', phone_number: '9123456788', location: 'Delhi', kyc_status: 'verified', role: 'business' },
      ],
      contracts: [
        { id: 'c1', business_id: 'b1', farmer_id: '1', crop_name: 'Wheat', quantity: 50, price: 2200, total_value: 110000, status: 'active', delivery_date: '2025-04-15' },
        { id: 'c2', business_id: 'b2', farmer_id: '2', crop_name: 'Rice', quantity: 30, price: 2800, total_value: 84000, status: 'pending', delivery_date: '2025-05-01' },
      ],
      conversations: [],
      messages: [],
    };
    localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(data));
    return data;
  },

  // Save data
  saveData(data) {
    localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(data));
  },

  // Get farmers
  getFarmers() {
    const data = this.getData();
    return data.profiles.filter(p => p.role === 'farmer');
  },

  // Get businesses
  getBusinesses() {
    const data = this.getData();
    return data.profiles.filter(p => p.role === 'business');
  },

  // Get profile by ID
  getProfile(id) {
    const data = this.getData();
    return data.profiles.find(p => p.id === id) || null;
  },

  // Create contract
  createContract(contract) {
    const data = this.getData();
    const newContract = {
      id: 'c' + Date.now(),
      ...contract,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    data.contracts.push(newContract);
    this.saveData(data);
    return newContract;
  },

  // Get contracts
  getContracts(userId, role) {
    const data = this.getData();
    const column = role === 'business' ? 'business_id' : 'farmer_id';
    return data.contracts.filter(c => c[column] === userId);
  },

  // Update profile
  updateProfile(id, updates) {
    const data = this.getData();
    const index = data.profiles.findIndex(p => p.id === id);
    if (index !== -1) {
      data.profiles[index] = { ...data.profiles[index], ...updates };
      this.saveData(data);
      return data.profiles[index];
    }
    return null;
  },

  // Reset data
  resetData() {
    localStorage.removeItem(LOCAL_DATA_KEY);
    return this.getData();
  },
};

export default localDb;
