import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrganizationMemberRole } from 'src/common/@types/organization';

export class UpdateMemberDto {
  @ApiProperty({
    description: 'The role of the member',
    enum: OrganizationMemberRole,
    example: OrganizationMemberRole.ADMIN,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(OrganizationMemberRole)
  role: OrganizationMemberRole;
}
