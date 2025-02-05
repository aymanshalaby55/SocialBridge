import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CommentDto } from 'src/common/dto/comment.dto';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dto/createComment.input';
import { UpdateCommentInput } from './dto/updateComment.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GetUser } from 'src/common/decorators/getUser.decorator';

UseGuards(JwtAuthGuard);
@Resolver(() => CommentDto)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query(() => [CommentDto], { name: 'comments' })
  getComments(): Promise<CommentDto[]> {
    return this.commentsService.findAll();
  }

  @Query(() => CommentDto, { name: 'comment' })
  getComment(@Args('id') id: number): Promise<CommentDto> {
    return this.commentsService.findOne(id);
  }

  @Mutation(() => CommentDto)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @GetUser() user,
  ): Promise<CommentDto> {
    return this.commentsService.create(createCommentInput, user.id);
  }

  @Mutation(() => CommentDto)
  updateComment(
    @Args('id') id: number,
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @GetUser() user,
  ): Promise<CommentDto> {
    return this.commentsService.update(id, updateCommentInput, user.id);
  }

  @Mutation(() => Boolean)
  deleteComment(@Args('id') id: number, @GetUser() user): Promise<boolean> {
    return this.commentsService.remove(id, user.id);
  }
}
