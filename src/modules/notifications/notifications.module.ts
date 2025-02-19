import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';
import { pubSubProvider } from '../../common/providers/pubSub.provider';

@Module({
  providers: [
    NotificationsGateway,
    NotificationsResolver,
    NotificationsService,
    pubSubProvider,
  ],
})
export class NotificationsModule {}
