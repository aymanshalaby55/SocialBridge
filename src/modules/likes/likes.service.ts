import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Like } from '@prisma/client';
import { LikeDto } from '../../common/dto/like.dto';
import { sendNotification } from 'src/common/providers/sendNotification.provider';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class LikesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  async createLike(
    userId: number,
    postId: number,
    emoji: string,
  ): Promise<LikeDto> {
    // Validate user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Validate post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new Error('Post not found');
    }

    const like = await this.prisma.like.create({
      data: {
        userId,
        postId,
        emoji,
      },
    });

    const notificationMessage = `${user.name} Liked your Post`;
    await sendNotification(
      userId,
      'Like',
      notificationMessage,
      this.prisma,
      this.pubSub,
    );

    return like;
  }

  async getLikesByPost(postId: number): Promise<Like[]> {
    // Validate post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return await this.prisma.like.findMany({
      where: { postId },
    });
  }

  async getLikesByUser(userId: number): Promise<Like[]> {
    // Validate user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const likes = await this.prisma.like.findMany({
      where: { userId },
    });
    console.log(likes);
    return likes;
  }

  async getLikeById(id: number): Promise<Like | null> {
    return await this.prisma.like.findUnique({
      where: { id },
    });
  }

  async deleteLike(id: number): Promise<boolean> {
    // Validate like exists
    const like = await this.prisma.like.findUnique({
      where: { id },
    });
    if (!like) {
      throw new Error('Like not found');
    }

    await this.prisma.like.delete({
      where: { id },
    });
    return true;
  }

  async updateLikeEmoji(
    userId: number,
    postId: number,
    emoji: string,
  ): Promise<Like> {
    // Validate user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Validate post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new Error('Post not found');
    }

    // Validate like exists
    const like = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!like) {
      throw new Error('Like not found');
    }

    return await this.prisma.like.update({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      data: {
        emoji,
      },
    });
  }

  async deleteLikeByUserAndPost(userId: number, postId: number): Promise<Like> {
    // Validate user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Validate post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new Error('Post not found');
    }

    // Validate like exists
    const like = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!like) {
      throw new Error('Like not found');
    }

    return await this.prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }
}
