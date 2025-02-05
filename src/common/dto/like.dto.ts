import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsNotEmpty } from 'class-validator';

@ObjectType()
export class LikeDto {
  @Field(() => ID)
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsNotEmpty()
  id?: number;

  @Field(() => String, { nullable: true, defaultValue: '👍' })
  emoji?: string;

  @Field(() => Date)
  @IsNotEmpty()
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => Int)
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsNotEmpty()
  userId?: number;

  @Field(() => Int)
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsNotEmpty()
  postId?: number;
}
