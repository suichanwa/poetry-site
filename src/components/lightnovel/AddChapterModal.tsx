import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { Editor } from "@/components/ui/editor";

interface AddChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  novelId: number;
  onChapterAdded: (chapter: {
    id: number;
    title: string;
    content: string;
    orderIndex: number;
  }) => void;
  currentChaptersCount: number;
}

export function AddChapterModal({
  isOpen,
  onClose,
  novelId,
  onChapterAdded,
  currentChaptersCount
}: AddChapterModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/lightnovels/${novelId}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          orderIndex: currentChaptersCount + 1
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create chapter');
      }

      const newChapter = await response.json();
      onChapterAdded(newChapter);
      setTitle("");
      setContent("");
      onClose();
    } catch (error) {
      console.error('Error creating chapter:', error);
      setError(error instanceof Error ? error.message : 'Failed to create chapter');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Chapter</h2>
        
        {error && (
          <div className="mb-4 bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Chapter Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter chapter title"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Chapter Content</label>
            <Editor
              value={content}
              onChange={setContent}
              placeholder="Write your chapter content here..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Chapter
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}