import { supabase, handleSupabaseError } from '../lib/supabase';

/**
 * Database service for farmer-related operations
 */

export const farmerService = {
  // Create or update farmer profile
  async createFarmerProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          role: 'farmer',
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Get farmer profile - only select core columns that always exist
  async getFarmerProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role, full_name, phone_number, onboarding_completed')
        .eq('id', userId)
        .eq('role', 'farmer')
        .single();

      if (error) {
        // If error, try without role filter
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('profiles')
          .select('id, email, role, full_name, phone_number, onboarding_completed')
          .eq('id', userId)
          .single();
        
        if (fallbackError) throw fallbackError;
        return { data: fallbackData, error: null };
      }
      return { data, error: null };
    } catch (error) {
      return { data: null, error: null }; // Return empty data instead of throwing
    }
  },

  // Add KYC documents
  async addKYCDocuments(userId, documents) {
    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: userId,
          ...documents,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Get farmer's contracts
  async getFarmerContracts(userId) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          business:business_id (
            id,
            business_name,
            business_gst
          )
        `)
        .eq('farmer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: null };
    }
  },

  // Get all available contract postings (for farmer marketplace)
  async getAvailablePostings() {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          business:business_id (
            id,
            business_name,
            business_gst,
            phone_number,
            location
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Get farmer's loan applications
  async getFarmerLoans(userId) {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select(`
          *,
          contract:contract_id (
            id,
            crop_name,
            quantity,
            total_value
          )
        `)
        .eq('farmer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },
};

/**
 * Database service for business-related operations
 */
export const businessService = {
  // Create or update business profile
  async createBusinessProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          role: 'business',
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Create a new contract
  async createContract(contractData) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert(contractData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Get business contracts
  async getBusinessContracts(businessId) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          farmer:farmer_id (
            id,
            full_name,
            phone_number,
            location
          )
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Update contract status
  async updateContractStatus(contractId, status) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', contractId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Search for farmers - only select core columns
  async searchFarmers(searchTerm = '') {
    try {
      let query = supabase
        .from('profiles')
        .select('id, email, full_name, phone_number')
        .eq('role', 'farmer');
      
      // Only add search filter if searchTerm is provided
      if (searchTerm && searchTerm.trim() !== '') {
        query = query.or(`full_name.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.limit(20);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },
};

/**
 * Database service for bank-related operations
 */
export const bankService = {
  // Create or update bank profile
  async createBankProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          role: 'bank',
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Get all loan applications for review
  async getLoanApplications(filters = {}) {
    try {
      let query = supabase
        .from('loan_applications')
        .select(`
          *,
          farmer:farmer_id (
            id,
            full_name,
            phone_number,
            location,
            land_size
          ),
          contract:contract_id (
            id,
            crop_name,
            quantity,
            price,
            total_value
          )
        `);

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Update loan application status
  async updateLoanStatus(loanId, status, reviewNotes = null) {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (reviewNotes) {
        updateData.review_notes = reviewNotes;
      }

      if (status === 'approved') {
        updateData.approved_at = new Date().toISOString();
      } else if (status === 'rejected') {
        updateData.rejected_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('loan_applications')
        .update(updateData)
        .eq('id', loanId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Create loan application
  async createLoanApplication(loanData) {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .insert(loanData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },
};

/**
 * General database utilities
 */
export const dbUtils = {
  // Get user profile by ID
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Get contract by ID
  async getContract(contractId) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          farmer:farmer_id (
            id,
            full_name,
            phone_number,
            location
          ),
          business:business_id (
            id,
            business_name,
            business_gst
          )
        `)
        .eq('id', contractId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },
};

// Chat/Messaging Service
export const chatService = {
  // Get or create conversation with a user
  async getOrCreateConversation(currentUserId, otherUserId) {
    try {
      // Check if conversation exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(participant_1.eq.${currentUserId},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${currentUserId})`)
        .single();

      if (existing) {
        return { data: existing, error: null };
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participant_1: currentUserId,
          participant_2: otherUserId,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Get all conversations for a user
  async getConversations(userId) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_1:profiles!participant_1(id, full_name, role),
          participant_2:profiles!participant_2(id, full_name, role),
          messages:messages(last_message:created_at, last_content:content)
        `)
        .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Get messages in a conversation
  async getMessages(conversationId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(id, full_name, role)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Send a message
  async sendMessage(conversationId, senderId, content) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content: content,
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  // Mark messages as read
  async markAsRead(conversationId, userId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId);

      if (error) throw error;
      return { data: error ? null : true, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },
};

export default {
  farmer: farmerService,
  business: businessService,
  bank: bankService,
  chat: chatService,
  utils: dbUtils,
};
