import { LightNovelCard } from "./LightNovelCard";

interface LightNovelGridProps {
  novels: Array<{
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
    status: string;
    chapters: {
      id: number;
      title: string;
      createdAt: string;
    }[];
    tags: { name: string }[];
  }>;
  onNovelClick: (novelId: number) => void;
}

export function LightNovelGrid({ novels, onNovelClick }: LightNovelGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {novels.map((novel) => (
        <LightNovelCard
          key={novel.id}
          novel={novel}
          onNovelClick={onNovelClick}
        />
      ))}
    </div>
  );
}