import { Module } from '@nestjs/common';
import { FriendsResolver } from './friends.resolver';
import { FriendsService } from './friends.service';
import { pubSubProvider } from '../../common/providers/pubSub.provider';

@Module({
  providers: [FriendsResolver, FriendsService, pubSubProvider],
})
export class FriendsModule {}
