import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class UserLikesInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @Field(() => String, { nullable: true })
  @IsString()
  emoji?: string;
}
