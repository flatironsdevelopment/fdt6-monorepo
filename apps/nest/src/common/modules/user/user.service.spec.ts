import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/common/database/entities/user.entity';
import { UserMockRepository } from 'test/factories/user.factory';
import { TestBed, factories, faker } from 'testing';
import { Repository } from 'typeorm';
import { AuthProviderName } from '../auth/constants';
import { UserService } from './user.service';

describe('UserService', () => {
  let underTest: UserService;
  let userRepository: Repository<User>;

  beforeEach(() => {
    const repositoryToken = getRepositoryToken(User) as string;
    const { unit, unitRef } = TestBed.create(UserService)
      .mock(repositoryToken)
      .using(UserMockRepository())
      .compile();

    underTest = unit;
    userRepository = unitRef.get(repositoryToken);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const userData = {
        email: faker.create.internet.email(),
        firstName: faker.create.person.firstName(),
        lastName: faker.create.person.lastName(),
        phoneNumber: faker.create.phone.number(),
        provider: AuthProviderName.COGNITO,
        providerId: faker.create.string.uuid(),
      };
      const user = factories.UserFactory.build();
      (userRepository.insert as jest.Mock).mockReturnValue({
        identifiers: [user],
      });

      const result = await underTest.create(userData);

      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const providerId = faker.create.string.uuid();
      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await underTest.findByProviderId(providerId);

      expect(result).toBeNull();
    });
  });

  describe('findByProviderId', () => {
    it('should return a user', async () => {
      const providerId = faker.create.string.uuid();
      const user = factories.UserFactory.build();
      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(user);

      const result = await underTest.findByProviderId(providerId);

      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const providerId = faker.create.string.uuid();
      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await underTest.findByProviderId(providerId);

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user', async () => {
      const email = faker.create.internet.email();
      const user = factories.UserFactory.build();
      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(user);

      const result = await underTest.findByEmail(email);

      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const email = faker.create.internet.email();
      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await underTest.findByEmail(email);

      expect(result).toBeNull();
    });
  });
});
