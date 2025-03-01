import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentDto } from '../../common/dto/comment.dto';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dto/createComment.input';
import { UpdateCommentInput } from './dto/updateComment.input';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GetUser } from '../../common/decorators/getUser.decorator';
import { GraphQLCacheInterceptor } from 'src/common/interceptors/cache.interceptor';

@UseGuards(JwtAuthGuard)
@Resolver(() => CommentDto)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => CommentDto)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @GetUser() user,
  ): Promise<CommentDto> {
    return this.commentsService.createCommet(createCommentInput, user.id);
  }

  @Mutation(() => CommentDto)
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @GetUser() user,
  ): Promise<CommentDto> {
    return this.commentsService.updateComment(updateCommentInput, user.id);
  }

  @Mutation(() => Boolean)
  deleteComment(
    @Args('id', { type: () => Int }) id: number,
    @GetUser() user,
  ): Promise<boolean> {
    return this.commentsService.delete(id, user.id);
  }

  @Query(() => [CommentDto], { name: 'comments' })
  @UseInterceptors(GraphQLCacheInterceptor)
  getUserComments(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<CommentDto[]> {
    return this.commentsService.findUserComments(userId);
  }

  @Query(() => CommentDto, { name: 'comment' })
  @UseInterceptors(GraphQLCacheInterceptor)
  getCommentById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<CommentDto> {
    return this.commentsService.findCommentById(id);
  }
}
