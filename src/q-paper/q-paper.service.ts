import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createQuestionPaperType } from 'src/interfaces/q-paper.interface';
import { QuestionPaper, QuestionPaperDocument } from 'src/schemas/q-peaper.model';
import { DeleteOrGetQuestionPaperDto } from './q-paper.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { ExtendedHeaderDto } from 'src/user/user.dto';

@Injectable()
export class QPaperService {
    constructor(
        @InjectModel(QuestionPaper.name) private QuestionPaperModel: Model<QuestionPaperDocument>
    ) { }

    public async createQuestionPaper({
        credentials
    }: {
        credentials: createQuestionPaperType
    }): Promise<QuestionPaperDocument> {
        return this.QuestionPaperModel.create(credentials);
    }

    public async getAllQuestionPapers(
        { 
            page,
            header
        }: {
            page: PaginationDto,
            header: ExtendedHeaderDto
        }
      ): Promise<{ total: number; data: QuestionPaperDocument[] }> {
        const [total, data] = await Promise.all([
          this.QuestionPaperModel.countDocuments({ 
            isDeleted: false,
            examineeId: header.user?.id
         }), // Total count
          this.QuestionPaperModel.find({ 
            isDeleted: false,
            examineeId: header.user?.id
         })            // Paginated data
            .sort({ _id: "asc" })
            .skip(page.skip ?? 0)
            .limit(page.take ?? 10)
            .exec(),
        ]);
      
        return { total, data };
      }

    public async getQuestionPaperById({ id }: DeleteOrGetQuestionPaperDto): Promise<QuestionPaperDocument> {
        const data = await this.QuestionPaperModel.findOne({
            _id: id
        })
        .populate("MCQSet")
        .exec();

        if (!data) {
            throw new HttpException('Question Paper not found', HttpStatus.NOT_FOUND);
        }

        return data
    }

    public async updateQuestionPaper({ id, updatedData }: { id: string, updatedData: Partial<QuestionPaper> }): Promise<QuestionPaperDocument> {
        const data = await this.QuestionPaperModel.findByIdAndUpdate(id, updatedData, { new: true }).exec();

        if (!data) {
            throw new HttpException('Question Paper not found', HttpStatus.NOT_FOUND);
        }

        return data
    }

    public async deleteQuestionPaper({ id }: DeleteOrGetQuestionPaperDto): Promise<{
        msg: string
    }> {
        await this.QuestionPaperModel.findOneAndUpdate({
            _id: id
        }, {
            isDeleted: true
        }, {
            new: true
        }).exec();

        return {
            msg: 'Question Paper deleted successfully'
        }
    }

    public async searchQuestionPaper({
        searchTerm
    }: {
        searchTerm: string
    }): Promise<QuestionPaperDocument[]> {
        await this.QuestionPaperModel.syncIndexes();
        return this.QuestionPaperModel.find({
            $text:{
                $search: searchTerm
            },
            isDeleted: false
        }).exec();
    }

}
