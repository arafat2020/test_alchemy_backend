import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Query,
    Req,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { QPaperService } from './q-paper.service';
import {
    CreateQuestionPaperDto,
    DeleteOrGetQuestionPaperDto,
    SearchQuestionPaperDto,
    UpdateQuestionPaperDto
} from './q-paper.dto';
import { ExamineeGuard } from 'src/user-role/examinee/examinee.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ExtendedHeaderDto } from 'src/user/user.dto';
import { PaginationDto } from 'src/common/pagination.dto';

@Controller('q-paper')
@UseGuards(AuthGuard)
export class QPaperController {
    constructor(
        private readonly qPaperService: QPaperService,
    ) { }

    @Post("create")
    @UseGuards(ExamineeGuard)
    @ApiBearerAuth()
    async createQuestionPaper(
        @Body() credentials: CreateQuestionPaperDto,
        @Req() req: ExtendedHeaderDto
    ) {
        if (!req.user?.id) throw new UnauthorizedException()
        return await this.qPaperService.createQuestionPaper({
            credentials: {
                examineeId: req.user?.id,
                duration: credentials.duration,
                name: credentials.name,
            }
        });
    }

    @Get("get-all")
    @ApiBearerAuth()
    async getAllQuestionPapers(
        @Query() pagination: PaginationDto,
        @Req() req: ExtendedHeaderDto
    ) {
        return await this.qPaperService.getAllQuestionPapers({
            page: pagination,
            header: req
        });
    }

    @Get("get-by-id")
    @ApiBearerAuth()
    async getQuestionPapersByExamineeId(@Query() query: DeleteOrGetQuestionPaperDto) {
        return await this.qPaperService.getQuestionPaperById(query);
    }
    
    @Patch("update")
    @ApiBearerAuth()
    @UseGuards(ExamineeGuard)
    updateQuestion(@Body() updatedData: UpdateQuestionPaperDto) {
        const { id, ...rest } = updatedData
        return this.qPaperService.updateQuestionPaper({
            id: updatedData.id as unknown as string,
            updatedData: {
                name: rest.name,
                duration: rest.duration,
            },
        });
    }

    @Delete("delete")
    @ApiBearerAuth()
    @UseGuards(ExamineeGuard)
    deleteQuestion(@Body() body: DeleteOrGetQuestionPaperDto,
    ) {
        return this.qPaperService.deleteQuestionPaper(body)
    }

    @Get("search")
    @ApiBearerAuth()
    searchQuestion(@Query() query: SearchQuestionPaperDto) {
        return this.qPaperService.searchQuestionPaper({
            searchTerm: query.searchTerm,
        });
    }
}
