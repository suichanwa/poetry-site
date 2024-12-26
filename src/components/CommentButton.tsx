import { useState } from "react";
import { MessageCircle } from "lucide-react";
//import { cn } from "@/lib/utils";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CommentButton({ onAddComment }: { onAddComment: (comment: string) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(comment);
      setComment("");
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center text-gray-500 hover:text-blue-500 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add a Comment</h2>
        <Input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          className="mb-4"
        />
        <Button 
          onClick={handleCommentSubmit} 
          className="w-full"
          disabled={!comment.trim() || isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </Modal>
    </>
  );
}