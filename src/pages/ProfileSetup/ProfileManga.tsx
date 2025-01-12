// src/pages/ProfileSetup/ProfileManga.tsx
import { MangaCard } from "@/components/MangaCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProfileMangaProps {
  manga: Manga[];
  isOwnProfile: boolean;
  userName: string;
  error: string;
}

export function ProfileManga({ manga, isOwnProfile, userName, error }: ProfileMangaProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        {isOwnProfile ? "My Manga" : `${userName}'s Manga`}
      </h2>
      {error ? (
        <div className="text-red-500 text-center text-sm">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {manga.length > 0 ? (
            manga.map((manga) => (
              <MangaCard
                key={manga.id}
                title={manga.title}
                description={manga.description}
                coverImage={manga.coverImage}
                author={userName || manga.author}
                id={manga.id}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
            </div>
          )}
        </div>
      )}
    </div>
  );
}