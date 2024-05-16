import { TestBed, factories } from 'testing';
import { UserService } from '../modules/user/user.service';
import { UserPipe } from './user.pipe';

describe('UserPipe', () => {
  let underTest: UserPipe;
  let userService: UserService;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(UserPipe)
      .mock(UserService)
      .using({
        findByProviderId: jest.fn(),
      })
      .compile();

    underTest = unit;
    userService = unitRef.get(UserService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return a user', async () => {
    const user = { id: '1' };
    (userService.findByProviderId as jest.Mock).mockResolvedValueOnce(user);

    const providerUser = factories.UserFactory.build();
    const result = await underTest.transform(providerUser);

    expect(result).toEqual({ ...user, providerInfo: providerUser });
  });

  it('should return null if user is not found', async () => {
    (userService.findByProviderId as jest.Mock).mockResolvedValueOnce(null);

    const providerUser = factories.UserFactory.build();
    const result = await underTest.transform(providerUser);

    expect(result).toBeNull();
  });
});
