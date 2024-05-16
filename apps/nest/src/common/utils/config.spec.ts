import { getRedisConfig } from './config';

describe('getRedisConfig', () => {
  it('should return Redis config when a valid URL is provided', () => {
    const validUrl = 'redis://username:password@localhost:6379';

    const config = getRedisConfig(validUrl);

    expect(config).toEqual({
      host: 'localhost',
      port: 6379,
      password: 'password',
      username: 'username',
    });
  });

  it('should return an empty object when no URL is provided', () => {
    const config = getRedisConfig('');

    expect(config).toEqual({});
  });

  it('should return an empty object when an invalid URL is provided', () => {
    const invalidUrl = 'invalid-url';

    const config = getRedisConfig(invalidUrl);

    expect(config).toEqual({});
  });
});
