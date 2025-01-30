import { Module } from '@nestjs/common';
import { McqController } from './mcq.controller';
import { McqService } from './mcq.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Mcq, McqSchema } from 'src/schemas/mcq.model';
import { QuestionPaper, QuestionPaperSchema } from 'src/schemas/q-peaper.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Mcq.name,
        schema: McqSchema,
      }, {
        name: QuestionPaper.name,
        schema: QuestionPaperSchema,
      }
    ])
  ],
  controllers: [McqController],
  providers: [McqService, JwtService]
})
export class McqModule { }
