// src/components/lightnovel/AddLightNovelModal.tsx
import { useState } from "react";
import { Modal, DialogTitle, DialogDescription } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Loader2, 
  BookOpen, 
  Image as ImageIcon, 
  FileEdit,
  CheckCircle,
  AlertCircle 
} from "lucide-react";
import { LightNovelBasicInfo } from "./LightNovelBasicInfo";
import { LightNovelCoverUpload } from "./LightNovelCoverUpload";
import { LightNovelChapterContent } from "./LightNovelChapterContent";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface AddLightNovelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLightNovel: (lightNovel: LightNovel) => void;
}

export function AddLightNovelModal({ isOpen, onClose, onAddLightNovel }: AddLightNovelModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic-info");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getProgress = () => {
    let progress = 0;
    if (title.trim()) progress += 25;
    if (description.trim()) progress += 25;
    if (coverFile) progress += 25;
    if (chapterTitle.trim() && chapterContent.trim()) progress += 25;
    return progress;
  };

  const canProceed = {
    "basic-info": title.trim() && description.trim(),
    "cover": coverFile !== null,
    "chapter": chapterTitle.trim() && chapterContent.trim()
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setCoverFile(null);
    setChapterTitle("");
    setChapterContent("");
    setError("");
    setActiveTab("basic-info");
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

    if (!title.trim() || !description.trim() || !coverFile || !chapterTitle.trim() || !chapterContent.trim()) {
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

      const response = await fetch('http://localhost:3001/api/lightnovels', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

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
      <div className="relative max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Create New Light Novel
          </DialogTitle>
          <DialogDescription className="mt-1.5">
            Share your story with the community
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basic-info" disabled={isSubmitting}>
                <FileText className="w-4 h-4 mr-2" />
                Basic Info
                {canProceed["basic-info"] && <CheckCircle className="w-4 h-4 ml-2 text-green-500" />}
              </TabsTrigger>
              <TabsTrigger value="cover" disabled={isSubmitting}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Cover Image
                {canProceed["cover"] && <CheckCircle className="w-4 h-4 ml-2 text-green-500" />}
              </TabsTrigger>
              <TabsTrigger value="chapter" disabled={isSubmitting}>
                <FileEdit className="w-4 h-4 mr-2" />
                First Chapter
                {canProceed["chapter"] && <CheckCircle className="w-4 h-4 ml-2 text-green-500" />}
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-6">
              <TabsContent value="basic-info">
                <LightNovelBasicInfo
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  tags={tags}
                  setTags={setTags}
                  isSubmitting={isSubmitting}
                />
                <div className="flex justify-end mt-6">
                  <Button 
                    type="button"
                    onClick={() => setActiveTab("cover")}
                    disabled={!canProceed["basic-info"]}
                  >
                    Next Step
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="cover">
                <LightNovelCoverUpload
                  coverFile={coverFile}
                  setCoverFile={setCoverFile}
                  isSubmitting={isSubmitting}
                  onError={setError}
                />
                <div className="flex justify-between mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setActiveTab("basic-info")}
                  >
                    Previous Step
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setActiveTab("chapter")}
                    disabled={!canProceed["cover"]}
                  >
                    Next Step
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="chapter">
                <LightNovelChapterContent
                  chapterTitle={chapterTitle}
                  setChapterTitle={setChapterTitle}
                  chapterContent={chapterContent}
                  setChapterContent={setChapterContent}
                  isSubmitting={isSubmitting}
                />
                <div className="flex justify-between mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setActiveTab("cover")}
                  >
                    Previous Step
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting || !canProceed["chapter"]}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Publish Novel
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Tabs>
        </div>
      </div>
    </Modal>
  );
}