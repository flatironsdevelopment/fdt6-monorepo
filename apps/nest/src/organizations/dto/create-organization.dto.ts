import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Name of the organization.',
    example: 'Flatirons',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
