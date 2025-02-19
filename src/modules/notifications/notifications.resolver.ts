import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PubSub } from 'graphql-subscriptions';

@Resolver('Notification')
export class NotificationsResolver {
  constructor(
    private readonly notificationService: NotificationsService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Subscription(() => String, {
    name: 'new_post',
    resolve: (payload) => {
      if (!payload || !payload.message) {
        throw new Error('Invalid payload: message is missing');
      }
      return payload.message;
    },
  })
  async new_post() {
    const data = await this.pubSub.subscribe('new_post', (payload) => {
      if (!payload) {
        throw new Error('No payload received');
      }
      return payload;
    });

    console.log(data);

    // Ensure the asyncIterableIterator is correctly set up
    return this.pubSub.asyncIterableIterator('new_post');
  }
  //   @Query(() => [Notification])
  //   getUserNotifications(@Args('userId') userId: number) {
  //     return this.notificationService.getUserNotifications(userId);
  //   }

  //   @Mutation(() => Notification)
  //   markNotificationAsRead(@Args('id') id: number) {
  //     return this.notificationService.markNotificationAsRead(id);
  //   }
}
