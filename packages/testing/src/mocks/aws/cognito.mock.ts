import { faker as fakerFactory } from '../../index'

const faker = fakerFactory.create

export const REFRESH_TOKEN_RESPONSE = {
  $metadata: {
    httpStatusCode: 200,
    requestId: faker.string.uuid(),
    attempts: 1,
    totalRetryDelay: 0
  },
  AuthenticationResult: {
    AccessToken: faker.string.uuid(),
    ExpiresIn: 3600,
    IdToken: faker.string.uuid(),
    TokenType: 'Bearer'
  },
  ChallengeParameters: {}
}

export const CHANGE_PASSWORD_RESPONSE = {
  $metadata: {
    httpStatusCode: 200,
    requestId: faker.string.uuid(),
    attempts: 1,
    totalRetryDelay: 0
  }
}

export const GET_USER_RESPONSE = {
  user: {
    $metadata: {
      httpStatusCode: 200,
      requestId: faker.string.uuid(),
      attempts: 1,
      totalRetryDelay: 0
    },
    UserAttributes: [
      {
        Name: 'sub',
        Value: faker.string.uuid()
      },
      {
        Name: 'email_verified',
        Value: 'true'
      },
      {
        Name: 'given_name',
        Value: faker.person.firstName()
      },
      {
        Name: 'family_name',
        Value: faker.person.lastName()
      },
      {
        Name: 'email',
        Value: faker.internet.email()
      }
    ],
    Username: faker.string.uuid()
  }
}

export const SIGN_OUT_RESPONSE = {
  $metadata: {
    httpStatusCode: 200,
    requestId: faker.string.uuid(),
    attempts: 1,
    totalRetryDelay: 0
  }
}

export const SIGN_IN_RESPONSE = {
  idToken: {
    jwtToken: faker.string.uuid(),
    payload: {
      sub: faker.string.uuid(),
      email_verified: true,
      iss: faker.internet.url(),
      'cognito:username': faker.string.uuid(),
      given_name: 'John',
      origin_jti: faker.string.uuid(),
      aud: faker.string.nanoid(),
      event_id: faker.string.uuid(),
      token_use: 'id',
      auth_time: 1701354922,
      exp: 1701358522,
      iat: 1701354922,
      family_name: 'Doe',
      jti: faker.string.uuid(),
      email: faker.internet.email()
    }
  },
  refreshToken: {
    token: faker.string.uuid()
  },
  accessToken: {
    jwtToken: faker.string.uuid(),
    payload: {
      sub: faker.string.uuid(),
      iss: faker.internet.url(),
      client_id: faker.string.nanoid(),
      origin_jti: faker.string.uuid(),
      event_id: faker.string.uuid(),
      token_use: 'access',
      scope: 'aws.cognito.signin.user.admin',
      auth_time: 1701354922,
      exp: 1701358522,
      iat: 1701354922,
      jti: faker.string.uuid(),
      username: faker.string.uuid()
    }
  },
  clockDrift: 0
}

export const FORGOT_PASSWORD_REQUEST_RESPONSE = {
  CodeDeliveryDetails: {
    AttributeName: 'email',
    DeliveryMedium: 'EMAIL',
    Destination: 'r***@f***'
  }
}

export const SIGN_UP_RESPONSE = {
  user: {
    username: faker.internet.email(),
    pool: {
      userPoolId: faker.string.nanoid(),
      clientId: faker.string.nanoid(),
      client: {
        endpoint: faker.internet.url(),
        fetchOptions: {}
      },
      advancedSecurityDataCollectionFlag: true
    },
    Session: null,
    client: {
      endpoint: faker.internet.url(),
      fetchOptions: {}
    },
    signInUserSession: null,
    authenticationFlowType: 'USER_SRP_AUTH',
    keyPrefix: faker.string.nanoid(),
    userDataKey: faker.string.nanoid(),
    getUsername: () => faker.internet.email()
  },
  userConfirmed: false,
  userSub: faker.string.uuid(),
  codeDeliveryDetails: {
    AttributeName: 'email',
    DeliveryMedium: 'EMAIL',
    Destination: 'r***@f***'
  }
}
