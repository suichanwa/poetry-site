// src/components/AddMangaModal.tsx

import { useState } from "react";
import { Modal, DialogTitle, DialogDescription } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Type, Text, Tag as TagIcon, X, Loader2, FileIcon, Plus } from "lucide-react";
import { PoemTags } from "@/components/subcomponents/PoemTags";

interface AddMangaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddManga: (manga: any) => void;
}

export function AddMangaModal({ isOpen, onClose, onAddManga }: AddMangaModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterPages, setChapterPages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setCoverImage(null);
    setChapterTitle("");
    setChapterPages([]);
    setError("");
  };

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      setCoverImage(file);
    } else {
      setError('Cover image must be an image file');
    }
  };

  const handleChapterPagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('All chapter pages must be image files');
      return;
    }

    setChapterPages(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!title.trim() || !description.trim() || !coverImage || !chapterTitle || chapterPages.length === 0) {
    setError("Please fill in all required fields and upload necessary files");
    return;
  }
  
  setIsSubmitting(true);
  setError("");

  try {
    const formData = new FormData();
    
    // Add metadata
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('tags', JSON.stringify(tags));
    formData.append('chapterTitle', chapterTitle.trim());
    
    // Add files
    formData.append('coverImage', coverImage);
    
    chapterPages.forEach((page) => {
      formData.append('chapterPages', page);
    });

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
          {/* Manga Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Manga Title</label>
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-muted-foreground" />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter manga title"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Manga Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <div className="flex items-center gap-2">
              <Text className="w-4 h-4 text-muted-foreground" />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] resize-none"
                placeholder="Enter manga description"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-muted-foreground" />
              <PoemTags tags={tags} setTags={setTags} />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Cover Image</label>
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <Input
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                required
                disabled={isSubmitting}
              />
            </div>
            {coverImage && (
              <div className="flex items-center gap-2 p-2 mt-2 bg-muted rounded-md">
                <FileIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{coverImage.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCoverImage(null)}
                  className="ml-auto"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          {/* First Chapter */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">First Chapter</h3>
            
            {/* Chapter Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Chapter Title</label>
              <Input
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="Enter chapter title"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Chapter Pages Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Chapter Pages</label>
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleChapterPagesUpload}
                  required
                  disabled={isSubmitting}
                />
              </div>
              {chapterPages.length > 0 && (
                <div className="mt-2 space-y-2">
                  {chapterPages.map((page, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <FileIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        Page {index + 1}: {page.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setChapterPages(prev => prev.filter((_, i) => i !== index))}
                        className="ml-auto"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
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
              disabled={isSubmitting || !title.trim() || !description.trim() || !coverImage || !chapterTitle || chapterPages.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
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