import { Field, ObjectType, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

@ObjectType()
export class PostDto {
  @Field(() => Int)
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsNotEmpty()
  id?: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Field(() => String, { nullable: true })
  @IsUrl()
  @IsOptional()
  file?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  viewCount?: number;

  @Field(() => Int)
  @IsNumber()
  userId: number;
}
