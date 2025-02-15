import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
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
    }):Promise<{
        exam: ExamDocument;
        questionPaper: {
            McqId: string;
            question: string;
            options: string[];
        }[]
    }> {
        if (isNaN(Number(credential.startTime))) throw new BadRequestException("Invalid start time");

        const startExam = await this.ExamModel.create(credential);
        const QuestionPaper = await this.QuestionPaperModel.findById(startExam.questionPaperId).populate("MCQSet")

        if (!QuestionPaper) {
            throw new HttpException("No QuestionPaper found", 404);
        }

        return {
            exam: startExam,
            questionPaper: QuestionPaper.MCQSet.map(e=> {
                return {
                    McqId: e.McqId,
                    question: e.question,
                    options: e.options,
                }
            })
        };
    }

    public async endExam(id: Types.ObjectId, payload: EndExamDto) {
        if (isNaN(Number(payload.endTime))) throw new BadRequestException("Invalid end time");
        console.log(id);
        
        const exam = await this.ExamModel.findByIdAndUpdate(
            id,
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
            console.log(answer);
            
            const mcq = answerSheet.find((e) => e.McqId === answer.McqId && e.answer === answer.correctAns);
            const wrongMcq = answerSheet.find((e) => e.McqId === answer.McqId && e.answer !== answer.correctAns);
            
            if (mcq) {
                acquiredMark += answer.mark;
                reportSheet.push({
                    questionId: answer.McqId,
                    correctAnswer: answer.correctAns,
                    studentAnswer: mcq.answer,
                });
            } else if (wrongMcq) {
                reportSheet.push({
                    questionId: answer.McqId,
                    correctAnswer: answer.correctAns,
                    studentAnswer: wrongMcq.answer,
                });
            } else {
                reportSheet.push({
                    questionId: answer.McqId,
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
        console.log(startTime, endTime);
        
        const start = new Date(parseInt(startTime)).getTime();
        const end = new Date(parseInt(endTime)).getTime();
        console.log(start, end, duration);
        
        return end - start <= duration * 60000; // Convert minutes to milliseconds
    }
}
