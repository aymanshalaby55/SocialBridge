import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsNumber,
} from 'class-validator';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { PostDto } from 'src/posts/dto/post.dto';

@ObjectType()
export class UserDto {
  @Field(() => ID)
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @MinLength(8)
  password: string;

  @Field(() => [PostDto], { nullable: true })
  posts?: PostDto[];
}
