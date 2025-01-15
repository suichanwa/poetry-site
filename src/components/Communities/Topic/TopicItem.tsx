// src/components/Communities/Topic/TopicItem.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pin, Lock, MessageCircle, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TopicItemProps {
  topic: {
    id: number;
    title: string;
    description?: string;
    isPinned: boolean;
    isLocked: boolean;
    createdAt: string;
    createdBy: {
      name: string;
      avatar?: string;
    };
    _count: {
      threads: number;
    };
  };
  isModOrCreator?: boolean;
}

export function TopicItem({ topic, isModOrCreator }: TopicItemProps) {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateTopic = async (updates: { isPinned?: boolean; isLocked?: boolean }) => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/topics/${topic.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update topic');
      }
    } catch (error) {
      console.error('Error updating topic:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card 
      className={`p-4 hover:bg-accent/50 transition-colors cursor-pointer ${
        topic.isPinned ? 'border-primary' : ''
      }`}
      onClick={() => navigate(`/topic/${topic.id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{topic.title}</h3>
            {topic.isPinned && <Pin className="w-4 h-4 text-primary" />}
            {topic.isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
          </div>
          {topic.description && (
            <p className="text-muted-foreground mt-1">{topic.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {topic._count.threads} threads
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
            </span>
            <span>by {topic.createdBy.name}</span>
          </div>
        </div>

        {isModOrCreator && (
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateTopic({ isPinned: !topic.isPinned })}
              disabled={isUpdating}
            >
              {topic.isPinned ? 'Unpin' : 'Pin'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateTopic({ isLocked: !topic.isLocked })}
              disabled={isUpdating}
            >
              {topic.isLocked ? 'Unlock' : 'Lock'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}