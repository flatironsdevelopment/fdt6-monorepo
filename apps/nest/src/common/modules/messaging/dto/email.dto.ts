import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MailDataType, MailTemplates } from '../mail/mail.constants';

type AccountCreated = MailDataType[MailTemplates.ACCOUNT_CREATED];

interface IAccountCreated extends Omit<AccountCreated, 'email'> {}

export class EmptyDto {}

export class AccountCreatedDto implements IAccountCreated {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  code: string;
}

export class SendEmailDto {
  @ApiProperty({
    description: 'Email address of the recipient',
    example: 'email@example.com',
  })
  @IsEmail()
  @IsString()
  to: string;

  @ApiProperty({
    description: 'The template used for the email to be sent',
    enum: MailTemplates,
  })
  @IsString()
  @Transform((param) => param.value.toLowerCase())
  @IsEnum(MailTemplates)
  template: MailTemplates;

  @ApiProperty({
    description: 'Data used in the email template',
    discriminator: {
      propertyName: 'template',
      mapping: {
        [MailTemplates.ACCOUNT_CREATED]: typeof AccountCreatedDto,
        [MailTemplates.RESEND_CODE]: typeof AccountCreatedDto,
      },
    },
    oneOf: [{ $ref: getSchemaPath(AccountCreatedDto) }],
    default: {},
  })
  @IsObject()
  @ValidateNested()
  @Type(({ object }) => {
    switch (object.template) {
      case MailTemplates.ACCOUNT_CREATED:
      case MailTemplates.RESEND_CODE:
        return AccountCreatedDto;
      default:
        return EmptyDto;
    }
  })
  data: AccountCreatedDto;
}
