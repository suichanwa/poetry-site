import { PoemCard } from "@/components/PoemCard";

interface FollowingTabProps {
  user: any;
  followingPoems: Array<{
    id: number;
    title: string;
    content: string;
    author: {
      id: number;
      name: string;
      email: string;
      avatar?: string;
    };
    createdAt: string;
    tags: { name: string }[];
    viewCount: number;
    formatting?: {
      isBold?: boolean;
      isItalic?: boolean;
      alignment?: 'left' | 'center' | 'right';
      fontSize?: 'small' | 'medium' | 'large';
    };
  }>;
}

export function FollowingTab({ user, followingPoems }: FollowingTabProps) {
  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          Please log in to see posts from people you follow.
        </p>
      </div>
    );
  }

  if (followingPoems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No posts from people you follow yet.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Start following people to see their poems here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {followingPoems.map((poem) => (
        <PoemCard 
          key={poem.id} 
          {...poem} 
          tags={poem.tags}
          viewCount={poem.viewCount}
        />
      ))}
    </div>
  );
}