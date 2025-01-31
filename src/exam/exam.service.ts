import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exam, ExamDocument } from 'src/schemas/exam.model';
import { StartExamDto, EndExamDto } from './exam.dto';
import { QuestionPaper, QuestionPaperDocument } from 'src/schemas/q-peaper.model';

@Injectable()
export class ExamService {
    constructor(
        @InjectModel(Exam.name) private readonly ExamModel: Model<ExamDocument>,
        @InjectModel(QuestionPaper.name) private readonly QuestionPaperModel: Model<QuestionPaperDocument>
    ) {}

    public async startExam({
        credential
    }: {
        credential: StartExamDto
    }) {
        return this.ExamModel.create(credential);
    }

    public async endExam(id: string, payload: EndExamDto) {
        const exam = await this.ExamModel.findOneAndUpdate(
            { _id: id },
            payload,
            { new: true }
        );

        if (!exam) {
            throw new NotFoundException('Exam not found');
        }

        const questionPaper = await this.QuestionPaperModel.findOne({ _id: exam.questionPaperId });
        
        if (!questionPaper) {
            throw new NotFoundException('Question paper not found');
        }

        if (!exam.startTime) {
            throw new HttpException("Data malformed", HttpStatus.BAD_REQUEST)
        }

        if (!this.isExamWithinDuration(exam.startTime as unknown as string, payload.endTime, questionPaper.duration)) {
            throw new BadRequestException('Time exceeded');
        }

        const { answerSheet } = exam;
        let acquiredMark = 0;
        let reportSheet: { questionId: string; correctAnswer: number; studentAnswer: number | null }[] = [];

        questionPaper.MCQSet.forEach((answer) => {
            const mcq = answerSheet.find((e) => e.McqId.toString() === answer.mcqId.toString() && e.answer === answer.correctAns);
            const wrongMcq = answerSheet.find((e) => e.mcqId.toString() === answer.mcqId.toString() && e.answer !== answer.correctAns);
            
            if (mcq) {
                acquiredMark += answer.mark;
                reportSheet.push({
                    questionId: answer.mcqId,
                    correctAnswer: answer.correctAns,
                    studentAnswer: mcq.answer,
                });
            } else if (wrongMcq) {
                reportSheet.push({
                    questionId: answer.mcqId,
                    correctAnswer: answer.correctAns,
                    studentAnswer: wrongMcq.answer,
                });
            } else {
                reportSheet.push({
                    questionId: answer.mcqId,
                    correctAnswer: answer.correctAns,
                    studentAnswer: null,
                });
            }
        });

        await this.ExamModel.updateOne({ _id: id }, { acquiredMark });

        return {
            acquiredMark,
            totalMarks: questionPaper.totalMarks,
            reportSheet,
        };
    }

    private isExamWithinDuration(startTime: string, endTime: string, duration: number): boolean {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        return end - start <= duration * 60000; // Convert minutes to milliseconds
    }
}
