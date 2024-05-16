import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationMember } from 'src/common/database/entities/organization-member.entity';
import { Organization } from 'src/common/database/entities/organization.entity';
import { UserModule } from 'src/common/modules/user/user.module';
import { OrganizationsMembersController } from './members.controller';
import { OrganizationsMembersService } from './members.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Organization, OrganizationMember]),
  ],
  controllers: [OrganizationsMembersController],
  providers: [OrganizationsMembersService],
})
export class OrganizationsMembersModule {}
