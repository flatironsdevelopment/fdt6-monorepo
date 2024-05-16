import {
  OrganizationInvitationStatus,
  OrganizationMemberRole,
} from 'src/common/@types/organization';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationMemberRoleColumn } from '../@types/columns';

@Entity('organization_invitation')
@Unique(['organizationId', 'email'])
export class OrganizationInvitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'organization_id',
  })
  organizationId: string;

  @Column({
    name: 'email',
  })
  email: string;

  @Column({
    name: 'status',
    enumName: 'organization_invitation_status',
  })
  status: OrganizationInvitationStatus;

  @OrganizationMemberRoleColumn({
    name: 'role',
  })
  role: OrganizationMemberRole;

  @CreateDateColumn({
    name: 'created_at',
    default: 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: 'now()',
  })
  updatedAt: Date;
}
