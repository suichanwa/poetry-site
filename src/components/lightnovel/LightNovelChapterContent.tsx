import { Input } from "@/components/ui/input";
import { Editor } from "@/components/ui/editor";

interface LightNovelChapterContentProps {
  chapterTitle: string;
  setChapterTitle: (value: string) => void;
  chapterContent: string;
  setChapterContent: (value: string) => void;
  isSubmitting: boolean;
}

export function LightNovelChapterContent({
  chapterTitle,
  setChapterTitle,
  chapterContent,
  setChapterContent,
  isSubmitting
}: LightNovelChapterContentProps) {
  return (
    <div className="border-t pt-4">
      <h3 className="text-lg font-semibold mb-4">First Chapter</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Chapter Title</label>
          <Input
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            placeholder="Chapter Title"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Chapter Content</label>
          <Editor
            value={chapterContent}
            onChange={setChapterContent}
            placeholder="Write your chapter content here..."
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}