import {
  Args,
  Int,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
  ID,
} from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { CreatePostInput } from './dto/createPost.input';
import { PostDto } from '../../common/dto/post.dto';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt.guard';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { GetUser } from '../../common/decorators/getUser.decorator';
import { CommentsService } from '../comments/comments.service';
import { CommentDto } from '../../common/dto/comment.dto';
import { LikeDto } from '../../common/dto/like.dto';
import { LikesService } from '../likes/likes.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { GraphQLCacheInterceptor } from 'src/common/interceptors/cache.interceptor';

@UseGuards(JwtAuthGuard)
@Resolver(() => PostDto)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentService: CommentsService,
    private readonly likesService: LikesService,
  ) {}

  @Mutation(() => PostDto)
  createPost(
    @Args('CreatePostInput') post: CreatePostInput,
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
    @GetUser() user,
  ) {
    const data = this.postsService.createPost(user.id, post, file);
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
  @UseInterceptors(GraphQLCacheInterceptor)
  getPostsByUser(@Args('userId', { type: () => ID }) userId: number) {
    return this.postsService.getUserPosts(userId);
  }

  @Mutation(() => PostDto)
  @UseInterceptors(GraphQLCacheInterceptor)
  getPostById(
    @Args({ name: 'postId', type: () => Int }) postId: number,
    @GetUser() user,
  ) {
    return this.postsService.getPostById(postId, user.id);
  }

  // this for getPostByid
  @ResolveField('comments', () => [CommentDto], { nullable: true })
  getPostComments(@Parent() post) {
    return this.commentService.getPostComments(post.id);
  }

  @ResolveField('likes', () => [LikeDto], { nullable: true })
  getpostsLike(@Parent() post) {
    return this.likesService.getLikesByPost(post.id);
  }
}
