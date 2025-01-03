// src/components/UserActions.tsx
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UserActionsProps {
  userId: number;
  isOwnProfile: boolean;
}

export function UserActions({ userId, isOwnProfile }: UserActionsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

// src/components/UserActions.tsx
const handleMessageClick = async () => {
  if (isCreating) return;
  
  setIsCreating(true);
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to start a chat');
    }

    const response = await fetch('http://localhost:3000/api/chats', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        participantId: Number(userId) // Ensure userId is a number
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create chat');
    }

    const chat = await response.json();
    navigate(`/chats?id=${chat.id}`);
  } catch (error) {
    console.error('Error creating chat:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: error instanceof Error ? error.message : 'Failed to create chat'
    });
  } finally {
    setIsCreating(false);
  }
};

  if (isOwnProfile) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleMessageClick}
      disabled={isCreating}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      <MessageCircle className="h-5 w-5" />
    </Button>
  );
}