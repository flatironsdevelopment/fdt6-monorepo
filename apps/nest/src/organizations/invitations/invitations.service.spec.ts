import { BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrganizationMemberRole } from 'src/common/@types/organization';
import { OrganizationInvitation } from 'src/common/database/entities/organization-invitation.entity';
import { OrganizationMember } from 'src/common/database/entities/organization-member.entity';
import { Organization } from 'src/common/database/entities/organization.entity';
import { UserService } from 'src/common/modules/user/user.service';
import { EncryptionService } from 'src/common/services/encryption.service';
import {
  OrganizationInvitationFactory,
  OrganizationInvitationMockRepository,
  OrganizationMemberMockRepository,
  OrganizationMockRepository,
} from 'test/factories/organization.factory';
import { UserFactory } from 'test/factories/user.factory';
import { TestBed, faker } from 'testing';
import { Repository } from 'typeorm';
import { OrganizationInvitationsService } from './invitations.service';

describe('InvitationsService', () => {
  let underTest: OrganizationInvitationsService;
  let invitationsRepository: Repository<OrganizationInvitation>;
  let organizationsRepository: Repository<Organization>;
  let membersRepository: Repository<OrganizationMember>;
  let encryptionService: EncryptionService;
  let userService: UserService;

  beforeEach(() => {
    const repositoryToken = getRepositoryToken(
      OrganizationInvitation,
    ) as string;
    const memberRepositoryToken = getRepositoryToken(
      OrganizationMember,
    ) as string;
    const organizationRepositoryToken = getRepositoryToken(
      Organization,
    ) as string;

    const { unit, unitRef } = TestBed.create(OrganizationInvitationsService)
      .mock(repositoryToken)
      .using(OrganizationInvitationMockRepository())
      .mock(memberRepositoryToken)
      .using(OrganizationMemberMockRepository())
      .mock(organizationRepositoryToken)
      .using(OrganizationMockRepository())
      .mock(EventEmitter2)
      .using({
        emit: jest.fn(),
      })
      .mock(EncryptionService)
      .using({
        encryptWithExpiration: jest.fn().mockResolvedValue('encrypted'),
        decryptWithExpiration: jest.fn().mockResolvedValue({
          invitationId: faker.create.string.uuid(),
          organizationId: faker.create.string.uuid(),
        }),
      })
      .mock(UserService)
      .using({
        findByEmail: jest.fn().mockResolvedValue(null),
      })
      .compile();

    underTest = unit;
    invitationsRepository = unitRef.get(repositoryToken);
    organizationsRepository = unitRef.get(organizationRepositoryToken);
    membersRepository = unitRef.get(memberRepositoryToken);
    encryptionService = unitRef.get(EncryptionService);
    userService = unitRef.get(UserService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(invitationsRepository).toBeDefined();
    expect(organizationsRepository).toBeDefined();
    expect(membersRepository).toBeDefined();
    expect(encryptionService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create an invitation', async () => {
      const invitationData = {
        email: faker.create.internet.email(),
        role: OrganizationMemberRole.MEMBER,
        organizationId: faker.create.string.uuid(),
      };
      const invitation = OrganizationInvitationFactory.build();
      (invitationsRepository.save as jest.Mock).mockReturnValue(invitation);

      const result = await underTest.create(invitationData);

      expect(result).toEqual(invitation);
    });

    it('should throw an error if invitation is not created', async () => {
      const invitationData = {
        email: faker.create.internet.email(),
        role: OrganizationMemberRole.MEMBER,
        organizationId: faker.create.string.uuid(),
      };
      (invitationsRepository.save as jest.Mock).mockRejectedValue(new Error());

      await expect(underTest.create(invitationData)).rejects.toThrow();
    });

    it('should throw a ConflictException if invitation already exists', async () => {
      const invitationData = {
        email: faker.create.internet.email(),
        role: OrganizationMemberRole.MEMBER,
        organizationId: faker.create.string.uuid(),
      };
      (invitationsRepository.save as jest.Mock).mockRejectedValue({
        code: '23505',
      });

      try {
        await underTest.create(invitationData);
      } catch (error) {
        expect(error.response.message).toEqual('Invitation already exists');
      }
    });

    it('should throw a BadRequestException if an unknown error occurs', async () => {
      const invitationData = {
        email: faker.create.internet.email(),
        role: OrganizationMemberRole.MEMBER,
        organizationId: faker.create.string.uuid(),
      };
      (invitationsRepository.save as jest.Mock).mockRejectedValue(new Error());

      try {
        await underTest.create(invitationData);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('findAll', () => {
    it('should return all invitations', async () => {
      expect(invitationsRepository.createQueryBuilder).not.toHaveBeenCalled();

      const result = await underTest.findAll(faker.create.string.uuid(), {
        current: 1,
        limit: 10,
      });

      expect(result.data.length > 0).toBeTruthy();
      expect(invitationsRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should return all invitations with custom options', async () => {
      expect(invitationsRepository.createQueryBuilder).not.toHaveBeenCalled();

      const result = await underTest.findAll(faker.create.string.uuid(), {
        current: 2,
        limit: 20,
      });

      expect(result.data.length > 0).toBeTruthy();
      expect(invitationsRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an invitation', async () => {
      expect(invitationsRepository.createQueryBuilder).not.toHaveBeenCalled();

      const result = await underTest.findOne(
        faker.create.string.uuid(),
        faker.create.string.uuid(),
      );

      expect(result).toBeDefined();
      expect(invitationsRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if invitation is not found', async () => {
      try {
        await underTest.findOne(
          faker.create.string.uuid(),
          faker.create.string.uuid(),
        );
      } catch (error) {
        expect(error.response.message).toEqual('Invitation not found');
      }
    });
  });

  describe('confirm', () => {
    it('should confirm an invitation', async () => {
      const confirmInvitationDto = {
        token: faker.create.string.uuid(),
      };

      (userService.findByEmail as jest.Mock).mockResolvedValue(
        UserFactory.build(),
      );

      const result = await underTest.confirm(confirmInvitationDto);

      expect(result).toEqual(undefined);
    });

    it('should throw a NotFoundException if invitation is not found', async () => {
      jest
        .spyOn(underTest, 'findOne')
        .mockRejectedValueOnce(new Error('Invitation not found'));

      try {
        await underTest.confirm({
          token: faker.create.string.uuid(),
        });
      } catch (error) {
        expect(error.message).toEqual('Invitation not found');
      }
    });

    it('should throw a NotFoundException if user is not found', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(null);

      try {
        await underTest.confirm({
          token: faker.create.string.uuid(),
        });
      } catch (error) {
        expect(error.response.message).toEqual('User not found');
      }
    });

    it('should throw an error if invitation is not confirmed', async () => {
      (membersRepository.insert as jest.Mock).mockRejectedValue(new Error());
      (userService.findByEmail as jest.Mock).mockResolvedValue(
        UserFactory.build(),
      );

      try {
        await underTest.confirm({
          token: faker.create.string.uuid(),
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('remove', () => {
    it('should remove an invitation', async () => {
      const organizationId = faker.create.string.uuid();
      const id = faker.create.string.uuid();

      const result = await underTest.remove(organizationId, id);

      expect(result).toBeDefined();
    });

    it('should throw a NotFoundException if invitation is not found', async () => {
      try {
        await underTest.remove(
          faker.create.string.uuid(),
          faker.create.string.uuid(),
        );
      } catch (error) {
        expect(error.response.message).toEqual('Invitation not found');
      }
    });

    it('should throw an error if invitation is not removed', async () => {
      (invitationsRepository.delete as jest.Mock).mockRejectedValue(
        new Error(),
      );

      try {
        await underTest.remove(
          faker.create.string.uuid(),
          faker.create.string.uuid(),
        );
      } catch (error) {
        expect(error.response.message).toEqual('Internal Server Error');
      }
    });
  });
});
