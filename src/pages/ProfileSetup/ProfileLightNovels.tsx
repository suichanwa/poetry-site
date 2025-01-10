// src/pages/ProfileSetup/ProfileLightNovels.tsx
import { LightNovelCard } from "@/components/LightNovelCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProfileLightNovelsProps {
  lightNovels: LightNovel[];
  isOwnProfile: boolean;
  userName: string;
  error: string;
}

export function ProfileLightNovels({ lightNovels, isOwnProfile, userName, error }: ProfileLightNovelsProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        {isOwnProfile ? "My Light Novels" : `${userName}'s Light Novels`}
      </h2>
      {error ? (
        <div className="text-red-500 text-center text-sm">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {lightNovels.length > 0 ? (
            lightNovels.map((novel) => (
              <LightNovelCard
                key={novel.id}
                novel={novel}
                onNovelClick={(novelId) => navigate(`/lightnovel/${novelId}`)}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
              {isOwnProfile && (
                <Button onClick={() => navigate('/add-light-novel')}>
                  Add Light Novel
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}