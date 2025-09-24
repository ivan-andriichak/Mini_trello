import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const {
      method,
      originalUrl,
      body,
      headers,
    }: {
      method: string;
      originalUrl: string;
      body: unknown;
      headers: unknown;
    } = req;
    const start = Date.now();

    this.logger.log(
      `Incoming Request: ${method} ${originalUrl} | Body: ${JSON.stringify(body)} | Headers: ${JSON.stringify(headers)}`,
    );

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(
        `Response: ${method} ${originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms`,
      );
    });

    next();
  }
}
