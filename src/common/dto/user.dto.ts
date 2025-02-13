import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PostDto } from 'src/common/dto/post.dto';
import { LikeDto } from 'src/common/dto/like.dto';
import { CommentDto } from './comment.dto';
import { FriendDto } from './friend.dto';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@ObjectType()
export class UserDto {
  @Field(() => ID)
  @IsNumber({ maxDecimalPlaces: 0 })
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

  @Field({ nullable: true })
  @IsOptional()
  image?: string;
  // @Field(() => [PostDto], { nullable: true })
  // posts?: PostDto[];

  // @Field(() => [LikeDto], { nullable: true })
  // likes?: LikeDto[];

  // @Field(() => [CommentDto], { nullable: true })
  // comments?: CommentDto[];

  // @Field(() => [FriendDto], { nullable: true })
  // friends?: FriendDto[];
}
