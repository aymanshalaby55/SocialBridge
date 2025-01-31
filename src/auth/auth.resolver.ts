import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { UserDto } from './dto/user.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Resolver(() => UserDto)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  healthCheck() {
    return 'Auth service is healthy';
  }

  // if there is not way for this just make it with REST.
  //   @Query(() => String)
  //   @UseGuards(GoogleAuthGuard)
  //   async googleLogin() {
  //     return 'Redirecting to Google...';
  //   }

  //   @Query(() => String)
  //   @UseGuards(GoogleAuthGuard)
  //   async googleLoginCallback(@Context('req') req: Request) {
  //     // After successful authentication, the user will be stored in the session
  //     console.log(req);
  //     return `Logged in as ${req}`;
  //   }

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

  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  async protectedRoute() {
    return 'This is a protected route';
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
   logout() {
    return 'Logged out successfully (remove your JWT token)';
  }
}
