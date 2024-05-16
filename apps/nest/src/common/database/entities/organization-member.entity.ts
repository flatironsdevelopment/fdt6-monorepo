import { OrganizationMemberRole } from 'src/common/@types/organization';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationMemberRoleColumn } from '../@types/columns';
import { User } from './user.entity';

@Entity('organization_member')
@Unique(['organizationId', 'userId'])
export class OrganizationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'organization_id',
  })
  organizationId: string;

  @Column({
    name: 'user_id',
  })
  userId: string;

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

  @OneToOne(() => User)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;

  static map(member: OrganizationMember) {
    return {
      id: member.id,
      organizationId: member.organizationId,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      role: member.role,
      email: member.user.email,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }

  static mapMany(members: OrganizationMember[]) {
    return members.map(OrganizationMember.map);
  }
}
