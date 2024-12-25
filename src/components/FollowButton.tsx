import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, UserMinus } from 'lucide-react';

interface FollowButtonProps {
  userId: number;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({ userId, onFollowChange }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || user.id === userId) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/follow/${userId}/status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        setIsFollowing(!!data.isFollowing);
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };

    checkFollowStatus();
  }, [userId, user]);

  const handleFollow = async () => {
    if (!user || user.id === userId) return;
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
      {isFollowing ? (
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