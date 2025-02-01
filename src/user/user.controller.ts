import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ExtendedHeaderDto, UserDto, UserSigninDto } from './user.dto';
import { UserDocument } from 'src/schemas/user.model';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

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

    @Post('logout')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    public async logout(@Req() req: ExtendedHeaderDto): Promise<{ msg: string }> {
        return this.userService.logout(req);
    }
}
