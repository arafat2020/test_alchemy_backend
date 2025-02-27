import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLoginType, UserSignUpType } from 'src/interfaces/user.interface';
import { LibService } from 'src/lib/lib.service';
import { User, UserDocument, UserRole } from 'src/schemas/user.model';
import { ExtendedHeaderDto, GetUserByAdminDto, UpdateUserDto } from './user.dto';
import { MongoId } from 'src/common/id.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { GetUsersByAdminWithPaginationDto } from 'src/common/getUser.dto';

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

    public updateUser({
        id,
        ...rest
    }: UpdateUserDto) {
        return this.UserModel.findOneAndUpdate({
            _id: id
        }, {
            ...rest
        }, {
            new: true
        }).exec()
    }

    public async login({
        credentials
    }: {
        credentials: UserLoginType
    }): Promise<{
        user: Partial<UserDocument>,
        token: string
    }> {
        const isExisting = await this.UserModel.findOneAndUpdate({
            email: credentials.email
        }, {
            active: true
        }, {
            new: true
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
                role: isExisting.role,
                active: isExisting.active
            },
            token: await this.jwt.signAsync({ id: isExisting._id, role: isExisting.role }, {
                secret: this.config.get('JWT_SECRET'),
                expiresIn: '24h'
            })
        }
    }

    public async logout({
        user
    }: ExtendedHeaderDto): Promise<{
        msg: string
    }> {
        const logoutUser = await this.UserModel.findByIdAndUpdate(user?.id, {
            active: false
        }, {
            new: true
        }).exec()

        if (!logoutUser) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        if (logoutUser.active) throw new HttpException('Logout Failed', HttpStatus.NOT_FOUND)
        return {
            msg: 'User logged out successfully'
        }
    }

    public async getAllUserByAdmin(
        { 
            userType,
            skip,
            take
         }: GetUsersByAdminWithPaginationDto
    ): Promise<{ total: number; data: UserDocument[] }> {
        const [total, data] = await Promise.all([
            this.UserModel.countDocuments({ role: userType }), // Total count
            this.UserModel.find({ role: userType })
                .sort({ _id: "asc" })            // Paginated data
                .skip(skip ?? 0)
                .limit(take ?? 10)
                .exec(),
        ]);

        return { total, data };
    }

    public async getAllUserByExaminer(
        { pagination }: { pagination: PaginationDto }
    ): Promise<{ total: number; data: UserDocument[] }> {
        const [total, data] = await Promise.all([
            this.UserModel.countDocuments({ role: UserRole.CANDIDATE }), // Total count
            this.UserModel.find({ role: UserRole.CANDIDATE })            // Paginated data
                .skip(pagination.skip ?? 0)
                .limit(pagination.take ?? 10)
                .exec(),
        ]);

        return { total, data };
    }


    public async verifyUser({
        header
    }: {
        header: ExtendedHeaderDto
    }): Promise<UserDocument> {
        const user = await this.UserModel.findById(header.user?.id)
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        if (!user.active) throw new HttpException("User not active", HttpStatus.UNAUTHORIZED)

        return user
    }

    public async delete({ _id }: MongoId) {
        return this.UserModel.findByIdAndDelete(_id).exec()
    }
}
