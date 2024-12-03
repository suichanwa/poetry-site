import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CommentButton({ onAddComment }: { onAddComment: (comment: string) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCommentSubmit = () => {
    onAddComment(comment);
    setComment("");
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className={cn(
          "flex items-center justify-center text-gray-500 hover:text-blue-500 transition-colors"
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <h2 className="text-xl font-bold mb-4">Add a Comment</h2>
        <Input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          className="mb-4"
        />
        <Button onClick={handleCommentSubmit} className="w-full">
          Post Comment
        </Button>
      </Modal>
    </>
  );
}