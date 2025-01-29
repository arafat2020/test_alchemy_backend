import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLoginType, UserSignUpType } from 'src/interfaces/user.interface';
import { LibService } from 'src/lib/lib.service';
import { User, UserDocument, UserRole } from 'src/schemas/user.model';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
        private readonly lib: LibService,
    ) { }

    public async createUser({
        credentials
    }: {
        credentials: UserSignUpType
    }): Promise<Partial<UserDocument>> {
        if (credentials.role === UserRole.ADMIN) throw new HttpException("Admin role is not allowed for public", HttpStatus.BAD_REQUEST)

        const isExisting = await this.UserModel.findOne({
            email: credentials.email
        })

        if (isExisting) throw new HttpException("user already exists", HttpStatus.BAD_REQUEST)

        const isNameTaken = await this.UserModel.findOne({
            username: credentials.username
        })

        if (isNameTaken) throw new HttpException("Username already taken", HttpStatus.BAD_REQUEST)

        credentials.password = await this.lib.hashPassword({
            password: credentials.password
        })
        const createdUser = await this.UserModel.create(credentials);
        return {
            _id: createdUser._id,
            name: createdUser.name,
            username: createdUser.username,
            email: createdUser.email,
            joiningDate: createdUser.joiningDate,
            role: createdUser.role
        }
    }

    public async login({
        credentials
    }: {
        credentials: UserLoginType
    }): Promise<{
        user: Partial<UserDocument>,
        token: string
    }> {
        const isExisting = await this.UserModel.findOne({
            email: credentials.email
        })

        if (!isExisting) throw new HttpException("User not found", HttpStatus.BAD_REQUEST)


        const isMatch = await this.lib.comparePassword({
            hashedPassword: isExisting.password,
            password: credentials.password
        })

        if (!isMatch) throw new HttpException("Wrong password", HttpStatus.UNAUTHORIZED)
        return {
            user: {
                _id: isExisting._id,
                name: isExisting.name,
                username: isExisting.username,
                email: isExisting.email,
                joiningDate: isExisting.joiningDate,
                role: isExisting.role
            },
            token: await this.jwt.signAsync({ id: isExisting._id, role: isExisting.role }, {
                secret: this.config.get('JWT_SECRET'),
                expiresIn: '24h'
            })
        }
    }
}
