import {
  AdminGetUserCommand,
  AssociateSoftwareTokenCommand,
  AuthFlowType,
  ChallengeNameType,
  ChangePasswordCommand,
  CognitoIdentityProvider,
  CognitoIdentityProviderClient,
  GetUserAttributeVerificationCodeCommand,
  GetUserCommand,
  GlobalSignOutCommand,
  ResendConfirmationCodeCommand,
  SetUserMFAPreferenceCommand,
  VerifySoftwareTokenCommand,
  VerifyUserAttributeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { UserData } from '../../../../models/user.model';
import { AuthProviderName } from '../../constants';
import {
  createAuthObject,
  createForgotPasswordDeliveryInfo,
  createGenericResult,
} from '../../utils';
import {
  AdditionalData,
  AuthProvider,
  AuthToken,
  DeliveryInfo,
  GenericResult,
} from '../base.interfaces';
import { UserDataCognito, generateCustomAttributesArray } from './helpers';

@Injectable()
export class CognitoProviderService implements AuthProvider {
  private userPool: CognitoUserPool;
  private providerClient: CognitoIdentityProviderClient;
  private serviceProvider: CognitoIdentityProvider;

  get name(): AuthProviderName {
    return AuthProviderName.COGNITO;
  }

  constructor(private readonly configService: ConfigService) {}

  initialize(): void {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get<string>('AWS_COGNITO_USER_POOL_ID'),
      ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
    });

    const region = this.configService.get<string>('AWS_REGION');

    this.serviceProvider = new CognitoIdentityProvider({
      region,
    });

    this.providerClient = new CognitoIdentityProviderClient({
      region,
    });
  }

  getCognitoUser(email: string): CognitoUser {
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    return new CognitoUser(userData);
  }

  async signUp(
    email: string,
    password: string,
    additionalData?: AdditionalData,
  ): Promise<GenericResult> {
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({ Name: 'email', Value: email }),
          ...generateCustomAttributesArray(additionalData),
        ],
        null,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(createGenericResult(true, result.user.getUsername()));
          }
        },
      );
    });
  }

  async signIn(username: string, password: string): Promise<AuthToken> {
    return new Promise<AuthToken>((resolve, reject) => {
      return this.serviceProvider.initiateAuth(
        {
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
          AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
          },
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(
              createAuthObject(
                result.AuthenticationResult?.AccessToken,
                result.AuthenticationResult?.RefreshToken,
                result.Session,
                result.ChallengeParameters?.USER_ID_FOR_SRP,
                result.ChallengeName,
              ),
            );
          }
        },
      );
    });
  }

  async confirmSignUp(
    username: string,
    verificationCode: string,
  ): Promise<GenericResult> {
    return new Promise((resolve, reject) => {
      return this.getCognitoUser(username).confirmRegistration(
        verificationCode,
        true,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(createGenericResult(true, result));
          }
        },
      );
    });
  }

  async forgotPassword(username: string): Promise<DeliveryInfo> {
    return new Promise((resolve, reject) => {
      return this.getCognitoUser(username).forgotPassword({
        onSuccess: function (result) {
          resolve(
            createForgotPasswordDeliveryInfo(
              result.CodeDeliveryDetails.DeliveryMedium,
              result.CodeDeliveryDetails.Destination,
            ),
          );
        },
        onFailure: function (err) {
          reject(err);
        },
      });
    });
  }

  async forgotPasswordSubmit(
    username: string,
    verificationCode: string,
    newPassword: string,
  ): Promise<GenericResult> {
    return new Promise((resolve, reject) => {
      return this.getCognitoUser(username).confirmPassword(
        verificationCode,
        newPassword,
        {
          onSuccess: function (result) {
            resolve(createGenericResult(true, result));
          },
          onFailure: function (err) {
            reject(err);
          },
        },
      );
    });
  }

  async signOut(token: string): Promise<GenericResult> {
    await this.providerClient.send(
      new GlobalSignOutCommand({
        AccessToken: token,
      }),
    );

    return createGenericResult(true);
  }

  async getUserByToken(token: string): Promise<UserData> {
    const response = await this.providerClient.send(
      new GetUserCommand({
        AccessToken: token,
      }),
    );

    const user = new UserDataCognito(response);

    return user.data;
  }

  async getUser(email: string): Promise<UserData> {
    const cognitoUser = this.getCognitoUser(email);

    return new Promise((resolve, reject) => {
      return cognitoUser.getUserData(async (err, result) => {
        if (err) {
          try {
            const user = await this.providerClient.send(
              new AdminGetUserCommand({
                UserPoolId: this.configService.get<string>(
                  'AWS_COGNITO_USER_POOL_ID',
                ),
                Username: email,
              }),
            );
            resolve(new UserDataCognito(user).data);
          } catch (error) {
            reject(err);
          }
        } else {
          const user = new UserDataCognito(result);
          resolve(user.data);
        }
      });
    });
  }

  async changePassword(
    token,
    oldPassword,
    newPassword,
  ): Promise<GenericResult> {
    await this.providerClient.send(
      new ChangePasswordCommand({
        AccessToken: token,
        PreviousPassword: oldPassword,
        ProposedPassword: newPassword,
      }),
    );

    return createGenericResult(true);
  }

  async refreshToken(refreshToken: string): Promise<AuthToken> {
    const authParams = {
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };

    return new Promise((resolve, reject) => {
      return this.serviceProvider.initiateAuth(authParams, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(
          createAuthObject(
            result.AuthenticationResult.AccessToken,
            result.AuthenticationResult.RefreshToken,
          ),
        );
      });
    });
  }

  async generateTOTPSecret(token: string): Promise<string> {
    const response = await this.providerClient.send(
      new AssociateSoftwareTokenCommand({
        AccessToken: token,
      }),
    );

    return response.SecretCode;
  }

  async resendEmail(email: string): Promise<DeliveryInfo> {
    const response = await this.providerClient.send(
      new ResendConfirmationCodeCommand({
        Username: email,
        ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
      }),
    );

    return createForgotPasswordDeliveryInfo(
      response.CodeDeliveryDetails.DeliveryMedium,
      response.CodeDeliveryDetails.Destination,
    );
  }

  async verifyCode(
    user: string,
    session: string,
    code: string,
    challengeName: ChallengeNameType = ChallengeNameType.SOFTWARE_TOKEN_MFA,
  ): Promise<AuthToken> {
    let codeConfig: { [key: string]: string };

    if (challengeName === ChallengeNameType.SMS_MFA) {
      codeConfig = {
        SMS_MFA_CODE: code,
      };
    }

    if (challengeName === ChallengeNameType.SOFTWARE_TOKEN_MFA) {
      codeConfig = {
        SOFTWARE_TOKEN_MFA_CODE: code,
      };
    }

    const response = await this.serviceProvider.respondToAuthChallenge({
      ChallengeName: challengeName,
      ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
      ChallengeResponses: {
        USERNAME: user,
        ...codeConfig,
      },
      Session: session,
    });

    return createAuthObject(
      response.AuthenticationResult.AccessToken,
      response.AuthenticationResult.RefreshToken,
      response.Session,
      response.ChallengeParameters.USER_ID_FOR_SRP,
    );
  }

  async enableTOTPMfa(
    token: string,
    device: string,
    code: string,
  ): Promise<GenericResult> {
    const response = await this.providerClient.send(
      new VerifySoftwareTokenCommand({
        AccessToken: token,
        FriendlyDeviceName: device,
        UserCode: code,
      }),
    );

    if (response.Status === 'SUCCESS') {
      await this.providerClient.send(
        new SetUserMFAPreferenceCommand({
          AccessToken: token,
          SoftwareTokenMfaSettings: {
            Enabled: true,
            PreferredMfa: true,
          },
        }),
      );

      return createGenericResult(true);
    }
    return createGenericResult(false);
  }

  async disableTOTPMfa(token: string): Promise<GenericResult> {
    await this.providerClient.send(
      new SetUserMFAPreferenceCommand({
        AccessToken: token,
        SoftwareTokenMfaSettings: {
          Enabled: false,
          PreferredMfa: false,
        },
      }),
    );

    return createGenericResult(true);
  }

  async verifyUserAttribute(
    token: string,
    attributeName: string,
    code: string,
  ) {
    return await this.providerClient.send(
      new VerifyUserAttributeCommand({
        AccessToken: token,
        AttributeName: attributeName,
        Code: code,
      }),
    );
  }

  async getSMSMfa(token: string): Promise<DeliveryInfo> {
    const response = await this.providerClient.send(
      new GetUserAttributeVerificationCodeCommand({
        AccessToken: token,
        AttributeName: 'phone_number',
      }),
    );

    return createForgotPasswordDeliveryInfo(
      response.CodeDeliveryDetails.DeliveryMedium,
      response.CodeDeliveryDetails.Destination,
    );
  }

  async enableSMSMfa(token: string, code: string): Promise<GenericResult> {
    try {
      await this.verifyUserAttribute(token, 'phone_number', code);

      await this.providerClient.send(
        new SetUserMFAPreferenceCommand({
          AccessToken: token,
          SMSMfaSettings: {
            Enabled: true,
            PreferredMfa: true,
          },
        }),
      );

      return createGenericResult(true);
    } catch (error) {
      return createGenericResult(false, error.message);
    }
  }

  async disableSMSMfa(token: string): Promise<GenericResult> {
    await this.providerClient.send(
      new SetUserMFAPreferenceCommand({
        AccessToken: token,
        SMSMfaSettings: {
          Enabled: false,
          PreferredMfa: false,
        },
      }),
    );

    return createGenericResult(true);
  }

  async healthCheck(): Promise<GenericResult> {
    try {
      await this.userPool.getClientId();
      return createGenericResult(true);
    } catch (error) {
      return createGenericResult(false, error.message);
    }
  }
}
