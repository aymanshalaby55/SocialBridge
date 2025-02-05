import { InputType, Field, PickType } from '@nestjs/graphql';
import { CommentInputDto } from './comment.input';

@InputType()
export class UpdateCommentInput extends PickType(CommentInputDto, [
  'content',
  'postId',
] as const) {}
