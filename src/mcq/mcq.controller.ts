import { Body, Controller, Delete, Patch, Post, UseGuards } from '@nestjs/common';
import { McqService } from './mcq.service';
import { McqDeleteDto, McqDto, McqUpdateDto } from './mcq.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ExamineeGuard } from 'src/user-role/examinee/examinee.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Types } from 'mongoose';

@Controller('mcq')
@UseGuards(AuthGuard, ExamineeGuard)
export class McqController {
    constructor(
        private readonly mcqService: McqService,
    ){}

    @Post('create')
    @ApiBearerAuth()
    createMcq(@Body() mcqDto: McqDto) {
        return this.mcqService.createMcq({
            mcq: mcqDto,
            qpId: mcqDto.QPid,
        });
    }

    @Patch('update')
    @ApiBearerAuth()
    updateMcq(@Body() mcqUpdateDto: McqUpdateDto) {
        return this.mcqService.updateMcq({
            credentials: mcqUpdateDto,
        });
    }

    @Delete('delete')
    @ApiBearerAuth()
    deleteMcq(@Body() mcqDeleteDto: McqDeleteDto) {
        return this.mcqService.deleteMcq({
            id: mcqDeleteDto,
        });
    }

}
