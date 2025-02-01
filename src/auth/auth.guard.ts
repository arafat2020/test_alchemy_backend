import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  HttpException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from "@nestjs/config/dist/config.service";
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.model';
import { Model } from 'mongoose';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);    
    if (!token) {
      throw new HttpException("Token Not Provided",401);
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: new ConfigService().get("JWT_SECRET")
        }
      );
      const user = await this.UserModel.findById(payload.id)
      if (!user) {
        throw new HttpException("User Not Found",401);
      }
      if (!user.active) {
        throw new HttpException("User is not Logged in",401);
      }
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  
}