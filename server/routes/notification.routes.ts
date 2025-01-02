import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/notifications - Get user's notifications
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: req.user.id
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// POST /api/notifications/:id/mark-read
router.post('/:id/mark-read', authMiddleware, async (req: any, res) => {
  try {
    const notification = await prisma.notification.update({
      where: {
        id: parseInt(req.params.id),
        recipientId: req.user.id
      },
      data: {
        isRead: true
      }
    });
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// POST /api/notifications/mark-all-read
router.post('/mark-all-read', authMiddleware, async (req: any, res) => {
  try {
    await prisma.notification.updateMany({
      where: {
        recipientId: req.user.id,
        isRead: false
      },
      data: {
        isRead: true
      }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

export default router;