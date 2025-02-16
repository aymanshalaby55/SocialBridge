import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserInput } from './dto/updateUser.input';
import { UserDto } from '../../common/dto/user.dto';
import { FileUpload, Upload } from 'graphql-upload-ts';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async getUserById(id: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }
    return user;
  }

  async updateUser(id: number, data: UpdateUserInput): Promise<UserDto> {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid update data');
    }
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateUserProfilePicture(image: FileUpload, userId: number) {
    const { key } = await this.uploadService.uploadFileToS3({
      folderName: 'userImage',
      file: image,
    });

    const imageUrl = this.uploadService.getLinkByKey(key);
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        image: imageUrl,
      },
    });
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    await this.prisma.user.delete({
      where: { id },
    });
    return true;
  }

  async getUsers(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany();
    if (!users) {
      throw new Error('Failed to fetch users');
    }
    return users;
  }
}
