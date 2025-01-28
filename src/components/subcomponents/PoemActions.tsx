import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Bookmark, MessageCircle, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PoemActionsProps {
  poemId: number;
  onAddComment: (comment: string) => Promise<void>;
  onShare: () => Promise<void>;
  onBookmark: () => Promise<void>;
  isBookmarked: boolean;
  initialLikes?: number;
  commentsCount?: number;
}

export function PoemActions({ 
  poemId,
  onAddComment, 
  onShare, 
  onBookmark, 
  isBookmarked,
  initialLikes = 0,
  commentsCount = 0
}: PoemActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/poems/${poemId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to toggle like');

      const data = await response.json();
      setIsLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCommentClick = () => {
    navigate(`/poems/${poemId}/comments`);
  };

  return (
    <div className="border-t pt-2 flex justify-between items-center">
      <div className="flex space-x-2 sm:space-x-4">
        {/* Like Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLike}
          className={cn(
            "hover:scale-110 transition-transform flex items-center gap-1",
            isLiked ? "text-red-500" : ""
          )}
        >
          <Heart 
            className="w-4 h-4 sm:w-5 sm:h-5" 
            fill={isLiked ? "currentColor" : "none"} 
          />
          <span className="text-sm">{likeCount}</span>
        </Button>

        {/* Comment Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCommentClick}
          className="hover:scale-110 transition-transform flex items-center gap-1"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm">{commentsCount}</span>
        </Button>

        {/* Share Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
          className="hover:scale-110 transition-transform w-8 h-8 sm:w-9 sm:h-9"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {/* Bookmark Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
          className={cn(
            "hover:scale-110 transition-transform w-8 h-8 sm:w-9 sm:h-9",
            isBookmarked ? "text-primary" : ""
          )}
        >
          <Bookmark 
            className="w-4 h-4 sm:w-5 sm:h-5" 
            fill={isBookmarked ? "currentColor" : "none"} 
          />
        </Button>
      </div>
    </div>
  );
}