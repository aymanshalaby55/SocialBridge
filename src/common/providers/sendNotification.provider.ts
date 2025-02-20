import { Prisma, PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';

export async function sendNotification(
  userId: number,
  type: string,
  message: string,
  prisma: PrismaClient,
  PubSub: PubSub,
): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const friends = await prisma.friends.findMany({
    where: {
      OR: [{ userId }, { friendUserId: userId }],
      status: 'ACCEPTED',
    },
    select: {
      userId: true,
      friendUserId: true,
    },
  });

  const friendIds = friends.map((friend) =>
    friend.userId === userId ? friend.friendUserId : friend.userId,
  );

  // send notifications

  console.log(friendIds);
  for (const id of friendIds) {
    PubSub.publish('Notification', {
      type: type,
      friendId: id,
      message: message,
    });
  }
}
