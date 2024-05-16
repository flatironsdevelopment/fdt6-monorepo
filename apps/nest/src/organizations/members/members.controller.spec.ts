import { OrganizationMemberRole } from 'src/common/@types/organization';
import { TestBed } from 'testing';
import { OrganizationsMembersController } from './members.controller';
import { OrganizationsMembersService } from './members.service';

describe('OrganizationsMembersController', () => {
  let underTest: OrganizationsMembersController;
  let service: OrganizationsMembersService;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(OrganizationsMembersController)
      .mock(OrganizationsMembersService)
      .using({
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
      })
      .compile();

    underTest = unit;
    service = unitRef.get(OrganizationsMembersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should call service.findAll', () => {
    const organizationId = 'organizationId';
    const query = { current: 2, limit: 11 };

    underTest.findAll(organizationId, query);

    expect(service.findAll).toHaveBeenCalledWith(organizationId, query);
  });

  it('should call service.findOne', () => {
    const organizationId = 'organizationId';
    const id = 'id';

    underTest.findOne(organizationId, id);

    expect(service.findOne).toHaveBeenCalledWith(organizationId, id);
  });

  it('should call service.update', () => {
    const organizationId = 'organizationId';
    const id = 'id';
    const updateMemberDto = { role: OrganizationMemberRole.ADMIN };

    underTest.update(organizationId, id, updateMemberDto);

    expect(service.update).toHaveBeenCalledWith(
      organizationId,
      id,
      updateMemberDto,
    );
  });

  it('should call service.remove', () => {
    const organizationId = 'organizationId';
    const id = 'id';

    underTest.remove(organizationId, id);

    expect(service.remove).toHaveBeenCalledWith(organizationId, id);
  });
});
