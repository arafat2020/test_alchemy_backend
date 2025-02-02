import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

@Schema({ timestamps: true })
export class Exam {
    @Prop({ required: true, default: false })
    isSubmitted: boolean;

    @Prop({ type: Array, default: [] })
    answerSheet: {
        McqId: string;
        answer: number
    }[];

    @Prop({
        default: `${Date.now()}`,
    })
    startTime?: string;

    @Prop()
    endTime?: string;

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