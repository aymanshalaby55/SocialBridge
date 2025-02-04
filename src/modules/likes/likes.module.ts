import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesResolver } from './likes.resolver';

@Module({
  providers: [LikesService, LikesResolver],
})
export class LikesModule {}
