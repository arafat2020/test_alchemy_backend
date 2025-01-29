import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { 
  BaseHeaderSchema, 
  ExtendedHeaderSchema, 
  UserSigninSchema, 
  UserSignUpSchema 
} from "src/interfaces/user.interface";
import { UserRole } from "src/schemas/user.model";

export class UserDto extends createZodDto(UserSignUpSchema) {
    @ApiProperty({ example: 'John Doe', description: 'The user\'s full name' })
    name: string;

    @ApiProperty({ example: 'john_doe', description: 'The user\'s username' })
    username: string;

    @ApiProperty({ example: 'johndoe@example.com', description: 'The user\'s email address' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'The user\'s password (min 8 characters)' })
    password: string;

    @ApiProperty({ example: 'https://example.com/user-pic.jpg', description: 'URL of the user\'s profile picture' })
    pic: string;

    @ApiProperty({ example: '2025-01-01T00:00:00Z', description: 'The user\'s joining date' })
    joiningDate: Date;

    @ApiProperty({ example: true, description: 'User account active status' })
    active: boolean;

    @ApiProperty({ example: UserRole.CANDIDATE, enum: UserRole, description: 'User role' })
    role: UserRole;
}

export class UserSigninDto extends createZodDto(UserSigninSchema) {
    @ApiProperty({ example: 'johndoe@example.com', description: 'The user\'s email address' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'The user\'s password (min 8 characters)' })
    password: string;
}

export class BaseHeaderDto extends createZodDto(BaseHeaderSchema) { }
export class ExtendedHeaderDto extends createZodDto(ExtendedHeaderSchema) { }