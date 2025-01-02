-- Create a new migration file
-- migrations/YYYYMMDDHHMMSS_add_user_customization.sql

ALTER TABLE "User" 
ADD COLUMN "avatarAnimation" TEXT,
ADD COLUMN "avatarStyle" TEXT,
ADD COLUMN "banner" TEXT,
ADD COLUMN "customCardStyle" JSONB,
ADD COLUMN "isAnimatedAvatar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "seasonalThemeEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "themeSettings" JSONB;