import {
  Field,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { UserDto } from 'src/common/dto/user.dto';

@ObjectType()
export class UserPostDto extends OmitType(UserDto, ['posts']) {}
