// server/routes/community.routes.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();
const prisma = new PrismaClient();

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

router.get('/', async (req, res) => {
  try {
    const communities = await prisma.community.findMany({
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

    res.json(communities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
});

// Get community by ID
router.get('/:id', async (req, res) => {
  try {
    const communityId = parseInt(req.params.id);

    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
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
        moderators: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        rules: true,
        posts: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            _count: {
              select: {
                comments: true,
                likes: true
              }
            }
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

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.json(community);
  } catch (error) {
    console.error('Error fetching community:', error);
    res.status(500).json({ error: 'Failed to fetch community' });
  }
});

// Update community
router.put('/:id', authMiddleware, async (req: any, res) => {
  try {
    const communityId = parseInt(req.params.id);
    const { name, description, isPrivate, rules } = req.body;
    const userId = req.user.id;

    // Check if user is creator or moderator
    const community = await prisma.community.findFirst({
      where: {
        id: communityId,
        OR: [
          { creatorId: userId },
          { moderators: { some: { id: userId } } }
        ]
      }
    });

    if (!community) {
      return res.status(403).json({ error: 'Not authorized to update this community' });
    }

    const updatedCommunity = await prisma.community.update({
      where: { id: communityId },
      data: {
        name,
        description,
        isPrivate,
        rules: rules ? {
          deleteMany: {},
          create: rules.map((rule: { title: string; description: string }) => ({
            title: rule.title,
            description: rule.description
          }))
        } : undefined
      },
      include: {
        creator: {
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

    res.json(updatedCommunity);
  } catch (error) {
    console.error('Error updating community:', error);
    res.status(500).json({ error: 'Failed to update community' });
  }
});

// Delete community
router.delete('/:id', authMiddleware, async (req: any, res) => {
  try {
    const communityId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if user is creator
    const community = await prisma.community.findFirst({
      where: {
        id: communityId,
        creatorId: userId
      }
    });

    if (!community) {
      return res.status(403).json({ error: 'Not authorized to delete this community' });
    }

    await prisma.community.delete({
      where: { id: communityId }
    });

    res.json({ message: 'Community deleted successfully' });
  } catch (error) {
    console.error('Error deleting community:', error);
    res.status(500).json({ error: 'Failed to delete community' });
  }
});

// Add these routes after the basic CRUD operations

// Join community
router.post('/:id/join', authMiddleware, async (req: any, res) => {
  try {
    const communityId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if community exists and user isn't already a member
    const community = await prisma.community.findFirst({
      where: {
        id: communityId,
        NOT: {
          members: {
            some: {
              id: userId
            }
          }
        }
      }
    });

    if (!community) {
      return res.status(400).json({ 
        error: 'Community not found or user is already a member' 
      });
    }

    // Add user to community members
    const updatedCommunity = await prisma.community.update({
      where: { id: communityId },
      data: {
        members: {
          connect: { id: userId }
        }
      },
      include: {
        _count: {
          select: {
            members: true,
            posts: true
          }
        }
      }
    });

    res.json(updatedCommunity);
  } catch (error) {
    console.error('Error joining community:', error);
    res.status(500).json({ error: 'Failed to join community' });
  }
});

// Leave community
router.post('/:id/leave', authMiddleware, async (req: any, res) => {
  try {
    const communityId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if user is a member
    const community = await prisma.community.findFirst({
      where: {
        id: communityId,
        members: {
          some: {
            id: userId
          }
        }
      }
    });

    if (!community) {
      return res.status(400).json({ error: 'Not a member of this community' });
    }

    // Prevent creator from leaving
    if (community.creatorId === userId) {
      return res.status(400).json({ 
        error: 'Community creator cannot leave the community' 
      });
    }

    // Remove user from community members and moderators
    const updatedCommunity = await prisma.community.update({
      where: { id: communityId },
      data: {
        members: {
          disconnect: { id: userId }
        },
        moderators: {
          disconnect: { id: userId }
        }
      },
      include: {
        _count: {
          select: {
            members: true,
            posts: true
          }
        }
      }
    });

    res.json(updatedCommunity);
  } catch (error) {
    console.error('Error leaving community:', error);
    res.status(500).json({ error: 'Failed to leave community' });
  }
});

// Get community members
router.get('/:id/members', async (req, res) => {
  try {
    const communityId = parseInt(req.params.id);

    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            avatar: true,
            createdAt: true
          }
        },
        moderators: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.json({
      members: community.members,
      moderators: community.moderators,
      creator: community.creator
    });
  } catch (error) {
    console.error('Error fetching community members:', error);
    res.status(500).json({ error: 'Failed to fetch community members' });
  }
});

export default router;