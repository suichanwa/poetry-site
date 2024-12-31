// server/routes/user.routes.ts
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware';
import { fileURLToPath } from 'url';

const router = express.Router();
const prisma = new PrismaClient();

// Define __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

// Avatar upload endpoint
router.post('/:id/avatar', authMiddleware, upload.single('avatar'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = parseInt(req.params.id);
    
    // Create relative path for storage - this should match how you're trying to access it
    const relativePath = `/uploads/${path.basename(req.file.path)}`;

    // Update user's avatar in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: relativePath }  // Save the relative path
    });

    res.json({
      avatar: relativePath,
      message: 'Avatar uploaded successfully'
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

router.get('/:id', authMiddleware, async (req: any, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user by username
router.get('/username/:username', async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { 
        name: req.params.username 
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
router.put('/:id', authMiddleware, async (req: any, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, bio } = req.body;

    // Make sure user can only update their own profile
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        bio,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

router.put('/:id/avatar-settings', authMiddleware, async (req: any, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { isAnimatedAvatar, avatarAnimation, avatarStyle } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isAnimatedAvatar,
        avatarAnimation,
        avatarStyle
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating avatar settings:', error);
    res.status(500).json({ error: 'Failed to update avatar settings' });
  }
});

export default router;