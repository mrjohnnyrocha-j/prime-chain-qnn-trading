// src/tests/testEncryption.js

import { generatePrimeChainKeyPair } from '../utils/keyGeneration.mjs';
import { encryptWithPublicKey } from '../utils/encryption.mjs';
import { decryptWithPrivateKey } from '../utils/decryption.mjs';

const { publicKey, privateKey } = generatePrimeChainKeyPair();

const message = 'Hello, this is a test message!';

try {
  const ciphertext = encryptWithPublicKey(message, publicKey);
  console.log('Ciphertext:', ciphertext);

  const decryptedMessage = decryptWithPrivateKey(ciphertext, privateKey);
  console.log('Decrypted Message:', decryptedMessage);
} catch (error) {
  console.error('Encryption/Decryption Error:', error);
}
