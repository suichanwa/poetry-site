router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { name, description, isPrivate = false } = req.body;
    const userId = req.user.id;

    const community = await prisma.community.create({
      data: {
        name,
        description,
        isPrivate,
        creatorId: userId,
        members: {
          connect: [{ id: userId }] // Creator becomes a member
        },
        moderators: {
          connect: [{ id: userId }] // Creator becomes a moderator
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            members: true,
            posts: true
          }
        }
      }
    });

    res.json(community);
  } catch (error) {
    console.error('Error creating community:', error);
    res.status(500).json({ error: 'Failed to create community' });
  }
});
