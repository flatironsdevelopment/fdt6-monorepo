import * as Factory from 'factory.ts'
import { User } from '~types'
import faker from './faker'

export const UserFactory = Factory.Sync.makeFactory<User>({
  id: Factory.each(() => faker.create.string.alphanumeric({ length: 24 })),
  firstName: Factory.each(() => faker.create.person.firstName()),
  lastName: Factory.each(() => faker.create.person.lastName()),
  email: Factory.each(() => faker.create.internet.email()),
  phoneNumber: Factory.each(() => faker.create.phone.number()),
  emailVerified: true,
  phoneNumberVerified: true
})
