import { Button } from "@/components/ui/button";
import { Plus, Bookmark } from "lucide-react";

interface LightNovelChaptersProps {
  novel: any;
  user: any;
  handleReadChapter: (chapter: any) => void;
  handleBookmarkChapter: (chapterId: number) => void;
  bookmarkedChapters: number[];
  setIsAddChapterOpen: (isOpen: boolean) => void;
}

export function LightNovelChapters({
  novel,
  user,
  handleReadChapter,
  handleBookmarkChapter,
  bookmarkedChapters,
  setIsAddChapterOpen
}: LightNovelChaptersProps) {
  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^.*[\/\\]uploads[\/\\]/, 'uploads/').replace(/\\/g, '/');
    return `http://localhost:3001/${cleanPath}`;
  };

  return (
    <div className="border-t pt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Chapters</h2>
        {user?.id === novel.author.id && (
          <Button onClick={() => setIsAddChapterOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Chapter
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {novel.chapters.map((chapter: any) => (
          <div key={chapter.id} className="flex items-center justify-between">
            <Button
              variant="outline"
              className="justify-start flex-1"
              onClick={() => handleReadChapter(chapter)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={getImageUrl(chapter.coverImage || '/placeholder.png')}
                  alt={chapter.title}
                  className="w-10 h-10 object-cover rounded"
                  onError={(e) => {
                    console.error('Error loading image:', e.nativeEvent);
                    e.currentTarget.src = '/placeholder.png';
                  }}
                />
                <span className="truncate">
                  Chapter {chapter.orderIndex}: {chapter.title}
                </span>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleBookmarkChapter(chapter.id)}
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedChapters.includes(chapter.id) ? 'text-primary' : ''}`} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}