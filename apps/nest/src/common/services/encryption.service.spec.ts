import { ConfigService } from '@nestjs/config';
import { TestBed, faker } from 'testing';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let underTest: EncryptionService;
  let configService: ConfigService;
  let encryptSpy: jest.SpyInstance;
  let decryptSpy: jest.SpyInstance;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(EncryptionService)
      .mock(ConfigService)
      .using({
        get: jest.fn().mockReturnValue('password'),
      })
      .compile();

    underTest = unit;
    configService = unitRef.get(ConfigService);
    encryptSpy = jest.spyOn(underTest, 'encrypt');
    decryptSpy = jest.spyOn(underTest, 'decrypt');

    encryptSpy.mockResolvedValue('encrypted');
    decryptSpy.mockResolvedValue('decrypted');
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(configService).toBeDefined();
    expect(configService).toBeDefined();
    expect(encryptSpy).toBeDefined();
    expect(decryptSpy).toBeDefined();
  });

  describe('encrypt', () => {
    it('should encrypt data', async () => {
      const data = 'data';
      const encrypted = faker.create.string.hexadecimal();

      encryptSpy.mockResolvedValue(encrypted);

      const result = await underTest.encrypt(data);

      expect(result).toEqual(encrypted);
    });

    it('should throw an error if encryption fails', async () => {
      const data = 'data';

      encryptSpy.mockRejectedValue(new Error());

      await expect(underTest.encrypt(data)).rejects.toThrow();
    });
  });

  describe('decrypt', () => {
    it('should decrypt data', async () => {
      const encrypted = faker.create.string.hexadecimal();
      const decrypted = faker.create.string.hexadecimal();

      decryptSpy.mockResolvedValue(decrypted);

      const result = await underTest.decrypt(encrypted);

      expect(result).toEqual(decrypted);
    });

    it('should throw an error if decryption fails', async () => {
      const encrypted = faker.create.string.hexadecimal();

      decryptSpy.mockRejectedValue(new Error());

      await expect(underTest.decrypt(encrypted)).rejects.toThrow();
    });
  });

  describe('encryptObject', () => {
    it('should encrypt an object', async () => {
      const data = { key: 'value' };
      const encrypted = faker.create.string.hexadecimal();

      encryptSpy.mockResolvedValue(encrypted);

      const result = await underTest.encryptObject(data);

      expect(result).toEqual(encrypted);
    });

    it('should throw an error if encryption fails', async () => {
      const data = { key: 'value' };

      encryptSpy.mockRejectedValue(new Error());

      await expect(underTest.encryptObject(data)).rejects.toThrow();
    });
  });

  describe('decryptObject', () => {
    it('should decrypt an object', async () => {
      const encrypted = faker.create.string.hexadecimal();
      const decrypted = { key: 'value' };

      decryptSpy.mockResolvedValue(JSON.stringify(decrypted));

      const result = await underTest.decryptObject(encrypted);

      expect(result).toEqual(decrypted);
    });

    it('should throw an error if decryption fails', async () => {
      const encrypted = faker.create.string.hexadecimal();

      decryptSpy.mockRejectedValue(new Error());

      await expect(underTest.decryptObject(encrypted)).rejects.toThrow();
    });
  });

  describe('encryptWithExpiration', () => {
    it('should encrypt an object with an expiration date', async () => {
      const data = { key: 'value' };
      const encrypted = faker.create.string.hexadecimal();

      encryptSpy.mockResolvedValue(encrypted);

      const result = await underTest.encryptWithExpiration(data, {
        expiration: 1,
      });

      expect(result).toEqual(encrypted);
    });

    it('should throw an error if encryption fails', async () => {
      const data = { key: 'value' };

      encryptSpy.mockRejectedValue(new Error());

      await expect(underTest.encryptWithExpiration(data)).rejects.toThrow();
    });
  });

  describe('decryptWithExpiration', () => {
    it('should decrypt an object with an expiration date', async () => {
      const encrypted = faker.create.string.hexadecimal();
      const decrypted = {
        exp: new Date(),
        data: { key: 'value' },
      };

      (global.Date.now as jest.Mock).mockReturnValueOnce(1701885600);

      decryptSpy.mockResolvedValue(JSON.stringify(decrypted));

      const result = await underTest.decryptWithExpiration(encrypted);

      expect(result).toEqual(decrypted.data);
    });

    it('should throw an error if decryption fails', async () => {
      const encrypted = faker.create.string.hexadecimal();

      decryptSpy.mockRejectedValue(new Error());

      await expect(
        underTest.decryptWithExpiration(encrypted),
      ).rejects.toThrow();
    });

    it('should throw an error if the expiration date is in the past', async () => {
      const encrypted = faker.create.string.hexadecimal();
      const decrypted = {
        exp: new Date().setFullYear(2010).toString(),
        data: { key: 'value' },
      };

      decryptSpy.mockResolvedValue(JSON.stringify(decrypted));

      await expect(
        underTest.decryptWithExpiration(encrypted),
      ).rejects.toThrow();
    });
  });
});
