import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PoemFormatting } from "./subcomponents/PoemFormatting";
import { PoemTags } from "./subcomponents/PoemTags";

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
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formatting, setFormatting] = useState({
    isBold: false,
    isItalic: false,
    alignment: 'left' as const,
    fontSize: 'medium' as const
  });

  const handleAddPoetry = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
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
      console.error('Error creating poem:', error);
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
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-2">Add a New Poem</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Content</label>
            <PoemFormatting formatting={formatting} setFormatting={setFormatting} />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={cn(
                "w-full min-h-[200px]",
                formatting.isBold && "font-bold",
                formatting.isItalic && "italic",
                `text-${formatting.alignment}`,
                {
                  'text-sm': formatting.fontSize === 'small',
                  'text-base': formatting.fontSize === 'medium',
                  'text-lg': formatting.fontSize === 'large'
                }
              )}
              required
            />
          </div>

          <PoemTags tags={tags} setTags={setTags} />
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddPoetry}
            disabled={!title.trim() || !content.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : 'Post'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}