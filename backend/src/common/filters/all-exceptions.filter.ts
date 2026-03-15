import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        console.error('Exception caught:', exception);

        const responseBody = typeof message === 'string'
            ? { statusCode: status, timestamp: new Date().toISOString(), message }
            : { statusCode: status, timestamp: new Date().toISOString(), ...(message as object) };

        response.status(status).json(responseBody);
    }
}
