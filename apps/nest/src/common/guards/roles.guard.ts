import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationMemberRole } from '../@types/organization';
import { OrganizationMember } from '../database/entities/organization-member.entity';
import { Organization } from '../database/entities/organization.entity';
import { ORGANIZATION_ROLES_KEY } from '../decorators/roles.decorator';
import { UserService } from '../modules/user/user.service';
import { extractFromHeader, extractPayloadFromJWT } from '../utils/token';

@Injectable()
export class OrganizationRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<
      OrganizationMemberRole[]
    >(ORGANIZATION_ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = extractFromHeader(request);

    // If no token is found, return forbidden
    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    const payload = extractPayloadFromJWT(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userService.findByProviderId(payload.sub);

    // if no user is found, return forbidden
    if (!user) {
      return false;
    }

    const organization_id = request.params.organization_id;

    const organization = await this.organizationRepository
      .createQueryBuilder('organization')
      .where('organization.id = :organization_id', { organization_id })
      .leftJoinAndSelect(
        'organization_member',
        'members',
        'members.userId = :userId',
        { userId: user.id },
      )
      .getOne();

    // if no organization is found, return forbidden
    // if the user is not a member of the organization, return forbidden
    if (!organization) {
      return false;
    }

    const member = await this.memberRepository.findOne({
      where: {
        userId: user.id,
        organizationId: organization.id,
      },
    });

    if (!member) {
      return false;
    }

    // if the user doesn't have the required role, return forbidden
    return requiredRoles.some((role) => role === member.role);
  }
}
