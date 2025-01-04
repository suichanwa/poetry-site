/*
  Warnings:

  - You are about to drop the column `content` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Page` table. All the data in the column will be lost.
  - Made the column `orderIndex` on table `Chapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Manga` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `pageNumber` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "content",
DROP COLUMN "images",
ALTER COLUMN "orderIndex" SET NOT NULL;

-- AlterTable
ALTER TABLE "Manga" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "createdAt",
DROP COLUMN "number",
ADD COLUMN     "pageNumber" INTEGER NOT NULL;
