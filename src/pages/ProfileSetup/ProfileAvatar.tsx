import { User } from "lucide-react";
import { AnimatedAvatar } from '@/components/AnimatedAvatar';
import { useAuth } from "@/context/AuthContext";

interface ProfileAvatarProps {
  avatar?: string | null;
  name?: string;
  size?: "sm" | "lg";
}

export function ProfileAvatar({ avatar, name, size = "lg" }: ProfileAvatarProps) {
  const { user } = useAuth();
  const sizeClasses = size === "lg" ? "w-20 h-20 lg:w-28 lg:h-28" : "w-8 h-8";
  const iconClasses = size === "lg" ? "w-8 h-8 lg:w-12 lg:h-12" : "w-4 h-4";

  if (user?.isAnimatedAvatar && avatar) {
    return (
      <AnimatedAvatar
        avatar={avatar}
        animation={user.avatarAnimation || 'pulse'}
        cardStyle={user.avatarStyle || 'minimal'}
        size={size === "lg" ? "lg" : "sm"}
      />
    );
  }

  return (
    <div className={`${sizeClasses} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden`}>
      {avatar ? (
        <img 
          src={`http://localhost:3001${avatar}`}
          alt={name || 'Profile'} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '';
            console.error('Error loading avatar image');
          }}
        />
      ) : (
        <User className={`${iconClasses} text-gray-500 dark:text-gray-400`} />
      )}
    </div>
  );
}