import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.model';
import { UserService } from 'src/user/user.service';
import { LibService } from 'src/lib/lib.service';

@Module({
  imports: [MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      }
    ])],
  controllers: [AdminController],
  providers: [AdminService, JwtService, UserService, LibService]
})
export class AdminModule {}
