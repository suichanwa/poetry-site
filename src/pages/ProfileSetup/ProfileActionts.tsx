// src/pages/ProfileSetup/ProfileActions.tsx
import { UserActions } from '@/components/UserActions';

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
        <>
          <FollowButton 
            userId={parseInt(userId)}
            initialIsFollowing={followStats.isFollowing}
            onFollowChange={onFollowChange}
          />
          <UserActions 
            userId={parseInt(userId)}
            isOwnProfile={isOwnProfile}
          />
        </>
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