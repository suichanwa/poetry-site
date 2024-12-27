router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { name, description, isPrivate = false, rules = [] } = req.body;
    const userId = req.user.id;

    const community = await prisma.community.create({
      data: {
        name,
        description,
        isPrivate,
        creatorId: userId,
        members: {
          connect: [{ id: userId }]  // Creator becomes a member
        },
        moderators: {
          connect: [{ id: userId }]  // Creator becomes a moderator
        },
        rules: {
          create: rules.map((rule: { title: string; description: string }) => ({
            title: rule.title,
            description: rule.description
          }))
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        rules: true,
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
