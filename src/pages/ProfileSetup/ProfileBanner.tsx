// src/pages/ProfileSetup/ProfileBanner.tsx
import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileBannerProps {
  banner: string | null;
  userData: {
    avatar: string | null;
    name: string;
  };
}

export function ProfileBanner({ banner, userData }: ProfileBannerProps) {
  return (
    <div className="relative h-64">
      {banner ? (
        <img 
          src={`http://localhost:3000${banner}`}
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