import { User, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  likes: number;
  isLiked?: boolean;
}

interface PoemDetailCommentsProps {
  comments: Comment[];
  onUserClick: (userId: number) => void;
}

export function PoemDetailComments({ comments, onUserClick }: PoemDetailCommentsProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likedComments, setLikedComments] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    // Initialize like counts from comments
    const initialLikeCounts = comments.reduce((acc, comment) => ({
      ...acc,
      [comment.id]: comment.likes || 0
    }), {});
    setLikeCounts(initialLikeCounts);

    // Check like status for each comment
    const checkLikeStatuses = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem('token');
        const statuses = await Promise.all(
          comments.map(comment => 
            fetch(`http://localhost:3000/api/poems/comments/${comment.id}/like/status`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }).then(res => res.json())
          )
        );

        const newLikedComments = comments.reduce((acc, comment, index) => ({
          ...acc,
          [comment.id]: statuses[index]?.liked || false
        }), {});

        setLikedComments(newLikedComments);
      } catch (error) {
        console.error('Error checking like statuses:', error);
      }
    };

    checkLikeStatuses();
  }, [comments, user]);

  const handleLikeComment = async (commentId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = likedComments[commentId] ? 'DELETE' : 'POST';
      const response = await fetch(`http://localhost:3000/api/poems/comments/${commentId}/like`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      setLikedComments(prev => ({ ...prev, [commentId]: data.liked }));
      setLikeCounts(prev => ({ ...prev, [commentId]: data.likeCount }));
    } catch (error) {
      console.error('Error toggling comment like:', error);
    }
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <p className="text-gray-500 text-center">No comments yet</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <button 
              onClick={() => onUserClick(comment.user.id)}
              className="flex-shrink-0"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {comment.user.avatar ? (
                  <img
                    src={`http://localhost:3000${comment.user.avatar}`}
                    alt={comment.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 m-2 text-gray-500 dark:text-gray-400" />
                )}
              </div>
            </button>
            <div className="flex-grow">
              <p 
                className="font-medium hover:underline cursor-pointer" 
                onClick={() => onUserClick(comment.user.id)}
              >
                {comment.user.name}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {comment.content}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleLikeComment(comment.id, e)}
                className={cn(
                  "mt-1 p-0 h-auto hover:bg-transparent",
                  likedComments[comment.id] ? "text-red-500" : "text-gray-500"
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