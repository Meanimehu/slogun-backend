import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse, ApiFieldError } from '../interfaces/api.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    let status: number;
    let message: string;
    let errorName: string;
    let fieldErrors: ApiFieldError[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        // Simple string error
        message = response;
        errorName = HttpStatus[status] || 'Error';
        
      } else if (typeof response === 'object' && response !== null) {
        const resp = response as any;
        
        // Validation errors (array of messages)
        if (Array.isArray(resp.message)) {
          fieldErrors = this.extractFieldErrors(resp.message);
          message = fieldErrors.length > 0 ? fieldErrors[0].message : 'Validation failed';
          errorName = resp.error || 'Bad Request';
        } 
        // Object with message
        else {
          message = resp.message || exception.message;
          errorName = resp.error || HttpStatus[status] || 'Error';
        }
      } else {
        message = exception.message;
        errorName = HttpStatus[status] || 'Error';
      }
      
    } else {
      // Unknown/unhandled errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      errorName = 'Internal Server Error';
      
      // Log the real error for debugging
      this.logger.error('Unhandled exception:', exception);
    }

    const payload: ApiErrorResponse = {
      statusCode: status,
      message,
      error: errorName,
      timestamp: new Date().toISOString(),
      path: req.url,
    };

    if (fieldErrors && fieldErrors.length > 0) {
      payload.errors = fieldErrors;
    }

    res.status(status).json(payload);
  }

  // Extract field-level errors from validation messages
  private extractFieldErrors(messages: any[]): ApiFieldError[] {
    const errors: ApiFieldError[] = [];

    for (const msg of messages) {
      if (typeof msg === 'string') {
        // "email must be a valid email" → field: "email"
        const field = msg.split(' ')[0]?.toLowerCase() || 'unknown';
        errors.push({ field, message: msg });
      } else if (typeof msg === 'object' && msg.property && msg.constraints) {
        // ValidationPipe detailed error
        const field = msg.property;
        const message = Object.values(msg.constraints).join(', ');
        errors.push({ field, message });
      }
    }

    return errors;
  }
}