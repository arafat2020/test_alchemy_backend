import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from 'src/schemas/user.model';
import { ExtendedHeaderDto } from 'src/user/user.dto';
type customRequestType = Request & ExtendedHeaderDto

@Injectable()
export class ExamineeGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<customRequestType>();
        const user = request.user;

        if (!user || user.role !== UserRole.EXAMINEE) {
            throw new ForbiddenException('Access denied: Examinees only');
        }

        return true;
    }
}
