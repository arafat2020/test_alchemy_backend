import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mcq, McqDocument } from 'src/schemas/mcq.model';
import { McqDeleteDto, McqDto, McqUpdateDto } from './mcq.dto';
import { QuestionPaper, QuestionPaperDocument } from 'src/schemas/q-peaper.model';

@Injectable()
export class McqService {
    constructor(
        @InjectModel(Mcq.name) private readonly McqModel: Model<McqDocument>,
        @InjectModel(QuestionPaper.name) private readonly QuestionModel: Model<QuestionPaperDocument>
    ) { }

    public async createMcq({
        mcq,
        qpId
    }: {
        qpId: string
        mcq: McqDto
    }): Promise<McqDocument> {
        const createdMcq = await this.McqModel.create(mcq);
        await this.QuestionModel.findByIdAndUpdate(qpId, {
            $push: {
                MCQSet: createdMcq.id
            }
        }, {
            new: true
        })
        return createdMcq;
    }

    public async updateMcq({
        credentials
    }: {
        credentials: McqUpdateDto
    }): Promise<McqDocument> {
        const updated = await this.McqModel.findByIdAndUpdate(credentials.id, {
            $set: {
                question: credentials.question,
                options: credentials.options,
                correctAns: credentials.correctAns,
                mark: credentials.mark
            }
        }, {
            new: true
        })
        if (!updated) throw new HttpException('MCQ not found', HttpStatus.NOT_FOUND)
        return updated
    }

    public async deleteMcq({
        id
    }:{
        id: McqDeleteDto
    }): Promise<{
        msg: string
    }> {
        const deleted = await this.McqModel.deleteOne({
            _id: id.id
        })

        if (!deleted.acknowledged) throw new HttpException('MCQ not found', HttpStatus.NOT_FOUND)
        return {
            msg: 'MCQ deleted successfully'
        }
    }
}
