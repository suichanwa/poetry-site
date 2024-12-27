import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PoemCard } from "@/components/PoemCard";
import { Users, Settings, BookOpen, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";

interface Community {
  id: number;
  name: string;
  description: string;
  avatar?: string;
  banner?: string;
  createdAt: string;
  isPrivate: boolean;
  rules: {
    id: number;
    title: string;
    description: string;
  }[];
  creator: {
    id: number;
    name: string;
    avatar?: string;
  };
  members: {
    id: number;
    name: string;
    avatar?: string;
  }[];
  posts: {
    id: number;
    title: string;
    content: string;
    author: {
      id: number;
      name: string;
      avatar?: string;
    };
    createdAt: string;
    _count: {
      comments: number;
      likes: number;
    };
  }[];
  _count: {
    members: number;
    posts: number;
  };
}

export default function CommunityDetail() {
  const { id } = useParams();
  const [community, setCommunity] = useState<Community | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/communities/${id}`);
        if (!response.ok) throw new Error('Failed to fetch community');
        const data = await response.json();
        setCommunity(data);
      } catch (error) {
        console.error('Error fetching community:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunity();
  }, [id]);

  if (isLoading) return <LoadingState />;
  if (!community) return <div>Community not found</div>;

  const isMember = community.members.some(member => member.id === user?.id);
  const isModerator = user?.id === community.creator.id;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Community Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
              {community.avatar ? (
                <img 
                  src={`http://localhost:3000${community.avatar}`}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="w-12 h-12 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
              <p className="text-muted-foreground mb-4">{community.description}</p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {community._count.members} members • {community._count.posts} posts
                </span>
                {!isMember && user && (
                  <Button onClick={() => {}}>Join Community</Button>
                )}
                {isMember && !isModerator && user && (
                  <Button variant="outline" onClick={() => {}}>Leave Community</Button>
                )}
                {isModerator && (
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Community
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Community Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="posts">
              <BookOpen className="w-4 h-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="members">
              <Users className="w-4 h-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="rules">
              <Shield className="w-4 h-4 mr-2" />
              Rules
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="space-y-4">
              {community.posts.map(post => (
                <PoemCard key={post.id} {...post} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {community.members.map(member => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {member.avatar ? (
                        <img 
                          src={`http://localhost:3000${member.avatar}`}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      {member.id === community.creator.id && (
                        <span className="text-xs text-primary">Creator</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rules" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Community Rules</h2>
              {community.rules.length > 0 ? (
                <div className="space-y-4">
                  {community.rules.map((rule, index) => (
                    <div key={rule.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <h3 className="font-medium">
                        {index + 1}. {rule.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rule.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No rules have been set for this community.</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}