import { PoemCard } from "@/components/PoemCard";
import { Poem } from "../types";

interface ForYouTabProps {
  isLoading: boolean;
  filteredPoems: Poem[];
  popularPoems: Poem[];
  searchQuery: string;
  selectedTags: string[];
}

export function ForYouTab({
  isLoading,
  filteredPoems,
  popularPoems,
  searchQuery,
  selectedTags
}: ForYouTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredPoems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          {searchQuery || selectedTags.length > 0 
            ? 'No poems found matching your search criteria.' 
            : 'No poems yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredPoems
        .filter(poem => !popularPoems.some(p => p.id === poem.id))
        .map((poem) => (
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