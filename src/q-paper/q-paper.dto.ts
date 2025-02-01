import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import mongoose from "mongoose";
import { createZodDto } from "nestjs-zod";
import { createQuestionPaperSchema, updateQuestionPaperSchema } from "src/interfaces/q-paper.interface";
import { z } from "zod";


// Create DTO class using the schema
export class CreateQuestionPaperDto extends createZodDto(createQuestionPaperSchema) {
    @ApiProperty({ example: 60, description: "Duration of the exam in minutes", minimum: 1 })
    duration: number;

    @ApiProperty({ example: "Final Exam 2025", description: "The name of the question paper" })
    name: string;

    @ApiProperty({ example: 0, description: "Initial mark 0" })
    totalMarks: number;
}

export class UpdateQuestionPaperDto extends createZodDto(updateQuestionPaperSchema) {
    @ApiProperty({ example: "65f4c0eac4561b2f98e0d123", description: "Unique identifier of the question paper" })
    id: mongoose.Types.ObjectId;
  
    @ApiPropertyOptional({ example: 60, description: "Duration of the exam in minutes", minimum: 1 })
    duration?: number;
  
    @ApiPropertyOptional({ example: 100, description: "Total marks for the exam" })
    totalMarks?: number;
  
    @ApiPropertyOptional({
      example: ["65f4c0eac4561b2f98e0d456"],
      description: "Array of MCQ question IDs",
    })
    MCQSet?: mongoose.Types.ObjectId[];
  
    @ApiPropertyOptional({
      example: "65f4c0eac4561b2f98e0d789",
      description: "ID of the examinee associated with this question paper",
    })
    examineeId?: mongoose.Types.ObjectId;
  
    @ApiPropertyOptional({ example: false, description: "Indicates whether the question paper is deleted" })
    isDeleted?: boolean;
  
    @ApiPropertyOptional({ example: "Final Exam 2025", description: "The name of the question paper" })
    name?: string;
  }

  export class DeleteOrGetQuestionPaperDto extends createZodDto(z.object({
    id: z.string()  // Make sure the id is a valid ObjectId type  // z.string().uuid() would also work for UUID validation  // z.string().matches(new RegExp(/^[a-fA-F0-9]{24}$/)) would work for exact 24-character hexadecimal string validation  // z.string().custom((value, context) => { if (!mongoose.isValidObjectId(value)) { throw new Error('Invalid ObjectId') } return true }) would work for a custom validation function  // Note: this validation is not performed in the controller, it is done here for demonstration purposes  // In a real-world application, you would add the validation logic in the controller  // Note: this validation is not performed in the controller, it is done here for demonstration purposes  // In a real-world application, you would add the validation logic in the controller  // Note
  })){
    @ApiProperty({ example: "65f4c0eac4561b2f98e0d123", description: "Unique identifier of the question paper" })
    id: string;
  }

  export class SearchQuestionPaperDto extends createZodDto(z.object({
    searchTerm: z.optional(z.string())
  })){
    @ApiProperty({ example: "Final Exam", description: "Search term for searching " })
    searchTerm: string;
  }