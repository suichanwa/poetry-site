import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { Image, Loader2, X } from "lucide-react";
import { DialogTitle, DialogDescription } from "@/components/ui/modal";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityId: number;
  onPostCreated: (post: any) => void;
}

export function CreatePostModal({
  isOpen,
  onClose,
  communityId,
  onPostCreated
}: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const validFiles = newFiles.filter(file => 
        file.size <= 5 * 1024 * 1024 && file.type.startsWith('image/')
      );

      if (validFiles.length < newFiles.length) {
        setError("Some files were skipped (too large or invalid format)");
      }

      setImages(prev => [...prev, ...validFiles]);
      
      // Create previews
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('communityId', communityId.toString());
      images.forEach(image => formData.append('images', image));

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/communities/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create post');
      }

      const post = await response.json();
      onPostCreated(post);
      onClose();
      setTitle("");
      setContent("");
      setImages([]);
      setPreviews([]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 p-4">
        <DialogTitle className="text-2xl font-bold">Create Post</DialogTitle>
        <DialogDescription>
          Share something with your community
        </DialogDescription>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />

          <Textarea
            placeholder="Write your post..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={isLoading}
            rows={5}
          />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('image-upload')?.click()}
                disabled={isLoading || images.length >= 5}
              >
                <Image className="w-4 h-4 mr-2" />
                Add Images
              </Button>
              <span className="text-sm text-muted-foreground">
                Max 5 images, 5MB each
              </span>
            </div>

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
              disabled={isLoading}
            />

            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-4 h-4" />
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
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title || !content || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </div>
              ) : (
                'Create Post'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}