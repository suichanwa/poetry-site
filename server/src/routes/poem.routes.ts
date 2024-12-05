import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all poems
router.get('/', async (req, res) => {
  try {
    const poems = await prisma.poem.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        comments: true,
        likes: true
      }
    });
    res.json(poems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch poems' });
  }
});

// Create a new poem (protected route)
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { title, content } = req.body;
    const poem = await prisma.poem.create({
      data: {
        title,
        content,
        authorId: req.user.id
      }
    });
    res.json(poem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create poem' });
  }
});

// Add like to poem (protected route)
router.post('/:id/like', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const like = await prisma.like.create({
      data: {
        userId: req.user.id,
        poemId: parseInt(id)
      }
    });
    res.json(like);
  } catch (error) {
    res.status(500).json({ error: 'Failed to like poem' });
  }
});

// Add comment to poem (protected route)
router.post('/:id/comment', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: req.user.id,
        poemId: parseInt(id)
      }
    });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

export default router;