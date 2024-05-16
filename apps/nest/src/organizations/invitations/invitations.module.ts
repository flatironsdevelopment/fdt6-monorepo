import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationInvitation } from 'src/common/database/entities/organization-invitation.entity';
import { OrganizationMember } from 'src/common/database/entities/organization-member.entity';
import { Organization } from 'src/common/database/entities/organization.entity';
import { UserModule } from 'src/common/modules/user/user.module';
import { EncryptionService } from 'src/common/services/encryption.service';
import { OrganizationInvitationsController } from './invitations.controller';
import { OrganizationInvitationsService } from './invitations.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      Organization,
      OrganizationMember,
      OrganizationInvitation,
    ]),
  ],
  controllers: [OrganizationInvitationsController],
  providers: [EncryptionService, OrganizationInvitationsService],
})
export class OrganizationInvitationsModule {}
