import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserDto {
  @Field()
  @IsNotEmpty()
  id: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @MinLength(8)
  password: string;
}
