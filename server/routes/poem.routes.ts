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
// Add new poem with tags
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { title, content, tags = [] } = req.body;
    const userId = req.user.id;

    const poem = await prisma.poem.create({
      data: {
        title,
        content,
        authorId: userId,
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag }
          }))
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        tags: true
      }
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

// Get single poem
router.get('/:id', async (req, res) => {
  try {
    const poemId = parseInt(req.params.id);
    
    if (isNaN(poemId)) {
      return res.status(400).json({ error: 'Invalid poem ID' });
    }

    const poem = await prisma.poem.findUnique({
      where: { id: poemId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        comments: {
          include: {
            user: {
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
        },
        tags: true
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

router.post('/:id/comments', authMiddleware, async (req: any, res) => {
  try {
    const poemId = parseInt(req.params.id);
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        poemId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    res.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Get comments for a poem
router.get('/:id/comments', authMiddleware, async (req: any, res) => {
  try {
    const poemId = parseInt(req.params.id);
    const comments = await prisma.comment.findMany({
      where: {
        poemId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Get like status
router.get('/:id/like/status', authMiddleware, async (req: any, res) => {
  try {
    const poemId = parseInt(req.params.id);
    const userId = req.user.id;

    const like = await prisma.like.findFirst({
      where: {
        poemId,
        userId,
      },
    });

    const likeCount = await prisma.like.count({
      where: {
        poemId,
      },
    });

    res.json({ 
      liked: !!like,
      likeCount 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get like status' });
  }
});

router.post('/:id/like', authMiddleware, async (req: any, res) => {
  try {
    const poemId = parseInt(req.params.id);
    const userId = req.user.id;

    const existingLike = await prisma.like.findFirst({
      where: {
        poemId,
        userId,
        commentId: null // Important: Only handle poem likes
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      });
    } else {
      await prisma.like.create({
        data: {
          userId,
          poemId,
        }
      });
    }

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: {
        poemId,
        commentId: null
      }
    });

    res.json({ 
      liked: !existingLike,
      likeCount 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

// Get comment like status
router.get('/comments/:id/like/status', authMiddleware, async (req: any, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const userId = req.user.id;

    const like = await prisma.like.findFirst({
      where: {
        commentId,
        userId,
      },
    });

    const likeCount = await prisma.like.count({
      where: {
        commentId,
      },
    });

    res.json({ 
      liked: !!like,
      likeCount 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get like status' });
  }
});

// Toggle comment like
router.post('/comments/:id/like', authMiddleware, async (req: any, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const userId = req.user.id;

    const existingLike = await prisma.like.findFirst({
      where: {
        commentId,
        userId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      });
    } else {
      await prisma.like.create({
        data: {
          userId,
          commentId,
        }
      });
    }

    const likeCount = await prisma.like.count({
      where: {
        commentId,
      }
    });

    res.json({ 
      liked: !existingLike,
      likeCount 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

// Get all tags
// Get all available tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { poems: true }
        }
      }
    });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Add tags to poem
router.post('/:id/tags', authMiddleware, async (req: any, res) => {
  try {
    const poemId = parseInt(req.params.id);
    const { tags } = req.body;
    
    // Check if user owns the poem
    const poem = await prisma.poem.findFirst({
      where: {
        id: poemId,
        authorId: req.user.id
      }
    });

    if (!poem) {
      return res.status(403).json({ error: 'Not authorized to modify this poem' });
    }

    const updatedPoem = await prisma.poem.update({
      where: { id: poemId },
      data: {
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag }
          }))
        }
      },
      include: {
        tags: true
      }
    });

    res.json(updatedPoem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tags' });
  }
});

router.post('/:id/view', async (req, res) => {
  try {
    const poemId = parseInt(req.params.id);
    
    if (isNaN(poemId)) {
      return res.status(400).json({ error: 'Invalid poem ID' });
    }

    const updatedPoem = await prisma.poem.update({
      where: { id: poemId },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });

    res.json({ viewCount: updatedPoem.viewCount });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({ error: 'Failed to increment view count' });
  }
});


export default router;