import { BadRequestException, GoneException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { decrypt, encrypt } from '../utils/encryption';

const DEFAULT_EXPIRATION_DAYS = 3;

@Injectable()
export class EncryptionService {
  constructor(private readonly configService: ConfigService) {}

  async encrypt(data: string): Promise<string> {
    try {
      return await encrypt(data, this.configService.get('ENCRYPTION_PASSWORD'));
    } catch (e) {
      throw new BadRequestException('Error encrypting data');
    }
  }

  async decrypt(encrypted: string): Promise<string> {
    try {
      return await decrypt(
        encrypted,
        this.configService.get('ENCRYPTION_PASSWORD'),
      );
    } catch (e) {
      throw new BadRequestException('Error decrypting data');
    }
  }

  async encryptObject<T>(data: T): Promise<string> {
    return await this.encrypt(JSON.stringify(data));
  }

  async decryptObject<T>(encrypted: string): Promise<T> {
    try {
      const decrypted = await this.decrypt(encrypted);

      return JSON.parse(decrypted);
    } catch {
      throw new BadRequestException('Error decrypting data');
    }
  }

  async encryptWithExpiration<T>(
    data: T,
    options?: { expiration: number },
  ): Promise<string> {
    const exp = new Date();

    exp.setDate(
      exp.getDate() +
        (options?.expiration !== undefined
          ? options.expiration
          : DEFAULT_EXPIRATION_DAYS),
    );

    return await this.encryptObject({ exp, data });
  }

  async decryptWithExpiration<T>(encrypted: string): Promise<T> {
    const decrypted = await this.decryptObject<{
      exp: string;
      data: T;
    }>(encrypted);

    if (new Date(decrypted.exp).getTime() <= Date.now()) {
      throw new GoneException('Expired');
    }

    return decrypted.data;
  }
}
