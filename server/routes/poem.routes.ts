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

// Add poem (protected route)
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const poem = await prisma.poem.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    });

    res.json(poem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create poem' });
  }
});

// Rest of your routes...
// Get bookmark status
router.get('/:id/bookmark/status', authMiddleware, async (req: any, res) => {
  try {
    const poemId = parseInt(req.params.id);
    const userId = req.user.id;

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_poemId: {
          userId: userId,
          poemId: poemId
        }
      }
    });

    res.json({ bookmarked: !!bookmark });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get bookmark status' });
  }
});

router.get('/user/:id', authMiddleware, async (req: any, res) => {
  try {
    const userId = parseInt(req.params.id);
    const poems = await prisma.poem.findMany({
      where: {
        authorId: userId
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    res.json(poems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user poems' });
  }
});

export default router;