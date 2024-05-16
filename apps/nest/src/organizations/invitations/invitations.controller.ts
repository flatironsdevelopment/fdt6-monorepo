import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrganizationMemberRole } from 'src/common/@types/organization';
import { PaginationOptions } from 'src/common/@types/pagination';
import { OrganizationInvitation } from 'src/common/database/entities/organization-invitation.entity';
import {
  PaginatedEndpoint,
  SecuredEndpoint,
} from 'src/common/decorators/endpoint.decorator';
import { OrganizationRoles } from 'src/common/decorators/roles.decorator';
import { OrganizationRolesGuard } from 'src/common/guards/roles.guard';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { ConfirmInvitationDto } from './dto/update-invitation.dto';
import { OrganizationInvitationsService } from './invitations.service';

@Controller({
  path: 'organizations/:organization_id/invitations',
  version: '1',
})
@ApiTags('organizations/invitations')
@UseGuards(OrganizationRolesGuard)
export class OrganizationInvitationsController {
  constructor(
    private readonly invitationsService: OrganizationInvitationsService,
  ) {}

  @OrganizationRoles(OrganizationMemberRole.ADMIN)
  @SecuredEndpoint(HttpStatus.CREATED)
  @Post()
  create(
    @Param('organization_id') organizationId: string,
    @Body() createInvitationDto: CreateInvitationDto,
  ) {
    return this.invitationsService.create({
      ...createInvitationDto,
      organizationId,
    });
  }

  @OrganizationRoles(
    OrganizationMemberRole.MEMBER,
    OrganizationMemberRole.ADMIN,
  )
  @SecuredEndpoint(HttpStatus.OK)
  @PaginatedEndpoint(OrganizationInvitation)
  @Get()
  findAll(
    @Param('organization_id') organizationId: string,
    @Query() query: PaginationOptions,
  ) {
    return this.invitationsService.findAll(organizationId, query);
  }

  @Put('confirm')
  confirm(@Body() confirmInvitationDto: ConfirmInvitationDto) {
    return this.invitationsService.confirm(confirmInvitationDto);
  }

  @OrganizationRoles(OrganizationMemberRole.ADMIN)
  @SecuredEndpoint(HttpStatus.NO_CONTENT)
  @Patch(':id')
  resend(
    @Param('organization_id') organizationId: string,
    @Param('id') id: string,
  ) {
    return this.invitationsService.resend(organizationId, id);
  }

  @OrganizationRoles(OrganizationMemberRole.ADMIN)
  @SecuredEndpoint(HttpStatus.OK)
  @Delete(':id')
  remove(
    @Param('organization_id') organizationId: string,
    @Param('id') id: string,
  ) {
    return this.invitationsService.remove(organizationId, id);
  }
}
