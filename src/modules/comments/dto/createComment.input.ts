import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { CommentInputDto } from './comment.input';

@InputType()
export class CreateCommentInput extends PickType(CommentInputDto, [
  'content',
] as const) {
  @Field(() => Int)
  postId: number;
}
