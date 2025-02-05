import { InputType, PickType, Field, Int } from '@nestjs/graphql';
import { CommentInputDto } from './comment.input';

@InputType()
export class UpdateCommentInput extends PickType(CommentInputDto, [
  'content',
] as const) {
  @Field(() => Int)
  postId: number;

  @Field(() => Int, { nullable: true })
  commentId?: number;
}
