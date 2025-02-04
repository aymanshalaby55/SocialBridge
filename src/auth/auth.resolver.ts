import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { UserDto } from '../common/dto/user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { GetUser } from 'src/common/decorators/getUser.decorator';
// import {  } from './guards/google.guard';

@Resolver(() => UserDto)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  healthCheck() {
    return 'Auth service is healthy';
  }

  @Mutation(() => String)
  async login(@Args('loginInput') loginInput: LoginInput) {
    const { access_token } = await this.authService.login(loginInput);
    return access_token;
  }

  @Mutation(() => String)
  async signup(@Args('signupInput') signupInput: SignupInput) {
    const { access_token } = await this.authService.signup(signupInput);
    return access_token;
  }

  // protected rout for testing
  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  protectedRoute(@GetUser() user) {
    return user;
  }

  // @Mutation(() => String)
  // @UseGuards(JwtAuthGuard)
  // logout() {
  //   return 'Logged out successfully (remove your JWT token)';
  // }
}
