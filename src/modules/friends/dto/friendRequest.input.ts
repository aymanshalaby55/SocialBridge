import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class FriendRequestInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  friendUserId: number;
}
