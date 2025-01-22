import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Heart, Eye, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BookDetailsProps {
  book: {
    id: number;
    title: string;
    description: string;
    coverImage: string;
    author: {
      id: number;
      name: string;
      avatar?: string;
      createdAt: string; // Add createdAt for author
    };
    createdAt: string;
    views: number;
    likes: number;
  };
  isLiked: boolean;
  handleLike: () => void;
}

export function BookDetails({ book, isLiked, handleLike }: BookDetailsProps) {
  const navigate = useNavigate();

  return (
    <Card className="w-full">
      <CardHeader>
          <div className="flex items-center gap-4"> {/* Wrap title and image in a div */}
            <img
              src={`http://localhost:3001${book.coverImage}`}
              alt={book.title}
              className="w-24 md:w-32 lg:w-40 h-auto rounded" // Responsive image size
            />
            <div>
              <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold">
                {book.title}
              </CardTitle>
            </div>
          </div>
      </CardHeader>
      <Separator />
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-4">
          <Avatar
            className="w-10 h-10 cursor-pointer"
            onClick={() => navigate(`/profile/${book.author.id}`)}
          >
            {book.author.avatar ? (
              <AvatarImage
                src={`http://localhost:3001${book.author.avatar}`}
                alt={book.author.name}
              />
            ) : (
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span
              className="font-medium cursor-pointer hover:underline"
              onClick={() => navigate(`/profile/${book.author.id}`)}
            >
              {book.author.name}
            </span>
            {/* Removed Joined Date Here */}
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{book.description}</p>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleLike}>
            <Heart
              className={`w-4 h-4 ${isLiked ? "fill-current text-red-500" : ""}`}
            />
          </Button>
          <span className="text-sm">
            {book.likes} {book.likes === 1 ? "Like" : "Likes"}
          </span>
          <Button variant="ghost" size="icon">
            <Eye className="w-4 h-4" />
          </Button>
          <span className="text-sm">
            {book.views} {book.views === 1 ? "View" : "Views"}
          </span>
        </div>
        <Button onClick={() => navigate(`/book/${book.id}/read`)}>
          <BookOpen className="mr-2 w-4 h-4" />
          Read
        </Button>
      </CardFooter>
    </Card>
  );
}