// src/pages/Communities/CommunityDetail.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";
import { CommunityInfo } from "./CommunityInfo";
import { MemberList } from "./MemberList";
import { CommunityRules } from "./CommunityRules";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Shield, Plus, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InviteUserModal } from "@/components/Communities/InviteUserModal";
import { CreatePostModal } from "@/components/Communities/CreatePostModal";

interface Community {
  id: number;
  name: string;
  description: string;
  avatar?: string;
  createdAt: string;
  isPrivate: boolean;
  _count: {
    members: number;
    posts: number;
  };
  members: {
    id: number;
    name: string;
    avatar?: string;
  }[];
  posts: any[];
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
  const [activeTab, setActiveTab] = useState("posts");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCommunityUpdate = (updatedCommunity: Community) => {
    setCommunity(updatedCommunity);
  };

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

  const handleJoinCommunity = async () => {
    if (!user || !community) return;
    try {
      const response = await fetch(`http://localhost:3001/api/communities/${id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!response.ok) throw new Error('Failed to join community');
      const updatedCommunity = await response.json();
      setCommunity(prev => ({
        ...prev!,
        members: [...prev!.members, user],
        _count: { ...prev!._count, members: prev!._count.members + 1 }
      }));
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleLeaveCommunity = async () => {
    if (!user || !community) return;
    try {
      const response = await fetch(`http://localhost:3001/api/communities/${id}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!response.ok) throw new Error('Failed to leave community');
      setCommunity(prev => ({
        ...prev!,
        members: prev!.members.filter(member => member.id !== user.id),
        _count: { ...prev!._count, members: prev!._count.members - 1 }
      }));
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  const handlePostCreated = (newPost: any) => {
    setCommunity(prev => ({
      ...prev!,
      posts: [newPost, ...prev!.posts],
      _count: { ...prev!._count, posts: prev!._count.posts + 1 }
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
        <CommunityInfo
          community={community}
          isMember={isMember}
          isModerator={isModerator}
          onJoin={handleJoinCommunity}
          onLeave={handleLeaveCommunity}
          onUpdate={handleCommunityUpdate}
          user={user}
        />

        <div className="flex justify-between items-center mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="posts">
                <BookOpen className="w-4 h-4 mr-2" />
                Posts ({community._count.posts})
              </TabsTrigger>
              <TabsTrigger value="members">
                <Users className="w-4 h-4 mr-2" />
                Members ({community._count.members})
              </TabsTrigger>
              <TabsTrigger value="rules">
                <Shield className="w-4 h-4 mr-2" />
                Rules
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6">
              <div className="space-y-4">
                {community.posts.length > 0 ? (
                  community.posts.map(post => (
                    <PoemCard key={post.id} {...post} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No posts yet. Be the first to share a poem!
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="members" className="mt-6">
              <MemberList
                members={community.members}
                creatorId={community.creator.id}
              />
            </TabsContent>

            <TabsContent value="rules" className="mt-6">
              <CommunityRules rules={community.rules} />
            </TabsContent>
          </Tabs>

          {isModerator && (
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setIsInviteModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Invite User
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/communities/${community.id}/manage`)}
              >
                Manage Community
              </Button>
            </div>
          )}
        </div>

        <CreatePostModal
          isOpen={isCreatePostModalOpen}
          onClose={() => setIsCreatePostModalOpen(false)}
          communityId={community.id}
          onPostCreated={handlePostCreated}
        />

        <InviteUserModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          communityId={community.id}
        />
      </div>
    </div>
  );
}