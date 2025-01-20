import { useAuth } from "@/context/AuthContext";
import { BookDetail, Comment } from "@/interfaces/bookInterfaces";

export function useBookActions(book: BookDetail | null, setBook: (book: BookDetail | null) => void, setIsLiked: (isLiked: boolean) => void, likedComments: Record<number, boolean>, setLikedComments: (likedComments: Record<number, boolean>) => void, setLikeCounts: (likeCounts: Record<number, number>) => void) {
  const { user } = useAuth();

  const handleLike = async () => {
    if (!user || !book) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/books/${book.id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to like book');

      const data = await response.json();
      setIsLiked(data.liked);
      setBook(prev => prev ? { ...prev, likes: data.likeCount } : prev);
    } catch (error) {
      console.error('Error liking book:', error);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/books/${book?.id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) throw new Error('Failed to add comment');
      
      const comment = await response.json();
      setBook(prev => prev ? { ...prev, comments: [comment, ...prev.comments] } : prev);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/books/comments/${commentId}/like`, {
        method: likedComments[commentId] ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to toggle like');

      const data = await response.json();
      setLikedComments(prev => ({ ...prev, [commentId]: data.liked }));
      setLikeCounts(prev => ({ ...prev, [commentId]: data.likeCount }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return { handleLike, handleAddComment, handleLikeComment };
}