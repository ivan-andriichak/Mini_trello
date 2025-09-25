import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, Observable, tap } from 'rxjs';

function maskSensitive(
  obj: Record<string, any>,
  keysToMask: string[] = ['password', 'token', 'refreshToken'],
): Record<string, any> {
  if (!obj || typeof obj !== 'object') return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      keysToMask.includes(key.toLowerCase())
        ? [key, '***hidden***']
        : [key, value],
    ),
  );
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const { method, originalUrl, body, headers } = req;
    const start = Date.now();

    this.logger.log(
      // eslint-disable-next-line max-len
      `Incoming Request: ${method} ${originalUrl} | Body: ${JSON.stringify(maskSensitive(body))} | Headers: ${JSON.stringify(maskSensitive(headers))}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - start;
        const statusCode: number = res.statusCode;

        this.logger.log(
          // eslint-disable-next-line max-len
          `Response: ${method} ${originalUrl} | Status: ${statusCode} | Duration: ${duration}ms | Response Body: ${JSON.stringify(maskSensitive(data))}`,
        );
      }),
      catchError((err) => {
        const duration = Date.now() - start;
        const statusCode: number = res.statusCode;

        this.logger.error(
          // eslint-disable-next-line max-len
          `Error: ${method} ${originalUrl} | Status: ${statusCode} | Duration: ${duration}ms | Message: ${err?.message}`,
          err?.stack,
        );
        throw err;
      }),
    );
  }
}
