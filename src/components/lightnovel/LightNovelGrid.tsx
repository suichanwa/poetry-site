// src/components/lightnovel/LightNovelGrid.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart } from "lucide-react";

interface LightNovel {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  author: {
    id: number;
    name: string;
  };
  tags: {
    id: number;
    name: string;
  }[];
  _count: {
    likes: number;
    chapters: number;
  } | null; // Make _count optional
}

interface LightNovelGridProps {
  lightNovels?: LightNovel[]; // Make lightNovels optional
}

export function LightNovelGrid({ lightNovels }: LightNovelGridProps) {
  const [likedNovels, setLikedNovels] = useState<number[]>([]);

  const handleLike = (novelId: number) => {
    setLikedNovels((prev) => {
      if (prev.includes(novelId)) {
        return prev.filter((id) => id !== novelId);
      } else {
        return [...prev, novelId];
      }
    });
  };

  const isNovelLiked = (novelId: number) => {
    return likedNovels.includes(novelId);
  };

  // Handle undefined or empty lightNovels
  if (!lightNovels || lightNovels.length === 0) {
    return <div className="text-gray-500">No light novels to display.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {lightNovels.map((novel) => (
        <Card key={novel.id} className="group relative overflow-hidden">
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleLike(novel.id)}
              className="rounded-full"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isNovelLiked(novel.id)
                    ? "fill-red-500 text-red-500"
                    : "text-white"
                }`}
              />
            </Button>
          </div>

          <AspectRatio ratio={9 / 14}>
            <img
              src={novel.coverImage}
              alt={novel.title}
              className="object-cover w-full h-full"
            />
          </AspectRatio>

          <CardHeader>
            <CardTitle className="line-clamp-2">{novel.title}</CardTitle>
            <CardDescription className="line-clamp-3">
              {novel.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-2">
              {novel.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {/* Handle optional _count */}
              {novel._count
                ? novel._count.chapters
                : 0}{" "}
              {novel._count &&
              novel._count.chapters === 1
                ? "Chapter"
                : "Chapters"}
            </div>
            <div className="text-sm text-muted-foreground">
              {/* Handle optional _count */}
              {novel._count ? novel._count.likes : 0} {" "}
              {novel._count && novel._count.likes === 1 ? "Like" : "Likes"}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}