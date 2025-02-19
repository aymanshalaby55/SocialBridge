import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PubSub } from 'graphql-subscriptions';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { NotificationDto } from './dto/notification.dto';

@Resolver('Notification')
export class NotificationsResolver {
  constructor(
    private readonly notificationService: NotificationsService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Subscription(() => String, {
    name: 'newNotification',
    resolve: async function (payload) {
      if (!payload || !payload.data) {
        throw new Error('Invalid payload: data is missing');
      }

      // Create notification in database
      const notification = await this.notificationService.createNotification(
        payload.recipientId,
        payload.data,
        payload.type || 'GENERAL',
      );

      return notification;
    },
    filter: (payload, variables) => {
      return payload.recipientId === variables.user.userId;
    },
  })
  notifyUser(@GetUser() user) {
    return this.pubSub.asyncIterableIterator('New_Notification');
  }

  @Query(() => [NotificationDto])
  getUserNotifications(@Args('userId') userId: number) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Mutation(() => NotificationDto)
  markNotificationAsRead(@Args('id') id: number) {
    return this.notificationService.markNotificationAsRead(id);
  }
}
