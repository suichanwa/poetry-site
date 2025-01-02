import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FollowButton } from "@/components/FollowButton";

interface ProfileActionsProps {
  isOwnProfile: boolean;
  userId?: string;
  followStats: {
    isFollowing: boolean;
  };
  onFollowChange: (isFollowing: boolean) => void;
}

export function ProfileActions({ 
  isOwnProfile, 
  userId, 
  followStats, 
  onFollowChange
}: ProfileActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      {!isOwnProfile && userId && (
        <FollowButton 
          userId={parseInt(userId)}
          initialIsFollowing={followStats.isFollowing}
          onFollowChange={onFollowChange}
        />
      )}
      {isOwnProfile && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/settings')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}