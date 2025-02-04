import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PostsService } from '../posts/posts.service';

@Module({
  providers: [UserResolver, UserService, PostsService],
})
export class UserModule {}
