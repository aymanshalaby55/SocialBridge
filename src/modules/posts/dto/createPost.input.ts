import { Field, InputType, OmitType } from '@nestjs/graphql';
import { PostDto } from '../../../common/dto/post.dto';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { IsOptional } from 'class-validator';
@InputType()
export class CreatePostInput extends OmitType(
  PostDto,
  ['id', 'viewCount', 'userId'],
  InputType,
) {}
