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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/poems', poemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/communities', communityRoutes); 
app.use('/api/notifications', notificationRoutes); // Changed from 'api/notification'
app.use('/api/notifications/preferences', notificationPreferencesRoutes);
app.use('/api/communities/posts', communityPostRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});