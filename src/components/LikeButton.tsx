import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface LikeButtonProps {
  poemId: number;
  initialLikes?: number;
}

export function LikeButton({ poemId, initialLikes = 0 }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/poems/${poemId}/like/status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch like status');
        
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [poemId, user]);

  const toggleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/poems/${poemId}/like`, {
        method: liked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to toggle like');

      const data = await response.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleLike();
      }}
      className="flex items-center gap-1"
    >
      <Heart 
        className={cn(
          "w-6 h-6 transition-all",
          liked ? "fill-red-500 text-red-500" : "text-gray-500"
        )}
      />
      <span className="text-sm">{likeCount}</span>
    </button>
  );
}