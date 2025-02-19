import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as depthLimit from 'graphql-depth-limit';

import { PrismaService } from './prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { UserModule } from './modules/user/user.module';
import { LikesModule } from './modules/likes/likes.module';
import { CommentsModule } from './modules/comments/comments.module';
import { FriendsModule } from './modules/friends/friends.module';
import { AllServicesModule } from './common/providers/allServices.module';
import { UploadModule } from './modules/upload/upload.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { GraphQLCacheInterceptor } from './common/interceptors/cache.interceptor';
import { NotificationsModule } from './modules/notifications/notifications.module';
//
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': true,
      },
      autoSchemaFile: 'src/schema.graphql',
      context: ({ req, res }) => ({ req, res }),
      validationRules: [depthLimit(3)],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.getOrThrow<number>('CACHE_TTL'),
        stores: new KeyvRedis(configService.getOrThrow<string>('REDIS_SERVER')),
      }),
      inject: [ConfigService],
    }),
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

  providers: [
    PrismaService,
    {
      provide: 'GRAPHQL_CACHE_INTERCEPTOR',
      useClass: GraphQLCacheInterceptor,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
