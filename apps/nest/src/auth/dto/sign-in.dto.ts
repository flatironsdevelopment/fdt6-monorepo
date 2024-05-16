import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { AuthToken } from 'src/common/modules/auth/providers/base.interfaces';
import { User } from '~types';

export class SignInDto {
  @ApiProperty({
    description: 'Email of the user that is logging in.',
    example: 'example@flatiros.com',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user that is logging in.',
    example: '$3cr3tP4$$w0rd',
    type: String,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class SignOutDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Access token to be log out.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.asdf.asdf',
    type: String,
  })
  accessToken: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Token to renew the token when the session ends.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.asdf.asdf',
    type: String,
  })
  token: string;
}

export class AuthTokenResponse implements AuthToken {
  @ApiProperty({
    description: 'Access token to be used in the Authorization header.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.asdf.asdf',
    type: String,
    required: false,
  })
  accessToken?: string;

  @ApiProperty({
    description: 'Token to renew the token when the session ends.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.asdf.asdf',
    type: String,
    required: false,
  })
  refreshToken?: string;

  @ApiProperty({
    description: 'The session to be send when a challenge is created',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    type: String,
    required: false,
  })
  session?: string;

  @ApiProperty({
    description: 'Id of the user that is logged in.',
    example: '0a932064-e1b4-45f1-bd74-62b6dff5b8fb',
    type: String,
    required: false,
  })
  userId?: string;

  @ApiProperty({
    description: 'Name of the challenge that is required to be solved.',
    example: 'SMS_MFA',
    type: String,
    required: false,
  })
  challengeName?: string;
}

export class SessionUser implements User {
  @ApiProperty({
    description: 'Id of the user.',
    example: '0a932064-e1b4-45f1-bd74-62b6dff5b8fb',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Name of the user.',
    example: 'John',
    type: String,
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user.',
    example: 'Doe',
    type: String,
  })
  lastName: string;

  @ApiProperty({
    description: 'Email of the user.',
    example: '@flatirons.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Phone number of the user.',
    example: '+12345678900',
    type: String,
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'If the email is verified.',
    example: true,
    type: Boolean,
    required: false,
  })
  emailVerified?: boolean;

  @ApiProperty({
    description: 'If the phone number is verified.',
    example: true,
    type: Boolean,
    required: false,
  })
  phoneNumberVerified?: boolean;

  @ApiProperty({
    description: 'MFA configuration of the user.',
    example: {
      preferredSetting: 'SMS_MFA',
      settingList: ['SMS_MFA', 'SOFTWARE_TOKEN_MFA'],
    },
    type: Object,
    required: false,
  })
  mfaConfig?: {
    preferredSetting: string;
    settingList: string[];
  };
}
