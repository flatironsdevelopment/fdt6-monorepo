import { UserCreatedWithOrganizationEvent } from 'src/common/constants/events';
import { TestBed, faker } from 'testing';
import { OrganizationsListener } from './organizations.listener';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsListener', () => {
  let underTest: OrganizationsListener;
  let organizationsService: OrganizationsService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(OrganizationsListener)
      .mock(OrganizationsService)
      .using({
        create: jest.fn(),
      })
      .compile();

    underTest = unit;
    organizationsService = unitRef.get(OrganizationsService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(organizationsService).toBeDefined();
  });

  it('should create user on listening Event', () => {
    const mockEvent: UserCreatedWithOrganizationEvent = {
      userId: faker.create.string.uuid(),
      userEmail: faker.create.internet.email(),
      organizationName: faker.create.company.name(),
    };

    underTest.handleCreateOrganizationEvent(mockEvent);

    expect(organizationsService.create).toHaveBeenCalledWith({
      id: mockEvent.userId,
      name: mockEvent.organizationName,
    });
  });
});
