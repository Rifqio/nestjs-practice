import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { gzipSync, gunzipSync } from 'zlib';

const encryptionKey = randomBytes(32);
export const encryptToken = (token: string): string => {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', encryptionKey, iv);

  let encryptedToken = cipher.update(token, 'utf8', 'hex');
  encryptedToken += cipher.final('hex');
  const encryptedData = iv.toString('hex') + encryptedToken;

  const compressedData = gzipSync(encryptedData).toString('base64');

  return compressedData;
};

export const decryptToken = (token: string): string => {
  const compressedData = Buffer.from(token, 'base64');
  const encryptedData = gunzipSync(compressedData).toString();

  const iv = Buffer.from(encryptedData.slice(0, 32), 'hex');
  const encryptedToken = encryptedData.slice(32);

  const decipher = createDecipheriv('aes-256-cbc', encryptionKey, iv);

  let decryptedToken = decipher.update(encryptedToken, 'hex', 'utf8');
  decryptedToken += decipher.final('utf8');

  return decryptedToken;
};
