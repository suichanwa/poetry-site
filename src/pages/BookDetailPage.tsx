import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useBookDetails } from "@/hooks/useBookDetails";
import { useBookActions } from "@/hooks/useBookActions";
import { LoadingState } from "@/components/LoadingState";
import { BookDetails } from "./BookDetails/BookDetails";
import { CommentsSection } from "./BookDetails/CommentsSection";

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { book, isLoading, error, isLiked, likedComments, likeCounts, setBook, setIsLiked, setLikedComments, setLikeCounts } = useBookDetails(id!);
  const { handleLike, handleAddComment, handleLikeComment } = useBookActions(book, setBook, setIsLiked, likedComments, setLikedComments, setLikeCounts);

  if (isLoading) return <LoadingState />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-500">Back</button>
      <BookDetails book={book} isLiked={isLiked} handleLike={handleLike} />
      <CommentsSection 
        comments={book.comments} 
        user={user} 
        likedComments={likedComments} 
        likeCounts={likeCounts} 
        handleAddComment={handleAddComment} 
        handleLikeComment={handleLikeComment} 
      />
    </div>
  );
}