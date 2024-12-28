import { User } from "lucide-react";

interface ProfileAvatarProps {
  avatar?: string | null;
  name?: string;
  size?: "sm" | "lg";
}

export function ProfileAvatar({ avatar, name, size = "lg" }: ProfileAvatarProps) {
  const sizeClasses = size === "lg" ? "w-20 h-20 lg:w-28 lg:h-28" : "w-8 h-8";
  const iconClasses = size === "lg" ? "w-8 h-8 lg:w-12 lg:h-12" : "w-4 h-4";

  return (
    <div className={`${sizeClasses} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden`}>
      {avatar ? (
        <img 
          src={`http://localhost:3000${avatar}`}
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