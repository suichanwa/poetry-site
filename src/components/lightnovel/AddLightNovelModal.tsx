// src/components/lightnovel/AddLightNovelModal.tsx
import { useState } from "react";
import { Modal, DialogTitle, DialogDescription } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { LightNovelBasicInfo } from "@/components/lightnovel/LightNovelBasicInfo";
import { LightNovelCoverUpload } from "@/components/lightnovel/LightNovelCoverUpload";
import { LightNovelChapterContent } from "@/components/lightnovel/LightNovelChapterContent";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface LightNovel {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  tags: { name: string }[];
  chapters: Array<{
    id: number;
    title: string;
    content: string;
    orderIndex: number;
  }>;
}

interface AddLightNovelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLightNovel: (lightNovel: LightNovel) => void;
}

export function AddLightNovelModal({ isOpen, onClose, onAddLightNovel }: AddLightNovelModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setCoverFile(null);
    setChapterTitle("");
    setChapterContent("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please log in again");
      navigate('/login');
      return;
    }

    if (!title.trim() || !description.trim() || !coverFile || !chapterTitle || !chapterContent) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('tags', JSON.stringify(tags));
      formData.append('coverFile', coverFile);
      formData.append('chapterTitle', chapterTitle.trim());
      formData.append('chapterContent', chapterContent.trim());

      const response = await fetch('http://localhost:3000/api/lightnovels', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create light novel');
      }

      const newLightNovel = await response.json();
      onAddLightNovel(newLightNovel);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating light novel:', error);
      setError(error instanceof Error ? error.message : 'Failed to create light novel');
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
            New Light Novel
          </DialogTitle>
          <DialogDescription>
            Create a new light novel to share with the community.
          </DialogDescription>
        </div>

        {error && (
          <div className="mt-4 bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <LightNovelBasicInfo
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            tags={tags}
            setTags={setTags}
            isSubmitting={isSubmitting}
          />

          <LightNovelCoverUpload
            coverFile={coverFile}
            setCoverFile={setCoverFile}
            isSubmitting={isSubmitting}
            onError={setError}
          />

          <LightNovelChapterContent
            chapterTitle={chapterTitle}
            setChapterTitle={setChapterTitle}
            chapterContent={chapterContent}
            setChapterContent={setChapterContent}
            isSubmitting={isSubmitting}
          />

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
              disabled={isSubmitting || !title.trim() || !description.trim() || !coverFile || !chapterTitle || !chapterContent}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Create Light Novel
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}