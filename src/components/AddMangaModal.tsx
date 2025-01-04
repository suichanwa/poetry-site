import { useState } from "react";
import { Modal, DialogTitle, DialogDescription } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Type, Text, Tag as TagIcon, X, Loader2, FileIcon } from "lucide-react";
import { PoemTags } from "@/components/subcomponents/PoemTags";

interface AddMangaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddManga: (manga: {
    title: string;
    description: string;
    tags: string[];
    chapterFile: File;
  }) => void;
}

export function AddMangaModal({ isOpen, onClose, onAddManga }: AddMangaModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chapterFile, setChapterFile] = useState<File | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setChapterFile(null);
    setError("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      setChapterFile(file);
    } else {
      setError('Only image files are allowed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !chapterFile) {
      setError("Please fill in all required fields and upload a chapter file");
      return;
    }
    
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', JSON.stringify(tags));
      formData.append('chapterFile', chapterFile);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/manga', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create manga');
      }

      const newManga = await response.json();
      onAddManga(newManga);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating manga:', error);
      setError(error instanceof Error ? error.message : 'Failed to create manga');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative max-h-[90vh] overflow-y-auto p-6">
        <div className="sticky top-0 z-10 bg-background pb-4 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            New Manga
          </DialogTitle>
          <DialogDescription>
            Create a new manga to share with the community.
          </DialogDescription>
        </div>

        {error && (
          <div className="mt-4 bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div>
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-muted-foreground" />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Manga Title"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Text className="w-4 h-4 text-muted-foreground" />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[200px] resize-none"
                placeholder="Manga Description"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-muted-foreground" />
            <PoemTags tags={tags} setTags={setTags} />
          </div>

          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-muted-foreground" />
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              required
              disabled={isSubmitting}
            />
          </div>

          {chapterFile && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <FileIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{chapterFile.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setChapterFile(null)}
                className="ml-auto"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          <div className="sticky bottom-0 pt-4 pb-6 bg-background border-t flex justify-end gap-2">
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
              disabled={isSubmitting || !title.trim() || !description.trim() || !chapterFile}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Create Manga
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}