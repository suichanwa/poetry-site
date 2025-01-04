// server/routes/manga.routes.ts

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/manga/covers/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'));
    }
  }
});

const chapterStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/manga/chapters/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const uploadChapterPages = multer({
  storage: chapterStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload image files only.'));
    }
  }
});

// Create new manga
router.post('/', authMiddleware, upload.single('coverImage'), async (req: any, res) => {
  try {
    const { title, description, tags } = req.body;
    const coverImage = req.file ? req.file.path : null;
    const parsedTags = JSON.parse(tags || '[]');

    const manga = await prisma.manga.create({
      data: {
        title,
        description,
        coverImage,
        authorId: req.user.id,
        tags: {
          connectOrCreate: parsedTags.map((tag: string) => ({
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

    res.json(manga);
  } catch (error) {
    console.error('Error creating manga:', error);
    res.status(500).json({ error: 'Failed to create manga' });
  }
});

// Get all manga
router.get('/', async (req, res) => {
  try {
    const manga = await prisma.manga.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        tags: true,
        chapters: {
          select: {
            id: true,
            title: true,
            orderIndex: true,
            createdAt: true
          }
        }
      }
    });

    res.json(manga);
  } catch (error) {
    console.error('Error fetching manga:', error);
    res.status(500).json({ error: 'Failed to fetch manga' });
  }
});

// Get single manga by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const manga = await prisma.manga.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        tags: true,
        chapters: {
          include: {
            pages: {
              orderBy: {
                pageNumber: 'asc'
              }
            }
          }
        }
      }
    });

    if (!manga) {
      return res.status(404).json({ error: 'Manga not found' });
    }

    res.json(manga);
  } catch (error) {
    console.error('Error fetching manga:', error);
    res.status(500).json({ error: 'Failed to fetch manga' });
  }
});

// Update manga
router.put('/:id', authMiddleware, upload.single('coverImage'), async (req: any, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags } = req.body;
    const parsedTags = JSON.parse(tags || '[]');

    // Check ownership
    const manga = await prisma.manga.findUnique({
      where: { id: parseInt(id) }
    });

    if (!manga) {
      return res.status(404).json({ error: 'Manga not found' });
    }

    if (manga.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedManga = await prisma.manga.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        ...(req.file && { coverImage: req.file.path }),
        tags: {
          set: [],
          connectOrCreate: parsedTags.map((tag: string) => ({
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

    res.json(updatedManga);
  } catch (error) {
    console.error('Error updating manga:', error);
    res.status(500).json({ error: 'Failed to update manga' });
  }
});

// Delete manga
router.delete('/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;

    // Check ownership
    const manga = await prisma.manga.findUnique({
      where: { id: parseInt(id) }
    });

    if (!manga) {
      return res.status(404).json({ error: 'Manga not found' });
    }

    if (manga.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.manga.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Manga deleted successfully' });
  } catch (error) {
    console.error('Error deleting manga:', error);
    res.status(500).json({ error: 'Failed to delete manga' });
  }
});

router.post('/:id/chapters', authMiddleware, uploadChapterPages.array('pages'), async (req: any, res) => {
  try {
    const mangaId = parseInt(req.params.id);
    const { title, orderIndex } = req.body;
    const files = req.files as Express.Multer.File[];

    // Check manga ownership
    const manga = await prisma.manga.findUnique({
      where: { id: mangaId }
    });

    if (!manga) {
      return res.status(404).json({ error: 'Manga not found' });
    }

    if (manga.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Create chapter
    const chapter = await prisma.chapter.create({
      data: {
        title,
        orderIndex: parseInt(orderIndex),
        mangaId,
        pages: {
          create: files.map((file, index) => ({
            imageUrl: file.path,
            pageNumber: index + 1
          }))
        }
      },
      include: {
        pages: {
          orderBy: {
            pageNumber: 'asc'
          }
        }
      }
    });

    res.json(chapter);
  } catch (error) {
    console.error('Error creating chapter:', error);
    res.status(500).json({ error: 'Failed to create chapter' });
  }
});

// Get all chapters of a manga
router.get('/:id/chapters', async (req, res) => {
  try {
    const mangaId = parseInt(req.params.id);

    const chapters = await prisma.chapter.findMany({
      where: { mangaId },
      include: {
        pages: {
          orderBy: {
            pageNumber: 'asc'
          }
        }
      },
      orderBy: {
        orderIndex: 'asc'
      }
    });

    res.json(chapters);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

// Update chapter
router.put('/:id/chapters/:chapterId', authMiddleware, uploadChapterPages.array('pages'), async (req: any, res) => {
  try {
    const mangaId = parseInt(req.params.id);
    const chapterId = parseInt(req.params.chapterId);
    const { title, orderIndex } = req.body;
    const files = req.files as Express.Multer.File[];

    // Check manga ownership
    const manga = await prisma.manga.findUnique({
      where: { id: mangaId }
    });

    if (!manga) {
      return res.status(404).json({ error: 'Manga not found' });
    }

    if (manga.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update chapter
    const chapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        title,
        orderIndex: parseInt(orderIndex),
        ...(files.length > 0 && {
          pages: {
            deleteMany: {},
            create: files.map((file, index) => ({
              imageUrl: file.path,
              pageNumber: index + 1
            }))
          }
        })
      },
      include: {
        pages: {
          orderBy: {
            pageNumber: 'asc'
          }
        }
      }
    });

    res.json(chapter);
  } catch (error) {
    console.error('Error updating chapter:', error);
    res.status(500).json({ error: 'Failed to update chapter' });
  }
});

// Delete chapter
router.delete('/:id/chapters/:chapterId', authMiddleware, async (req: any, res) => {
  try {
    const mangaId = parseInt(req.params.id);
    const chapterId = parseInt(req.params.chapterId);

    // Check manga ownership
    const manga = await prisma.manga.findUnique({
      where: { id: mangaId }
    });

    if (!manga) {
      return res.status(404).json({ error: 'Manga not found' });
    }

    if (manga.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.chapter.delete({
      where: { id: chapterId }
    });

    res.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    res.status(500).json({ error: 'Failed to delete chapter' });
  }
});

export default router;