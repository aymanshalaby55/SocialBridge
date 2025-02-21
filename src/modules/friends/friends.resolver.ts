import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FriendsService } from './friends.service';
import { FriendDto } from '../../common/dto/friend.dto';
import { GetUser } from '../../common/decorators/getUser.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Resolver()
export class FriendsResolver {
  constructor(private readonly friendsService: FriendsService) {}

  @Mutation(() => FriendDto)
  addFriend(
    @Args('targetId', { type: () => Int }) targetId: number,
    @GetUser() user,
  ): Promise<FriendDto> {
    return this.friendsService.addFriend(user.id, targetId);
  }

  @Mutation(() => FriendDto)
  rejectFriendRequest(
    @Args('friendId', { type: () => Int }) friendId: number,
  ): Promise<FriendDto> {
    return this.friendsService.rejectFriendRequest(friendId);
  }

  // accept friend request.
  @Mutation(() => FriendDto)
  acceptFriendRequest(
    @Args('friendId', { type: () => Int }) friendId: number,
    @GetUser() user,
  ): Promise<FriendDto> {
    return this.friendsService.acceptFriendRequest(friendId, user.id);
  }

  @Query(() => [FriendDto])
  getUserFriends(@GetUser() user): Promise<FriendDto[]> {
    return this.friendsService.getUserFriends(user.id);
  }
}
