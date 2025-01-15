// src/pages/ProfileSetup/ProfileBanner.tsx
import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileBannerProps {
  banner: string | null;
  userData: {
    avatar: string | null;
    name: string;
  } | undefined;
  followStats: {
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
  };
  onFollowChange: (isFollowing: boolean) => void;
}

export function ProfileBanner({ banner, userData, followStats, onFollowChange }: ProfileBannerProps) {
  if (!userData) {
    return null; // or a loading state
  }

  return (
    <div className="relative h-64">
      {banner ? (
        <img 
          src={`http://localhost:3001${banner}`}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
      )}
      <div className="absolute -bottom-16 left-6">
        <ProfileAvatar
          avatar={userData.avatar}
          name={userData.name}
          size="lg"
        />
      </div>
    </div>
  );
}