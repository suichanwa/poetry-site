interface ProfileInfoProps {
  name?: string;
  email?: string;
  bio?: string;
  followStats: {
    followersCount: number;
    followingCount: number;
  };
}

export function ProfileInfo({ name, email, bio, followStats }: ProfileInfoProps) {
  return (
    <div className="flex-grow">
      <h1 className="text-2xl lg:text-3xl font-bold mb-1">{name}</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">{email}</p>
      {bio && (
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm lg:text-base">{bio}</p>
      )}
      <div className="flex items-center space-x-4 mt-2">
        <span className="text-sm lg:text-base">
          <span className="font-bold">{followStats.followersCount || 0}</span> followers
        </span>
        <span className="text-sm lg:text-base">
          <span className="font-bold">{followStats.followingCount || 0}</span> following
        </span>
      </div>
    </div>
  );
}