import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Heart, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BookDetail {
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
  comments: Comment[];
}

interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/books/${id}`);
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
  }, [id, user]);

  useEffect(() => {
    const incrementViewCount = async () => {
      if (!id) return;
      
      try {
        await fetch(`http://localhost:3001/api/books/${id}/view`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    };

    incrementViewCount();
  }, [id]);

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

  const handleAddComment = async () => {
    if (!user || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/books/${book?.id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newComment.trim() })
      });

      if (!response.ok) throw new Error('Failed to add comment');
      
      const comment = await response.json();
      setBook(prev => prev ? { ...prev, comments: [comment, ...prev.comments] } : prev);
      setNewComment("");
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
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

  if (isLoading) return <LoadingState />;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!book) return <div>Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-500">Back</button>
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

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {user && (
          <div className="flex gap-4 mb-4">
            <Avatar className="w-10 h-10">
              {user.avatar ? (
                <AvatarImage src={`http://localhost:3001${user.avatar}`} />
              ) : (
                <AvatarFallback>
                  <User className="w-5 h-5" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button 
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmitting}
                size="sm"
              >
                Post Comment
              </Button>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {book.comments?.map(comment => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="w-10 h-10 cursor-pointer" onClick={() => navigate(`/profile/${comment.user.id}`)}>
                {comment.user.avatar ? (
                  <AvatarImage src={`http://localhost:3001${comment.user.avatar}`} />
                ) : (
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    className="font-medium hover:underline cursor-pointer"
                    onClick={() => navigate(`/profile/${comment.user.id}`)}
                  >
                    {comment.user.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-foreground/90">{comment.content}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikeComment(comment.id)}
                  className={`mt-1 p-0 h-auto hover:bg-transparent ${likedComments[comment.id] ? 'text-red-500' : 'text-muted-foreground'}`}
                >
                  <Heart 
                    className="w-4 h-4 mr-1" 
                    fill={likedComments[comment.id] ? "currentColor" : "none"} 
                  />
                  <span className="text-xs">{likeCounts[comment.id] || 0}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}