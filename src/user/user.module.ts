import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.model';
import { UserSeeder } from 'src/seed/user.seeder';
import { LibService } from 'src/lib/lib.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[MongooseModule.forFeature([
    {
      name: User.name,
      schema: UserSchema,
    }
  ])],
  controllers: [
    UserController
  ],
  providers: [UserService, UserSeeder, LibService, JwtService],
  exports: [UserSeeder],
})
export class UserModule {}
