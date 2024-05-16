import { getRepositoryToken } from '@nestjs/typeorm';
import { OrganizationMemberMockRepository } from 'src/../test/factories/organization.factory';
import { UserFactory } from 'src/../test/factories/user.factory';
import { OrganizationMemberRole } from 'src/common/@types/organization';
import { OrganizationMember } from 'src/common/database/entities/organization-member.entity';
import { TestBed, faker } from 'testing';
import { Repository } from 'typeorm';
import { OrganizationsMembersService } from './members.service';

describe('OrganizationsMembersService', () => {
  let underTest: OrganizationsMembersService;
  let organizationMemberRepository: Repository<OrganizationMember>;

  beforeEach(() => {
    const repositoryToken = getRepositoryToken(OrganizationMember) as string;

    const { unit, unitRef } = TestBed.create(OrganizationsMembersService)
      .mock(repositoryToken)
      .using(OrganizationMemberMockRepository())
      .compile();

    underTest = unit;
    organizationMemberRepository = unitRef.get(repositoryToken);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(organizationMemberRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all members of an organization', async () => {
      const organizationId = 'organizationId';
      const options = { current: 2, limit: 11 };

      const result = await underTest.findAll(organizationId, options);

      expect(result.current).toEqual(options.current);
      expect(result.limit).toEqual(options.limit);
      expect(result.data.length).toBeTruthy();
    });
  });

  describe('findOne', () => {
    it('should return a member of an organization', async () => {
      const organizationId = faker.create.string.uuid();
      const id = faker.create.string.uuid();

      const result = await underTest.findOne(organizationId, id);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if member is not found', async () => {
      const organizationId = faker.create.string.uuid();
      const id = faker.create.string.uuid();

      jest
        .spyOn(organizationMemberRepository, 'createQueryBuilder')
        .mockReturnValueOnce({
          where: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          andWhereInIds: jest.fn().mockReturnValue({
            getOne: jest.fn().mockResolvedValue(undefined),
          }),
        } as any);

      await expect(underTest.findOne(organizationId, id)).rejects.toThrow(
        'Member not found',
      );
    });
  });

  describe('update', () => {
    it('should update a member of an organization', async () => {
      const organizationId = faker.create.string.uuid();
      const id = faker.create.string.uuid();
      const updateMemberDto = { role: OrganizationMemberRole.ADMIN };

      (organizationMemberRepository.save as jest.Mock).mockResolvedValue({
        ...updateMemberDto,
        user: UserFactory.build(),
      });

      const result = await underTest.update(
        organizationId,
        id,
        updateMemberDto,
      );

      expect(result).toBeDefined();
      expect(result.role).toEqual(updateMemberDto.role);
    });

    it('should throw ForbiddenException if the member is the last admin', async () => {
      const organizationId = faker.create.string.uuid();
      const id = faker.create.string.uuid();
      const updateMemberDto = { role: OrganizationMemberRole.ADMIN };

      jest
        .spyOn(organizationMemberRepository, 'createQueryBuilder')
        .mockReturnValue({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          andWhereInIds: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockResolvedValue(0),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          getOne: jest
            .fn()
            .mockResolvedValue({ role: OrganizationMemberRole.ADMIN }),
        } as any);

      await expect(
        underTest.update(organizationId, id, updateMemberDto),
      ).rejects.toThrow('Cannot modify the last admin');
    });
  });

  describe('remove', () => {
    it('should remove a member of an organization', async () => {
      const organizationId = faker.create.string.uuid();
      const id = faker.create.string.uuid();

      const result = await underTest.remove(organizationId, id);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if member is not found', async () => {
      const organizationId = faker.create.string.uuid();
      const id = faker.create.string.uuid();

      jest
        .spyOn(organizationMemberRepository, 'createQueryBuilder')
        .mockReturnValueOnce({
          where: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          andWhereInIds: jest.fn().mockReturnValue({
            getOne: jest.fn().mockResolvedValue(undefined),
          }),
        } as any);

      await expect(underTest.remove(organizationId, id)).rejects.toThrow(
        'Member not found',
      );
    });

    it('should throw ForbiddenException if the member is the last admin', async () => {
      const organizationId = faker.create.string.uuid();
      const id = faker.create.string.uuid();

      jest
        .spyOn(organizationMemberRepository, 'createQueryBuilder')
        .mockReturnValue({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          andWhereInIds: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockResolvedValue(0),
          getOne: jest
            .fn()
            .mockResolvedValue({ role: OrganizationMemberRole.ADMIN }),
        } as any);

      await expect(underTest.remove(organizationId, id)).rejects.toThrow(
        'Cannot modify the last admin',
      );
    });
  });
});
