/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Notification` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "updatedAt",
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");
