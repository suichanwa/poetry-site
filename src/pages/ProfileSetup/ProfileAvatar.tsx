import { User } from "lucide-react";
import { AnimatedAvatar } from '@/components/AnimatedAvatar';
import { useAuth } from "@/context/AuthContext";
import classNames from 'classnames';

interface ProfileAvatarProps {
  avatar?: string | null;
  name?: string;
  size?: "sm" | "lg";
  className?: string;
}

export function ProfileAvatar({ avatar, name, size = "lg", className }: ProfileAvatarProps) {
  const { user } = useAuth();
  const sizeClasses = size === "lg" ? "w-28 h-28" : "w-8 h-8";
  const iconClasses = size === "lg" ? "w-12 h-12" : "w-4 h-4";

  if (user?.isAnimatedAvatar && avatar) {
    return (
      <AnimatedAvatar
        avatar={avatar}
        animation={user.avatarAnimation || 'pulse'}
        cardStyle={user.avatarStyle || 'minimal'}
        size={size === "lg" ? "lg" : "sm"}
        className={className}
      />
    );
  }

  return (
    <div className={classNames(`${sizeClasses} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden`, className)}>
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