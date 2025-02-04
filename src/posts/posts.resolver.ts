import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { CreatePostInput } from './dto/createPost.input';
import { PostDto } from './dto/post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/decorators/getUser.decorator';

@UseGuards(JwtAuthGuard)
@Resolver(() => PostDto)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => PostDto)
  createPost(@Args('CreatePostInput') post: CreatePostInput, @GetUser() user) {
    const data = this.postsService.createPost(user.id, post);
    return data;
  }

  @Mutation(() => PostDto)
  updatePost(
    @Args({ name: 'postId', type: () => Int }) postId,
    @Args('UpdatePostInput') post: CreatePostInput,
    @GetUser() user,
  ) {
    return this.postsService.updatePost(postId, post, user.id);
  }

  @Mutation(() => Boolean)
  deletePost(
    @Args({ name: 'postId', type: () => Int }) postId: number,
    @GetUser() user,
  ) {
    return this.postsService.deletePost(postId, user.id);
  }

  @Query(() => [PostDto])
  getPostsByUser(@GetUser() user) {
    return this.postsService.getPostsByUser(user.id);
  }

  @Mutation(() => PostDto)
  getPostById(
    @Args({ name: 'postId', type: () => Int }) postId: number,
    @GetUser() user,
  ) {
    return this.postsService.getPostById(postId, user.id);
  }
}
