import { MangaReader } from "@/components/MangaReader";

interface MangaReaderWrapperProps {
  currentChapter: any;
  handleChapterChange: (chapterId: number) => void;
  setIsReaderOpen: (isOpen: boolean) => void;
  totalChapters: number;
}

export function MangaReaderWrapper({
  currentChapter,
  handleChapterChange,
  setIsReaderOpen,
  totalChapters
}: MangaReaderWrapperProps) {
  return (
    <MangaReader
      pages={currentChapter.pages}
      currentChapter={currentChapter}
      onChapterChange={handleChapterChange}
      onClose={() => setIsReaderOpen(false)}
      totalChapters={totalChapters}
    />
  );
}