import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { LikesService } from '../likes/likes.service';
import { CommentsService } from '../comments/comments.service';
import { UploadService } from '../upload/upload.service';
import { pubSubProvider } from '../../common/providers/pubSub.provider';

@Module({
  providers: [
    PostsService,
    PostsResolver,
    LikesService,
    CommentsService,
    UploadService,
    pubSubProvider,
  ],
  exports: [PostsService],
})
export class PostsModule {}
