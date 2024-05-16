import faker from './faker'
import { UserFactory } from './user-factory'

describe('UserFactory', () => {
  beforeEach(async () => {
    faker.create.resetSeed!()
  })

  it('should return a mock user', () => {
    expect(UserFactory.build()).toMatchSnapshot()
  })

  it('should return the same user', () => {
    const firstUser = UserFactory.build()
    faker.create.resetSeed!()
    const secondUser = UserFactory.build()

    expect(`${firstUser}`).toBe(`${secondUser}`)
  })
  it('should return a different user', () => {
    const firstUser = UserFactory.build()
    const secondUser = UserFactory.build()

    expect(firstUser).not.toBe(secondUser)
  })
})
