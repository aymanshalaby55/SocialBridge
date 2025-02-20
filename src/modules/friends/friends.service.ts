import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FriendDto } from '../../common/dto/friend.dto';
import { PubSub } from 'graphql-subscriptions';
import { sendNotification } from 'src/common/providers/sendNotification.provider';

@Injectable()
export class FriendsService {
  constructor(
    private prisma: PrismaService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  async addFriend(
    userId: number,
    friendUserId: number,
  ): Promise<FriendDto | null> {
    // Check if users exist
    const [user, friendUser] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.user.findUnique({ where: { id: friendUserId } }),
    ]);

    if (!user || !friendUser) {
      throw new NotFoundException('users not found');
    }

    // Check if friend request already exists
    const existingRequest = await this.prisma.friends.findFirst({
      where: {
        OR: [
          { userId, friendUserId },
          { userId: friendUserId, friendUserId: userId },
        ],
      },
    });

    if (existingRequest) {
      throw new Error('Friend request already exists');
    }

    const newFriend = await this.prisma.friends.create({
      data: {
        userId,
        friendUserId,
        status: 'PENDING',
      },
    });

    const notificationMessage = `${friendUser.name} Friend requser`;
    await sendNotification(
      userId,
      'Friend',
      notificationMessage,
      this.prisma,
      this.pubSub,
    );

    return newFriend;
  }

  async rejectFriendRequest(friendId: number): Promise<FriendDto> {
    const friendRequest = await this.prisma.friends.findUnique({
      where: { id: friendId },
    });

    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }

    if (friendRequest.status !== 'PENDING') {
      throw new Error('Only pending requests can be rejected');
    }

    const deletedRequest = await this.prisma.friends.delete({
      where: { id: friendId },
    });

    return deletedRequest;
  }

  async acceptFriendRequest(userId: number, friendUserId: number) {
    try {
      // Find the pending friendship request
      const pendingRequest = await this.prisma.friends.findUnique({
        where: {
          userId_friendUserId: {
            userId: friendUserId, // User who sent the request
            friendUserId: userId, // User who is accepting the request
          },
        },
      });

      if (!pendingRequest) {
        throw new Error('No pending friend request found.');
      }

      if (pendingRequest.status !== 'PENDING') {
        throw new Error('The friend request is not in a pending state.');
      }

      // Update the status to ACCEPTED
      const updatedRequest = await this.prisma.friends.update({
        where: {
          id: pendingRequest.id,
        },
        data: {
          status: 'ACCEPTED',
        },
      });

      return updatedRequest;
    } catch (error) {
      console.error('Error accepting friend request:', error.message);
      throw error;
    }
  }

  async getUserFriends(userId: number): Promise<FriendDto[]> {
    const friends = await this.prisma.friends.findMany({
      where: {
        OR: [
          { userId, status: 'ACCEPTED' },
          { friendUserId: userId, status: 'ACCEPTED' },
        ],
      },
    });

    return friends;
  }
}
