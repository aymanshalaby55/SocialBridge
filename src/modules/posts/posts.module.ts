import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { LikesService } from '../likes/likes.service';
import { CommentsService } from '../comments/comments.service';
import { UploadService } from '../upload/upload.service';

@Module({
  providers: [
    PostsService,
    PostsResolver,
    LikesService,
    CommentsService,
    UploadService,
  ],
  exports: [PostsService],
})
export class PostsModule {}
