import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { fileURLToPath } from 'url';

const router = express.Router();
const prisma = new PrismaClient();

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
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

// Configure multer upload
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Only .jpeg, .png and .gif files are allowed'), false);
      return;
    }
    cb(null, true);
  }
});

// Avatar upload endpoint
router.post('/:id/avatar', authMiddleware, upload.single('avatar'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = parseInt(req.params.id);
    
    // Authorization check
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this user' });
    }

    // Create relative path for storage
    const relativePath = path.relative(
      path.join(__dirname, '../..'),
      req.file.path
    ).replace(/\\/g, '/');

    // Update user's avatar in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: `/uploads/${path.basename(req.file.path)}` }
    });

    res.json({
      avatar: updatedUser.avatar,
      message: 'Avatar uploaded successfully'
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

export default router;