import { Test, TestingModule } from '@nestjs/testing';
import { ExamineeService } from './examinee.service';

describe('ExamineeService', () => {
  let service: ExamineeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamineeService],
    }).compile();

    service = module.get<ExamineeService>(ExamineeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
