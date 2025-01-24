# Manga System Implementation Plan

## Progress Summary
- **Completed**: Basic CRUD operations, MangaReader component, chapter management, bookmarking system
- **In Progress**: File handling optimization, chapter navigation
- **Planned**: Advanced search, recommendation system, offline reading

## Current Features (✅ Complete)
### Core Functionality
- [x] Basic manga CRUD operations
- [x] Chapter upload and management
- [x] MangaReader component with:
  - Page navigation
  - Zoom controls
  - Fullscreen mode
  - Paged/Scroll view modes
- [x] Basic bookmarking system
- [x] View count tracking
- [x] Like system

### User Interface
- [x] MangaCard component
- [x] Manga detail page
- [x] Chapter list view
- [x] Add manga modal with multi-step form
- [x] Basic responsive design

## Immediate Priorities (🚧 In Progress)
1. **File Optimization**
   - [] Image compression
   - [] Lazy loading for manga pages
   - [] Caching system for frequently accessed pages

2. **Reader Enhancements**
   - [ ] Reading progress tracking
   - [ ] Remember last read page

3. **Chapter Management**
   - [ ] Chapter reordering
   - [ ] Chapter preview in management view
   - [ ] Auto-save draft chapters

## Future Features (📋 Planned)
### Phase 1: Enhanced Reading Experience
- [ ] Offline reading support
- [ ] Double page view option
- [ ] Reading history with resume points

### Phase 2: Social Features
- [ ] Comments on chapters
- [ ] Rating system
- [ ] Share specific pages
- [ ] Reading lists/collections
- [ ] Follow manga for updates

### Phase 3: Advanced Features
- [ ] Recommendation system
- [ ] Machine learning for content tagging
- [ ] Automated content moderation
- [ ] Analytics dashboard for creators

## Technical Improvements
1. **Performance**
   - [ ] Implement CDN for manga images
   - [ ] Progressive image loading
   - [ ] Optimize database queries
   - [ ] Background prefetching

2. **Security**
   - [ ] Content ownership verification
   - [ ] File type validation
   - [ ] Rate limiting for uploads
   - [ ] DMCA compliance system

3. **Mobile Optimization**
   - [ ] Touch gestures for navigation
   - [ ] Mobile-optimized reader layout
   - [ ] Reduce data usage options
   - [ ] PWA features

## Next Steps
1. Implement file optimization features
2. Enhance reader with progress tracking
3. Add bulk chapter upload functionality
4. Improve mobile experience
5. Begin work on offline support

# Implementing it

Collecting workspace information

Sure, here's a step-by-step plan to implement the rating system in your project:

# Step-by-Step Plan to Implement Rating System

## Step 1: Database Schema Update
1. **Update Prisma Schema**:
   - Add a new `MangaRating` model to your Prisma schema.
   - Ensure each user can rate a manga only once.

```prisma
model MangaRating {
  id        Int      @id @default(autoincrement())
  rating    Int      // 1-5 stars
  manga     Manga    @relation(fields: [mangaId], references: [id])
  mangaId   Int
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  comment   String?  // Optional rating comment
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([mangaId, userId]) // One rating per manga per user
}
```

2. **Run Migrations**:
   - Generate and run the migration to update the database schema.
   ```sh
   npx prisma migrate dev --name add_manga_rating
   ```

## Step 2: Backend Implementation
1. **Create Rating Service**:
   - Implement a service to handle rating logic in `poetry-site-server/services/rating.service.ts`.

```ts
import { prisma } from "@/lib/prisma";

export class RatingService {
  async rateManga(userId: number, mangaId: number, rating: number, comment?: string) {
    return await prisma.mangaRating.upsert({
      where: { mangaId_userId: { mangaId, userId } },
      update: { rating, comment },
      create: { userId, mangaId, rating, comment },
    });
  }

  async getMangaRatings(mangaId: number) {
    const ratings = await prisma.mangaRating.findMany({
      where: { mangaId },
      select: { rating: true },
    });
    const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    return { average, total: ratings.length };
  }
}
```

2. **Create API Endpoints**:
   - Add endpoints to handle rating requests in `poetry-site-server/routes/manga.ts`.

```ts
import { Router } from "express";
import { RatingService } from "@/services/rating.service";

const router = Router();
const ratingService = new RatingService();

router.post("/:id/rate", async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id; // Assuming user ID is available in req.user

  try {
    const result = await ratingService.rateManga(userId, parseInt(id), rating, comment);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/ratings", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await ratingService.getMangaRatings(parseInt(id));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

## Step 3: Frontend Implementation
1. **Create Rating Component**:
   - Implement a star rating component in 

src/components/ui/Rating.tsx

.

```tsx
import React, { useState } from "react";
import { Star } from "lucide-react";

interface RatingProps {
  initialRating: number;
  onRate: (rating: number) => void;
}

export const Rating: React.FC<RatingProps> = ({ initialRating, onRate }) => {
  const [rating, setRating] = useState(initialRating);

  const handleRate = (rate: number) => {
    setRating(rate);
    onRate(rate);
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
          onClick={() => handleRate(star)}
        />
      ))}
    </div>
  );
};
```

2. **Integrate Rating Component**:
   - Use the rating component in the manga detail page in 
