import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { FriendshipStatus } from '@prisma/client';
import { IsNumber, IsNotEmpty, IsEnum } from 'class-validator';

@ObjectType()
export class FriendDto {
  @Field(() => ID)
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsNotEmpty()
  id?: number;

  @Field(() => Int)
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsNotEmpty()
  userId?: number;

  @Field(() => Int)
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsNotEmpty()
  friendUserId?: number;

  @Field(() => String, { defaultValue: FriendshipStatus.PENDING })
  @IsEnum(FriendshipStatus)
  status: FriendshipStatus;

  @Field(() => Date)
  @IsNotEmpty()
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
