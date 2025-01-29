import { Module } from '@nestjs/common';
import { ExamineeController } from './examinee.controller';
import { ExamineeService } from './examinee.service';

@Module({
  controllers: [ExamineeController],
  providers: [ExamineeService]
})
export class ExamineeModule {}
