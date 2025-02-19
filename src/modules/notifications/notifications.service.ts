import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(
    userId: number,
    message: string,
    type: string,
  ): Promise<Notification> {
    return await this.prisma.notification.create({
      data: {
        userId,
        message,
        type,
      },
    });
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    return await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
