import { createConfigMock } from './config';

describe('createConfigMock', () => {
  it('should create a mock configuration object with default values', () => {
    const mockConfig = createConfigMock();

    expect(mockConfig).toHaveProperty('values');
    expect(mockConfig).toHaveProperty('get');
    expect(typeof mockConfig.get).toBe('function');

    expect(mockConfig.values).toMatchSnapshot();

    expect(mockConfig.get('AWS_COGNITO_USER_POOL_ID')).toBe(
      'us-east-2_5DEYLvvFJ',
    );
    expect(mockConfig.get('AWS_REGION')).toBe('us-east-2');
  });

  it('should create a mock configuration object with custom values', () => {
    const customConfigs = {
      AWS_COGNITO_USER_POOL_ID: 'CustomUserPoolID',
      APP_NAME: 'CustomAppName',
    };

    const mockConfig = createConfigMock(customConfigs);

    expect(mockConfig.get('AWS_COGNITO_USER_POOL_ID')).toBe('CustomUserPoolID');
    expect(mockConfig.get('APP_NAME')).toBe('CustomAppName');
  });
});
