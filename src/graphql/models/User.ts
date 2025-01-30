import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserSetting } from './userSetting';

@ObjectType()
export class User {
  @Field((type) => Int) // important
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  mock?: string;

  @Field({ nullable: true })
  settings?: UserSetting;
}
