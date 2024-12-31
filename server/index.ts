import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import poemRoutes from './routes/poem.routes.js';
import followRoutes from './routes/follow.routes.js';
import communityRoutes from './routes/community.routes.js'; 
import notificationPreferencesRoutes from './routes/notification.preferences.routes';
import notificationRoutes from './routes/notification.routes.js';
import { createServer } from 'http';
import { initWebSocket } from './services/websocket.service';
import communityPostRoutes from './routes/community.post.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const server = createServer(app);
initWebSocket(server);

// Set up __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create upload directories
const uploadsDir = path.join(__dirname, '../uploads');
const communityAvatarsDir = path.join(uploadsDir, 'community-avatars');
const communityPostsDir = path.join(uploadsDir, 'community-posts');

// Create directories if they don't exist
[uploadsDir, communityAvatarsDir, communityPostsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// CORS configuration with proper headers
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition', 'Cross-Origin-Resource-Policy']
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());

// Configure static file serving with proper headers
app.use('/uploads', (req, res, next) => {
  // Add necessary headers for cross-origin image loading
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  next();
}, express.static(uploadsDir, {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Special route for community avatars
app.get('/uploads/community-avatars/:filename', (req, res) => {
  const filePath = path.join(communityAvatarsDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.sendFile(filePath);
  } else {
    res.status(404).send('Avatar not found');
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/poems', poemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/notifications/preferences', notificationPreferencesRoutes);
app.use('/api/communities/posts', communityPostRoutes);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});