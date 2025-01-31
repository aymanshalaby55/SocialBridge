import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(context);
    const googleAuthUrl = this.configService.get<string>('GOOGLE_CALLBACK_URL');

    if (!googleAuthUrl) {
      throw new Error('Google OAuth URL is missing in environment variables');
    }

    if (!req.user) {
      throw new Error(`Google OAuth requires a redirection. Use this URL: ${googleAuthUrl}`);
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
