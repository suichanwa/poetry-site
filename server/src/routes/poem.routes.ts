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

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

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

// Add bookmark to poem (protected route)
router.post('/:id/bookmark', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        userId,
        poemId: parseInt(id),
      },
    });

    if (existingBookmark) {
      // Remove bookmark if it exists
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      res.json({ bookmarked: false });
    } else {
      // Create new bookmark
      await prisma.bookmark.create({
        data: {
          userId,
          poemId: parseInt(id),
        },
      });
      res.json({ bookmarked: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
});


// In server/src/routes/poem.routes.ts
router.get('/:id/bookmark/status', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const bookmark = await prisma.bookmark.findFirst({
      where: {
        userId,
        poemId: parseInt(id),
      },
    });

    res.json({ bookmarked: !!bookmark });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookmark status' });
  }
});

// In server/src/routes/poem.routes.ts
router.get('/user/:userId', authMiddleware, async (req: any, res) => {
  try {
    const { userId } = req.params;
    const poems = await prisma.poem.findMany({
      where: { authorId: parseInt(userId) },
      include: {
        author: {
          select: { name: true, email: true }
        }
      }
    });
    res.json(poems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user poems' });
  }
});

export default router;