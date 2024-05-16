import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserFactory } from 'test/factories/user.factory';
import { TestBed, faker } from 'testing';
import { Repository } from 'typeorm';
import {
  OrganizationFactory,
  OrganizationMemberFactory,
  OrganizationMemberMockRepository,
  OrganizationMockRepository,
} from '../../../test/factories/organization.factory';
import { testAccessToken } from '../../../test/utils/jwt';
import { createExecutionContext } from '../../../test/utils/request';
import { OrganizationMemberRole } from '../@types/organization';
import { OrganizationMember } from '../database/entities/organization-member.entity';
import { Organization } from '../database/entities/organization.entity';
import { UserService } from '../modules/user/user.service';
import { OrganizationRolesGuard } from './roles.guard';

describe('OrganizationRolesGuard', () => {
  let underTest: OrganizationRolesGuard;
  let organizationRepository: Repository<Organization>;
  let memberRepository: Repository<OrganizationMember>;
  let reflector: Reflector;
  let userService: UserService;

  beforeEach(() => {
    const repositoryToken = getRepositoryToken(Organization) as string;
    const memberRepositoryToken = getRepositoryToken(
      OrganizationMember,
    ) as string;
    const { unit, unitRef } = TestBed.create(OrganizationRolesGuard)
      .mock(repositoryToken)
      .using(OrganizationMockRepository())
      .mock(memberRepositoryToken)
      .using(OrganizationMemberMockRepository())
      .mock(Reflector)
      .using({
        getAllAndOverride: jest.fn(),
      })
      .mock(UserService)
      .using({
        findByProviderId: jest.fn(),
      })
      .compile();

    underTest = unit;
    organizationRepository = unitRef.get(repositoryToken);
    memberRepository = unitRef.get(memberRepositoryToken);
    reflector = unitRef.get(Reflector);
    userService = unitRef.get(UserService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(organizationRepository).toBeDefined();
    expect(memberRepository).toBeDefined();
    expect(reflector).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if no roles are required', async () => {
      const context = createExecutionContext();

      const result = await underTest.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false if no token is found', async () => {
      const context = createExecutionContext({
        headers: {},
      });
      (reflector.getAllAndOverride as jest.Mock).mockReturnValueOnce([
        OrganizationMemberRole.ADMIN,
      ]);

      try {
        await underTest.canActivate(context);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('No token found');
      }
    });

    it('should return false if no user is found', async () => {
      const context = createExecutionContext({
        headers: { authorization: `Bearer ${testAccessToken}` },
      });

      (reflector.getAllAndOverride as jest.Mock).mockReturnValueOnce([
        OrganizationMemberRole.ADMIN,
      ]);

      (userService.findByProviderId as jest.Mock).mockResolvedValueOnce(null);

      try {
        await underTest.canActivate(context);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('User not found');
      }
    });

    it('should return false if no organization is found', async () => {
      const context = createExecutionContext({
        headers: { authorization: `Bearer ${testAccessToken}` },
        params: { organization_id: faker.create.string.uuid() },
      });
      (reflector.getAllAndOverride as jest.Mock).mockReturnValueOnce([
        OrganizationMemberRole.ADMIN,
      ]);

      (userService.findByProviderId as jest.Mock).mockResolvedValueOnce(
        UserFactory.build(),
      );

      (organizationRepository.createQueryBuilder as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(null),
      });

      try {
        await underTest.canActivate(context);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Organization not found');
      }
    });

    it('should return false if no member is found', async () => {
      const context = createExecutionContext({
        headers: { authorization: `Bearer ${testAccessToken}` },
        params: { organization_id: faker.create.string.uuid() },
      });
      (reflector.getAllAndOverride as jest.Mock).mockReturnValueOnce([
        OrganizationMemberRole.ADMIN,
      ]);

      (userService.findByProviderId as jest.Mock).mockResolvedValueOnce(
        UserFactory.build(),
      );

      (organizationRepository.createQueryBuilder as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(OrganizationFactory.build()),
      });

      (memberRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

      try {
        await underTest.canActivate(context);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Member not found');
      }
    });

    it('should return false if user does not have the required role', async () => {
      const context = createExecutionContext({
        headers: { authorization: `Bearer ${testAccessToken}` },
        params: { organization_id: faker.create.string.uuid() },
      });
      (reflector.getAllAndOverride as jest.Mock).mockReturnValueOnce([
        OrganizationMemberRole.ADMIN,
      ]);

      (userService.findByProviderId as jest.Mock).mockResolvedValueOnce(
        UserFactory.build(),
      );

      (organizationRepository.createQueryBuilder as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(OrganizationFactory.build()),
      });

      (memberRepository.findOne as jest.Mock).mockResolvedValueOnce(
        OrganizationMemberFactory.build({
          role: OrganizationMemberRole.MEMBER,
        }),
      );

      try {
        await underTest.canActivate(context);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('User does not have the required role');
      }
    });

    it('should return true if user has the required role', async () => {
      const context = createExecutionContext({
        headers: { authorization: `Bearer ${testAccessToken}` },
        params: { organization_id: faker.create.string.uuid() },
      });
      (reflector.getAllAndOverride as jest.Mock).mockReturnValueOnce([
        OrganizationMemberRole.ADMIN,
      ]);

      (userService.findByProviderId as jest.Mock).mockResolvedValueOnce(
        UserFactory.build(),
      );

      (organizationRepository.createQueryBuilder as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(OrganizationFactory.build()),
      });

      (memberRepository.findOne as jest.Mock).mockResolvedValueOnce(
        OrganizationMemberFactory.build({
          role: OrganizationMemberRole.ADMIN,
        }),
      );

      const result = await underTest.canActivate(context);

      expect(result).toBe(true);
    });
  });
});
