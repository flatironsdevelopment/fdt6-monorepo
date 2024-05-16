import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginationOptions } from 'src/common/@types/pagination';
import { GenericResultResponse } from 'src/common/constants/open-api';
import { Organization } from 'src/common/database/entities/organization.entity';
import {
  PaginatedEndpoint,
  SecuredEndpoint,
} from 'src/common/decorators/endpoint.decorator';
import { GetDBUser } from 'src/common/decorators/user.decorator';
import { UserData } from 'src/common/models/user.model';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller({
  path: 'organizations',
  version: '1',
})
@ApiTags('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @ApiCreatedResponse({
    description: 'User creates a new Organization.',
    type: GenericResultResponse,
  })
  @SecuredEndpoint(HttpStatus.CREATED)
  @Post()
  create(
    @GetDBUser() user: UserData,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.organizationsService.create({
      ...createOrganizationDto,
      id: user.id,
    });
  }

  @SecuredEndpoint(HttpStatus.OK)
  @PaginatedEndpoint(Organization)
  @Get()
  findAll(@GetDBUser() user: UserData, @Query() query: PaginationOptions) {
    return this.organizationsService.findAll(user.id, query);
  }

  @ApiOkResponse({
    description: 'User retrieves a specific Organization.',
    type: Organization,
  })
  @SecuredEndpoint(HttpStatus.OK)
  @Get(':id')
  findOne(@GetDBUser() user: UserData, @Param('id') id: string) {
    return this.organizationsService.findOne(user.id, id);
  }

  @ApiOkResponse({
    description: 'User updates a specific Organization.',
    type: Organization,
  })
  @SecuredEndpoint(HttpStatus.OK)
  @Put(':id')
  update(
    @GetDBUser() user: UserData,
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(user.id, id, updateOrganizationDto);
  }
}
