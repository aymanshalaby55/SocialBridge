import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

@ObjectType()
export class CommentDto {
  @Field(() => ID)
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsNotEmpty()
  id?: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  content: string;

  @Field(() => Date)
  @IsNotEmpty()
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  editedAt?: Date;

  @Field(() => Boolean, { nullable: true })
  isEdited?: boolean;

  @Field(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsNotEmpty()
  userId: number;

  @Field(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsNotEmpty()
  postId: number;
}
