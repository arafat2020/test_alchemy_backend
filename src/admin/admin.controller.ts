import { Body, Controller, Delete, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { MongoId } from 'src/common/id.dto';
import { AdminGuard } from 'src/user-role/admin/admin.guard';
import { 
    UserDto,
    UpdateUserDto
 } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
export class AdminController {

    constructor(
        private readonly userService: UserService,
    ){}

    @Post('user/create')
    @ApiBearerAuth()
    public createUser(@Body() credentials: UserDto) {
        return this.userService.createUser({ credentials });
    }

    @Patch('user/update')
    @ApiBearerAuth()
    public updateUser(@Body() credentials: UpdateUserDto){
        return this.userService.updateUser(credentials)
    }

    @Delete('user/delete')
    @ApiBearerAuth()
    public async logout(@Body() id:MongoId) {
        return this.userService.delete(id)
    }
}
