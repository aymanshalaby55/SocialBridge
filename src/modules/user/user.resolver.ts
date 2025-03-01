import {
  Query,
  Args,
  Mutation,
  Resolver,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/updateUser.input';
import { GetUser } from '../../common/decorators/getUser.decorator';
import { UserDto } from '../../common/dto/user.dto';
import { PostsService } from '../../modules/posts/posts.service';
import { FriendsService } from '../friends/friends.service';
import { LikesService } from '../likes/likes.service';
import { CommentsService } from '../comments/comments.service';
import { CommentDto } from '../../common/dto/comment.dto';
import { FriendDto } from '../../common/dto/friend.dto';
import { LikeDto } from '../../common/dto/like.dto';
import { PostDto } from '../../common/dto/post.dto';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { GraphQLCacheInterceptor } from '../../common/interceptors/cache.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Resolver(() => UserDto)
@UseGuards(JwtAuthGuard)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly postsService: PostsService,
    private readonly friendsService: FriendsService,
    private readonly likesService: LikesService,
    private readonly commentsService: CommentsService,
  ) {}

  @Mutation(() => UserDto)
  async uploadUserProfile(
    @Args('image', { type: () => GraphQLUpload }) image: FileUpload,
    @GetUser() user,
  ) {
    await this.userService.updateUserProfilePicture(image, user.id);
  }

  @Query(() => UserDto)
  @UseInterceptors(GraphQLCacheInterceptor)
  getUser(@Args('userId', { type: () => Int }) userId: number) {
    return this.userService.getUserById(userId);
  }

  @Query(() => UserDto)
  @UseInterceptors(GraphQLCacheInterceptor)
  getProfile(@GetUser() user) {
    return this.userService.getUserById(user.id);
  }

  @Mutation(() => UserDto)
  updateUserProfile(
    @Args('userProfileUpdates') updates: UpdateUserInput,
    @GetUser() user,
  ) {
    return this.userService.updateUser(user.id, updates);
  }
  // make this only for admin.
  @Query(() => [UserDto])
  @UseInterceptors(GraphQLCacheInterceptor)
  getUsers() {
    return this.userService.getUsers();
  }

  @Mutation(() => Boolean)
  deleteUser(@GetUser() user) {
    return this.userService.deleteUser(user.id);
  }

  // resolved Fields
  @ResolveField('posts', () => [PostDto], { nullable: true })
  posts(@Parent() user: UserDto) {
    return this.postsService.getUserPosts(user.id);
  }

  @ResolveField('friends', () => [FriendDto], { nullable: true })
  friends(@Parent() user: UserDto) {
    return this.friendsService.getUserFriends(user.id);
  }

  @ResolveField('likes', () => [LikeDto], { nullable: true })
  likes(@Parent() user: UserDto) {
    return this.likesService.getLikesByUser(user.id);
  }

  @ResolveField('comments', () => [CommentDto], { nullable: true })
  comments(@Parent() user: UserDto) {
    return this.commentsService.findUserComments(user.id);
  }
}
