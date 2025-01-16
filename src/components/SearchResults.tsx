// src/components/SearchResults.tsx
import { PoemCard } from "@/components/PoemCard";
import { MangaCard } from "@/components/MangaCard";
import { LightNovelCard } from "@/components/LightNovelCard";

interface SearchResultsProps {
  poems: any[];
  manga: any[];
  lightNovels: any[];
}

export function SearchResults({ poems, manga, lightNovels }: SearchResultsProps) {
  return (
    <div>
      {poems.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold">Poems</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {poems.map(poem => (
              <PoemCard key={poem.id} {...poem} />
            ))}
          </div>
        </div>
      )}

      {manga.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold">Manga</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {manga.map(manga => (
              <MangaCard key={manga.id} {...manga} />
            ))}
          </div>
        </div>
      )}

      {lightNovels.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold">Light Novels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lightNovels.map(novel => (
              <LightNovelCard key={novel.id} {...novel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}