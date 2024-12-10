// src/components/poem/PoemCard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LikeButton } from "@/components/LikeButton";
import { CommentButton } from "@/components/CommentButton";
import { Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface PoemHeaderProps {
  title: string;
  author: string | { name: string; email: string };
  label?: string;
  isPreview?: boolean;
}

function PoemHeader({ title, author, label, isPreview = true }: PoemHeaderProps) {
  const maxTitleLength = window.innerWidth < 640 ? 60 : 120;
  const displayTitle = isPreview && title.length > maxTitleLength 
    ? `${title.slice(0, maxTitleLength)}...` 
    : title;
  const authorName = typeof author === 'string' ? author : author.name;

  return (
    <>
      {label && (
        <div className="text-sm font-semibold text-blue-500 mb-2 animate-fadeIn">
          {label}
        </div>
      )}
      <div className="border-b pb-2">
        <h3 className="text-lg sm:text-xl font-bold hover:text-primary transition-colors line-clamp-2">
          {displayTitle}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          By {authorName}
        </p>
      </div>
    </>
  );
}

interface PoemContentProps {
  content: string;
  isPreview?: boolean;
  onClick?: () => void;
}

function PoemContent({ content, isPreview = true, onClick }: PoemContentProps) {
  const maxPreviewLength = window.innerWidth < 640 ? 100 : 150;
  const shouldTruncate = isPreview && content.length > maxPreviewLength;
  const displayContent = shouldTruncate 
    ? `${content.slice(0, maxPreviewLength)}...` 
    : content;

  return (
    <div className="py-2 sm:py-4" onClick={onClick}>
      <p className={cn(
        "leading-relaxed text-sm sm:text-base",
        isPreview && "line-clamp-3 sm:line-clamp-4"
      )}>
        {displayContent}
      </p>
      {shouldTruncate && (
        <button 
          className="text-primary text-xs sm:text-sm mt-2 hover:underline"
          onClick={onClick}
        >
          Read more
        </button>
      )}
    </div>
  );
}

interface PoemActionsProps {
  onAddComment: (comment: string) => Promise<void>;
  onShare: () => Promise<void>;
  onBookmark: () => Promise<void>;
  isBookmarked: boolean;
}

function PoemActions({ onAddComment, onShare, onBookmark, isBookmarked }: PoemActionsProps) {
  return (
    <div className="border-t pt-2 flex justify-between items-center">
      <div className="flex space-x-2 sm:space-x-4">
        <LikeButton />
        <CommentButton onAddComment={onAddComment} />
      </div>
      <div className="flex space-x-1 sm:space-x-2">
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

interface PoemCommentsProps {
  comments: string[];
}

function PoemComments({ comments }: PoemCommentsProps) {
  if (comments.length === 0) return null;

  return (
    <div className="mt-2 sm:mt-4 border-t pt-2 sm:pt-4">
      <h4 className="text-xs sm:text-sm font-semibold mb-2">Comments</h4>
      <div className="space-y-1 sm:space-y-2">
        {comments.map((comment, index) => (
          <div key={index} className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {comment}
          </div>
        ))}
      </div>
    </div>
  );
}

export interface PoemCardProps {
  title: string;
  content: string;
  author: string | { name: string; email: string };
  label?: string;
  id: number;
  isPreview?: boolean;
}

export function PoemCard({ title, content, author, label, id, isPreview = true }: PoemCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      if (!user) return; 
      
      try {
        const response = await fetch(`http://localhost:3000/api/poems/${id}/bookmark/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setIsBookmarked(data.bookmarked);
      } catch (error) {
        console.error('Error fetching bookmark status:', error);
      }
    };

    fetchBookmarkStatus();
  }, [id, user]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} by ${typeof author === 'string' ? author : author.name}`,
          text: content,
          url: `${window.location.origin}/poem/${id}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      const url = `${window.location.origin}/poem/${id}`;
      await navigator.clipboard.writeText(url);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/poems/${id}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to bookmark poem');
      }

      const data = await response.json();
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      console.error('Error bookmarking poem:', error);
    }
  };

  const handleNavigate = () => {
    if (isPreview) {
      navigate(`/poem/${id}`);
    }
  };

  const addComment = async (comment: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/poems/${id}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      setComments([...comments, comment]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Card 
      className={cn(
        "transform transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800 animate-fadeIn p-3 sm:p-4",
        isPreview && "hover:scale-[1.01] cursor-pointer"
      )}
      onClick={handleNavigate}
    >
      <PoemHeader title={title} author={author} label={label} isPreview={isPreview} />
      <PoemContent 
        content={content} 
        isPreview={isPreview} 
        onClick={handleNavigate}
      />
      <PoemActions 
        onAddComment={addComment}
        onShare={handleShare}
        onBookmark={handleBookmark}
        isBookmarked={isBookmarked}
      />
      <PoemComments comments={comments} />
    </Card>
  );
}