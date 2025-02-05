import { InputType, PickType } from '@nestjs/graphql';
import { CommentInputDto } from './comment.input';

@InputType()
export class CreateCommentInput extends PickType(CommentInputDto, [
  'postId',
  'content',
] as const) {}
