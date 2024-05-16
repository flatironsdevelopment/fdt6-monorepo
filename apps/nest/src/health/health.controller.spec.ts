import { TestBed } from 'testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const { unit } = TestBed.create(HealthController)

      .compile();

    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
