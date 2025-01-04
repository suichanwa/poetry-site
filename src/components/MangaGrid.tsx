// src/components/MangaGrid.tsx

import { MangaCard } from "./MangaCard";

interface MangaGridProps {
  mangas: Array<{
    id: number;
    title: string;
    description: string;
    coverImage: string;
    author: {
      id: number;
      name: string;
      avatar?: string;
    };
    createdAt: string;
    views: number;
    likes: number;
    chapters: {
      id: number;
      title: string;
      createdAt: string;
    }[];
    tags: { name: string }[];
  }>;
  onMangaClick: (mangaId: number) => void;
}

export function MangaGrid({ mangas, onMangaClick }: MangaGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {mangas.map((manga) => (
        <MangaCard
          key={manga.id}
          manga={manga}
          onMangaClick={onMangaClick}
        />
      ))}
    </div>
  );
}