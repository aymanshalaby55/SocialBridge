import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctxType = host.getType();

    // Handle GraphQL context
    const info = host.getArgByIndex(2); // Extract GraphQL info object
    const context = host.switchToRpc().getContext();

    this.logger.error(`GraphQL Unhandled exception: ${exception}`);

    // Return the error in a format compatible with GraphQL
    return {
      errors: [
        {
          message: 'Internal server error',
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            exception: {
              stacktrace: exception.stack?.split('\n').slice(0, 5), // Optional: Include partial stack trace
            },
          },
        },
      ],
    };
  }
}
