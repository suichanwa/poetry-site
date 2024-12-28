// Get all poems
router.get('/', async (req, res) => {
  try {
    const poems = await prisma.poem.findMany({
      orderBy: {
        createdAt: 'desc'
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
        tags: true,
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });
    res.json(poems);
  } catch (error) {
    console.error('Error fetching poems:', error);
    res.status(500).json({ error: 'Failed to fetch poems' });
  }
});

// Get popular poems
router.get('/popular', async (req, res) => {
  try {
    const popularPoems = await prisma.poem.findMany({
      take: 2,
      orderBy: [
        { viewCount: 'desc' },
        { createdAt: 'desc' }
      ],
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
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });
    res.json(popularPoems);
  } catch (error) {
    console.error('Error fetching popular poems:', error);
    res.status(500).json({ error: 'Failed to fetch popular poems' });
  }
});

// Get all tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});