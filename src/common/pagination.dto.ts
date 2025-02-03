import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { ApiPropertyOptional } from "@nestjs/swagger";

const paginationSchema = z.object({
  take: z.number()
    .min(1, { message: "Take must be at least 1" })
    .max(100, { message: "Take cannot exceed 100" })
    .optional()
    .default(10),
  skip: z.number()
    .min(0, { message: "Skip cannot be negative" })
    .optional()
    .default(0),
});

export class PaginationDto extends createZodDto(paginationSchema) {
  @ApiPropertyOptional({ description: "Number of items to take", minimum: 1, maximum: 100, default: 10 })
  take: number
  @ApiPropertyOptional({ description: "Number of items to skip", minimum: 0, default: 0 })
  skip: number;
} 
