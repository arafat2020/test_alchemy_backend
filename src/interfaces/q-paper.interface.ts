import { z } from "zod";
import mongoose from "mongoose";

// Define Zod schema for QuestionPaper
export const QuestionPaperSchema = z.object({
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  totalMarks: z.number().optional(),
  MCQSet: z.optional(z.array(z.instanceof(mongoose.Types.ObjectId))), // Reference to MCQs
  examineeId: z.instanceof(mongoose.Schema.Types.ObjectId),
  isDeleted: z.boolean().default(false),
  name: z.string().min(1, "Name is required"),
});

export const createQuestionPaperSchema = z.object({
    duration: z.number().min(1, "Duration must be at least 1 minute"),
    name: z.string().min(1, "Name is required"),
    examineeId: z.instanceof(mongoose.Schema.Types.ObjectId),

})

// Type inference from schema
export type QuestionPaperType = z.infer<typeof QuestionPaperSchema>;
export type createQuestionPaperType = z.infer<typeof createQuestionPaperSchema>;
