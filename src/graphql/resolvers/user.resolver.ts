import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../models/User';
import { users } from '../mocks/users.mock';
import { userSettings } from '../mocks/userSetting.mock';
import { CreateUserInput } from '../inputs/createUser.input';

@Resolver((of) => User)
export class UserResolver {
  @Query((returns) => User, { nullable: true, name: 'userById' })
  async getUser(@Args('id') id: number) {
    return users.find((user) => user.id === id);
  }

  @Query(() => [User])
  getUsers() {
    return users;
  }

  @ResolveField((returns) => userSettings, { nullable: true })
  settings(@Parent() user: User) {
    return userSettings.find((setting) => setting.userId === user.id);
  }

  @Mutation((returns) => User)
  addUser(@Args('userInput') user: CreateUserInput) {
    const { name, mock } = user;
    const newUser: User = { name, mock, id: 6 };
    users.push(newUser);
    console.log(users);
    return newUser;
  }
}
