// src/components/AddMangaModal.tsx
import { useState } from "react";
import { Modal, DialogTitle, DialogDescription } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Type, 
  Text, 
  Tag as TagIcon, 
  X, 
  Loader2, 
  FileIcon, 
  Plus,
  CheckCircle,
  AlertCircle,
  ImageIcon
} from "lucide-react";
import { PoemTags } from "@/components/subcomponents/PoemTags";

interface AddMangaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddManga: (manga: any) => void;
}

export function AddMangaModal({ isOpen, onClose, onAddManga }: AddMangaModalProps) {
  const [activeTab, setActiveTab] = useState("basic-info");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterPages, setChapterPages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getProgress = () => {
    let progress = 0;
    if (title.trim()) progress += 25;
    if (description.trim()) progress += 25;
    if (coverImage) progress += 25;
    if (chapterTitle.trim() && chapterPages.length > 0) progress += 25;
    return progress;
  };

  const canProceed = {
    "basic-info": title.trim() && description.trim(),
    "cover": coverImage !== null,
    "chapter": chapterTitle.trim() && chapterPages.length > 0
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setCoverImage(null);
    setChapterTitle("");
    setChapterPages([]);
    setError("");
    setActiveTab("basic-info");
  };

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

  const handleChapterPagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('All chapter pages must be image files');
      return;
    }

    setChapterPages(files);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !coverImage || !chapterTitle || chapterPages.length === 0) {
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
      formData.append('coverImage', coverImage);
      formData.append('chapterTitle', chapterTitle.trim());
      chapterPages.forEach(page => formData.append('chapterPages', page));

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/manga', {
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
      <div className="relative max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Create New Manga
          </DialogTitle>
          <DialogDescription className="mt-1.5">
            Share your manga with the community
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
                <Plus className="w-4 h-4 mr-2" />
                First Chapter
                {canProceed["chapter"] && <CheckCircle className="w-4 h-4 ml-2 text-green-500" />}
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-6">
              <TabsContent value="basic-info">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Manga Title</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter manga title"
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
                      placeholder="Enter manga description"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <PoemTags tags={tags} setTags={setTags} />
                </div>
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
                <div className="space-y-4">
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
                </div>
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
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Chapter Title</label>
                    <Input
                      value={chapterTitle}
                      onChange={(e) => setChapterTitle(e.target.value)}
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
                      onChange={handleChapterPagesUpload}
                      required
                      disabled={isSubmitting}
                    />
                    {chapterPages.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        {chapterPages.map((page, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(page)}
                              alt={`Page ${index + 1}`}
                              className="rounded-lg object-cover w-full aspect-[2/3]"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => setChapterPages(prev => prev.filter((_, i) => i !== index))}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
                        <FileText className="w-4 h-4 mr-2" />
                        Publish Manga
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