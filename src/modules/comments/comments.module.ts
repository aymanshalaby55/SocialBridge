import { Module } from '@nestjs/common';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [
    CommentsResolver,
    CommentsService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class CommentsModule {}
