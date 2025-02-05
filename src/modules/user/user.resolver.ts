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
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { UserDto } from 'src/common/dto/user.dto';
import { Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { PostsService } from 'src/modules/posts/posts.service';
import { FriendsService } from '../friends/friends.service';
import { LikesService } from '../likes/likes.service';
import { CommentsService } from '../comments/comments.service';

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

  @Query(() => UserDto)
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

  @Query(() => [UserDto])
  getUsers() {
    return this.userService.getUsers();
  }

  @Mutation(() => Boolean)
  deleteUser(@GetUser() user) {
    return this.userService.deleteUser(user.id);
  }

  // resolved Fields
  @ResolveField()
  posts(@Parent() user: UserDto) {
    return this.postsService.getPostsByUser(user.id);
  }

  @ResolveField()
  friends(@Parent() user: UserDto) {
    return this.friendsService.getUserFriends(user.id);
  }

  @ResolveField()
  likes(@Parent() user: UserDto) {
    return this.likesService.getLikesByUser(user.id);
  }

  @ResolveField()
  comments(@Parent() user: UserDto) {
    console.log(user);
    return this.commentsService.findUserComments(user.id);
  }
}
