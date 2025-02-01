import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { QPaperController } from './q-paper.controller';
import { QPaperService } from './q-paper.service';
import { ExamineeMiddleware } from 'src/user-role/user-role.middleware';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionPaper, QuestionPaperSchema } from 'src/schemas/q-peaper.model';
import { User, UserSchema } from 'src/schemas/user.model';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: QuestionPaper.name,
      schema: QuestionPaperSchema,
    }, {
      name: User.name,
      schema: UserSchema,
    }
  ])],
  controllers: [QPaperController],
  providers: [QPaperService, JwtService]
})
export class QPaperModule { }
