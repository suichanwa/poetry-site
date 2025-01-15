// src/components/subcomponents/PoemActions.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Bookmark, MessageCircle, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(initialLikes);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/poems/${poemId}/like/status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch like status');
        
        const data = await response.json();
        setIsLiked(data.liked);
        setLikeCount(data.likeCount);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [poemId, user]);

 const handleLike = async (e: React.MouseEvent) => {
  e.stopPropagation();
  if (!user) {
    navigate('/login');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const method = isLiked ? 'DELETE' : 'POST';
    const response = await fetch(`http://localhost:3001/api/poems/${poemId}/like`, {
      method,
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
          disabled={!poemId} // Disable if no poemId
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
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="hover:scale-110 transition-transform flex items-center gap-1"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm">{commentsCount}</span>
        </Button>
      </div>

      <div className="flex space-x-1 sm:space-x-2">
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

      {/* Comment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
            <textarea
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              rows={3}
              placeholder="Write your comment..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onAddComment(e.currentTarget.value);
                  setIsModalOpen(false);
                }
              }}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const textarea = document.querySelector('textarea');
                  if (textarea && textarea.value.trim()) {
                    onAddComment(textarea.value);
                    setIsModalOpen(false);
                  }
                }}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}