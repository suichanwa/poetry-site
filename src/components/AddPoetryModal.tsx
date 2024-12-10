import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

interface AddPoetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPoetry: (poem: { title: string; content: string; author: string }) => void;
}

export function AddPoetryModal({ isOpen, onClose, onAddPoetry }: AddPoetryModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState(user?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create poem');
    }

    const newPoem = await response.json();
    onAddPoetry(newPoem);
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
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full"
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
        <div className="flex items-center justify-end pt-4 border-t mt-4">
          <Button
            onClick={handleAddPoetry}
            disabled={!title || !content || isSubmitting}
            className="px-6 rounded-full"
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