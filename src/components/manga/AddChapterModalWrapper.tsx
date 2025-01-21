import { AddChapterModal } from "@/components/AddChapterModal";

interface AddChapterModalWrapperProps {
  isAddChapterOpen: boolean;
  setIsAddChapterOpen: (isOpen: boolean) => void;
  mangaId: number;
  setManga: (manga: any) => void;
  currentChaptersCount: number;
}

export function AddChapterModalWrapper({
  isAddChapterOpen,
  setIsAddChapterOpen,
  mangaId,
  setManga,
  currentChaptersCount
}: AddChapterModalWrapperProps) {
  return (
    <AddChapterModal
      isOpen={isAddChapterOpen}
      onClose={() => setIsAddChapterOpen(false)}
      mangaId={mangaId}
      onChapterAdded={(newChapter) => setManga(prev => prev ? { ...prev, chapters: [...prev.chapters, newChapter] } : prev)}
      currentChaptersCount={currentChaptersCount}
    />
  );
}