// src/pages/ProfileSetup/ProfileContent.tsx
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileActions } from "./ProfileActions";
import { ProfilePoems } from "./ProfilePoems";

interface ProfileContentProps {
  userData: any;
  followStats: any;
  isOwnProfile: boolean;
  userId?: string;
  userPoems: any[];
  onFollowChange: (isFollowing: boolean) => void;
  onLogout: () => void;
  error: string;
}

export function ProfileContent({
  userData,
  followStats,
  isOwnProfile,
  userId,
  userPoems,
  onFollowChange,
  onLogout,
  error
}: ProfileContentProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="pt-20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <ProfileInfo
            name={userData.name}
            email={userData.email}
            bio={userData.bio}
            followStats={followStats}
          />
          <ProfileActions
            isOwnProfile={isOwnProfile}
            userId={userId}
            followStats={followStats}
            onFollowChange={onFollowChange}
            onLogout={onLogout}
          />
        </div>

        <div className="flex gap-6 mt-6 pb-6 border-b">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-bold">{userPoems.length}</span>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <div className="border rounded-lg p-4 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
            <ProfilePoems
              poems={userPoems}
              isOwnProfile={isOwnProfile}
              userName={userData.name}
              error={error}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}