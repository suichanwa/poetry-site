// src/components/Communities/CommunityHeader.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Settings, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CommunityHeaderProps {
  community: {
    name: string;
    description: string;
    avatar?: string;
    createdAt: string;
    _count: {
      members: number;
    };
  };
  isMember: boolean;
  isModerator: boolean;
  onJoin: () => void;
  onLeave: () => void;
  user: any | null;
}

export function CommunityHeader({
  community,
  isMember,
  isModerator,
  onJoin,
  onLeave,
  user
}: CommunityHeaderProps) {
  return (
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
            <div className="text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {community._count.members} members
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Created {formatDistanceToNow(new Date(community.createdAt), { addSuffix: true })}
              </span>
            </div>
            {user && (
              <>
                {!isMember && (
                  <Button onClick={onJoin}>Join Community</Button>
                )}
                {isMember && !isModerator && (
                  <Button variant="outline" onClick={onLeave}>
                    Leave Community
                  </Button>
                )}
                {isModerator && (
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Community
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}