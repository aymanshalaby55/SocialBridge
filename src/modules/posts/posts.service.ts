import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreatePostInput } from './dto/createPost.input';
import { FileUpload } from 'graphql-upload-ts';
import { UploadService } from '../upload/upload.service';
import { PubSub } from 'graphql-subscriptions';
import { sendNotification } from '../../common/providers/sendNotification.provider';
import { PostDto } from '../../common/dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private readonly uploadService: UploadService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  async createPost(userId: number, post: CreatePostInput, file: FileUpload) {
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
    const { key } = await this.uploadService.uploadFileToS3({
      folderName: 'posts',
      file,
    });
    const fileUrl = this.uploadService.getLinkByKey(key);

    const newPost = await this.prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        file: fileUrl,
        user: {
          connect: { id: userId },
        },
      },
    });

    // new notification
    const notificationMessage = `${user.name} posted a new post`;
    await sendNotification(
      userId,
      'Post',
      notificationMessage,
      this.prisma,
      this.pubSub,
    );

    return newPost;
  }

  async updatePost(
    id: number,
    post: CreatePostInput,
    userId: number,
  ): Promise<PostDto> {
    // Verify post exists and belongs to user
    const existingPost = await this.prisma.post.findFirstOrThrow({
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
      },
    });

    return updatedPost;
  }

  async deletePost(id: number, userId: number): Promise<boolean> {
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

  async getUserPosts(userId: number): Promise<PostDto[]> {
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
