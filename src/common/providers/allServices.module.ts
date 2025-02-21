import { Global, Module } from '@nestjs/common';
// import { PrismaService } from '../../prisma.service';
// import { FriendsService } from '../../modules/friends/friends.service';
// import { PostsService } from '../../modules/posts/posts.service';
// import { UserService } from '../../modules/user/user.service';
// import { LikesService } from '../../modules/likes/likes.service';
// import { CommentsService } from '../../modules/comments/comments.service';

// maybe will not use this approach for its drawbacks.
@Global()
@Module({
  // providers: [
  //   PrismaService,
  //   FriendsService,
  //   PostsService,
  //   UserService,
  //   LikesService,
  //   CommentsService,
  //   {
  //     provide: 'ALL_SERVICES',
  //     useFactory: (
  //       prisma: PrismaService,
  //       friends: FriendsService,
  //       posts: PostsService,
  //       user: UserService,
  //       likes: LikesService,
  //       comments: CommentsService,
  //     ) => ({
  //       prisma,
  //       friends,
  //       posts,
  //       user,
  //       likes,
  //       comments,
  //     }),
  //     inject: [
  //       PrismaService,
  //       FriendsService,
  //       PostsService,
  //       UserService,
  //       LikesService,
  //       CommentsService,
  //     ],
  //   },
  // ],
  // exports: ['ALL_SERVICES'],
})
export class AllServicesModule {}
