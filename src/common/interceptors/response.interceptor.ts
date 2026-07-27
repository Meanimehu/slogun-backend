import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data: any): ApiResponse<T> => {
        
        let resultData: any = null;
        let message = 'Success';
        let meta = undefined;
        let statusCode = res.statusCode || HttpStatus.OK;

        // Check if handler used success() helper
        if (data && typeof data === 'object' && 'data' in data) {
          resultData = data.data ?? null;
          message = data.message || message;
          meta = data.meta;
          statusCode = data.statusCode || statusCode;
        } else if (data === undefined || data === null) {
          resultData = null;
        } else {
          resultData = data;
        }

        // Handle 204 No Content
        if (statusCode === HttpStatus.NO_CONTENT) {
          res.status(HttpStatus.NO_CONTENT);
          return {
            statusCode: HttpStatus.NO_CONTENT,
            message: 'No Content',
            data: null,
            timestamp: new Date().toISOString(),
            path: req.url,
          };
        }

        // Set actual HTTP status
        res.status(statusCode);

        return {
          statusCode,
          message,
          data: resultData,
          timestamp: new Date().toISOString(),
          path: req.url,
          ...(meta ? { meta } : {})
        };
      }),
    );
  }
}