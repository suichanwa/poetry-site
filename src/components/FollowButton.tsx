import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, UserMinus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FollowButtonProps {
  userId: number;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({ userId, initialIsFollowing = false, onFollowChange }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.id === userId) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/follow/${userId}`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const newFollowingState = !isFollowing;
      setIsFollowing(newFollowingState);
      onFollowChange?.(newFollowingState);
    } catch (error) {
      console.error('Follow action error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.id === userId) return null;

  return (
    <Button
      variant={isFollowing ? "destructive" : "default"}
      onClick={handleFollow}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="w-4 h-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </Button>
  );
}