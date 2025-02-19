export async function getFriendsIds(
  userId: number,
  prisma: any,
): Promise<number[]> {
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

  return friends.map((friend) =>
    friend.userId === userId ? friend.friendUserId : friend.userId,
  );
}
