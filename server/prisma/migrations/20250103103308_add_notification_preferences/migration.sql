-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailComments" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailFollows" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailLikes" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pushComments" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pushFollows" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pushLikes" BOOLEAN NOT NULL DEFAULT false;
