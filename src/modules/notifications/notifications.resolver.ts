import {
  Args,
  Context,
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
import { Request } from 'express';

@Resolver('Notification')
export class NotificationsResolver {
  constructor(
    private readonly notificationService: NotificationsService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Subscription(() => NotificationDto, {
    resolve: async function (payload, variables, context) {
      if (!payload || !payload.friendId) {
        throw new Error('Invalid payload: data is missing');
      }

      // console.log(context);
      console.log(payload.friendId, context.user.id);
      // Get user from context
      const { user } = context;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Only proceed if notification is for the current user
      if (payload.friendId !== user.id) {
        return null;
      }

      // Create notification in database
      const notification = await this.notificationService.createNotification(
        payload.friendId,
        payload.message,
        payload.type || 'GENERAL',
      );

      return notification;
    },
    filter: (payload, variables, context) => {
      console.log(context);
      const { user } = context;
      return payload.friendId === user.id;
    },
  })
  notifyUser() {
    return this.pubSub.asyncIterableIterator('Notification');
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
