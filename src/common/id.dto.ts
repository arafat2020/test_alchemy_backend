import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class MongoId extends createZodDto(z.object({
    _id: z.custom<Types.ObjectId>((val) =>
      Types.ObjectId.isValid(val as any),
      { message: "Invalid ObjectId" }
    )
})){
    @ApiProperty({ example: "65f4c0eac4561b2f98e0d123", description: "Unique identifier of the document" })
    _id: Types.ObjectId;  // Use Types.ObjectId from Mongoose for type safety
}