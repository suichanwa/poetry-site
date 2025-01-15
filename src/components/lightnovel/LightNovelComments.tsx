// src/components/lightnovel/LightNovelComments.tsx
import { useState, useEffect } from "react";
import { User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

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

interface LightNovelCommentsProps {
  novelId: number;
  onUserClick: (userId: number) => void;
}

export function LightNovelComments({ novelId, onUserClick }: LightNovelCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    fetchComments();
  }, [novelId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/lightnovels/${novelId}/comments`);
      const data = await response.json();
      setComments(data);

      // Initialize like counts
      const initialLikeCounts = data.reduce((acc: Record<number, number>, comment: Comment) => ({
        ...acc,
        [comment.id]: comment.likes
      }), {});
      setLikeCounts(initialLikeCounts);

      // Check like status if user is logged in
      if (user) {
        const token = localStorage.getItem('token');
        const likeStatuses = await Promise.all(
          data.map((comment: Comment) =>
            fetch(`http://localhost:3001/api/lightnovels/comments/${comment.id}/like/status`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }).then(res => res.json())
          )
        );

        const newLikedComments = data.reduce((acc: Record<number, boolean>, comment: Comment, index: number) => ({
          ...acc,
          [comment.id]: likeStatuses[index]?.liked || false
        }), {});
        setLikedComments(newLikedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!user || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/lightnovels/${novelId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newComment.trim() })
      });

      if (!response.ok) throw new Error('Failed to add comment');
      
      const comment = await response.json();
      setComments(prev => [comment, ...prev]);
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
      const response = await fetch(`http://localhost:3001/api/lightnovels/comments/${commentId}/like`, {
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Comments</h2>
      
      {/* Add Comment */}
      {user && (
        <div className="flex gap-4">
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
            <Input
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
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="w-10 h-10 cursor-pointer" onClick={() => onUserClick(comment.user.id)}>
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
                  onClick={() => onUserClick(comment.user.id)}
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
                className={cn(
                  "mt-1 p-0 h-auto hover:bg-transparent",
                  likedComments[comment.id] ? "text-red-500" : "text-muted-foreground"
                )}
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
  );
}