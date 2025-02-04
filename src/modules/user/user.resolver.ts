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
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { PostsService } from 'src/modules/posts/posts.service';

@Resolver(() => UserDto)
@UseGuards(JwtAuthGuard)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly postsService: PostsService,
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

  // resolved Feilds
  @ResolveField()
  posts(@Parent() user: UserDto) {
    return this.postsService.getPostsByUser(user.id);
  }
}
