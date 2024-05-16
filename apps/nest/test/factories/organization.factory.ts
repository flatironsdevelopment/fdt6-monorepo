import {
  OrganizationInvitationStatus,
  OrganizationMemberRole,
} from 'src/common/@types/organization';
import { OrganizationInvitation } from 'src/common/database/entities/organization-invitation.entity';
import { OrganizationMember } from 'src/common/database/entities/organization-member.entity';
import { Organization } from 'src/common/database/entities/organization.entity';
import { factory, faker } from 'testing';
import { UserFactory } from './user.factory';

export const OrganizationFactory = factory.Sync.makeFactory<Organization>({
  id: factory.each(() => faker.create.string.uuid()),
  name: factory.each(() => faker.create.company.name()),
  createdAt: factory.each(() => faker.create.date.past()),
  updatedAt: factory.each(() => faker.create.date.recent()),
});

export const OrganizationMemberFactory =
  factory.Sync.makeFactory<OrganizationMember>({
    id: factory.each(() => faker.create.string.uuid()),
    userId: factory.each(() => faker.create.string.uuid()),
    organizationId: factory.each(() => faker.create.string.uuid()),
    role: factory.each(() =>
      faker.create.helpers.arrayElement([
        OrganizationMemberRole.ADMIN,
        OrganizationMemberRole.MEMBER,
      ]),
    ),
    createdAt: factory.each(() => faker.create.date.past()),
    updatedAt: factory.each(() => faker.create.date.recent()),
    user: UserFactory.build(),
  });

export const OrganizationInvitationFactory =
  factory.Sync.makeFactory<OrganizationInvitation>({
    id: factory.each(() => faker.create.string.uuid()),
    organizationId: factory.each(() => faker.create.string.uuid()),
    email: factory.each(() => faker.create.internet.email()),
    status: factory.each(() =>
      faker.create.helpers.arrayElement([OrganizationInvitationStatus.PENDING]),
    ),
    role: factory.each(() =>
      faker.create.helpers.arrayElement([
        OrganizationMemberRole.ADMIN,
        OrganizationMemberRole.MEMBER,
      ]),
    ),
    createdAt: factory.each(() => faker.create.date.past()),
    updatedAt: factory.each(() => faker.create.date.recent()),
  });

const mockRepositoryFactory = (factory) => ({
  save: jest.fn().mockResolvedValue(factory.build()),
  findOne: jest.fn().mockResolvedValue(factory.build()),
  remove: jest.fn().mockResolvedValue(factory.build()),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    andWhereInIds: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([factory.buildList(3), 3]),
    getMany: jest.fn().mockResolvedValue(factory.buildList(3)),
    getOne: jest.fn().mockResolvedValue(factory.build()),
    getCount: jest.fn().mockResolvedValue(3),
  }),
});

export const OrganizationMockRepository = () =>
  mockRepositoryFactory(OrganizationFactory);

export const OrganizationMemberMockRepository = () =>
  mockRepositoryFactory(OrganizationMemberFactory);

export const OrganizationInvitationMockRepository = () =>
  mockRepositoryFactory(OrganizationInvitationFactory);
