import { z } from "zod";
import { Types } from "mongoose";

const ObjectIdSchema = z.custom<Types.ObjectId>((val) =>
  Types.ObjectId.isValid(val as any),
  { message: "Invalid ObjectId" }
);

export const ExamSchema = z.object({
  isSubmitted: z.boolean().default(false),
  answerSheet: z.array(
    z.object({
      McqId: ObjectIdSchema,
      answer: z.number(),
    })
  ),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  totalMarks: z.number().optional(),
  isDeleted: z.boolean().default(false),
  questionPaperId: z.string().uuid(),
  candidId: ObjectIdSchema,
  acquiredMark: z.number().default(0),
});

export const EndExamSchema = z.object({
    id: z.string().min(1),
    endTime: z.string().optional(),
    isSubmitted: z.boolean(),
    answerSheet: z.array(
      z.object({
        mcqId: z.string(),
        answer: z.number()
      })
    )
  });

export type ExamType = z.infer<typeof ExamSchema>;
export type EndExamType = z.infer<typeof EndExamSchema>;
