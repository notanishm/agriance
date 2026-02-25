const ENCRYPTION_KEY_STORAGE = 'agriance_chat_key';

export const cryptoUtils = {
  generateKeyFromIds(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort();
    const combined = `${sortedIds[0]}:${sortedIds[1]}`;
    return combined;
  },

  async deriveKey(userId1, userId2) {
    const keyMaterial = this.generateKeyFromIds(userId1, userId2);
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(keyMaterial);

    const key = await crypto.subtle.digest('SHA-256', keyData);
    
    return crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  },

  async encrypt(plaintext, userId1, userId2) {
    try {
      const key = await this.deriveKey(userId1, userId2);
      const encoder = new TextEncoder();
      const data = encoder.encode(plaintext);

      const iv = crypto.getRandomValues(new Uint8Array(12));

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  },

  async decrypt(ciphertext, userId1, userId2) {
    try {
      const key = await this.deriveKey(userId1, userId2);
      
      const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
      
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw error;
    }
  },
};

export default cryptoUtils;
