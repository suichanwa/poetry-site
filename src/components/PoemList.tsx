import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Poem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  shares: number;
}

interface PoemListProps {
  poems: Poem[];
}

export default function PoemList({ poems }: PoemListProps) {
  const navigate = useNavigate();
  const [likedPoems, setLikedPoems] = useState<Record<number, boolean>>({});
  const [bookmarkedPoems, setBookmarkedPoems] = useState<Record<number, boolean>>({});

  const handleLike = (poemId: number) => {
    setLikedPoems((prev) => ({
      ...prev,
      [poemId]: !prev[poemId],
    }));
    // TODO: Implement API call to like/unlike poem
  };

  const handleBookmark = (poemId: number) => {
    setBookmarkedPoems((prev) => ({
      ...prev,
      [poemId]: !prev[poemId],
    }));
    // TODO: Implement API call to bookmark/unbookmark poem
  };

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;
    const cleanPath = path.replace(/^.*[\/\\]uploads[\/\\]/, "uploads/").replace(/\\/g, "/");
    return `http://localhost:3001/${cleanPath}`;
  };

  const handlePoemClick = (poemId: number) => {
    navigate(`/poem/${poemId}`);
  };

  return (
    <div className="space-y-4">
      {poems.length === 0 ? (
        <div className="text-center text-muted-foreground">No poems found.</div>
      ) : (
        poems.map((poem) => (
          <Card key={poem.id} className="border rounded-lg">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Avatar
                className="w-10 h-10 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${poem.author.id}`);
                }}
              >
                {poem.author.avatar ? (
                  <AvatarImage
                    src={getImageUrl(poem.author.avatar)}
                    alt={poem.author.name}
                  />
                ) : (
                  <AvatarFallback>
                    {poem.author.name.substring(0, 2)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div
                className="flex-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${poem.author.id}`);
                }}
              >
                <div className="text-base font-medium hover:underline">
                  {poem.author.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(poem.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </CardHeader>

            {/* Title Card */}
            <Card
              onClick={() => handlePoemClick(poem.id)}
              className="cursor-pointer mb-0 ml-10 mr-10 mt-[-8px] border rounded-lg"
            >
              <CardContent className="p-4 cursor-pointer">
                <h3 className="font-bold text-xl pl-4 truncate">{poem.title}</h3>
              </CardContent>
            </Card>

            <CardContent
              onClick={() => handlePoemClick(poem.id)}
              className="cursor-pointer pt-0"
            >
              {/* Content Card */}
              <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line line-clamp-5">
                  {poem.content}
                </p>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(poem.id);
                    }}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        likedPoems[poem.id] ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <span className="text-sm">{poem.likes}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                  <span className="text-sm">{poem.comments}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <span className="text-sm">{poem.shares}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmark(poem.id);
                  }}
                >
                  <Bookmark
                    className={`w-5 h-5 ${
                      bookmarkedPoems[poem.id]
                        ? "fill-current text-primary"
                        : ""
                    }`}
                  />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}