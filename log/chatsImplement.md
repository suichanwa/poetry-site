### Database Schema
- [ ] Create `Message` model:
  ```prisma
  model Message {
    id        Int      @id @default(autoincrement())
    content   String
    senderId  Int
    sender    User     @relation("sent", fields: [senderId], references: [id])
    receiverId Int
    receiver  User     @relation("received", fields: [receiverId], references: [id])
    read      Boolean  @default(false)
    type      String   // text, image, etc.
    createdAt DateTime @default(now())
  }

  model Conversation {
    id           Int       @id @default(autoincrement())
    participants User[]    @relation("UserConversations")
    lastMessage  Message?  @relation(fields: [lastMessageId], references: [id])
    lastMessageId Int?
    createdAt    DateTime  @default(now())
    updatedAt    DateTime  @updatedAt
  }

  Collecting workspace information

# Multi-Content Upload System Implementation Plan

## 1. Database Models [Phase 1]
```prisma
model ContentType {
  id          Int       @id @default(autoincrement())
  name        String    // POEM, MANGA, BOOK, LIGHT_NOVEL
  contents    Content[]
}

model Content {
  id          Int         @id @default(autoincrement())
  title       String
  description String?
  authorId    Int
  author      User        @relation(fields: [authorId], references: [id])
  typeId      Int
  type        ContentType @relation(fields: [typeId], references: [id])
  chapters    Chapter[]
  tags        Tag[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Chapter {
  id          Int      @id @default(autoincrement())
  title       String
  content     String?
  images      String[] // For manga chapters
  contentId   Int
  content     Content  @relation(fields: [contentId], references: [id])
  orderIndex  Int
  createdAt   DateTime @default(now())
}
```

## 2. UI Components [Phase 1]
- [ ] Add Content Button Enhancement
  - [ ] Create dropdown menu for content types
  - [ ] Add icons for each content type
  - [ ] Implement type selection logic

- [ ] Content Upload Modals
  - [ ] Create base modal component
  - [ ] Implement specific modals:
    ```typescript
    - PoemUploadModal
    - MangaUploadModal
    - BookUploadModal
    - LightNovelUploadModal
    ```

## 3. Content Type Features [Phase 2]
- [ ] Manga Features
  - [ ] Page-by-page upload system
  - [ ] Panel arrangement tools
  - [ ] Chapter organization
  - [ ] Preview generation

- [ ] Book/Light Novel Features
  - [ ] Chapter text editor
  - [ ] Cover image upload
  - [ ] Table of contents generator
  - [ ] Reading progress tracker

## 4. API Endpoints [Phase 1]
```typescript
// POST /api/content
// GET /api/content/:id
// PUT /api/content/:id
// DELETE /api/content/:id
// POST /api/content/:id/chapters
```

## Next Immediate Tasks:
1. Update database schema with new models
2. Create basic content type selection UI
3. Implement base upload modal
4. Add content type specific forms

## Technical Requirements:
1. File upload handling for different content types
2. Image processing for manga/covers
3. Rich text editor for books/novels
4. Content validation per type
5. Proper storage management