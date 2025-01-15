import { useState } from "react";
import { 
  Modal,
  DialogTitle,
  DialogDescription
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PoemTags } from "@/components/subcomponents/PoemTags";
import { PoemFormatting } from "@/components/subcomponents/PoemFormatting";
import { Upload, FileText, Type, Text, Tag as TagIcon, X, Loader2, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PoemFile {
  file: File;
  type: 'pdf' | 'doc';
}

interface AddPoetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPoetry: (poem: { 
    title: string; 
    content: string; 
    author: string;
    tags: string[];
    poemFile?: PoemFile;
    formatting?: {
      isBold?: boolean;
      isItalic?: boolean;
      alignment?: 'left' | 'center' | 'right';
      fontSize?: 'small' | 'medium' | 'large';
    }
  }) => void;
}

export function AddPoetryModal({ isOpen, onClose, onAddPoetry }: AddPoetryModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [poemFile, setPoemFile] = useState<PoemFile | null>(null);
  const [formatting, setFormatting] = useState({
    isBold: false,
    isItalic: false,
    alignment: 'left' as const,
    fontSize: 'medium' as const
  });

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setPoemFile(null);
    setFormatting({
      isBold: false,
      isItalic: false,
      alignment: 'left',
      fontSize: 'medium'
    });
    setError("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf' || 
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setPoemFile({
        file,
        type: file.type.includes('pdf') ? 'pdf' : 'doc'
      });
    } else {
      setError('Only PDF and DOC files are allowed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        title,
        content,
        tags,
        formatting
      }));
      
      if (poemFile) {
        formData.append('poemFile', poemFile.file);
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/poems', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create poem');
      }

      const newPoem = await response.json();
      onAddPoetry({ ...newPoem, formatting, tags, poemFile });
      resetForm();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create poem');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            New Poem
          </DialogTitle>
          <DialogDescription>
            Create a new poem to share with the community.
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
                placeholder="Title"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <PoemFormatting formatting={formatting} setFormatting={setFormatting} />
            <div className="flex items-center gap-2">
              <Text className="w-4 h-4 text-muted-foreground" />
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={cn(
                  "min-h-[200px] resize-none",
                  formatting.isBold && "font-bold",
                  formatting.isItalic && "italic",
                  `text-${formatting.alignment}`,
                  {
                    'text-sm': formatting.fontSize === 'small',
                    'text-base': formatting.fontSize === 'medium',
                    'text-lg': formatting.fontSize === 'large'
                  }
                )}
                placeholder="Write your poem..."
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
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={isSubmitting}
            />
          </div>

          {poemFile && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <FileIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{poemFile.file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPoemFile(null)}
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
              disabled={!title.trim() || !content.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Create Poem
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}