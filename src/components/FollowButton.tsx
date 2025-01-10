// src/components/FollowButton.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, UserMinus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast'; // Fixed import path

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
  const { toast } = useToast();

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`http://localhost:3000/api/follow/${userId}/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });

        if (!response.ok) throw new Error('Failed to check follow status');
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };

    checkFollowStatus();
  }, [userId, user]);

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

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update follow status');
      }

      const newFollowingState = !isFollowing;
      setIsFollowing(newFollowingState);
      onFollowChange?.(newFollowingState);

      toast({
        description: newFollowingState 
          ? "You are now following this user" 
          : "You have unfollowed this user",
        duration: 3000
      });

    } catch (error) {
      console.error('Follow action error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update follow status',
        duration: 3000
      });
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