import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from 'src/schemas/user.model';
import { ConfigService } from '@nestjs/config';
import { LibService } from 'src/lib/lib.service';

@Injectable()
export class UserSeeder implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly config: ConfigService,
    private readonly lib: LibService,
) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  async seedAdmin() {
    const adminExists = await this.userModel.findOne({ role: UserRole.ADMIN }).exec();
    
    if (!adminExists) {
      const hashedPassword = await this.lib.hashPassword({
        password: this.config.get('ADMIN_PASS') as string,
        round: 6,
      });
      const adminUser = new this.userModel({
        name: 'Admin',
        username: 'admin',
        email: 'arafatmannan2019@example.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      await adminUser.save();
      Logger.log('Admin user created successfully.');
    } else {
      Logger.log('Admin user already exists.');
    }
  }
}
