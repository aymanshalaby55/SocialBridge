import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { print } from 'graphql';

@Injectable()
export class GraphQLCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private generateCacheKey(context: ExecutionContext): string {
    const ctx = GqlExecutionContext.create(context);
    const info = ctx.getInfo();

    // Get the actual GraphQL query document
    const queryDocument = print(info.operation);

    const key = `graphql:${Buffer.from(queryDocument).toString('base64')}`;

    return key;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context);
    const info = ctx.getInfo();

    // Skip caching for mutations
    if (info.operation.operation !== 'query') {
      return next.handle();
    }

    const key = this.generateCacheKey(context);

    try {
      const cachedResponse = await this.cacheManager.get(key);
      if (cachedResponse) {
        return of(cachedResponse);
      }

      return next.handle().pipe(
        tap(async (response) => {
          if (response && !response.errors) {
            await this.cacheManager.set(key, response);
          }
        }),
      );
    } catch (error) {
      throw error();
      return next.handle();
    }
  }
}
