import { SetMetadata } from '@nestjs/common';
import { OrganizationMemberRole } from '../@types/organization';

export const ORGANIZATION_ROLES_KEY = 'organization-roles';

export const OrganizationRoles = (...args: OrganizationMemberRole[]) =>
  SetMetadata(ORGANIZATION_ROLES_KEY, args);
