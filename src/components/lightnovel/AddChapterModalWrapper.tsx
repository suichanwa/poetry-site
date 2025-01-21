import { AddChapterModal } from "@/components/lightnovel/AddChapterModal";

interface AddChapterModalWrapperProps {
  isAddChapterOpen: boolean;
  setIsAddChapterOpen: (isOpen: boolean) => void;
  novelId: number;
  setNovel: (novel: any) => void;
  currentChaptersCount: number;
}

export function AddChapterModalWrapper({
  isAddChapterOpen,
  setIsAddChapterOpen,
  novelId,
  setNovel,
  currentChaptersCount
}: AddChapterModalWrapperProps) {
  return (
    <AddChapterModal
      isOpen={isAddChapterOpen}
      onClose={() => setIsAddChapterOpen(false)}
      novelId={novelId}
      onChapterAdded={(newChapter) => setNovel(prev => prev ? { ...prev, chapters: [...prev.chapters, newChapter] } : prev)}
      currentChaptersCount={currentChaptersCount}
    />
  );
}