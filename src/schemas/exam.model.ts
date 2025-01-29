import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class Exam {
    @Prop({ required: true, default: false })
    isSubmitted: boolean;

    @Prop({ type: Array, required: true })
    answerSheet: {
        McqId: mongoose.Schema.Types.ObjectId;
        answer: number
    }[];

    @Prop()
    startTime?: Date;

    @Prop()
    endTime?: Date;

    @Prop()
    totalMarks?: number;

    @Prop({ required: true, default: false })
    isDeleted: boolean;

    @Prop({ required: true, unique: true })
    questionPaperId: string;

    @Prop({ required: true })
    candidId: mongoose.Schema.Types.ObjectId;


    @Prop({ default: 0 })
    acquiredMark: number;
}

export type ExamDocument = HydratedDocument<Exam>;
export const ExamSchema = SchemaFactory.createForClass(Exam);