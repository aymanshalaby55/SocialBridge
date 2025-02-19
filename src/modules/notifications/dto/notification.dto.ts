import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class NotificationDto {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field()
  message: string;

  @Field()
  type: string;

  @Field()
  isRead: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
