import { Faker as IFaker, faker as originalFaker } from '@faker-js/faker'

type FakerType = IFaker & { resetSeed?: () => void; symbol?: () => string }
const SEED = 1
originalFaker.seed(SEED)

export default class Faker {
  static readonly SEED = SEED
  static create: FakerType = originalFaker
}

Faker.create.resetSeed = () => {
  Faker.create.seed(SEED)
}
