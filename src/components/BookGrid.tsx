// src/components/BookGrid.tsx
import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Book {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  tags: { name: string }[];
  createdAt: string;
  views: number;
  likes: number;
}

interface BookGridProps {
  books: Book[];
  onBookClick: (bookId: number) => void;
  onAddBook?: () => void;
}

export function BookGrid({ books, onBookClick, onAddBook }: BookGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <Card key={book.id} className="cursor-pointer" onClick={() => onBookClick(book.id)}>
          <img src={book.coverImage} alt={book.title} className="w-full h-48 object-cover rounded-t-lg" />
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">{book.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{book.description}</p>
            <div className="flex items-center gap-2 mb-2">
              <img src={book.author.avatar || '/placeholder.png'} alt={book.author.name} className="w-6 h-6 rounded-full" />
              <span className="text-sm">{book.author.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              {book.views} views
            </div>
          </div>
        </Card>
      ))}
      {onAddBook && (
        <Button variant="outline" className="w-full h-48 flex items-center justify-center" onClick={onAddBook}>
          <BookOpen className="w-6 h-6 mr-2" />
          Add New Book
        </Button>
      )}
    </div>
  );
}