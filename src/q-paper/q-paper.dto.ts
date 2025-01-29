import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { createQuestionPaperSchema } from "src/interfaces/q-paper.interface";


// Create DTO class using the schema
export class CreateQuestionPaperDto extends createZodDto(createQuestionPaperSchema) {
    @ApiProperty({ example: 60, description: "Duration of the exam in minutes", minimum: 1 })
    duration: number;

    @ApiProperty({ example: "Final Exam 2025", description: "The name of the question paper" })
    name: string;
}
