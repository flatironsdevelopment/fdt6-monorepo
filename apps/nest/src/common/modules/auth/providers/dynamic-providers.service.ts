import { Injectable } from '@nestjs/common';
import { LazyModuleLoader, ModuleRef } from '@nestjs/core';
import { AuthProviderName } from '../constants';
import { AuthProvider } from './base.interfaces';
import { CognitoModule } from './cognito/cognito.module';
import { CognitoProviderService } from './cognito/cognito.service';

type AuthProviderType = typeof CognitoProviderService;

const providers: Record<AuthProviderName, AuthProviderType> = {
  [AuthProviderName.COGNITO]: CognitoProviderService,
};

@Injectable()
export class DynamicAuthProviderService {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  async loadModule(provider: string): Promise<ModuleRef> {
    let moduleRef: ModuleRef;
    if (provider === AuthProviderName.COGNITO) {
      moduleRef = await this.lazyModuleLoader.load(() => CognitoModule);
    }

    if (!moduleRef) {
      throw new Error('No valid Auth provider found');
    }

    return moduleRef;
  }

  async getProvider(provider: AuthProviderName): Promise<AuthProvider> {
    const moduleRef = await this.loadModule(provider);
    return moduleRef.get(providers[provider]);
  }
}
