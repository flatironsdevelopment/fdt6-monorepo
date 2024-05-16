import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmInvitationDto {
  @ApiProperty({
    description: 'The token of the invitation',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
