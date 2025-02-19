import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PostsService } from '../posts/posts.service';
import { FriendsService } from '../friends/friends.service';
import { LikesService } from '../likes/likes.service';
import { CommentsService } from '../comments/comments.service';
import { GraphQLCacheInterceptor } from 'src/common/interceptors/cache.interceptor';
import { pubSubProvider } from '../../common/providers/pubSub.provider';

@Module({
  providers: [
    UserResolver,
    UserService,
    PostsService,
    FriendsService,
    LikesService,
    CommentsService,
    pubSubProvider,
  ],
})
export class UserModule {}
