import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CommonRequestHeader } from '../../common/constants/request';
import { QRCodeType, TextQRCodeType } from '../../common/services/qr.service';

export class AuthorizationDto {
  @ApiProperty({
    description: 'Authentication jwt token',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.asdf.asdf',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Expose({
    name: CommonRequestHeader.AUTHORIZATION.toLowerCase(),
  })
  [CommonRequestHeader.AUTHORIZATION]: string;
}

export class UserDeviceDto extends AuthorizationDto {
  @ApiProperty({
    description: 'User device name',
    example: 'computer-123',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Expose({
    name: CommonRequestHeader.USER_DEVICE.toLowerCase(),
  })
  [CommonRequestHeader.USER_DEVICE]: string;
}

export class CodeDto {
  @ApiProperty({
    description: 'Code for 2fa.',
    example: '111222',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  code: string;
}

export class QRCodeDto {
  @ApiProperty({
    description: 'QR code type',
    example: QRCodeType.IMAGE,
    type: String,
    enum: QRCodeType,
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @IsEnum(QRCodeType)
  qrType: QRCodeType;

  @ApiProperty({
    description: 'QR code format, only required when qrType = text.',
    example: TextQRCodeType.UTF8,
    type: String,
    enum: TextQRCodeType,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @IsEnum(TextQRCodeType)
  qrFormat: TextQRCodeType;
}

export class VerifyCodeDto extends CodeDto {
  @ApiProperty({
    description: 'User id',
    example: '0a932064-e1b4-45f1-bd74-62b6dff5b8fb',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  user: string;

  @ApiProperty({
    description: 'Session generated at sign in',
    example: '0a932064-e1b4-45f1-bd74-62b6dff5b8fb',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  session: string;
}
