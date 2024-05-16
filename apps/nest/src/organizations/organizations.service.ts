import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationMemberRole } from 'src/common/@types/organization';
import { PaginationOptions } from 'src/common/@types/pagination';
import { OrganizationMember } from 'src/common/database/entities/organization-member.entity';
import { Organization } from 'src/common/database/entities/organization.entity';
import {
  addPaginationToQuery,
  getPaginatedResult,
} from 'src/common/utils/pagination';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

    @InjectRepository(OrganizationMember)
    private readonly organizationMemberRepository: Repository<OrganizationMember>,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto & { id: string }) {
    const organization = await this.organizationRepository.save({
      name: createOrganizationDto.name,
    });

    await this.organizationMemberRepository.insert({
      userId: createOrganizationDto.id,
      organizationId: organization.id,
      role: OrganizationMemberRole.ADMIN,
    });

    return organization;
  }

  getUserOrganizationQuery(userId: string) {
    return this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect(
        'organization_member',
        'member',
        'member.userId = :userId',
        { userId },
      )
      .orderBy('organization.createdAt', 'ASC');
  }

  async findAll(userId: string, options: PaginationOptions) {
    const builder = this.getUserOrganizationQuery(userId);

    const query = addPaginationToQuery(builder, options);

    const organizations = await getPaginatedResult(query, options);

    return organizations;
  }

  async findOne(userId: string, id: string) {
    const organizations = this.getUserOrganizationQuery(userId);

    const organization = await organizations.andWhereInIds([id]).getOne();

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async update(
    userId: string,
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ) {
    const organization = await this.findOne(userId, id);

    const updatedOrganization = this.organizationRepository.merge(
      organization,
      updateOrganizationDto,
    );

    return this.organizationRepository.save(updatedOrganization);
  }
}
