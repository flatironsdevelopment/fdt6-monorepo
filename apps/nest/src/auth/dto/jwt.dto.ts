import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsJWT, IsNotEmpty } from 'class-validator';
import { CommonRequestHeader } from '../../common/constants/request';

export class JwtTokenDto {
  @ApiProperty({
    description: 'Jwt access token.',
    type: String,
  })
  @IsJWT()
  @IsNotEmpty()
  @IsDefined()
  @Expose({
    name: CommonRequestHeader.AUTHORIZATION.toLowerCase(),
  })
  [CommonRequestHeader.AUTHORIZATION]: string;
}
