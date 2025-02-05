import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CommentDto } from '../../common/dto/comment.dto';
import { CreateCommentInput } from './dto/createComment.input';
import { UpdateCommentInput } from './dto/updateComment.input';

import { validate } from 'class-validator';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CommentDto[]> {
    return this.prisma.comment.findMany();
  }

  async findOne(id: number): Promise<CommentDto> {
    return this.prisma.comment.findUnique({
      where: { id },
    });
  }

  async create(
    createCommentInput: CreateCommentInput,
    userId: number,
  ): Promise<CommentDto> {
    const errors = await validate(createCommentInput);
    if (errors.length > 0) {
      throw new Error('Validation failed');
    }

    return this.prisma.comment.create({
      data: {
        ...createCommentInput,
        userId,
      },
    });
  }

  async update(
    id: number,
    updateCommentInput: UpdateCommentInput,
    userId: number,
  ): Promise<CommentDto> {
    const errors = await validate(updateCommentInput);
    if (errors.length > 0) {
      throw new Error('Validation failed');
    }

    return this.prisma.comment.update({
      where: { id, userId },
      data: {
        content: updateCommentInput.content,
        isEdited: true,
      },
    });
  }

  async remove(commentId: number, userId: number): Promise<boolean> {
    try {
      await this.prisma.comment.delete({
        where: { id: commentId, userId },
      });
      return true;
    } catch {
      return false;
    }
  }
}
