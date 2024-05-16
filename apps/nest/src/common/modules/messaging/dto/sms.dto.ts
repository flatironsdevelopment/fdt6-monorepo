import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SmsDataType, SmsType } from '../sms/sms.constants';

type AccountCreatedCode = SmsDataType[SmsType.ACCOUNT_CREATED_CODE];
type ForgotPasswordCode = SmsDataType[SmsType.FORGOT_PASSWORD_CODE];
type VerifyAccountCode = SmsDataType[SmsType.RESEND_SMS_CODE];

interface IAccountCreatedCode extends Omit<AccountCreatedCode, 'phone'> {}
interface IForgotPasswordCode extends Omit<ForgotPasswordCode, 'phone'> {}
interface IVerifyAccountCode extends Omit<VerifyAccountCode, 'phone'> {}

export class EmptyDto {}

export class AccountCreatedCodeDto implements IAccountCreatedCode {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  code: string;
}
export class ForgotPasswordCodeDto implements IForgotPasswordCode {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  code: string;
}
export class VerificationCodeDto implements IVerifyAccountCode {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  code: string;
}

export class SendSmsDto {
  @ApiProperty({
    description: 'phone number of the recipient',
    example: '+12223334444',
  })
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty({
    description: 'The template used for the sms to be sent',
    enum: SmsType,
  })
  @IsString()
  @Transform((param) => param.value.toLowerCase())
  @IsEnum(SmsType)
  template: SmsType;

  @ApiProperty({
    description: 'Data used in the email template',
    discriminator: {
      propertyName: 'template',
      mapping: {
        [SmsType.ACCOUNT_CREATED_CODE]: typeof AccountCreatedCodeDto,
        [SmsType.FORGOT_PASSWORD_CODE]: typeof ForgotPasswordCodeDto,
        [SmsType.RESEND_SMS_CODE]: typeof VerificationCodeDto,
        [SmsType.UPDATE_PHONE_NUMBER_CODE]: typeof VerificationCodeDto,
        [SmsType.VERIFY_PHONE_NUMBER_CODE]: typeof VerificationCodeDto,
        [SmsType.AUTHENTICATION_CODE]: typeof VerificationCodeDto,
      },
    },
    oneOf: [
      { $ref: getSchemaPath(AccountCreatedCodeDto) },
      { $ref: getSchemaPath(ForgotPasswordCodeDto) },
      { $ref: getSchemaPath(VerificationCodeDto) },
    ],
    default: {},
  })
  @IsObject()
  @ValidateNested()
  @Type(({ object }) => {
    switch (object.template) {
      case SmsType.ACCOUNT_CREATED_CODE:
        return AccountCreatedCodeDto;
      case SmsType.FORGOT_PASSWORD_CODE:
        return ForgotPasswordCodeDto;
      case SmsType.RESEND_SMS_CODE:
      case SmsType.UPDATE_PHONE_NUMBER_CODE:
      case SmsType.VERIFY_PHONE_NUMBER_CODE:
      case SmsType.AUTHENTICATION_CODE:
        return VerificationCodeDto;
      default:
        return EmptyDto;
    }
  })
  data: AccountCreatedCodeDto | ForgotPasswordCodeDto | VerificationCodeDto;
}
