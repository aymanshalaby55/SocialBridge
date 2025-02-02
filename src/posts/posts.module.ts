import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  providers: [PostsService, PostsResolver, PrismaService],
})
export class PostsModule {}
