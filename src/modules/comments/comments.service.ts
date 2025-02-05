import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CommentDto } from '../../common/dto/comment.dto';
import { CreateCommentInput } from './dto/createComment.input';
import { UpdateCommentInput } from './dto/updateComment.input';
import { validate } from 'class-validator';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Fetch all comments.
   */
  async findAll(): Promise<CommentDto[]> {
    return this.prisma.comment.findMany();
  }

  /**
   * Fetch a single comment by ID.
   * @param id - The ID of the comment to fetch.
   */
  async findOne(id: number): Promise<CommentDto> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    return comment;
  }

  async create(
    createCommentInput: CreateCommentInput,
    userId: number,
  ): Promise<CommentDto> {
    // Check if the post exists
    const post = await this.prisma.post.findUnique({
      where: { id: createCommentInput.postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.prisma.comment.create({
      data: {
        content: createCommentInput.content,
        postId: createCommentInput.postId,
        userId,
      },
    });
  }

  async update(
    updateCommentInput: UpdateCommentInput,
    userId: number,
  ): Promise<CommentDto> {
    // search for comment and post
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

  async remove(commentId: number, userId: number): Promise<string> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this comment',
      );
    }

    try {
      await this.prisma.comment.delete({
        where: { id: commentId },
      });
      return 'comment deleted succsufyl';
    } catch (error) {
      throw new error();
    }
  }
}
