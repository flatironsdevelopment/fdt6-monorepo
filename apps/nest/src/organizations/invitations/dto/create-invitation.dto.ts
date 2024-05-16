import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrganizationMemberRole } from 'src/common/@types/organization';

export class CreateInvitationDto {
  @ApiProperty({
    description: 'The email of the user to invite',
    example: 'test@flatirons.com',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The role of the user in the organization',
    enum: OrganizationMemberRole,
    example: OrganizationMemberRole.ADMIN,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(OrganizationMemberRole)
  role: OrganizationMemberRole;
}
