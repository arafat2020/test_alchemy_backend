import { Test, TestingModule } from '@nestjs/testing';
import { QPaperController } from './q-paper.controller';

describe('QPaperController', () => {
  let controller: QPaperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QPaperController],
    }).compile();

    controller = module.get<QPaperController>(QPaperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
