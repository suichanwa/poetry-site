import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { User } from "lucide-react";

interface AddPoetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPoetry: (title: string, content: string, author: string) => void;
}

export function AddPoetryModal({ isOpen, onClose, onAddPoetry }: AddPoetryModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPoetry = async () => {
    if (!title || !content || !author) return;
    
    setIsSubmitting(true);
    try {
      await onAddPoetry(title, content, author);
      setTitle("");
      setContent("");
      setAuthor("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="space-y-6 px-2"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          <div className="flex-grow space-y-4">
            <Textarea
              placeholder="What's your poem's title?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-none resize-none focus:ring-0 text-xl font-semibold placeholder:text-gray-400 p-0"
            />
            
            <Textarea
              placeholder="Write your poetry here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] border-none resize-none focus:ring-0 p-0"
            />
            
            <Textarea
              placeholder="Your pen name..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border-none resize-none focus:ring-0 p-0"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t mt-4">
          <Button
            onClick={handleAddPoetry}
            disabled={!title || !content || !author || isSubmitting}
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
      </motion.div>
    </Modal>
  );
}