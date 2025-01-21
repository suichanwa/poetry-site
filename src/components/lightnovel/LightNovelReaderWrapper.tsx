import { LightNovelReader } from "@/components/lightnovel/LightNovelReader";

interface LightNovelReaderWrapperProps {
  currentChapter: any;
  handleChapterChange: (chapterId: number) => void;
  setIsReaderOpen: (isOpen: boolean) => void;
  totalChapters: number;
}

export function LightNovelReaderWrapper({
  currentChapter,
  handleChapterChange,
  setIsReaderOpen,
  totalChapters
}: LightNovelReaderWrapperProps) {
  return (
    <LightNovelReader
      chapter={currentChapter}
      onChapterChange={handleChapterChange}
      onClose={() => setIsReaderOpen(false)}
      totalChapters={totalChapters}
    />
  );
}