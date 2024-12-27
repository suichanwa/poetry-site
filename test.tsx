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