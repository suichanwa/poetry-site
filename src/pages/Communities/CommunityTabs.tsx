// src/components/Communities/CommunityTabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BookOpen, Users, Shield } from "lucide-react";
import { PoemCard } from "@/components/PoemCard";

interface CommunityTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  community: {
    _count: {
      posts: number;
      members: number;
    };
    posts: any[];
    members: {
      id: number;
      name: string;
      avatar?: string;
    }[];
    creator: {
      id: number;
    };
    rules: {
      id: number;
      title: string;
      description: string;
    }[];
  };
}

export function CommunityTabs({ activeTab, setActiveTab, community }: CommunityTabsProps) {
  return (
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
        <MembersList members={community.members} creatorId={community.creator.id} />
      </TabsContent>

      <TabsContent value="rules" className="mt-6">
        <CommunityRules rules={community.rules} />
      </TabsContent>
    </Tabs>
  );
}