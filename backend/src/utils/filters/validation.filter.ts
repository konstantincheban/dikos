import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Error } from 'mongoose';
import ValidationError = Error.ValidationError;

@Catch(ValidationError)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp(),
      response = ctx.getResponse();

    return response.status(400).json({
      statusCode: 400,
      createdBy: 'ValidationFilter',
      message: exception.message,
    });
  }
}
