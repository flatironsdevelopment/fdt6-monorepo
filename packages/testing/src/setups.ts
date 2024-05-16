import { faker } from '.'
import * as mocks from './mocks/aws/cognito.mock'

export const mockCognitoDependencies = () => {
  jest.mock('@aws-sdk/client-cognito-identity-provider', () => {
    return {
      AuthFlowType: {
        ADMIN_NO_SRP_AUTH: 'ADMIN_NO_SRP_AUTH',
        ADMIN_USER_PASSWORD_AUTH: 'ADMIN_USER_PASSWORD_AUTH',
        CUSTOM_AUTH: 'CUSTOM_AUTH',
        REFRESH_TOKEN: 'REFRESH_TOKEN',
        REFRESH_TOKEN_AUTH: 'REFRESH_TOKEN_AUTH',
        USER_PASSWORD_AUTH: 'USER_PASSWORD_AUTH',
        USER_SRP_AUTH: 'USER_SRP_AUTH'
      },
      ChallengeNameType: {
        ADMIN_NO_SRP_AUTH: 'ADMIN_NO_SRP_AUTH',
        CUSTOM_CHALLENGE: 'CUSTOM_CHALLENGE',
        DEVICE_PASSWORD_VERIFIER: 'DEVICE_PASSWORD_VERIFIER',
        DEVICE_SRP_AUTH: 'DEVICE_SRP_AUTH',
        MFA_SETUP: 'MFA_SETUP',
        NEW_PASSWORD_REQUIRED: 'NEW_PASSWORD_REQUIRED',
        PASSWORD_VERIFIER: 'PASSWORD_VERIFIER',
        SELECT_MFA_TYPE: 'SELECT_MFA_TYPE',
        SMS_MFA: 'SMS_MFA',
        SOFTWARE_TOKEN_MFA: 'SOFTWARE_TOKEN_MFA'
      },
      CognitoIdentityProvider: class {
        initiateAuth(params: any, callback: Function) {
          if (
            params.AuthFlow === 'REFRESH_TOKEN_AUTH' &&
            params.AuthParameters.REFRESH_TOKEN === 'invalid-refresh-token'
          ) {
            return callback(new Error('REFRESH_TOKEN_AUTH_ERROR'), null)
          }

          if (params.AuthParameters.PASSWORD === 'wrong-password') {
            return callback(new Error('WRONG_PASSWORD'), null)
          }

          callback(null, mocks.REFRESH_TOKEN_RESPONSE)
        }
        async respondToAuthChallenge(params: any) {
          if (params.Session === 'wrong-session') {
            throw new Error('WRONG_SESSION')
          }

          if (params.ChallengeResponses.USERNAME === 'wrong-username') {
            throw new Error('WRONG_USERNAME')
          }

          if (
            params.ChallengeResponses.SOFTWARE_TOKEN_MFA_CODE === 'wrong-code'
          ) {
            throw new Error('WRONG_SECRET_HASH')
          }

          return mocks.REFRESH_TOKEN_RESPONSE
        }
      },
      CognitoIdentityProviderClient: class {
        async send(object: any) {
          return object
        }
      },
      ChangePasswordCommand: class {
        constructor() {
          return mocks.CHANGE_PASSWORD_RESPONSE
        }
      },
      GetUserCommand: class {
        constructor() {
          return mocks.GET_USER_RESPONSE.user
        }
      },
      GlobalSignOutCommand: class {
        constructor() {
          return mocks.SIGN_OUT_RESPONSE
        }
      },
      AssociateSoftwareTokenCommand: class {
        constructor({ AccessToken }: { AccessToken: string }) {
          return { SecretCode: AccessToken }
        }
      },
      VerifySoftwareTokenCommand: class {
        constructor() {
          return { ...mocks.REFRESH_TOKEN_RESPONSE, Status: 'SUCCESS' }
        }
      },
      SetUserMFAPreferenceCommand: class {
        constructor() {
          return mocks.CHANGE_PASSWORD_RESPONSE
        }
      },
      ResendConfirmationCodeCommand: class {
        constructor() {
          return mocks.FORGOT_PASSWORD_REQUEST_RESPONSE
        }
      },
      VerifyUserAttributeCommand: class {
        constructor() {
          return
        }
      },
      GetUserAttributeVerificationCodeCommand: class {
        constructor() {
          return mocks.FORGOT_PASSWORD_REQUEST_RESPONSE
        }
      }
    }
  })

  jest.mock('amazon-cognito-identity-js', () => {
    return {
      AuthenticationDetails: class {
        constructor(properties: any) {
          return properties
        }
      },
      CognitoUser: class {
        data: any
        constructor(properties: any) {
          this.data = {
            Username: faker.create.string.uuid(),
            UserAttributes: [
              {
                Name: 'email',
                Value: faker.create.internet.email()
              },
              {
                Name: 'given_name',
                Value: faker.create.person.firstName()
              },
              {
                Name: 'family_name',
                Value: faker.create.person.lastName()
              },
              {
                Name: 'email_verified',
                Value: 'true'
              }
            ],
            ...properties
          }
          return this
        }
        authenticateUser(
          params: any,
          { onSuccess, onFailure }: { onSuccess: Function; onFailure: Function }
        ) {
          if (params.Password === 'wrong-password') {
            return onFailure(new Error('WRONG_PASSWORD'))
          }

          return onSuccess(mocks)
        }
        confirmRegistration(
          verificationCode: string,
          forceAliasCreation: boolean,
          callback: Function
        ) {
          if (verificationCode === 'wrong-code') {
            return callback(new Error('WRONG_CODE'), null)
          }

          return callback(null, 'SUCCESS')
        }
        forgotPassword({
          onSuccess
        }: {
          onSuccess: Function
          onFailure: Function
        }) {
          return onSuccess(mocks.FORGOT_PASSWORD_REQUEST_RESPONSE)
        }
        confirmPassword(
          verificationCode: string,
          newPassword: string,
          {
            onSuccess,
            onFailure
          }: {
            onSuccess: Function
            onFailure: Function
          }
        ) {
          if (verificationCode === 'wrong-code') {
            return onFailure(new Error('WRONG_CODE'), null)
          }

          return onSuccess(null, 'SUCCESS')
        }
        getUserData(callback: Function) {
          return callback(null, mocks.GET_USER_RESPONSE.user)
        }
        getUsername() {
          return this.data.Username
        }
      },
      CognitoUserAttribute: class {
        constructor(params: any) {
          return params
        }
      },
      CognitoUserPool: class {
        constructor(params: any) {
          return this
        }

        signUp(
          email: string,
          password: string,
          attributes: any,
          validationData: any,
          callback: Function
        ) {
          return callback(null, mocks.SIGN_UP_RESPONSE)
        }

        signIn(
          email: string,
          password: string,
          attributes: any,
          validationData: any,
          callback: Function
        ) {
          return callback(null, mocks.SIGN_IN_RESPONSE)
        }

        getClientId() {
          return faker.create.string.uuid()
        }
      },
      CognitoUserSession: class {
        constructor() {}
        getIdToken() {
          return {
            getJwtToken: faker.create.string.uuid()
          }
        }
        getRefreshToken() {
          return {
            getToken: faker.create.string.uuid()
          }
        }
        getAccessToken() {
          return {
            getJwtToken: faker.create.string.uuid()
          }
        }
        isValid() {
          return true
        }
      }
    }
  })
}
