import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { notificationService } from '../services/notification.service';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const paginationSchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '20'))
});

// Get user notifications with pagination
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const notifications = await notificationService.getUserNotifications(req.user.id, page, limit);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.post('/:id/mark-read', authMiddleware, async (req: any, res) => {
  try {
    const notification = await notificationService.markAsRead(
      parseInt(req.params.id),
      req.user.id
    );
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.post('/mark-all-read', authMiddleware, async (req: any, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Delete notification
router.delete('/:id', authMiddleware, async (req: any, res) => {
  try {
    await notificationService.deleteNotification(parseInt(req.params.id), req.user.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

export default router;