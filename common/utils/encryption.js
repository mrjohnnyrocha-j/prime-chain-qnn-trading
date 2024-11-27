// backend/common/utils/encryption.js

const crypto = require('crypto');

/**
 * Encrypts data using AES-256-CBC
 * @param {string} data - Data to encrypt
 * @param {string} password - Password for encryption
 * @returns {string} - Encrypted data in hex format
 */
function encryptData(data, password) {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(password).digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts data using AES-256-CBC
 * @param {string} encryptedData - Encrypted data in hex format
 * @param {string} password - Password for decryption
 * @returns {string} - Decrypted data
 */
function decryptData(encryptedData, password) {
  const [ivHex, encryptedHex] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const key = crypto.createHash('sha256').update(password).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  encryptData,
  decryptData,
};
