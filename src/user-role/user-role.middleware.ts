import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from 'src/schemas/user.model';
import { ExtendedHeaderDto } from 'src/user/user.dto';

type customRequestType = Request & ExtendedHeaderDto

/**
 * Base Role Middleware to be extended by specific role middlewares
 */
abstract class BaseRoleMiddleware implements NestMiddleware {
    constructor(private readonly allowedRole: UserRole) {}

    use(req: customRequestType, res: Response, next: NextFunction) {
        const user = req.user; // Assumes authentication middleware has attached `req.user`
        console.log(user);
        
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }

        if (user.role !== this.allowedRole) {
            throw new ForbiddenException(`Access denied for role: ${user.role}`);
        }

        next();
    }
}

/**
 * Middleware for Admin Role
 */
@Injectable()
export class AdminMiddleware extends BaseRoleMiddleware {
    constructor() {
        super(UserRole.ADMIN);
    }
}

/**
 * Middleware for Candidate Role
 */
@Injectable()
export class CandidateMiddleware extends BaseRoleMiddleware {
    constructor() {
        super(UserRole.CANDIDATE);
    }
}

/**
 * Middleware for Examinee Role
 */
@Injectable()
export class ExamineeMiddleware extends BaseRoleMiddleware {
    constructor() {
        super(UserRole.EXAMINEE);
    }
}
