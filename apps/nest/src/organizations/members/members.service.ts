import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationMemberRole } from 'src/common/@types/organization';
import { PaginationOptions } from 'src/common/@types/pagination';
import { OrganizationMember } from 'src/common/database/entities/organization-member.entity';
import {
  addPaginationToQuery,
  getPaginatedResult,
} from 'src/common/utils/pagination';
import { Repository } from 'typeorm';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class OrganizationsMembersService {
  constructor(
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
  ) {}

  private getOrganizationMembersQuery(organizationId: string) {
    return this.memberRepository
      .createQueryBuilder('organization_member')
      .leftJoinAndSelect('organization_member.user', 'user')
      .where('organization_member.organizationId = :organizationId', {
        organizationId,
      })
      .orderBy('organization_member.createdAt', 'ASC');
  }

  private async isLastAdmin(organizationId: string, memberId: string) {
    const adminCount = await this.getOrganizationMembersQuery(organizationId)
      .andWhere({
        role: OrganizationMemberRole.ADMIN,
      })
      .andWhere('organization_member.id != :memberId', { memberId })
      .getCount();

    if (adminCount === 0) {
      throw new ForbiddenException('Cannot modify the last admin');
    }
  }

  async findAll(organizationId: string, options: PaginationOptions) {
    const builder = this.getOrganizationMembersQuery(organizationId);

    const query = addPaginationToQuery(builder, options);

    const members = await getPaginatedResult(
      query,
      options,
      OrganizationMember.mapMany,
    );
    return members;
  }

  async findOne(organizationId: string, id: string, raw?: boolean) {
    const query = this.getOrganizationMembersQuery(
      organizationId,
    ).andWhereInIds([id]);

    let member;

    try {
      member = await query.getOne();
    } catch (error) {
      throw new BadRequestException('Invalid member id');
    }

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (raw) {
      return member;
    }

    return OrganizationMember.map(member);
  }

  // Vulnerability: We don't have a concept of owner in the organization, so any admin can remove any other admin
  async update(
    organizationId: string,
    id: string,
    updateMemberDto: UpdateMemberDto,
  ) {
    const member = await this.findOne(organizationId, id, true);

    if (member.role === OrganizationMemberRole.ADMIN) {
      await this.isLastAdmin(organizationId, id);
    }

    member.role = updateMemberDto.role;
    const updatedMember = await this.memberRepository.save(member);

    return OrganizationMember.map(updatedMember);
  }

  // Vulnerability: We don't have a concept of owner in the organization, so any admin can remove any other admin
  async remove(organizationId: string, id: string) {
    const member = (await this.findOne(
      organizationId,
      id,
      true,
    )) as OrganizationMember;

    if (member.role === OrganizationMemberRole.ADMIN) {
      await this.isLastAdmin(organizationId, id);
    }

    return await this.memberRepository.remove(member);
  }
}
