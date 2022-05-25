import { Test, TestingModule } from '@nestjs/testing';
import { MetroService } from './metro.service';

describe('MetroService', () => {
  let service: MetroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetroService],
    }).compile();

    service = module.get<MetroService>(MetroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
