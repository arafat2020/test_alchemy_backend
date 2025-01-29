import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto, UserSigninDto } from './user.dto';
import { UserDocument } from 'src/schemas/user.model';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ){}

    @Post('signup')
    public async signUp(@Body() credentials: UserDto): Promise<Partial<UserDocument>> {
        return this.userService.createUser({ credentials });
    }

    @Post('signin')
    public async signIn(@Body() credentials: UserSigninDto): Promise<{ user: Partial<UserDocument>, token: string }> {
        return this.userService.login({ credentials });
    }
}
