import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mcq, McqDocument } from 'src/schemas/mcq.model';

@Injectable()
export class McqService {
    constructor(
          @InjectModel(Mcq.name) private readonly UserModel: Model<McqDocument>,
    ){}

    async create(mcq: Mcq): Promise<McqDocument> {
        const createdMcq = new this.UserModel(mcq);
        return createdMcq.save();
    }
}
