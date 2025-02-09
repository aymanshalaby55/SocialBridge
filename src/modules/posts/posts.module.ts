import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { LikesService } from '../likes/likes.service';
import { CommentsService } from '../comments/comments.service';

@Module({
  imports: [],
  providers: [PostsService, PostsResolver, LikesService , CommentsService],
  exports: [PostsService],
})
export class PostsModule {}
