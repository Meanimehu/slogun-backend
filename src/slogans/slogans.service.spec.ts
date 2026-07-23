import { Test, TestingModule } from '@nestjs/testing';
import { SlogansService } from './slogans.service';

describe('SlogansService', () => {
  let service: SlogansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlogansService],
    }).compile();

    service = module.get<SlogansService>(SlogansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
