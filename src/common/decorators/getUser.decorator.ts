import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx);
    const request = gqlContext.getContext().req;

    if (!request.user) {
      throw new Error('User not found in request');
    }

    return request.user;
  },
);
