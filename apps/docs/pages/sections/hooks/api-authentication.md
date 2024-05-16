# API Authentication

The API Authentication module serves as the central component for managing authentication within your application. It encapsulates all the necessary logic required for authentication processes, including sign-in, sign-up, two-factor authentication (2FA), and password recovery flows.

## Provider

To utilize the authentication functionality provided by the API Authentication module, you need to wrap your application components with the `AuthProvider` component. This component establishes the authentication context and makes authentication-related functionality accessible throughout your application.

```javascript
import { AuthProvider } from 'api-authentication'

// Your application component code...

return <AuthProvider>{/* Your application components */}</AuthProvider>
```

By integrating the `AuthProvider` component into your application, you gain access to a suite of authentication-related features, allowing you to seamlessly manage authentication processes and user sessions within your application.

## `useAuthContext()`

The `useAuthContext()` hook is a powerful tool for accessing all authentication methods and data provided by the API Authentication module. It returns an object containing various methods and states related to authentication. Here's the structure of the returned object:

```javascript
const {} = useAuthContext()
```

### Session Token Related Token

```javascript
const {
  // Token related methods
  token,
  refreshToken,
  getNewAccessToken,
  refreshTokenState
} = useAuthContext()
```

### Registration

```javascript
const {
  // Creating account related methods
  signUp,
  signUpState,
  confirmSignUp,
  confirmSignUpState,
  resendSignUpEmail,
  resendSignUpEmailState
} = useAuthContext()
```

### Recovery

```javascript
const {
  // Password related methods
  forgotPassword,
  forgotPasswordState,
  forgotPasswordSubmit,
  forgotPasswordSubmitState,
  changePassword,
  changePasswordState
} = useAuthContext()
```

### Session

```javascript
const {
  // Sign in/out related methods
  signIn,
  signInState,
  signOut,
  signOutState,
  getUser,
  userState
} = useAuthContext()
```

### 2FA

#### SMS

```javascript
const {
  // 2FA SMS related methods
  getSMSCode,
  getSmsCodeState,
  enableSMSMfa,
  enableSMSMfaState,
  disableSMSMfa,
  disableSMSMfaState,
  verifySms,
  verifySmsState
} = useAuthContext()
```

#### TOTP (QR code)

```javascript
const {
  // 2FA TOTP related methods
  getTOTPQRCode,
  getTOTPQRCodeState
  enableTOTPMfa,
  enableTOTPState,
  disableTOTPMfa,
  disableTOTPState,
  verifyTOTP,
  verifyTOTPState,
} = useAuthContext()
```

This comprehensive set of methods and states allows you to interact with various authentication features, such as obtaining tokens, signing in/out users, changing passwords, managing multi-factor authentication (MFA), and handling user-related operations.

```javascript
import { useAuthContext } from 'api-authentication'

const MyComponent = () => {
  const authContext = useAuthContext()

  // Example usage:
  const signIn = async () => {
    await authContext.signIn('username', 'password')
  }

  return (
    <>
      {authContext.signInState.loading ? <LoadingIndicator /> : null}
      // Your component JSX
    </>
  )
}
```
