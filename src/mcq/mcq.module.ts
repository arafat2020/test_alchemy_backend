import { Module } from '@nestjs/common';
import { McqController } from './mcq.controller';
import { McqService } from './mcq.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Mcq, McqSchema } from 'src/schemas/mcq.model';
import { QuestionPaper, QuestionPaperSchema } from 'src/schemas/q-peaper.model';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from 'src/schemas/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Mcq.name,
        schema: McqSchema,
      }, {
        name: QuestionPaper.name,
        schema: QuestionPaperSchema,
      }, {
        name: User.name,
        schema: UserSchema,
      }
    ])
  ],
  controllers: [McqController],
  providers: [McqService, JwtService]
})
export class McqModule { }
