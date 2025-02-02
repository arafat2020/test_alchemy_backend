import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { MongooseError } from 'mongoose';
  
  @Catch(MongooseError)
  export class MongooseExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      if (exception.name === 'CastError') {
        // Handle Mongoose CastError
        response.status(400).json({
          statusCode: 400,
          message: `Invalid ${exception.path}: ${exception.value}`,
          error: 'Bad Request',
        });
      } else {
        // For other Mongoose errors, you could log them or handle differently
        response.status(500).json({
          statusCode: 500,
          message: 'Internal Server Error',
        });
      }
    }
  }
  