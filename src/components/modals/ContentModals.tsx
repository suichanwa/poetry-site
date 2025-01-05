import { AddPoetryModal } from "@/components/AddPoetryModal";
import { AddMangaModal } from "@/components/AddMangaModal";
import { AddLightNovelModal } from "@/components/lightnovel/AddLightNovelModal";
import type { Poem, Manga, LightNovel } from "@/types/content";

interface ContentModalsProps {
  isPoemModalOpen: boolean;
  isMangaModalOpen: boolean;
  isLightNovelModalOpen: boolean;
  onClosePoemModal: () => void;
  onCloseMangaModal: () => void;
  onCloseLightNovelModal: () => void;
  onAddPoem: (poem: Poem) => void;
  onAddManga: (manga: Manga) => void;
  onAddLightNovel: (novel: LightNovel) => void;
}

export function ContentModals({
  isPoemModalOpen,
  isMangaModalOpen,
  isLightNovelModalOpen,
  onClosePoemModal,
  onCloseMangaModal,
  onCloseLightNovelModal,
  onAddPoem,
  onAddManga,
  onAddLightNovel
}: ContentModalsProps) {
  return (
    <>
      <AddPoetryModal
        isOpen={isPoemModalOpen}
        onClose={onClosePoemModal}
        onAddPoetry={onAddPoem}
      />

      <AddMangaModal
        isOpen={isMangaModalOpen}
        onClose={onCloseMangaModal}
        onAddManga={onAddManga}
      />

      <AddLightNovelModal
        isOpen={isLightNovelModalOpen}
        onClose={onCloseLightNovelModal}
        onAddLightNovel={onAddLightNovel}
      />
    </>
  );
}