// src/components/AddChapterModal.tsx
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileIcon, X, Loader2, Plus } from "lucide-react";

interface AddChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  mangaId: number;
  onChapterAdded: (chapter: any) => void;
  currentChaptersCount: number;
}

export function AddChapterModal({
  isOpen,
  onClose,
  mangaId,
  onChapterAdded,
  currentChaptersCount
}: AddChapterModalProps) {
  const [title, setTitle] = useState("");
  const [pages, setPages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('All pages must be image files');
      return;
    }

    setPages(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || pages.length === 0) {
      setError("Please fill in all required fields and upload pages");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('orderIndex', (currentChaptersCount + 1).toString());
      
      pages.forEach((page) => {
        formData.append('pages', page);
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/manga/${mangaId}/chapters`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create chapter');
      }

      const newChapter = await response.json();
      onChapterAdded(newChapter);
      setTitle("");
      setPages([]);
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
            <label className="block text-sm font-medium mb-2">Chapter Pages</label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePagesUpload}
              required
              disabled={isSubmitting}
            />
            
            {pages.length > 0 && (
              <div className="mt-2 space-y-2">
                {pages.map((page, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <FileIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Page {index + 1}: {page.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPages(prev => prev.filter((_, i) => i !== index))}
                      className="ml-auto"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
              disabled={isSubmitting || !title.trim() || pages.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Chapter
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}