import { OrganizationFactory } from 'test/factories/organization.factory';
import { TestBed, factories, faker } from 'testing';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsController', () => {
  let underTest: OrganizationsController;
  let organizationService: OrganizationsService;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(OrganizationsController)
      .mock(OrganizationsService)
      .using({
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
      })
      .compile();

    underTest = unit;
    organizationService = unitRef.get(OrganizationsService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(organizationService).toBeDefined();
  });

  describe('create', () => {
    it('should create a organization', async () => {
      const organizationData = {
        name: faker.create.company.name(),
      };
      const organization = { id: '1', ...organizationData };
      (organizationService.create as jest.Mock).mockResolvedValueOnce(
        organization,
      );

      const user = factories.UserFactory.build();

      const result = await underTest.create(user, organizationData);

      expect(result).toEqual(organization);
    });

    it('should throw an error if organization is not created', async () => {
      const organizationData = {
        name: 'Test Organization',
      };
      (organizationService.create as jest.Mock).mockRejectedValueOnce(
        new Error(),
      );

      const user = factories.UserFactory.build();
      await expect(underTest.create(user, organizationData)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all organizations', async () => {
      const organizations = OrganizationFactory.buildList(3);
      const paginatedResult = {
        data: organizations,
        totalCount: 3,
        current: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };
      (organizationService.findAll as jest.Mock).mockResolvedValueOnce(
        paginatedResult,
      );

      const user = factories.UserFactory.build();

      const result = await underTest.findAll(user, {
        current: 1,
        limit: 10,
      });

      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findOne', () => {
    it('should return a organization', async () => {
      const organization = OrganizationFactory.build();
      (organizationService.findOne as jest.Mock).mockResolvedValueOnce(
        organization,
      );

      const user = factories.UserFactory.build();

      const result = await underTest.findOne(user, organization.id);

      expect(result).toEqual(organization);
    });
  });

  describe('update', () => {
    it('should update a organization', async () => {
      const organization = OrganizationFactory.build();
      (organizationService.update as jest.Mock).mockResolvedValueOnce(
        organization,
      );

      const user = factories.UserFactory.build();
      const organizationData = { name: 'Updated Organization' };

      const result = await underTest.update(
        user,
        organization.id,
        organizationData,
      );

      expect(result).toEqual(organization);
    });
  });
});
