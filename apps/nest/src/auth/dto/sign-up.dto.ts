import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'Name of the user.',
    example: 'John',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user.',
    example: 'Doe',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Email of the user.',
    example: 'email@flatirons.com',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user.',
    example: '$3cr3tP4$$w0rd',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Phone number of the user.',
    example: '+12345678900',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Name of the organization.',
    example: 'Flatirons',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organizationName?: string;
}

export class ResendEmailCodeDto {
  @ApiProperty({
    description: 'Email of the user.',
    example: 'email@flatirons.com',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ConfirmSignUpDto {
  @ApiProperty({
    description: 'Email of the user.',
    example: 'email@flatirons.com',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Code to confirm the sign Up.',
    example: '111222',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}
