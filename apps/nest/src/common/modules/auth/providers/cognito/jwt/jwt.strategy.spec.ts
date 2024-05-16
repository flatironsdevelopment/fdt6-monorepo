import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TestBed } from 'testing';
import { createConfigMock } from '../../../../../../../test/utils/config';
import { CognitoProviderService } from '../cognito.service';
import { CognitoJwtStrategy } from './jwt.strategy';

const mockConfigValues = {
  AWS_REGION: 'us-east-1',
  AWS_COGNITO_USER_POOL_ID: 'user-pool-id',
};

describe('CognitoJwtStrategy', () => {
  let underTest: CognitoJwtStrategy;
  let configService: ConfigService;
  let cognitoProviderService: CognitoProviderService;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(CognitoJwtStrategy)
      .mock(ConfigService)
      .using(createConfigMock(mockConfigValues))
      .compile();
    underTest = unit;
    configService = unitRef.get(ConfigService);
    cognitoProviderService = unitRef.get(CognitoProviderService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(configService).toBeDefined();
    expect(cognitoProviderService).toBeDefined();
  });

  it('should return null if payload or sub is missing', async () => {
    const req: Request = {} as Request;
    const payload = null;

    const user = await underTest.validate(req, payload);

    expect(user).toBeNull();
  });

  it('should return user when token is valid and getUserByToken succeeds', async () => {
    const req: Request = {
      headers: { authorization: 'Bearer validToken' },
    } as Request;
    const payload = { sub: 'userId' };

    const userData = {
      id: 'userId',
      firstName: 'John',
      lastName: 'Doe',
      email: 'email@email.com',
    };

    jest
      .spyOn(cognitoProviderService, 'getUserByToken')
      .mockResolvedValue(userData);

    const user = await underTest.validate(req, payload);

    expect(user).toEqual(userData);
  });

  it('should return false when getUserByToken fails', async () => {
    const req: Request = {
      headers: { authorization: 'Bearer invalidToken' },
    } as Request;
    const payload = { sub: 'userId' };

    jest
      .spyOn(cognitoProviderService, 'getUserByToken')
      .mockRejectedValue(new Error('Token validation failed'));

    const user = await underTest.validate(req, payload);

    expect(user).toBe(false);
  });
});
