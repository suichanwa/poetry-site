// src/components/Communities/Topic/TopicDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pin, Lock, ArrowLeft, MessageCircle } from 'lucide-react';
import { ThreadList } from '../Thread/ThreadList';
import { CreateThreadModal } from '../Thread/CreateThreadModal';
import { formatDistanceToNow } from 'date-fns';

export function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateThreadModalOpen, setIsCreateThreadModalOpen] = useState(false);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/topics/${id}`);
        if (!response.ok) throw new Error('Failed to fetch topic');
        const data = await response.json();
        setTopic(data);
      } catch (error) {
        setError('Failed to load topic');
        console.error('Error fetching topic:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTopic();
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !topic) {
    return <div className="text-red-500">{error || 'Topic not found'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        {!topic.isLocked && (
          <Button
            onClick={() => setIsCreateThreadModalOpen(true)}
            className="ml-auto"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            New Thread
          </Button>
        )}
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{topic.title}</h1>
              {topic.isPinned && <Pin className="w-5 h-5 text-primary" />}
              {topic.isLocked && <Lock className="w-5 h-5 text-muted-foreground" />}
            </div>
            {topic.description && (
              <p className="mt-2 text-muted-foreground">{topic.description}</p>
            )}
            <div className="mt-4 text-sm text-muted-foreground">
              Created by {topic.createdBy.name}{' '}
              {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
      </Card>

      <ThreadList topicId={parseInt(id)} isLocked={topic.isLocked} />

      <CreateThreadModal
        isOpen={isCreateThreadModalOpen}
        onClose={() => setIsCreateThreadModalOpen(false)}
        topicId={parseInt(id)}
      />
    </div>
  );
}