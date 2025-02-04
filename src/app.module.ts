import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as depthLimit from 'graphql-depth-limit';

import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UserModule } from './user/user.module';
import { LikesModule } from './likes/likes.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.graphql',
      context: ({ req, res }) => ({ req, res }),
      validationRules: [depthLimit(3)],
    }),
    AuthModule,
    PostsModule,
    UserModule,
    LikesModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
