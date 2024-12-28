import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { PoemFormatting } from "./subcomponents/PoemFormatting";
import { PoemTags } from "./subcomponents/PoemTags";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils"; // Add this import


interface AddPoetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPoetry: (poem: { 
    title: string; 
    content: string; 
    author: string;
    tags: string[];
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formatting, setFormatting] = useState({
    isBold: false,
    isItalic: false,
    alignment: 'left' as const,
    fontSize: 'medium' as const
  });

  const handleAddPoetry = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/poems', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title, 
          content,
          tags,
          formatting
        }),
      });

      if (!response.ok) throw new Error('Failed to create poem');

      const newPoem = await response.json();
      onAddPoetry({ ...newPoem, formatting, tags });
      resetForm();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create poem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setFormatting({
      isBold: false,
      isItalic: false,
      alignment: 'left',
      fontSize: 'medium'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add a New Poem</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleAddPoetry(); }} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              required
              placeholder="Enter your poem's title"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Content</label>
            <PoemFormatting formatting={formatting} setFormatting={setFormatting} />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={cn(
                "w-full min-h-[200px] transition-all duration-200",
                formatting.isBold && "font-bold",
                formatting.isItalic && "italic",
                `text-${formatting.alignment}`,
                {
                  'text-sm': formatting.fontSize === 'small',
                  'text-base': formatting.fontSize === 'medium',
                  'text-lg': formatting.fontSize === 'large'
                }
              )}
              placeholder="Write your poem here..."
              required
              disabled={isSubmitting}
            />
          </div>

          <PoemTags tags={tags} setTags={setTags} />

          <div className="flex justify-end gap-2 pt-4 border-t">
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
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </div>
              ) : (
                'Create Poem'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}