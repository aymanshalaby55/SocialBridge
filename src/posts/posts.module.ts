import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';

@Module({
  imports: [],
  providers: [PostsService, PostsResolver],
  exports: [PostsService],
})
export class PostsModule {}
