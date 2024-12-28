import { Settings, LogOut, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FollowButton } from "@/components/FollowButton";

interface ProfileActionsProps {
  isOwnProfile: boolean;
  userId?: string;
  followStats: {
    followersCount: number;
    followingCount: number;
    isFollowing?: boolean;
  };
  onFollowChange: (isFollowing: boolean) => void;
  onLogout: () => void;
}

export function ProfileActions({ 
  isOwnProfile, 
  userId, 
  followStats, 
  onFollowChange,
  onLogout 
}: ProfileActionsProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center space-x-2">
        {!isOwnProfile && userId && (
          <FollowButton 
            userId={parseInt(userId)}
            initialIsFollowing={followStats.isFollowing}
            onFollowChange={onFollowChange}
          />
        )}
        {isOwnProfile && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/write')}
            className="flex items-center space-x-1"
          >
            <PenSquare className="w-4 h-4" />
            <span>Write</span>
          </Button>
        )}
      </div>

      {isOwnProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            className="justify-start"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Button>
          <Button 
            variant="outline"
            size="sm" 
            className="justify-start text-red-500 hover:text-red-600"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      )}
    </>
  );
}