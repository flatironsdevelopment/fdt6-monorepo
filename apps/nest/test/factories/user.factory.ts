import { User } from 'src/common/database/entities/user.entity';
import { AuthProviderName } from 'src/common/modules/auth/constants';
import { factory, faker } from 'testing';

export const UserFactory = factory.Sync.makeFactory<User>({
  id: factory.each(() => faker.create.string.uuid()),
  firstName: factory.each(() => faker.create.person.firstName()),
  lastName: factory.each(() => faker.create.person.lastName()),
  email: factory.each(() => faker.create.internet.email()),
  phoneNumber: factory.each(() => faker.create.phone.number()),
  createdAt: factory.each(() => faker.create.date.past()),
  updatedAt: factory.each(() => faker.create.date.recent()),
  provider: factory.each(() =>
    faker.create.helpers.arrayElement([AuthProviderName.COGNITO]),
  ),
  providerId: factory.each(() => faker.create.string.uuid()),
});

export const UserMockRepository = () => ({
  insert: jest.fn().mockResolvedValue({
    identifiers: [UserFactory.build()],
  }),
  findOne: jest.fn().mockResolvedValue(UserFactory.build()),
});
