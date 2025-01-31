// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategy/google.stratgy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports:[ConfigModule],useFactory:async(configService: ConfigService)=>({
        secret: await configService.get<string>('JWT_SECRET'),
        signOptions:{ expiresIn: await configService.get<string>('JWT_EXPIRES_IN')},}),
      inject:[ConfigService],}),
  ],
  providers: [JwtStrategy,GoogleStrategy, AuthResolver, AuthService],
})
export class AuthModule {}