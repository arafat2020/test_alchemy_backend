import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { QPaperService } from './q-paper.service';
import { CreateQuestionPaperDto } from './q-paper.dto';
import { ExamineeGuard } from 'src/user-role/examinee/examinee.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ExtendedHeaderDto } from 'src/user/user.dto';

@Controller('q-paper')
@UseGuards(AuthGuard)
export class QPaperController {
    constructor(
        private readonly qPaperService: QPaperService,
    ){}

    @Post("create")
    @UseGuards(ExamineeGuard)
    @ApiBearerAuth()
    async createQuestionPaper(
        @Body() credentials: CreateQuestionPaperDto,
        @Req() req:ExtendedHeaderDto
    ) {
        if (!req.user?.id) return UnauthorizedException
        return await this.qPaperService.createQuestionPaper({
            credentials:{
                examineeId: req.user?.id,
                duration: credentials.duration,
                name: credentials.name,
            }
        });
    }

    @Post("get-all")
    @ApiBearerAuth()
    @UseGuards(ExamineeGuard)
    async getAllQuestionPapers() {
        return await this.qPaperService.getAllQuestionPapers();
    }
}
