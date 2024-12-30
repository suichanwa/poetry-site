import { PrismaClient, NotificationType, Notification } from '@prisma/client';
import { WebSocket } from 'ws';
import { EmailService } from './email.service';
import { wsService } from './websocket.service';

const prisma = new PrismaClient();
const emailService = new EmailService();

interface CreateNotificationParams {
  type: NotificationType;
  content: string;
  recipientId: number;
  senderId?: number;
  link?: string;
  poemId?: number;
  commentId?: number;
  communityId?: number;
  threadId?: number;
}

class NotificationService {
  private wsConnections: Map<number, WebSocket> = new Map();

  async createNotification(params: CreateNotificationParams): Promise<Notification> {
    try {
      const notification = await prisma.notification.create({
        data: {
          type: params.type,
          content: params.content,
          link: params.link,
          recipient: { connect: { id: params.recipientId } },
          sender: params.senderId ? { connect: { id: params.senderId } } : undefined,
          poem: params.poemId ? { connect: { id: params.poemId } } : undefined,
          comment: params.commentId ? { connect: { id: params.commentId } } : undefined,
          community: params.communityId ? { connect: { id: params.communityId } } : undefined,
          thread: params.threadId ? { connect: { id: params.threadId } } : undefined,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      });

      // Send WebSocket notification if user is connected
      this.sendRealtimeNotification(params.recipientId, notification);

      // Send email notification
      await this.sendEmailNotification(notification);

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [notifications, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where: { recipientId: userId },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.notification.count({
        where: { recipientId: userId }
      })
    ]);

    return {
      notifications,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit
      }
    };
  }

  async markAsRead(notificationId: number, userId: number): Promise<Notification> {
    return prisma.notification.update({
      where: {
        id: notificationId,
        recipientId: userId
      },
      data: { isRead: true }
    });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        recipientId: userId,
        isRead: false
      },
      data: { isRead: true }
    });
  }

  async deleteNotification(id: number, userId: number): Promise<void> {
    await prisma.notification.delete({
      where: {
        id,
        recipientId: userId
      }
    });
  }

  private async sendEmailNotification(notification: Notification) {
    try {
      const recipient = await prisma.user.findUnique({
        where: { id: notification.recipientId }
      });

      if (recipient?.email) {
        await emailService.sendNotificationEmail(
          recipient.email,
          notification.content,
          notification.link
        );
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  private sendRealtimeNotification(userId: number, notification: Notification) {
    const userSocket = this.wsConnections.get(userId);
    if (userSocket) {
      userSocket.send(JSON.stringify({
        type: 'NEW_NOTIFICATION',
        notification
      }));
    }
  }

  // WebSocket connection management
  addWSConnection(userId: number, ws: WebSocket) {
    this.wsConnections.set(userId, ws);
  }

  removeWSConnection(userId: number) {
    this.wsConnections.delete(userId);
  }
}

export const notificationService = new NotificationService();