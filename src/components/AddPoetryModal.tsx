// src/components/AddPoetryModal.tsx
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';
import { cn } from "@/lib/utils";

interface AddPoetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPoetry: (poem: { 
    title: string; 
    content: string; 
    author: string;
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
  const [author, setAuthor] = useState(user?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formatting, setFormatting] = useState({
    isBold: false,
    isItalic: false,
    alignment: 'left' as const,
    fontSize: 'medium' as const
  });

  const handleAddPoetry = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:3000/api/poems', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title, 
          content,
          formatting
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create poem');
      }

      const newPoem = await response.json();
      onAddPoetry({ ...newPoem, formatting });
      setTitle("");
      setContent("");
      setFormatting({
        isBold: false,
        isItalic: false,
        alignment: 'left',
        fontSize: 'medium'
      });
      onClose();
    } catch (error) {
      console.error('Error creating poem:', error);
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="flex flex-wrap gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormatting(prev => ({ ...prev, isBold: !prev.isBold }))}
                className={cn(formatting.isBold && "bg-accent")}
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormatting(prev => ({ ...prev, isItalic: !prev.isItalic }))}
                className={cn(formatting.isItalic && "bg-accent")}
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormatting(prev => ({ ...prev, alignment: 'left' }))}
                className={cn(formatting.alignment === 'left' && "bg-accent")}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormatting(prev => ({ ...prev, alignment: 'center' }))}
                className={cn(formatting.alignment === 'center' && "bg-accent")}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormatting(prev => ({ ...prev, alignment: 'right' }))}
                className={cn(formatting.alignment === 'right' && "bg-accent")}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
              <select
                className="px-2 py-1 border rounded text-sm"
                value={formatting.fontSize}
                onChange={(e) => setFormatting(prev => ({ 
                  ...prev, 
                  fontSize: e.target.value as 'small' | 'medium' | 'large'
                }))}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={cn(
                "w-full min-h-[200px]",
                formatting.isBold && "font-bold",
                formatting.isItalic && "italic",
                formatting.alignment === 'center' && "text-center",
                formatting.alignment === 'right' && "text-right",
                {
                  'text-sm': formatting.fontSize === 'small',
                  'text-base': formatting.fontSize === 'medium',
                  'text-lg': formatting.fontSize === 'large'
                }
              )}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full"
              required
              disabled
            />
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-2 pt-4 border-t mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddPoetry}
            disabled={!title || !content || isSubmitting}
            className="px-6"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              'Post'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}