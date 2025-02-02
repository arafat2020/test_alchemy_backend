import { ApiProperty } from '@nestjs/swagger'; // Optional: If you're using Swagger for API documentation
import { Types } from 'mongoose';
import { createZodDto } from 'nestjs-zod'; // Assumed helper function to create DTOs from Zod schemas
import { McqSchemaZod, McqUpdateSchema } from 'src/interfaces/mcq.interface';
import { z } from 'zod';

// Define the McqDto class extending createZodDto
export class McqDto extends createZodDto(McqSchemaZod) {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The UUID of the question paper' })
  QPid: string;

  @ApiProperty({ example: 'What is the capital of France?', description: 'The question text' })
  question: string;

  @ApiProperty({ example: ['Paris', 'London', 'Berlin', 'Madrid'], description: 'The options for the MCQ' })
  options: string[];

  @ApiProperty({ example: 1, description: 'The index of the correct answer in the options array (1-4)' })
  correctAns:  1 | 2 | 3 | 4;

  @ApiProperty({ example: 5, description: 'The mark awarded for this question' })
  mark: number;
}

export class McqUpdateDto extends createZodDto(McqUpdateSchema) {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The UUID of the question paper' })
    QPid?: string; // Make it optional for updates
  
    @ApiProperty({ example: 'What is the capital of France?', description: 'The question text', required: false })
    question?: string; // Make it optional for updates
  
    @ApiProperty({
      example: ['Paris', 'London', 'Berlin', 'Madrid'],
      description: 'The options for the MCQ',
      required: false,
    })
    options?: string[]; // Make it optional for updates
  
    @ApiProperty({ example: 0, description: 'The index of the correct answer in the options array (0-3)', required: false })
    correctAns?: 0 | 1 | 2 | 3; // Make it optional for updates
  
    @ApiProperty({ example: 5, description: 'The mark awarded for this question', required: false })
    mark?: number; // Make it optional for updates
  }

  export class McqDeleteDto extends createZodDto(z.object({
    id: z.instanceof(Types.ObjectId)
  })){
    @ApiProperty({ example: '65f4c0eac4561b2f98e0d123', description: 'The unique identifier of the MCQ' })
    id: Types.ObjectId; // Use Types.ObjectId from Mongoose for type safety
  }
