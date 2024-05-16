import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { UserData, UserModel } from '../../../../models/user.model';

export const createCustomAttribute = (field, value) => {
  return {
    [`custom:${field}`]: value,
  };
};

export const generateCustomAttributesArray = (
  attributes: any,
): CognitoUserAttribute[] => {
  const customAttributes = [];
  for (const [key, value] of Object.entries(attributes)) {
    customAttributes.push(
      new CognitoUserAttribute({
        Name: key,
        Value: typeof value === 'object' ? JSON.stringify(value) : `${value}`,
      }),
    );
  }
  return customAttributes;
};

export class UserDataCognito implements UserModel {
  data: UserData;

  constructor(data: any) {
    this.data = this.mapToUser(data);
  }

  mapToUser(data: any): UserData {
    return {
      id: data.Username,
      email: data.UserAttributes.find((attr) => attr.Name === 'email').Value,
      firstName: data.UserAttributes.find((attr) => attr.Name === 'given_name')
        ?.Value,
      lastName: data.UserAttributes.find((attr) => attr.Name === 'family_name')
        ?.Value,
      emailVerified:
        data.UserAttributes.find((attr) => attr.Name === 'email_verified')
          ?.Value === 'true',
      phoneNumber: data.UserAttributes.find(
        (attr) => attr.Name === 'phone_number',
      )?.Value,
      phoneNumberVerified:
        data.UserAttributes.find(
          (attr) => attr.Name === 'phone_number_verified',
        )?.Value === 'true',
      mfaConfig: {
        preferredSetting: data.PreferredMfaSetting,
        settingList: data.UserMFASettingList,
      },
    };
  }
}
