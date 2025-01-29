import { Test, TestingModule } from '@nestjs/testing';
import { QPaperService } from './q-paper.service';

describe('QPaperService', () => {
  let service: QPaperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QPaperService],
    }).compile();

    service = module.get<QPaperService>(QPaperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
