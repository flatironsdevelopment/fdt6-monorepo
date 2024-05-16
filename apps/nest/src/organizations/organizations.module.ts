import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationMember } from 'src/common/database/entities/organization-member.entity';
import { Organization } from 'src/common/database/entities/organization.entity';
import { UserModule } from 'src/common/modules/user/user.module';
import { OrganizationInvitationsModule } from './invitations/invitations.module';
import { OrganizationsMembersModule } from './members/members.module';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsListener } from './organizations.listener';
import { OrganizationsService } from './organizations.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Organization, OrganizationMember]),
    OrganizationInvitationsModule,
    OrganizationsMembersModule,
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationsListener],
})
export class OrganizationsModule {}
