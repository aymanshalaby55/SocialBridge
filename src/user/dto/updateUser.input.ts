import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { UserDto } from 'src/common/dto/user.dto';

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(UserDto, ['id', 'posts', 'email'], InputType),
) {}
