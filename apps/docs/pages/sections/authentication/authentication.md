# Authentication

This repository contains the implementation of a basic authentication flow.

## Architecture Overview

---

![Architecture design](../../assets/auth-architecture-overview.png 'Architecture overview').

There are 3 important modules in the backend project.

- `auth`
  > Basic interface for the authentication endpoints, dto and validations are done at this level.
- `common/modules/auth`
  > Auth Providers, this module lazy load the specific provider. All logic for authentication is here.
- `common/modules/messaging`
  > Modules for sending emails and sms. The sms providers is lazy load in the same way we lazy load the auth modules.

### Providers Overview

All providers share the same interface, port authentication it is the `AuthProvider` interface.

And then the `auth-provider.service.ts`, which implements the same interface, is the one that is imported for external services. This services abstracts the logic for getting the provider reference.

#### Requirements

Each provider (e.g., Cognito, Auth0, etc.) should provide its own implementation of the `UserModel`, `JWTStrategy`, and the `AuthProvider` interface.

##### UserModel

The `UserModel` interface serves to map the provider-specific user object to a shared interface used across all providers. It should include fields such as:

```javascript
// apps/nest/src/common/models/user.model.ts
export interface UserModel {
  data: User;

  mapToUser(data: any): User;
}
```

##### JWTStrategy

The JWTStrategy represents the strategy used by each provider to handle the JWT token from the authorization header. Providers are responsible for exporting their specific strategy. This typically involves decoding and validating JWT tokens.

Example of the cognito jwt strategy:

```javascript
// apps/nest/src/common/modules/auth/providers/cognito/jwt/jwt.strategy.ts
@Injectable()
export class CognitoJwtStrategy extends PassportStrategy(Strategy) {
   constructor(
    private configService: ConfigService,
    private authProvider: CognitoProviderService,
  ) {}

  public async validate(req: Request, payload: any) {}
}
```

##### AuthProvider

The AuthProvider interface serves as the base interface for all providers. It defines the methods or functionalities that each provider should implement.

```javascript
// apps/nest/src/common/modules/auth/providers/base.interfaces.ts
export interface AuthProvider {
  initialize(config?: any): void;
  signUp(
    username: string,
    password: string,
    additionalData?: AdditionalData,
  ): Promise<GenericResult>;
  signIn(username: string, password: string): Promise<AuthToken>;
  signOut(token: string): Promise<GenericResult>;
  getUser(username: string): Promise<UserData>;
  getUserByToken(token: string): Promise<UserData>;
  confirmSignUp(username: string, code: string): Promise<GenericResult>;
  forgotPassword(username: string): Promise<DeliveryInfo>;
  forgotPasswordSubmit(
    username: string,
    code: string,
    newPassword: string,
  ): Promise<GenericResult>;
  changePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<GenericResult>;
  refreshToken(token: string): Promise<AuthToken>;
  resendEmail(email: string): Promise<DeliveryInfo>;
  generateTOTPSecret(token: string): Promise<string>;
  verifyCode(
    user: string,
    session: string,
    code: string,
    type: ChallengeNameType,
  ): Promise<AuthToken>;
  enableTOTPMfa(
    token: string,
    device: string,
    code: string,
  ): Promise<GenericResult>;
  disableTOTPMfa(token: string): Promise<GenericResult>;
  getSMSMfa(token: string): Promise<DeliveryInfo>;
  enableSMSMfa(token: string, code: string): Promise<GenericResult>;
  disableSMSMfa(token: string): Promise<GenericResult>;
}
```

### Lazy loading providers

On the `dynamic-providers.service.ts` file, you can find the strategy pattern we are using for lazy loading modules.

```javascript
// apps/nest/src/common/modules/auth/providers/dynamic-providers.service.ts
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
```

The provider is specified on module import, see the imports in `app.module.ts`

```javascript
// apps/nest/src/app.module.ts
AuthProviderModule.forRoot(AuthProviderName.COGNITO)
```

And on the service we use the dynamic provider `getProvider` method get a reference of the provider:

```javascript
// apps/nest/src/common/modules/auth/providers/dynamic-providers.service.ts
async getProvider(provider: AuthProviderName): Promise<AuthProvider> {
  const moduleRef = await this.loadModule(provider);
  return moduleRef.get(providers[provider]);
}
```

## Endpoints Overview

---

The authentication flow includes the following steps:

### User Creation

1. **Sign Up** [_POST_ v1/auth/sign-up]
2. **Confirm Sign Up** [_PUT_ v1/auth/sign-up/confirm]
3. **Resend Sign Up Code** [_POST_ v1/auth/email/resend]

### Session

1. **Sign In** [_POST_ v1/auth/sign-in]
2. **Get User** [_GET_ v1/auth/session]
3. **Refresh Token** [_POST_ v1/auth/refresh-token]
4. **Sign Out** [_DELETE_ v1/auth/sign-out]

### Recovery

1. **Initiate Forget Password** [_POST_ v1/auth/forgot-password]
2. **Confirm Forget Password** [_PUT_ v1/auth/forgot-password]
3. **Change Password** [_PUT_ v1/auth/change-password]

### TOTP 2FA

1. **Generate Set Up Code** [_GET_ v1/auth/totp?qrType=image]
2. **Enable TOTP 2FA** [_POST_ v1/auth/totp]
3. **2FA Verify Code** [_PUT_ v1/auth/totp]
4. **Remove TOTP 2FA** [_DELETE_ v1/auth/totp]

### SMS 2FA

1. **Send Set Up Code** [_GET_ v1/auth/sms]
2. **Enable SMS 2FA** [_POST_ v1/auth/sms]
3. **2FA Verify Code** [_PUT_ v1/auth/sms]
4. **Remove SMS 2FA** [_DELETE_ v1/auth/sms]

## Messaging Endpoints

---

These endpoints uses the `x-api-key` header, this has to exactly match the value of the environment variable `API_KEY_HEADER`.

These endpoints are meant so be used as webhooks for sending the verification codes for services that don't allow retrieving the code by other methods inside the code (like cognito).

### Send Email

1. **Send Email** [_POST_ v1/messaging/email/send]

### Send SMS

1. **Send SMS** [_POST_ v1/messaging/sms/send]
