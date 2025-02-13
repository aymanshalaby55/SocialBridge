import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreatePostInput } from './dto/createPost.input';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: number, post: CreatePostInput) {
    if (!userId || !post) {
      throw new Error('User ID and data are required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // upload to aws-s3

    const newPost = await this.prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        // imageUrl: post.imageUrl,
        user: {
          connect: { id: userId },
        },
      },
    });

    return newPost;
  }

  async updatePost(id: number, post: CreatePostInput, userId: number) {
    // Verify post exists and belongs to user
    const existingPost = await this.prisma.post.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingPost) {
      throw new Error('Post not found or unauthorized');
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        title: post.title,
        content: post.content,
        // imageUrl: postImage,
      },
    });

    return updatedPost;
  }

  async deletePost(id: number, userId: number) {
    if (!id || !userId) {
      throw new Error('Post ID and user ID are required');
    }

    // Verify post exists and belongs to user
    const existingPost = await this.prisma.post.findFirst({
      where: { id, userId },
    });

    if (!existingPost) {
      throw new Error('Post not found or unauthorized');
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return true;
  }

  async getPostsByUser(userId: number) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const posts = await this.prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return posts;
  }

  async getPostById(id: number, userId: number) {
    if (!id || !userId) {
      throw new Error('Post ID and user ID are required');
    }

    const post = await this.prisma.post.findFirst({
      where: { id, userId },
    });

    if (!post) {
      throw new Error('Post not found or unauthorized');
    }

    return post;
  }
}
