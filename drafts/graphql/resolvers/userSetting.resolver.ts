import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserSetting } from '../models/userSetting';
import { userSettings } from '../mocks/userSetting.mock';

@Resolver((of) => UserSetting)
export class UserSettingResolver {
  @Query((returns) => UserSetting, { nullable: true, name: 'userSettingById' })
  async getUserSetting(@Args('userId') userId: number) {
    return userSettings.find((setting) => setting.userId === userId);
  }

  @Mutation((returns) => UserSetting)
  updateUserSetting(
    @Args('userId') userId: number,
    @Args('recivedNotif') recivedNotif: boolean,
    @Args('receiveEmails') receiveEmails: boolean,
  ) {
    const setting = userSettings.find((setting) => setting.userId === userId);
    if (setting) {
      setting.recivedNotif = recivedNotif;
      setting.receiveEmails = receiveEmails;
    }
    return setting;
  }
}
