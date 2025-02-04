import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserInput } from './dto/updateUser.input';
import { UserDto } from '../../common/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
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
