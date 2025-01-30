import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Mcq } from "./mcq.model";

@Schema({ timestamps: true })
export class QuestionPaper {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    duration: number;

    @Prop()
    totalMarks?: number;

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mcq' }]
    })
    MCQSet: Mcq[];

    @Prop({ required: true })
    examineeId: string;

    @Prop({ required: true, default: false })
    isDeleted: boolean;
}

export type QuestionPaperDocument = HydratedDocument<QuestionPaper>;
export const QuestionPaperSchema = SchemaFactory.createForClass(QuestionPaper);
QuestionPaperSchema.index({ 
    name: "text",
 });

 QuestionPaperSchema.pre("findOneAndDelete", async function (next) {
    const doc = await this.model.findOne(this.getQuery()).populate("MCQSet");
    if (doc) {
        await mongoose.model("Mcq").deleteMany({ _id: { $in: doc.MCQSet } });
    }
    next();
});

