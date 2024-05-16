import { Column, ColumnOptions } from 'typeorm';

export const OrganizationMemberRoleColumn = (options?: ColumnOptions) =>
  Column({ ...options, type: 'enum', enumName: 'organization_member_role' });
