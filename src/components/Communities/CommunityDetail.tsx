// src/pages/Communities/CommunityDetail.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";
import { CommunityHeader } from "@/components/Communities/CommunityHeader";
import { CreatePostModal } from "@/components/Communities/CreatePostModal";
import { CommunityPost } from "@/components/Communities/CommunityPost";
import { CreateThreadModal } from "@/components/Communities/CreateThreadModal";
import { ThreadList } from "@/components/Communities/ThreadList";
import { Button } from "@/components/ui/button";

interface Community {
  id: number;
  name: string;
  description: string;
  avatar?: string;
  createdAt: string;
  _count: {
    members: number;
    posts: number;
    threads: number;
  };
  members: {
    id: number;
    name: string;
    avatar?: string;
  }[];
  posts: any[];
  threads: any[];
  creator: {
    id: number;
  };
  rules: {
    id: number;
    title: string;
    description: string;
  }[];
}

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>();
  const [community, setCommunity] = useState<Community | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isCreateThreadModalOpen, setIsCreateThreadModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/communities/${id}`);
        if (!response.ok) throw new Error('Failed to fetch community');
        const data = await response.json();
        setCommunity(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        console.error('Error fetching community:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunity();
  }, [id]);

  const handlePostCreated = (newPost: any) => {
    setCommunity(prev => ({
      ...prev!,
      posts: [newPost, ...prev!.posts],
      _count: { ...prev!._count, posts: prev!._count.posts + 1 }
    }));
  };

  const handleThreadCreated = (newThread: any) => {
    setCommunity(prev => ({
      ...prev!,
      threads: [newThread, ...prev!.threads],
      _count: { ...prev!._count, threads: prev!._count.threads + 1 }
    }));
  };

  if (isLoading) return <LoadingState />;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!community) return <div className="text-center py-8">Community not found</div>;

  const isMember = community.members.some(member => member.id === user?.id);
  const isModerator = user?.id === community.creator.id;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <CommunityHeader
          community={community}
          isMember={isMember}
          isModerator={isModerator}
          onJoin={() => {}}
          onLeave={() => {}}
          user={user}
        />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{community.name}</h1>
          {isMember && (
            <Button onClick={() => setIsCreatePostModalOpen(true)}>
              Create Post
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {community.posts.length > 0 ? (
            community.posts.map(post => (
              <CommunityPost key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No posts yet. Be the first to share something!
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-6 mt-10">
          <h2 className="text-2xl font-bold">Threads</h2>
          {isMember && (
            <Button onClick={() => setIsCreateThreadModalOpen(true)}>
              Create Thread
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {community.threads.length > 0 ? (
            <ThreadList threads={community.threads} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No threads yet. Be the first to start a discussion!
            </div>
          )}
        </div>

        <CreatePostModal
          isOpen={isCreatePostModalOpen}
          onClose={() => setIsCreatePostModalOpen(false)}
          communityId={community.id}
          onPostCreated={handlePostCreated}
        />

        <CreateThreadModal
          isOpen={isCreateThreadModalOpen}
          onClose={() => setIsCreateThreadModalOpen(false)}
          communityId={community.id}
          onThreadCreated={handleThreadCreated}
        />
      </div>
    </div>
  );
}