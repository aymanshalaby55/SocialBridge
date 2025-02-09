import { InputType, OmitType } from '@nestjs/graphql';
import { PostDto } from '../../../common/dto/post.dto';

@InputType()
export class CreatePostInput extends OmitType(
  PostDto,
  ['id', 'viewCount', 'userId',],
  InputType,
) {}
