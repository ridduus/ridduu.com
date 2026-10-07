import crypto from 'crypto';

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || 'ridduu_32_bytes_super_secure_key_!'; // 32 bytes key
const IV_LENGTH = 16; // For AES-256-CBC

/**
 * Encrypt payload string/object
 */
export function encryptData(data) {
  try {
    const text = typeof data === 'object' ? JSON.stringify(data) : String(data);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
      iv: iv.toString('hex'),
      data: encrypted,
    };
  } catch (err) {
    console.error('Encryption error:', err);
    return data;
  }
}

/**
 * Decrypt payload string/object
 */
export function decryptData(encryptedObj) {
  try {
    if (!encryptedObj || !encryptedObj.iv || !encryptedObj.data) {
      return encryptedObj;
    }
    const iv = Buffer.from(encryptedObj.iv, 'hex');
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedObj.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (err) {
    console.error('Decryption error:', err);
    return null;
  }
}
