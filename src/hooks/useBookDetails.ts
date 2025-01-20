import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { BookDetail, Comment } from "@/interfaces/bookInterfaces";

export function useBookDetails(bookId: string) {
  const { user } = useAuth();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isLiked, setIsLiked] = useState(false);
  const [likedComments, setLikedComments] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/books/${bookId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data = await response.json();
        setBook(data);
        setIsLiked(data.isLiked || false);

        // Initialize like counts for comments
        const initialLikeCounts = data.comments.reduce((acc: Record<number, number>, comment: Comment) => ({
          ...acc,
          [comment.id]: comment.likes || 0
        }), {});
        setLikeCounts(initialLikeCounts);

        // Check like status for each comment
        if (user) {
          const token = localStorage.getItem('token');
          const statuses = await Promise.all(
            data.comments.map((comment: Comment) =>
              fetch(`http://localhost:3001/api/books/comments/${comment.id}/like/status`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }).then(res => res.json())
            )
          );

          const newLikedComments = data.comments.reduce((acc: Record<number, boolean>, comment: Comment, index: number) => ({
            ...acc,
            [comment.id]: statuses[index]?.liked || false
          }), {});
          setLikedComments(newLikedComments);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch book details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId, user]);

  useEffect(() => {
    const incrementViewCount = async () => {
      if (!bookId) return;
      
      try {
        await fetch(`http://localhost:3001/api/books/${bookId}/view`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    };

    incrementViewCount();
  }, [bookId]);

  return { book, isLoading, error, isLiked, likedComments, likeCounts, setBook, setIsLiked, setLikedComments, setLikeCounts };
}