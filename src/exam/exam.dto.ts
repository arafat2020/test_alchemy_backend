import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { createZodDto } from "nestjs-zod";
import { EndExamSchema, ExamSchema } from "src/interfaces/exam.interface";

export class StartExamDto extends createZodDto(ExamSchema) {
    @ApiProperty({ example: "4646465416546541", description: "Start time of the exam" })
    startTime: string;
  
    @ApiProperty({ example: "some-unique-id", description: "Question paper ID" })
    questionPaperId: string;
  
    @ApiProperty({ example: "some-unique-candid-id", description: "Candidate ID" })
    candidId: Types.ObjectId;
  }

  export class EndExamDto extends createZodDto(EndExamSchema) {
    @ApiProperty({ example: "some-unique-id", description: "Exam ID" })
    Exam_id: Types.ObjectId;
  
    @ApiProperty({ example: "53416546484164889684", description: "End time of the exam" })
    endTime: string;
  
    @ApiProperty({ example: true, description: "Submission status of the exam" })
    isSubmitted: boolean;
  
    @ApiProperty({ 
      example: [{ McqId: "mcq1", answer: 2 }],
      description: "Array of answered MCQs"
    })
    answerSheet: { mcqId: string; answer: number }[];
  }