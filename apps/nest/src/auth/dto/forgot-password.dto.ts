import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { DeliveryInfo } from 'src/common/modules/auth/providers/base.interfaces';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email of the user that is logging in.',
    example: 'example@flatiros.com',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ConfirmForgotPasswordDto {
  @ApiProperty({
    description: 'Email of the user that is resetting the password.',
    example: 'example@flatiros.com',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'New password for the user.',
    example: '$3cr3tP4$$w0rd',
    type: String,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Code to confirm the forgot password.',
    example: '111222',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Old password of the user.',
    example: '$3cr3tP4$$w0rd',
    type: String,
  })
  @IsNotEmpty()
  @MinLength(8)
  oldPassword: string;

  @ApiProperty({
    description: 'New password of the user.',
    example: '$3cr3tP4$$w0rd',
    type: String,
  })
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}

export class DeliveryInfoResponse implements DeliveryInfo {
  @ApiProperty({
    description: 'Delivery medium of the code.',
    example: 'EMAIL',
    type: String,
  })
  medium: string;

  @ApiProperty({
    description: 'Destination of the code.',
    example: '***@***.com',
    type: String,
  })
  destination: string;
}
