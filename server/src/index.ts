import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from '../routes/auth.routes';
import userRoutes from '../routes/poem.routes';
import poemRoutes from '../routes/poem.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Define __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
// In server/src/index.ts
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/poems', poemRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});