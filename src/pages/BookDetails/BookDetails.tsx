import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
    <div className="flex flex-col md:flex-row gap-4">
      <img src={`http://localhost:3001${book.coverImage}`} alt={book.title} className="w-full md:w-1/3 h-auto object-cover rounded-lg" />
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
        <p className="text-sm text-muted-foreground mb-4">{book.description}</p>
        <div className="flex items-center gap-2 mb-4">
          <img src={`http://localhost:3001${book.author.avatar}`} alt={book.author.name} className="w-8 h-8 rounded-full" />
          <span className="text-sm">{book.author.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>{new Date(book.createdAt).toLocaleDateString()}</span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {book.views} views
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {book.likes} likes
          </span>
        </div>
        <Button onClick={() => navigate(`/book/${book.id}/read`)} className="mb-4">
          Start Reading
        </Button>
        <Button variant="ghost" onClick={handleLike} className="flex items-center gap-2">
          <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`} />
          {isLiked ? 'Unlike' : 'Like'}
        </Button>
      </div>
    </div>
  );
}