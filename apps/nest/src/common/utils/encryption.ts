import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const iv = randomBytes(16);

export const encrypt = async (textToEncrypt: string, password: string) => {
  const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  const encryptedText = Buffer.concat([
    cipher.update(textToEncrypt),
    cipher.final(),
  ]);

  return encryptedText.toString('base64url');
};

export const decrypt = async (textToDecrypt: string, password: string) => {
  const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  const decipher = createCipheriv('aes-256-ctr', key, iv);

  const decryptedText = Buffer.concat([
    decipher.update(textToDecrypt, 'base64url'),
    decipher.final(),
  ]);

  return decryptedText.toString();
};
