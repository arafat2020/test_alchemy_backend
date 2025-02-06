import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ExamService } from './exam.service';
import { EndExamDto, StartExamDto } from './exam.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CandidateGuard } from 'src/user-role/candidate/candidate.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('exam')
@UseGuards(AuthGuard, CandidateGuard)
export class ExamController {
    constructor(public examService: ExamService){}

    @Post('start')
    @ApiBearerAuth()
    async startExam(@Body() payload: StartExamDto) {
        console.log(isNaN(Number(payload.startTime)));
        
        return this.examService.startExam({
            credential: payload
        });
    }

    @Post('end')
    @ApiBearerAuth()
    async endExam(@Body() payload: EndExamDto) {
        const { id } = payload;
        await this.examService.endExam(id, payload);
    }
}
