import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CommentDto } from '../../common/dto/comment.dto';
import { CreateCommentInput } from './dto/createComment.input';
import { UpdateCommentInput } from './dto/updateComment.input';
import { sendNotification } from 'src/common/providers/sendNotification.provider';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  async findUserComments(userId: number): Promise<CommentDto[]> {
    return await this.prisma.comment.findMany({
      where: { userId },
    });
  }

  async findCommentById(commidId: number): Promise<CommentDto> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commidId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async getPostComments(postId: number) {
    const comments = await this.prisma.comment.findMany({
      where: {
        postId,
      },
    });

    return comments;
  }

  async createCommet(
    createCommentInput: CreateCommentInput,
    userId: number,
  ): Promise<CommentDto> {
    const newComment = await this.prisma.comment.create({
      data: {
        content: createCommentInput.content,
        postId: createCommentInput.postId,
        userId,
      },
    });

    const notificationMessage = 'new comment just added';
    await sendNotification(
      userId,
      'Comment',
      notificationMessage,
      this.prisma,
      this.pubSub,
    );

    return newComment;
  }

  async updateComment(
    updateCommentInput: UpdateCommentInput,
    userId: number,
  ): Promise<CommentDto> {
    const { commentId } = updateCommentInput;

    const [post, comment] = await Promise.all([
      this.prisma.post.findUnique({
        where: { id: updateCommentInput.postId },
      }),
      this.prisma.comment.findUnique({
        where: { id: commentId },
      }),
    ]);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this comment',
      );
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: updateCommentInput.content,
        isEdited: true,
      },
    });
  }

  async delete(commentId: number, userId: number): Promise<boolean> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this comment',
      );
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });
    return true;
  }
}
