import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrganizationMember } from 'src/common/database/entities/organization-member.entity';
import { Organization } from 'src/common/database/entities/organization.entity';
import { TestBed, faker } from 'testing';
import { Repository } from 'typeorm';
import {
  OrganizationFactory,
  OrganizationMockRepository,
} from '../../test/factories/organization.factory';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsService', () => {
  let underTest: OrganizationsService;
  let organizationRepository: Repository<Organization>;

  beforeEach(() => {
    const repositoryToken = getRepositoryToken(Organization) as string;
    const memberRepositoryToken = getRepositoryToken(
      OrganizationMember,
    ) as string;
    const { unit, unitRef } = TestBed.create(OrganizationsService)
      .mock(repositoryToken)
      .using(OrganizationMockRepository())
      .mock(memberRepositoryToken)
      .using(OrganizationMockRepository())
      .compile();

    underTest = unit;
    organizationRepository = unitRef.get(repositoryToken);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(organizationRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a organization', async () => {
      const organizationData = {
        name: faker.create.company.name(),
        id: faker.create.string.uuid(),
      };
      const organization = OrganizationFactory.build();
      (organizationRepository.save as jest.Mock).mockReturnValue(organization);

      const result = await underTest.create(organizationData);

      expect(result).toEqual(organization);
    });

    it('should throw an error if organization is not created', async () => {
      const organizationData = {
        name: faker.create.company.name(),
        id: faker.create.string.uuid(),
      };
      (organizationRepository.save as jest.Mock).mockRejectedValue(new Error());

      await expect(underTest.create(organizationData)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all organizations', async () => {
      expect(organizationRepository.createQueryBuilder).not.toHaveBeenCalled();

      const result = await underTest.findAll(faker.create.string.uuid(), {
        current: 1,
        limit: 10,
      });

      expect(result.data.length > 0).toBeTruthy();
      expect(organizationRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a organization', async () => {
      expect(organizationRepository.createQueryBuilder).not.toHaveBeenCalled();

      const result = await underTest.findOne(
        faker.create.string.uuid(),
        faker.create.string.uuid(),
      );

      expect(result).toBeDefined();
      expect(organizationRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw an error if organization is not found', async () => {
      try {
        await underTest.findOne(
          faker.create.string.uuid(),
          faker.create.string.uuid(),
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update', () => {
    it('should update a organization', async () => {
      const organization = OrganizationFactory.build();
      (organizationRepository.merge as jest.Mock).mockReturnValue(organization);
      (organizationRepository.save as jest.Mock).mockReturnValue(organization);

      const result = await underTest.update(
        faker.create.string.uuid(),
        faker.create.string.uuid(),
        { name: faker.create.company.name() },
      );

      expect(result).toEqual(organization);
    });

    it('should throw an error if organization is not found', async () => {
      try {
        await underTest.update(
          faker.create.string.uuid(),
          faker.create.string.uuid(),
          { name: faker.create.company.name() },
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
