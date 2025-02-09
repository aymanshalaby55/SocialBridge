import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { UserDto } from 'src/common/dto/user.dto';

// make sure u update every objecttype here
@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(
    UserDto,
    ['id', 'email'],
    InputType,
  ),
) {}
