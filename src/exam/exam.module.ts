import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from 'src/schemas/exam.model';
import { QuestionPaper, QuestionPaperSchema } from 'src/schemas/q-peaper.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Exam.name,
      schema: ExamSchema
    },
    {
      name: QuestionPaper.name,
      schema: QuestionPaperSchema
    }
  ])],
  controllers: [ExamController],
  providers: [ExamService, JwtService]
})
export class ExamModule {}
