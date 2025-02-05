import { Module } from '@nestjs/common';
import { FriendsResolver } from './friends.resolver';
import { FriendsService } from './friends.service';

@Module({
  providers: [FriendsResolver, FriendsService],
})
export class FriendsModule {}
