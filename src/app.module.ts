import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Context, GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as depthLimit from 'graphql-depth-limit';
import { JwtService } from '@nestjs/jwt';
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
import { pubSubProvider } from './common/providers/pubSub.provider';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.graphql',
      installSubscriptionHandlers: true,
      sortSchema: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: async (connectionParams: any, _webSocket, context) => {
            console.log(connectionParams, Context);
            try {
              const jwtService = new JwtService({
                secret: process.env.JWT_SECRET,
              });

              if (!connectionParams.authToken) {
                throw new Error('Missing authentication token');
              }
              console.log(connectionParams);
              // Verify and decode the JWT token
              const payload = await jwtService.verifyAsync(
                connectionParams.authToken,
              );
              // Return the user info to be merged into the context
              return { user: payload };
            } catch (error) {
              throw new Error('Invalid or expired token');
            }
          },
        },
      },
      // Adjust the context to support both HTTP and WebSocket connections.
      context: ({ req, connection }) => {
        if (connection) {
          // For subscriptions, return the connection context which contains the user payload.
          return connection.context;
        }
        // For HTTP requests, return the request (and optionally response) object.
        return { req };
      },
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
    pubSubProvider,
    // {
    //   provide: 'GRAPHQL_CACHE_INTERCEPTOR',
    //   useClass: GraphQLCacheInterceptor,
    // },
  ],
  exports: [PrismaService],
})
export class AppModule {}
