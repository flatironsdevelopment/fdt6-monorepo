import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrganizationMemberRole } from 'src/common/@types/organization';
import { PaginationOptions } from 'src/common/@types/pagination';
import { OrganizationInvitation } from 'src/common/database/entities/organization-invitation.entity';
import {
  PaginatedEndpoint,
  SecuredEndpoint,
} from 'src/common/decorators/endpoint.decorator';
import { OrganizationRoles } from 'src/common/decorators/roles.decorator';
import { OrganizationRolesGuard } from 'src/common/guards/roles.guard';
import { UpdateMemberDto } from './dto/update-member.dto';
import { OrganizationsMembersService } from './members.service';

@Controller({
  path: 'organizations/:organization_id/members',
  version: '1',
})
@UseGuards(OrganizationRolesGuard)
export class OrganizationsMembersController {
  constructor(private readonly membersService: OrganizationsMembersService) {}

  @SecuredEndpoint(HttpStatus.OK)
  @PaginatedEndpoint(OrganizationInvitation)
  @Get()
  findAll(
    @Param('organization_id') organizationId: string,
    @Query() query: PaginationOptions,
  ) {
    return this.membersService.findAll(organizationId, query);
  }

  @SecuredEndpoint(HttpStatus.OK)
  @Get(':id')
  findOne(
    @Param('organization_id') organizationId: string,
    @Param('id') id: string,
  ) {
    return this.membersService.findOne(organizationId, id);
  }

  @OrganizationRoles(OrganizationMemberRole.ADMIN)
  @SecuredEndpoint(HttpStatus.OK)
  @Put(':id')
  update(
    @Param('organization_id') organizationId: string,
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.membersService.update(organizationId, id, updateMemberDto);
  }

  @OrganizationRoles(OrganizationMemberRole.ADMIN)
  @SecuredEndpoint(HttpStatus.OK)
  @Delete(':id')
  remove(
    @Param('organization_id') organizationId: string,
    @Param('id') id: string,
  ) {
    return this.membersService.remove(organizationId, id);
  }
}
