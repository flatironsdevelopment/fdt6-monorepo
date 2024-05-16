import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import {
  UserDataCognito,
  createCustomAttribute,
  generateCustomAttributesArray,
} from './helpers';

describe('UserDataCognito', () => {
  const mockUserData = {
    Username: 'testuser',
    UserAttributes: [
      { Name: 'email', Value: 'test@example.com' },
      { Name: 'given_name', Value: 'John' },
      { Name: 'family_name', Value: 'Doe' },
      { Name: 'email_verified', Value: 'true' },
    ],
  };

  it('should initialize UserDataCognito correctly', () => {
    const userDataCognito = new UserDataCognito(mockUserData);

    expect(userDataCognito.data.id).toBe('testuser');
    expect(userDataCognito.data.email).toBe('test@example.com');
    expect(userDataCognito.data.firstName).toBe('John');
    expect(userDataCognito.data.lastName).toBe('Doe');
    expect(userDataCognito.data.emailVerified).toBe(true);
  });

  it('should map user attributes correctly', () => {
    const userDataCognito = new UserDataCognito(mockUserData);

    const mappedUser = userDataCognito.mapToUser(mockUserData);

    expect(mappedUser.id).toBe('testuser');
    expect(mappedUser.email).toBe('test@example.com');
    expect(mappedUser.firstName).toBe('John');
    expect(mappedUser.lastName).toBe('Doe');
    expect(mappedUser.emailVerified).toBe(true);
  });

  it('should handle missing attributes gracefully', () => {
    const incompleteUserData = {
      Username: 'testuser',
      UserAttributes: [
        { Name: 'email', Value: 'test@example.com' },
        // Missing 'given_name' and 'family_name'
        { Name: 'email_verified', Value: 'true' },
      ],
    };

    const userDataCognito = new UserDataCognito(incompleteUserData);

    expect(userDataCognito.data.id).toBe('testuser');
    expect(userDataCognito.data.email).toBe('test@example.com');
    expect(userDataCognito.data.firstName).toBeUndefined();
    expect(userDataCognito.data.lastName).toBeUndefined();
    expect(userDataCognito.data.emailVerified).toBe(true);
  });
});

describe('generateCustomAttributesArray', () => {
  it('should generate custom attributes array correctly from object', () => {
    const attributes = {
      age: 25,
      address: {
        city: 'New York',
        country: 'USA',
      },
      isStudent: true,
    };

    const expectedAttributes: CognitoUserAttribute[] = [
      new CognitoUserAttribute({ Name: 'age', Value: '25' }),
      new CognitoUserAttribute({
        Name: 'address',
        Value: JSON.stringify({ city: 'New York', country: 'USA' }),
      }),
      new CognitoUserAttribute({ Name: 'isStudent', Value: 'true' }),
    ];

    const generatedAttributes = generateCustomAttributesArray(attributes);

    expect(generatedAttributes).toEqual(expectedAttributes);
  });

  it('should handle empty object and return an empty array', () => {
    const attributes = {};

    const generatedAttributes = generateCustomAttributesArray(attributes);

    expect(generatedAttributes).toEqual([]);
  });

  it('should handle nested objects and stringify correctly', () => {
    const attributes = {
      nested: {
        key1: 'value1',
        key2: {
          subKey: 'subValue',
        },
      },
    };

    const expectedAttributes: CognitoUserAttribute[] = [
      new CognitoUserAttribute({
        Name: 'nested',
        Value: JSON.stringify({
          key1: 'value1',
          key2: { subKey: 'subValue' },
        }),
      }),
    ];

    const generatedAttributes = generateCustomAttributesArray(attributes);

    expect(generatedAttributes).toEqual(expectedAttributes);
  });

  it('should handle non-object values and convert to string', () => {
    const attributes = {
      name: 'John Doe',
      isActive: false,
      score: 75.5,
    };

    const expectedAttributes: CognitoUserAttribute[] = [
      new CognitoUserAttribute({ Name: 'name', Value: 'John Doe' }),
      new CognitoUserAttribute({ Name: 'isActive', Value: 'false' }),
      new CognitoUserAttribute({ Name: 'score', Value: '75.5' }),
    ];

    const generatedAttributes = generateCustomAttributesArray(attributes);

    expect(generatedAttributes).toEqual(expectedAttributes);
  });
});

describe('createCustomAttribute', () => {
  it('should create a custom attribute object correctly', () => {
    const field = 'age';
    const value = 25;

    const expectedAttribute = { 'custom:age': 25 };

    const createdAttribute = createCustomAttribute(field, value);

    expect(createdAttribute).toEqual(expectedAttribute);
  });

  it('should handle string value correctly', () => {
    const field = 'name';
    const value = 'John Doe';

    const expectedAttribute = { 'custom:name': 'John Doe' };

    const createdAttribute = createCustomAttribute(field, value);

    expect(createdAttribute).toEqual(expectedAttribute);
  });

  it('should handle boolean value correctly', () => {
    const field = 'isActive';
    const value = true;

    const expectedAttribute = { 'custom:isActive': true };

    const createdAttribute = createCustomAttribute(field, value);

    expect(createdAttribute).toEqual(expectedAttribute);
  });

  it('should handle object value correctly', () => {
    const field = 'details';
    const value = { city: 'New York', country: 'USA' };

    const expectedAttribute = {
      'custom:details': { city: 'New York', country: 'USA' },
    };

    const createdAttribute = createCustomAttribute(field, value);

    expect(createdAttribute).toEqual(expectedAttribute);
  });
});
