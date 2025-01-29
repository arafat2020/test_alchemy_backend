import mongoose from "mongoose";
import { UserRole } from "src/schemas/user.model";
import { z } from "zod";



export const UserSignUpSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  joiningDate: z.date().default(() => new Date()),
  active: z.boolean(),
  role: z.nativeEnum(UserRole),
});

export const UserSigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const BaseHeaderSchema = z.object({
  authorization: z.string().min(1, 'Authorization header is required'),
  'x-custom-header': z.string().optional(),
});

export const ExtendedHeaderSchema = BaseHeaderSchema.extend({
  user: z.object({
    id: z.instanceof(mongoose.Schema.Types.ObjectId),
    iat: z.string(),
    exp: z.string(),
    role: z.nativeEnum(UserRole)
  }).optional(),
});

export type UserFormHeaderSchema = z.infer<typeof ExtendedHeaderSchema>;
export type UserSignUpType = z.infer<typeof UserSignUpSchema>;
export type UserLoginType = z.infer<typeof UserSigninSchema>;
