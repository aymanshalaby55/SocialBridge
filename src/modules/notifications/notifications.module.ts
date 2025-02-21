import { Module } from '@nestjs/common';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';
import { pubSubProvider } from '../../common/providers/pubSub.provider';

@Module({
  providers: [NotificationsResolver, NotificationsService, pubSubProvider],
})
export class NotificationsModule {}
