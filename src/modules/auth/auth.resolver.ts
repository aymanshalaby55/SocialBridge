import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { UserDto } from '../../common/dto/user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt.guard';

@Resolver(() => UserDto)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  healthCheck() {
    return 'Auth service is healthy';
  }

  @Mutation(() => String)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context('res') res: Response,
  ) {
    const { access_token } = await this.authService.login(loginInput);

    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return access_token;
  }

  @Mutation(() => String)
  async signup(
    @Args('signupInput') signupInput: SignupInput,
    @Context('res') res: Response,
  ) {
    const { access_token } = await this.authService.signup(signupInput);

    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return access_token;
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  logout(@Context('res') res: Response) {
    res.clearCookie('jwt');
    return 'Logged out successfully (remove your JWT token)';
  }
}
