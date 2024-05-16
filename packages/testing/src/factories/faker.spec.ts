import faker from './faker'

describe('Testing/Faker', () => {
  beforeEach(async () => {
    faker.create.resetSeed!()
  })

  it('return a name', () => {
    expect(typeof faker.create.person.firstName()).toBe('string')
  })

  it('should return the same name', () => {
    const firstName = faker.create.person.fullName()
    faker.create.resetSeed!()
    const secondName = faker.create.person.fullName()

    expect(firstName).toBe(secondName)
  })
  it('should return a different name', () => {
    const firstName = faker.create.person.fullName()
    const secondUser = faker.create.person.fullName()

    expect(firstName).not.toBe(secondUser)
  })
})
