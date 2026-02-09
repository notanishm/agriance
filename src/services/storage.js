import { supabase, handleSupabaseError } from '../lib/supabase';

/**
 * Client-side file encryption using Web Crypto API
 * Files are encrypted before upload and decrypted after download
 */

// Derive encryption key from user password using PBKDF2
const deriveKey = async (password, salt) => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000, // OWASP recommendation
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

// Encrypt file using AES-256-GCM
export const encryptFile = async (file, userPassword) => {
  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Derive encryption key
    const key = await deriveKey(userPassword, salt);

    // Encrypt file data
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      arrayBuffer
    );

    // Package encrypted data with metadata
    const encryptedPackage = {
      salt: Array.from(salt),
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted)),
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      timestamp: Date.now(),
    };

    // Convert to blob for upload
    const blob = new Blob([JSON.stringify(encryptedPackage)], {
      type: 'application/json',
    });

    return { blob, metadata: encryptedPackage, error: null };
  } catch (error) {
    console.error('Encryption error:', error);
    return { blob: null, metadata: null, error: error.message };
  }
};

// Decrypt file using AES-256-GCM
export const decryptFile = async (encryptedData, userPassword) => {
  try {
    let encryptedPackage;

    // Parse encrypted package if it's a string
    if (typeof encryptedData === 'string') {
      encryptedPackage = JSON.parse(encryptedData);
    } else {
      encryptedPackage = encryptedData;
    }

    const salt = new Uint8Array(encryptedPackage.salt);
    const iv = new Uint8Array(encryptedPackage.iv);
    const data = new Uint8Array(encryptedPackage.data);

    // Derive decryption key
    const key = await deriveKey(userPassword, salt);

    // Decrypt file data
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    // Recreate original file
    const file = new File([decrypted], encryptedPackage.fileName, {
      type: encryptedPackage.fileType,
    });

    return { file, error: null };
  } catch (error) {
    console.error('Decryption error:', error);
    return { file: null, error: 'Decryption failed. Wrong password?' };
  }
};

/**
 * File validation
 */
export const validateFile = (file) => {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];

  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file size
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit',
    };
  }

  // Check MIME type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only PDF, JPG, and PNG are allowed.',
    };
  }

  // Check file extension
  const ext = file.name.toLowerCase().split('.').pop();
  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: 'Invalid file extension',
    };
  }

  return { valid: true, error: null };
};

/**
 * Supabase Storage Service
 */
export const storageService = {
  /**
   * Upload encrypted file to Supabase Storage
   */
  async uploadFile(file, userId, fileType, userPassword) {
    try {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        return { data: null, error: validation.error };
      }

      // Encrypt file
      const { blob, metadata, error: encryptError } = await encryptFile(
        file,
        userPassword
      );
      if (encryptError) {
        return { data: null, error: encryptError };
      }

      // Generate unique file path
      const fileId = crypto.randomUUID();
      const filePath = `${userId}/${fileType}/${fileId}.encrypted`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, blob, {
          contentType: 'application/json',
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Store file metadata in database
      const { error: dbError } = await supabase.from('file_metadata').insert({
        id: fileId,
        user_id: userId,
        file_type: fileType,
        file_name: file.name,
        file_size: file.size,
        original_type: file.type,
        storage_path: filePath,
        encrypted: true,
        uploaded_at: new Date().toISOString(),
      });

      if (dbError) {
        console.error('Database metadata error:', dbError);
        // Try to delete uploaded file if metadata insert fails
        await supabase.storage.from('documents').remove([filePath]);
        throw dbError;
      }

      return {
        data: {
          fileId,
          path: filePath,
          metadata,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  /**
   * Download and decrypt file from Supabase Storage
   */
  async downloadFile(fileId, userPassword) {
    try {
      // Get file metadata from database
      const { data: metadata, error: metaError } = await supabase
        .from('file_metadata')
        .select('*')
        .eq('id', fileId)
        .single();

      if (metaError) throw metaError;

      // Download encrypted file
      const { data: blob, error: downloadError } = await supabase.storage
        .from('documents')
        .download(metadata.storage_path);

      if (downloadError) throw downloadError;

      // Read blob as text (encrypted JSON)
      const text = await blob.text();

      // Decrypt file
      const { file, error: decryptError } = await decryptFile(
        text,
        userPassword
      );

      if (decryptError) {
        return { data: null, error: decryptError };
      }

      return { data: file, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  /**
   * Get file URL (for encrypted files, returns metadata URL)
   */
  async getFileUrl(filePath) {
    try {
      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      return { data: data.publicUrl, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  /**
   * List user's files
   */
  async listUserFiles(userId, fileType = null) {
    try {
      let query = supabase
        .from('file_metadata')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

      if (fileType) {
        query = query.eq('file_type', fileType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  /**
   * Delete file from storage and database
   */
  async deleteFile(fileId) {
    try {
      // Get file metadata
      const { data: metadata, error: metaError } = await supabase
        .from('file_metadata')
        .select('storage_path')
        .eq('id', fileId)
        .single();

      if (metaError) throw metaError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([metadata.storage_path]);

      if (storageError) throw storageError;

      // Delete metadata from database
      const { error: dbError } = await supabase
        .from('file_metadata')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },

  /**
   * Upload file without encryption (for non-sensitive files)
   */
  async uploadFileUnencrypted(file, userId, fileType) {
    try {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        return { data: null, error: validation.error };
      }

      // Generate unique file path
      const fileId = crypto.randomUUID();
      const ext = file.name.split('.').pop();
      const filePath = `${userId}/${fileType}/${fileId}.${ext}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Store file metadata in database
      const { error: dbError } = await supabase.from('file_metadata').insert({
        id: fileId,
        user_id: userId,
        file_type: fileType,
        file_name: file.name,
        file_size: file.size,
        original_type: file.type,
        storage_path: filePath,
        encrypted: false,
        uploaded_at: new Date().toISOString(),
      });

      if (dbError) throw dbError;

      return {
        data: {
          fileId,
          path: filePath,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },
};

export default storageService;
