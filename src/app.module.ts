import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ExamineeModule } from './examinee/examinee.module';
import { CandidateModule } from './candidate/candidate.module';
import { McqModule } from './mcq/mcq.module';
import { LibModule } from './lib/lib.module';
import { AdminModule } from './admin/admin.module';
import { QPaperModule } from './q-paper/q-paper.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserSeeder } from './seed/user.seeder';
import { ExamModule } from './exam/exam.module';

@Module({
  imports: [
    UserModule,
    ExamineeModule,
    CandidateModule,
    McqModule,
    QPaperModule,
    AdminModule,
    LibModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    ExamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
