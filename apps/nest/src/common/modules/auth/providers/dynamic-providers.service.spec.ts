import { LazyModuleLoader } from '@nestjs/core';
import { TestBed } from 'testing';
import { AuthProviderName } from '../constants';
import { CognitoModule } from './cognito/cognito.module';
import { CognitoProviderService } from './cognito/cognito.service';
import { DynamicAuthProviderService } from './dynamic-providers.service';

describe('DynamicAuthProviderService', () => {
  let underTest: DynamicAuthProviderService;
  let mockLazyModuleLoader: LazyModuleLoader;
  let cognitoModule: CognitoModule;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(DynamicAuthProviderService)
      .mock(LazyModuleLoader)
      .using({
        load: jest.fn((moduleFactory) => moduleFactory()),
      })
      .compile();

    underTest = unit;
    mockLazyModuleLoader = unitRef.get(LazyModuleLoader);

    const { unit: cognitoUnit } = TestBed.create(CognitoModule).compile();

    cognitoModule = cognitoUnit;
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(mockLazyModuleLoader).toBeDefined();
    expect(cognitoModule).toBeDefined();
  });

  it('should load CognitoModule and get CognitoProviderService', async () => {
    const mockCognitoProviderServiceInstance = {} as CognitoProviderService;
    const mockModuleRef: any = {
      get: jest.fn().mockReturnValue(mockCognitoProviderServiceInstance),
    };

    underTest.loadModule = jest.fn().mockResolvedValue(mockModuleRef);

    const providerService = await underTest.getProvider(
      AuthProviderName.COGNITO,
    );

    expect(underTest.loadModule).toHaveBeenCalledWith('cognito');
    expect(mockModuleRef.get).toHaveBeenCalledWith(CognitoProviderService);
    expect(providerService).toBe(mockCognitoProviderServiceInstance);
  });
});
