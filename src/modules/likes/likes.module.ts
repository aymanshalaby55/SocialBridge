import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesResolver } from './likes.resolver';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [
    LikesService,
    LikesResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class LikesModule {}
