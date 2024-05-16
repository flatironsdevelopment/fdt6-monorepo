# Cognito

## Set Up

---

1. Go to the Amazon Cognito console:
   - Navigate to the AWS Management Console (https://console.aws.amazon.com/).
   - Find and select the "Amazon Cognito" service from the list of available services.
2. Choose User Pools:
   - Once in the Amazon Cognito console, select "Manage User Pools" to view existing user pools or create a new one.
3. Create a User Pool:
   - Click on the "Create a user pool" button to start the user pool creation wizard.
4. Configure Sign-in Experience:
   - Select `Email` as Cognito user pool sign-in options.
5. Configure Security Requirements:
   - Define the password policy for user accounts. Cognito Defaults it's okay.
   - Select `Optional` for multi-factor authentication (MFA) requirements.
   - Select `Authenticator Apps` and `SMS Message` for MFA methods.
   - Enable `Self-service account recoveryInfo`, and Select `Email if available, otherwise SMS` for User account recovery.
6. Configure Sign-up Experience:

   - Enable Self-registration
   - Cognito-assisted verification and confirmation
     - Allow Cognito to automatically send messages to verify and confirm - Recommended.
     - `Send email message, verify email address` for Attributes to verify.
   - Verifying attribute changes
     - Disable Keep original attribute value active when an update is pending - Recommended.
   - Required attributes

     - Select Additional required attributes.
       - Recommended:
         - `given_name`
         - `family_name`
         - `email`
         - `phone_number`

   - Add Custom attributes - optional

7. Configure message delivery:
   - Email
     - `Send email with Cognito` as the Email provider, we'll be setting up this later.
   - SMS
     - `Create a new IAM role` for the IAM role.
     - Add an IAM role name.
8. Integrate your app:
   - Enter an User pool name
   - Initial app client:
     - `Public client` as App type.
     - Add an App client name
     - `Don't generate a client secret` for Client secret
   - Advanced app client settings:
     - Add the following flows
       - ALLOW_CUSTOM_AUTH
       - ALLOW_REFRESH_TOKEN_AUTH
       - ALLOW_USER_PASSWORD_AUTH
       - ALLOW_USER_SRP_AUTH
     - Setup the token expiration
9. Save and Create the User Pool:
   - Review the configurations made for the user pool.
   - Once you've configured all the necessary settings, proceed to create the user pool.

With this, you can test the basic flows:

- Sign Up and all it's related endpoints
- Sign In and all it's related endpoints
- TOTP 2FA and all it's related endpoints

To enable custom emails and SMS-based two-factor authentication (2FA) in Amazon Cognito, follow the next section.

## Custom Emails and SMS provider

---

1. Go to [cognito console](https://us-east-2.console.aws.amazon.com/cognito/v2/idp/user-pools?region=us-east-2)
2. Select User pool properties
3. Add Lambda trigger
   - Create Lambda function
     - Create function
       - Provide a name
       - Select Node.js 18.x as runtime
     - Go to Code and in Code Source
       - Click `Upload From`
         - Select `.zip File`
         - Generate the zip file following this repo:
           - <https://github.com/flatironsdevelopment/cognito-lambda-trigger-fn/tree/main>
4. Go to the [Key Management Console](http://console.aws.amazon.com/kms)
5. Select Customer-managed keys
   - Create key
     - Configure key
       - `Symmetric` for Key type
       - `Encrypt and decrypt` for Key usage
     - Add labels
       - add an Alias
     - Define key administrative permissions
       - Search and Select for your lambda function
     - Define key usage permissions
       - Search and Select for your lambda function
     - Review and Create
   - Go to the recently create key
     - Keep the tab opened
6. Go to your Lambda Function
   - Go to configuration
   - Select Environment variables
     - Add the following Environment Variables
       - API_KEY_HEADER
         - Same value that the one in the backend env variables
       - API_KEY_HEADER_KEY
         - Header name `x-api-key`
       - API_URL
         - Production, Staging or Development Api URL
         - For development you can expose your localhost `lt --port 3000 --subdomain fuel-dev-test-random_str`
       - KEY_ALIAS
         - Alias of the key
         - Copy the ARN and remove the `key` part and replace it with `alias/NAME-OF-THE-KEY`
         - `arn:aws:kms:us-west-4:552018944901:alias/NAME-OF-THE-KEY`
           - ex.: `arn:aws:kms:us-west-4:552018944901:alias/monorepo-docs`
       - KEY_ARN
         - Arn of the key
         - `arn:aws:kms:us-west-4:552018944901:key/f90111b1-df6c-549b-b049-2ef514e14d08`
     - Go to Permissions
       - In Resource-based policy statements
         - Add permissions
           - Select AWS Service
             - Select Cognito Sync Trigger
               - `InvokePermission` as Statement Id.
               - `cognito-idp.amazonaws.com` as Principal.
               - User Pool ARN as Source ARN.
               - `lambda:InvokeFunction` as Action.
7. In your terminal run the follow command:
   - Replace `LAMBDA-FUNCTION-ARN` with the lambda function arn.
   - Replace `KEY-ARN` with the key arn.
   - Replace `COGNITO-USER-POOL-ID` with the user pool id.

```bash
aws cognito-idp update-user-pool --lambda-config "PreSignUp=LAMBDA-FUNCTION-ARN,CustomMessage=LAMBDA-FUNCTION-ARN,PostConfirmation=LAMBDA-FUNCTION-ARN,PreAuthentication=LAMBDA-FUNCTION-ARN,PostAuthentication=LAMBDA-FUNCTION-ARN,DefineAuthChallenge=LAMBDA-FUNCTION-ARN,CreateAuthChallenge=LAMBDA-FUNCTION-ARN,VerifyAuthChallengeResponse=LAMBDA-FUNCTION-ARN,PreTokenGeneration=LAMBDA-FUNCTION-ARN,CustomSMSSender={LambdaVersion=V1_0,LambdaArn=LAMBDA-FUNCTION-ARN},CustomEmailSender={LambdaVersion=V1_0,LambdaArn=LAMBDA-FUNCTION-ARN},KMSKeyID=KEY-ARN" --user-pool-id "COGNITO-USER-POOL-ID" --auto-verified-attributes "email"
```

This enables trigger functions for

- Sign Up
  - Pre sign-up trigger
  - Post confirmation trigger
- Authentication
  - Pre authentication trigger
  - Post authentication trigger
- Custom authentication
  - Define auth challenge
  - Create auth challenge
  - Verify auth challenge response
- Messaging
  - Custom message trigger
  - Custom SMS trigger
  - Custom EMAIL trigger

## Environment Variables

---

In your .env file, you need to define:

```bash
AWS_COGNITO_USER_POOL_ID=
AWS_COGNITO_CLIENT_ID=
AWS_REGION=
APP_COMPANY=
```
