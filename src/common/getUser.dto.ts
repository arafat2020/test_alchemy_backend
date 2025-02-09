import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { UserRole } from 'src/schemas/user.model';

// Define Zod Schema
const GetUsersByAdminSchema = z.object({
  userType: z.nativeEnum(UserRole),
  skip: z.number().min(0).optional(),
  take: z.number().min(1).optional(),
});

export class GetUsersByAdminWithPaginationDto extends createZodDto(GetUsersByAdminSchema) {
  @ApiProperty({ example: UserRole.CANDIDATE, enum: UserRole, description: 'User role to filter' })
  userType: UserRole;

  @ApiPropertyOptional({ example: 0, description: 'Number of records to skip' })
  skip?: number;

  @ApiPropertyOptional({ example: 10, description: 'Number of records to take' })
  take?: number;
}
