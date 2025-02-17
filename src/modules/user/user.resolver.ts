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
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt.guard';
import { PostsService } from '../../modules/posts/posts.service';
import { FriendsService } from '../friends/friends.service';
import { LikesService } from '../likes/likes.service';
import { CommentsService } from '../comments/comments.service';
import { CommentDto } from '../../common/dto/comment.dto';
import { FriendDto } from '../../common/dto/friend.dto';
import { LikeDto } from '../../common/dto/like.dto';
import { PostDto } from '../../common/dto/post.dto';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GraphQLCacheInterceptor } from '../../common/interceptors/cache.interceptor';

@Resolver(() => UserDto)
@UseGuards(JwtAuthGuard)
@UseInterceptors(GraphQLCacheInterceptor)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly postsService: PostsService,
    private readonly friendsService: FriendsService,
    private readonly likesService: LikesService,
    private readonly commentsService: CommentsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Mutation(() => UserDto)
  async uploadUserProfile(
    @Args('image', { type: () => GraphQLUpload }) image: FileUpload,
    @GetUser() user,
  ) {
    // Assuming there's a method in the service to update the user's profile picture
    await this.userService.updateUserProfilePicture(image, user.id);
  }

  @Query(() => UserDto)
  @UseInterceptors(GraphQLCacheInterceptor)
  getUser(@Args('userId', { type: () => Int }) userId: number) {
    return this.userService.getUserById(userId);
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
    return this.postsService.getPostsByUser(user.id);
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
    console.log(user);
    return this.commentsService.findUserComments(user.id);
  }
}
