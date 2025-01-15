import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreateTopicModal } from "./CreateTopicModal";
import { TopicItem } from "./TopicItem";
import { useAuth } from "@/context/AuthContext";
import { Plus, Loader2 } from "lucide-react";

interface TopicListProps {
  communityId: number;
  isModOrCreator?: boolean;
}

export function TopicList({ communityId, isModOrCreator }: TopicListProps) {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/topics/community/${communityId}`);
        if (!response.ok) throw new Error('Failed to fetch topics');
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        setError('Failed to load topics');
        console.error('Error fetching topics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [communityId]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isModOrCreator && (
        <div className="flex justify-end">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Topic
          </Button>
        </div>
      )}

      {error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="space-y-2">
          {topics.map((topic) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              isModOrCreator={isModOrCreator}
            />
          ))}
        </div>
      )}

      <CreateTopicModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        communityId={communityId}
        onTopicCreated={(newTopic) => {
          setTopics((prev) => [newTopic, ...prev]);
        }}
      />
    </div>
  );
}