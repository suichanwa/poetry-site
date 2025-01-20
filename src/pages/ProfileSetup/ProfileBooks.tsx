import React from 'react';
import { Card } from '@/components/ui/card';

interface Book {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  author: {
    id: number;
    name: string;
  };
}

interface ProfileBooksProps {
  books: Book[];
  isOwnProfile: boolean;
  userName: string;
  error: string;
}

export function ProfileBooks({ books, isOwnProfile, userName, error }: ProfileBooksProps) {
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (books.length === 0) {
    return <p className="text-gray-500">No books yet.</p>;
  }

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <Card key={book.id} className="p-4">
          <div className="flex items-center gap-4">
            <img
              src={`http://localhost:3001${book.coverImage}`}
              alt={book.title}
              className="w-24 h-32 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-xl font-semibold">{book.title}</h3>
              <p className="text-gray-600">{book.description}</p>
              <p className="text-sm text-gray-500">By {book.author.name}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}