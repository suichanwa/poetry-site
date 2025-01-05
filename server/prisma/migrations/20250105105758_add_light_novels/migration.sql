-- CreateTable
CREATE TABLE "LightNovel" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ONGOING',

    CONSTRAINT "LightNovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LightNovelChapter" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "lightNovelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LightNovelChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LightNovelToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LightNovelToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LightNovelToTag_B_index" ON "_LightNovelToTag"("B");

-- AddForeignKey
ALTER TABLE "LightNovel" ADD CONSTRAINT "LightNovel_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LightNovelChapter" ADD CONSTRAINT "LightNovelChapter_lightNovelId_fkey" FOREIGN KEY ("lightNovelId") REFERENCES "LightNovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LightNovelToTag" ADD CONSTRAINT "_LightNovelToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "LightNovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LightNovelToTag" ADD CONSTRAINT "_LightNovelToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
