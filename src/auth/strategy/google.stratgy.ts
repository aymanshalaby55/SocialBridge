import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID', ''),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET', ''),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL', ''),
      scope: ['email', 'profile'],
    });

    // Ensure required env variables exist
    if (!configService.get('GOOGLE_CLIENT_ID') || !configService.get('GOOGLE_CLIENT_SECRET')) {
      throw new Error('Missing Google OAuth environment variables');
    }
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Partial<Profile>,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const { name, emails, photos } = profile;
      if (!emails?.length) {
        return done(new Error('No email found'), null);
      }

      const user = {
        email: emails[0].value,
        firstName: name?.givenName || '',
        lastName: name?.familyName || '',
        picture: photos?.[0]?.value || '',
        accessToken,
      };

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
