import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { UserModule } from './modules/user/user.module';
import { LikesModule } from './modules/likes/likes.module';
import { CommentsModule } from './modules/comments/comments.module';
import { FriendsModule } from './modules/friends/friends.module';
import { AllServicesModule } from './common/providers/allServices.module';
import { UploadModule } from './modules/upload/upload.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { pubSubProvider } from './common/providers/pubSub.provider';
import { graphqlConfig } from './config/graphql.config';
import { redisConfig } from './config/redis.config';
import { GraphQLCacheInterceptor } from './common/interceptors/cache.interceptor';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    graphqlConfig,
    redisConfig,
    AuthModule,
    PostsModule,
    UserModule,
    LikesModule,
    CommentsModule,
    FriendsModule,
    AllServicesModule,
    UploadModule,
    NotificationsModule,
  ],
  providers: [PrismaService, pubSubProvider, GraphQLCacheInterceptor],
  exports: [PrismaService],
})
export class AppModule {}
