import { PoemCard } from "@/components/PoemCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProfilePoemsProps {
  poems: Array<{
    id: number;
    title: string;
    content: string;
    author: string | { name: string; email: string };
  }>;
  isOwnProfile: boolean;
  userName: string;
  error?: string;
}

export function ProfilePoems({ poems, isOwnProfile, userName, error }: ProfilePoemsProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        {isOwnProfile ? "My Poems" : `${userName}'s Poems`}
      </h2>
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
                author={userName || poem.author}
                id={poem.id}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="text-base mb-3">No poems yet.</p>
              {isOwnProfile && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/write')}
                >
                  Write Your First Poem
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}