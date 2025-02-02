import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


@Schema()
export class Mcq {
    @Prop({ required: true, ref: "QuestionPaper" })
    QPid: string;

    @Prop({ 
        required: true, 
        unique:true,
    })
    McqId: string;

    @Prop({ required: true })
    question: string;

    @Prop({ type: [String], required: true })
    options: string[];

    @Prop({ required: true, enum: [0, 1, 2, 3] })
    correctAns: number;

    @Prop({ required: true })
    mark: number;
}

export type McqDocument = HydratedDocument<Mcq>;
export const McqSchema = SchemaFactory.createForClass(Mcq);