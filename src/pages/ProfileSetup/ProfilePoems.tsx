// src/pages/ProfileSetup/ProfilePoems.tsx
import { PoemCard } from "@/components/PoemCard";
import { Button } from "@/components/ui/button";  // Add this import
import { useNavigate } from "react-router-dom";

interface ProfilePoemsProps {
  poems: Array<{
    id: number;
    title: string;
    content: string;
    author: {
      id: number;
      name: string;
      avatar?: string;
    };
    createdAt: string;
    viewCount?: number;
    tags?: Array<{ name: string }>;
  }>;
  isOwnProfile: boolean;
  userName: string;
  error: string;
}

export function ProfilePoems({ poems, isOwnProfile, userName, error }: ProfilePoemsProps) {
  const navigate = useNavigate();

  return (
    <div>
      {error ? (
        <div className="text-red-500 text-center text-sm">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {poems.length > 0 ? (
            poems.map((poem) => (
              <PoemCard
                key={poem.id}
                title={poem.title}
                content={poem.content}
                author={userName || poem.author.name}
                id={poem.id}
                viewCount={poem.viewCount}
                tags={poem.tags || []}
                isPreview={true}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No poems yet</p>
              {isOwnProfile && (
                <Button 
                  onClick={() => navigate('/write')}
                  className="mt-4"
                >
                  Write your first poem
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}