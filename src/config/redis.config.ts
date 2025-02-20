import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';

export const redisConfig = CacheModule.registerAsync({
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    ttl: configService.getOrThrow<number>('CACHE_TTL'),
    stores: new KeyvRedis(configService.getOrThrow<string>('REDIS_SERVER')),
  }),
  inject: [ConfigService],
});
