// src/components/Modals.tsx
import { AddPoetryModal } from "@/components/AddPoetryModal";
import { AddMangaModal } from "@/components/AddMangaModal";
import { AddLightNovelModal } from "@/components/lightnovel/AddLightNovelModal";

interface ModalsProps {
  isPoemModalOpen: boolean;
  setIsPoemModalOpen: (isOpen: boolean) => void;
  isMangaModalOpen: boolean;
  setIsMangaModalOpen: (isOpen: boolean) => void;
  isLightNovelModalOpen: boolean;
  setIsLightNovelModalOpen: (isOpen: boolean) => void;
  onAddPoetry: (newPoem: any) => void;
  onAddManga: (newManga: any) => void;
  onAddLightNovel: (newNovel: any) => void;
}

export function Modals({
  isPoemModalOpen,
  setIsPoemModalOpen,
  isMangaModalOpen,
  setIsMangaModalOpen,
  isLightNovelModalOpen,
  setIsLightNovelModalOpen,
  onAddPoetry,
  onAddManga,
  onAddLightNovel
}: ModalsProps) {
  return (
    <>
      <AddPoetryModal
        isOpen={isPoemModalOpen}
        onClose={() => setIsPoemModalOpen(false)}
        onAddPoetry={onAddPoetry}
      />
      <AddMangaModal
        isOpen={isMangaModalOpen}
        onClose={() => setIsMangaModalOpen(false)}
        onAddManga={onAddManga}
      />
      <AddLightNovelModal
        isOpen={isLightNovelModalOpen}
        onClose={() => setIsLightNovelModalOpen(false)}
        onAddLightNovel={onAddLightNovel}
      />
    </>
  );
}