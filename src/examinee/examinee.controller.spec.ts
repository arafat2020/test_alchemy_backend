import { Test, TestingModule } from '@nestjs/testing';
import { ExamineeController } from './examinee.controller';

describe('ExamineeController', () => {
  let controller: ExamineeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamineeController],
    }).compile();

    controller = module.get<ExamineeController>(ExamineeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
