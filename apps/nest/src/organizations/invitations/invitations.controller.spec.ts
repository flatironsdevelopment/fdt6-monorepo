import { OrganizationMemberRole } from 'src/common/@types/organization';
import { OrganizationInvitationFactory } from 'test/factories/organization.factory';
import { TestBed, faker } from 'testing';
import { OrganizationInvitationsController } from './invitations.controller';
import { OrganizationInvitationsService } from './invitations.service';

describe('InvitationsController', () => {
  let underTest: OrganizationInvitationsController;
  let service: OrganizationInvitationsService;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(OrganizationInvitationsController)
      .mock(OrganizationInvitationsService)
      .using({
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
      })
      .compile();

    underTest = unit;
    service = unitRef.get(OrganizationInvitationsService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an invitation', async () => {
      const organizationId = faker.create.string.uuid();
      const createInvitationDto = {
        email: faker.create.internet.email(),
        role: OrganizationMemberRole.ADMIN,
      };
      const invitation = {
        id: faker.create.string.uuid(),
        organizationId,
        ...createInvitationDto,
      };

      (service.create as jest.Mock).mockResolvedValue(invitation);
      expect(service.create).not.toHaveBeenCalled();

      const result = await underTest.create(
        organizationId,
        createInvitationDto,
      );

      expect(result).toEqual(invitation);
      expect(service.create).toHaveBeenCalledWith({
        organizationId,
        ...createInvitationDto,
      });
    });

    it('should throw an error if invitation is not created', async () => {
      const organizationId = faker.create.string.uuid();
      const createInvitationDto = {
        email: faker.create.internet.email(),
        role: OrganizationMemberRole.ADMIN,
      };

      (service.create as jest.Mock).mockRejectedValue(new Error());
      expect(service.create).not.toHaveBeenCalled();

      await expect(
        underTest.create(organizationId, createInvitationDto),
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all invitations', async () => {
      const organizationId = faker.create.string.uuid();
      const options = {
        current: 1,
        limit: 10,
      };

      const invitations = OrganizationInvitationFactory.buildList(5);
      (service.findAll as jest.Mock).mockResolvedValue(invitations);
      expect(service.findAll).not.toHaveBeenCalled();

      const result = await underTest.findAll(organizationId, options);

      expect(result).toEqual(invitations);
      expect(service.findAll).toHaveBeenCalledWith(organizationId, options);
    });
  });

  describe('remove', () => {
    it('should remove an invitation', async () => {
      const organizationId = faker.create.string.uuid();
      const invitationId = faker.create.string.uuid();

      (service.remove as jest.Mock).mockResolvedValue(undefined);
      expect(service.remove).not.toHaveBeenCalled();

      await underTest.remove(organizationId, invitationId);

      expect(service.remove).toHaveBeenCalledWith(organizationId, invitationId);
    });

    it('should throw an error if invitation is not removed', async () => {
      const organizationId = faker.create.string.uuid();
      const invitationId = faker.create.string.uuid();

      (service.remove as jest.Mock).mockRejectedValue(new Error());
      expect(service.remove).not.toHaveBeenCalled();

      await expect(
        underTest.remove(organizationId, invitationId),
      ).rejects.toThrow();
    });
  });

  describe('confirm', () => {
    it('should confirm an invitation', async () => {
      const confirmInvitationDto = {
        token: faker.create.string.uuid(),
      };

      (service.confirm as jest.Mock).mockResolvedValue(undefined);
      expect(service.confirm).not.toHaveBeenCalled();

      await underTest.confirm(confirmInvitationDto);

      expect(service.confirm).toHaveBeenCalledWith(confirmInvitationDto);
    });

    it('should throw an error if invitation is not confirmed', async () => {
      const confirmInvitationDto = {
        token: faker.create.string.uuid(),
      };

      (service.confirm as jest.Mock).mockRejectedValue(new Error());
      expect(service.confirm).not.toHaveBeenCalled();

      await expect(underTest.confirm(confirmInvitationDto)).rejects.toThrow();
    });
  });

  describe('resend', () => {
    it('should resend an invitation', async () => {
      const organizationId = faker.create.string.uuid();
      const invitationId = faker.create.string.uuid();

      (service.resend as jest.Mock).mockResolvedValue(undefined);
      expect(service.resend).not.toHaveBeenCalled();

      await underTest.resend(organizationId, invitationId);

      expect(service.resend).toHaveBeenCalledWith(organizationId, invitationId);
    });

    it('should throw an error if invitation is not resent', async () => {
      const organizationId = faker.create.string.uuid();
      const invitationId = faker.create.string.uuid();

      (service.resend as jest.Mock).mockRejectedValue(new Error());
      expect(service.resend).not.toHaveBeenCalled();

      await expect(
        underTest.resend(organizationId, invitationId),
      ).rejects.toThrow();
    });
  });
});
