import { Test, TestingModule } from '@nestjs/testing';
import { SlogansController } from './slogans.controller';

describe('SlogansController', () => {
  let controller: SlogansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlogansController],
    }).compile();

    controller = module.get<SlogansController>(SlogansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
