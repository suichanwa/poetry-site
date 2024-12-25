// server/routes/poem.routes.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware';

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

// Bookmark a poem
// Bookmark a poem
router.post('/:id/bookmark', authMiddleware, async (req: any, res) => {
  try {
    const poemId = parseInt(req.params.id);
    const userId = req.user.id;

    console.log('User ID:', userId);
    console.log('Poem ID:', poemId);

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_poemId: {
          userId: userId,
          poemId: poemId
        }
      }
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          userId_poemId: {
            userId: userId,
            poemId: poemId
          }
        }
      });
      res.json({ bookmarked: false });
    } else {
      await prisma.bookmark.create({
        data: {
          userId: userId,
          poemId: poemId
        }
      });
      res.json({ bookmarked: true });
    }
  } catch (error) {
    console.error('Error bookmarking poem:', error);
    res.status(500).json({ error: 'Failed to bookmark poem' });
  }
});

// Get poems by user
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

// Get bookmarked poems by user
router.get('/user/:id/bookmarks', authMiddleware, async (req: any, res) => {
  try {
    const userId = parseInt(req.params.id);
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: userId
      },
      include: {
        poem: {
          include: {
            author: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    const poems = bookmarks.map(bookmark => bookmark.poem);
    res.json(poems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookmarked poems' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const poemId = parseInt(req.params.id);
    const poem = await prisma.poem.findUnique({
      where: { id: poemId },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            avatar: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        },
        likes: true
      }
    });

    if (!poem) {
      return res.status(404).json({ error: 'Poem not found' });
    }

    res.json(poem);
  } catch (error) {
    console.error('Error fetching poem:', error);
    res.status(500).json({ error: 'Failed to fetch poem' });
  }
});

export default router;