import { PoemCard } from "@/components/PoemCard";
import { Poem } from "../types";

interface PopularPoemsProps {
  poems: Poem[];
  isLoading: boolean;
}

export function PopularPoems({ poems, isLoading }: PopularPoemsProps) {
  if (isLoading || poems.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Popular Poems</h2>
      <div className="space-y-4">
        {poems.map((poem) => (
          <PoemCard 
            key={`popular-${poem.id}`}
            {...poem} 
            tags={poem.tags}
            viewCount={poem.viewCount}
            label="Popular"
          />
        ))}
      </div>
    </div>
  );
}