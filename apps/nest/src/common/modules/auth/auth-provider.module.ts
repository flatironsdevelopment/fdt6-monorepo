import { Global, Module } from '@nestjs/common';
import { AuthProviderService } from './auth-provider.service';
import { AUTH_MODULE_CONFIG, AuthProviderName } from './constants';
import { DynamicAuthProviderService } from './providers/dynamic-providers.service';

@Global()
@Module({
  providers: [DynamicAuthProviderService, AuthProviderService],
})
export class AuthProviderModule {
  static forRoot(provider: AuthProviderName) {
    return {
      module: AuthProviderModule,
      providers: [
        DynamicAuthProviderService,
        AuthProviderService,
        {
          provide: AUTH_MODULE_CONFIG,
          useValue: { provider },
        },
      ],
      exports: [
        DynamicAuthProviderService,
        {
          provide: AUTH_MODULE_CONFIG,
          useValue: { provider },
        },
        AuthProviderService,
      ],
    };
  }
}
