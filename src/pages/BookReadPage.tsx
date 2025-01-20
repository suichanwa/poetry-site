import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface BookContent {
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export default function BookReadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState<BookContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBookContent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/books/${id}/read`);
        if (!response.ok) {
          throw new Error("Failed to fetch book content");
        }
        const data = await response.json();
        setBook(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch book content");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookContent();
  }, [id]);

  if (isLoading) return <LoadingState />;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!book) return <div>Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-500">Back</button>
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-10 h-10">
          {book.author.avatar ? (
            <AvatarImage src={`http://localhost:3001${book.author.avatar}`} />
          ) : (
            <AvatarFallback>
              <User className="w-5 h-5" />
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-sm text-muted-foreground">by {book.author.name}</p>
        </div>
      </div>
      <div className="prose max-w-none">
        <p>{book.content}</p>
      </div>
    </div>
  );
}