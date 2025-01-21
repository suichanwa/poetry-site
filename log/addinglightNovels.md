# Light Novel Implementation Plan

## 1. Database Schema Updates
- [x] LightNovel model
  ```prisma
  model LightNovel {
    id          Int       @id @default(autoincrement())
    title       String
    description String
    coverImage  String?
    chapters    Chapter[]
    author      User      @relation(fields: [authorId], references: [id])
    authorId    Int
    tags        Tag[]
    createdAt   DateTime  @default(now())
    updatedAt   DateTime  @updatedAt
    views       Int       @default(0)
    likes       Int       @default(0)
  }

  model Chapter {
    id          Int      @id @default(autoincrement())
    title       String
    orderIndex  Int
    content     String
    lightNovel  LightNovel @relation(fields: [lightNovelId], references: [id])
    lightNovelId Int
    createdAt   DateTime @default(now())
  }
  ```

## 2. API Endpoints
- [x] Create Light Novel
- [x] Update Light Novel
- [x] Delete Light Novel
- [x] Get Light Novel by ID
- [x] Get All Light Novels
- [x] Add Chapter
- [x] Update Chapter
- [x] Delete Chapter
- [x] Get Chapter by ID

## 3. Frontend Components
- [x] AddLightNovelModal
  - [x] Basic novel info input
  - [x] Cover image upload
  - [x] Tags selection
  - [x] Rich text editor for content

- [x] LightNovelCard
  - [x] Display novel cover
  - [x] Title and description
  - [x] Author info
  - [x] View/Like counts
  - [x] Latest chapter info
  - [x] Status indicator

- [x] LightNovelReader
  - [x] Chapter navigation
  - [x] Font size controls
  - [x] Theme options (light/dark/sepia)
  - [x] Reading progress tracking
  - [x] Bookmarking system

## 4. Content Management
- [x] Text Editor Features
  - [x] Rich text formatting
  - [x] Chapter organization
  - [x] Auto-save drafts
  - [x] Image insertion
  - [x] Table of contents generation

- [x] Reading Experience
  - [x] Progress tracking
  - [x] Reading time estimates
  - [x] Font customization
  - [x] Line spacing options
  - [x] Margin controls

## 5. Features Implementation Order
1. Basic Novel Creation
   - [x] Implement AddLightNovelModal
   - [x] Rich text editor integration
   - [x] Cover image upload
   - [x] Basic info management

2. Novel Listing
   - [x] Create LightNovelCard component
   - [x] Implement grid/list view
   - [x] Add pagination/infinite scroll
   - [x] Search and filtering

3. Chapter Management
   - [x] Chapter creation system
   - [x] Content editor integration
   - [x] Chapter organization
   - [x] Draft system

4. Reader Implementation
   - [x] Create novel reader component
   - [x] Reading preferences
   - [x] Navigation controls
   - [x] Progress saving

5. Social Features
   - [x] Comments system
   - [x] Rating system
   - [x] Share functionality
   - [x] Follow authors
   - [x] Reading history

## 6. Technical Considerations
- [x] Rich text storage and rendering
- [x] Reading progress synchronization
- [x] Content backup system
- [x] Mobile-responsive design
- [x] SEO optimization
- [x] Content moderation tools
- [x] Report system

```
всё хуйня из пункта 8 ещё под вопросами
```

## 8. Additional Features
- [ ] Series management
- [ ] Volume organization
- [ ] Character profiles
- [ ] Glossary system
- [ ] Translation support
- [ ] Review system
- [ ] Reading lists
