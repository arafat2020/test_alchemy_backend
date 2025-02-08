import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ExtendedHeaderDto, GetUserByAdminDto, UserDto, UserSigninDto } from './user.dto';
import { UserDocument } from 'src/schemas/user.model';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/user-role/admin/admin.guard';
import { ExamineeGuard } from 'src/user-role/examinee/examinee.guard';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

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

    @Get('get-user-by-admin')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, AdminGuard)
    public async getAllUserByAdmin(@Query() UserRole: GetUserByAdminDto): Promise<UserDocument[]> {
        return this.userService.getAllUserByAdmin({ UserRole });
    }

    @Get('get-user-by-examiner')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, ExamineeGuard)
    public async getAllUserByExaminer(): Promise<UserDocument[]> {
        return this.userService.getAllUserByExaminer()
    }

    @Get('verify')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    public async verify(@Req() req: ExtendedHeaderDto){
        return this.userService.verifyUser({
            header: req
        })
    }
}
