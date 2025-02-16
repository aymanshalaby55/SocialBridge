import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class CookiesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const { res: response } = ctx.getContext();

    if (!response) {
      throw new Error('Response object not found in context');
    }

    return next.handle().pipe(
      tap((data) => {
        if (!data) {
          throw new Error('No token data found to set cookie');
        }

        response.cookie('jwt', data, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000,
        });
      }),
    );
  }
}
