// src/components/AddBookModal.tsx
import { useState } from "react";
import { Modal, DialogTitle, DialogDescription } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { Loader2, BookOpen, FileText, Image as ImageIcon, CheckCircle, AlertCircle, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: any) => void;
}

export function AddBookModal({ isOpen, onClose, onAddBook }: AddBookModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      setCoverImage(file);
      setError("");
    } else {
      setError('Cover image must be an image file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !coverImage) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('coverImage', coverImage);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/books', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create book');
      }

      const newBook = await response.json();
      onAddBook(newBook);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating book:', error);
      setError(error instanceof Error ? error.message : 'Failed to create book');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCoverImage(null);
    setError("");
  };

  const getProgress = () => {
    let progress = 0;
    if (title.trim()) progress += 33;
    if (description.trim()) progress += 33;
    if (coverImage) progress += 34;
    return progress;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Create New Book
          </DialogTitle>
          <DialogDescription className="mt-1.5">
            Share your book with the community
          </DialogDescription>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Completion Progress</span>
              <span>{getProgress()}%</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {error && (
            <div className="mt-4 bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Book Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
                placeholder="Enter book description"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cover Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                required
                disabled={isSubmitting}
              />
              {coverImage && (
                <div className="mt-4 relative aspect-[2/3] max-w-xs mx-auto">
                  <img
                    src={URL.createObjectURL(coverImage)}
                    alt="Cover preview"
                    className="rounded-lg object-cover w-full h-full"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setCoverImage(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Create Book
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}