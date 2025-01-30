import { z } from "zod";

// Zod schema for MCQ
export const McqSchemaZod = z.object({
    QPid: z.string().uuid(), // Assuming QPid is a UUID
    question: z.string().min(1, "Question is required"),
    options: z.array(z.string()).min(2, "There must be at least two options"), // Options must be an array of strings
    correctAns: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]), // Correct answer must be one of 0, 1, 2, or 3
    mark: z.number().min(1, "Mark must be at least 1"), // Mark must be a positive number
});


// Zod schema for updating MCQ, making fields optional
export const McqUpdateSchema = z.object({
  id: z.string().uuid().optional(), // Make id optional, assuming it’s passed in URL, not body
  question: z.string().min(1, "Question is required").optional(), // Make question optional for update
  options: z.array(z.string()).min(2, "There must be at least two options").optional(), // Make options optional for update
  correctAns: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).optional(), // Make correctAns optional for update
  mark: z.number().min(1, "Mark must be at least 1").optional(), // Make mark optional for update
});

export type McqUpdateDto = z.infer<typeof McqUpdateSchema>; // This generates the DTO type from the schema


export type McqDto = z.infer<typeof McqSchemaZod>; // This gives you the TypeScript type of the schema
