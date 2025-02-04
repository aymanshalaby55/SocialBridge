import { ObjectType, OmitType } from '@nestjs/graphql';
import { UserDto } from 'src/common/dto/user.dto';

@ObjectType()
export class UserInfoDto extends OmitType(UserDto, ['posts']) {}
