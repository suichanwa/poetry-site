import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// Follow a user
router.post('/:id', authMiddleware, async (req: any, res) => {
  try {
    const followingId = parseInt(req.params.id);
    const followerId = req.user.id;

    if (followerId === followingId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    res.json({ success: true, isFollowing: true });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// Unfollow a user
router.delete('/:id', authMiddleware, async (req: any, res) => {
  try {
    const followingId = parseInt(req.params.id);
    const followerId = req.user.id;

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    res.json({ success: true, isFollowing: false });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

// Check follow status
router.get('/:id/status', authMiddleware, async (req: any, res) => {
  try {
    const followingId = parseInt(req.params.id);
    const followerId = req.user.id;

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    res.json({ isFollowing: !!follow });
  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ error: 'Failed to check follow status' });
  }
});

// Get followers
router.get('/:id/followers', authMiddleware, async (req: any, res) => {
  try {
    const userId = parseInt(req.params.id);

    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: true,
      },
    });

    res.json(followers.map(f => f.follower));
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

// Get following
router.get('/:id/following', authMiddleware, async (req: any, res) => {
  try {
    const userId = parseInt(req.params.id);

    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: true,
      },
    });

    res.json(following.map(f => f.following));
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});

export default router;