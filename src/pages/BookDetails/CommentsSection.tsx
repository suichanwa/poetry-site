import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Comment } from "./Comment";

interface CommentsSectionProps {
  comments: Array<{
    id: number;
    content: string;
    user: {
      id: number;
      name: string;
      avatar?: string;
    };
    createdAt: string;
    likes: number;
  }>;
  user: {
    id: number;
    avatar?: string;
  };
  likedComments: Record<number, boolean>;
  likeCounts: Record<number, number>;
  handleAddComment: (content: string) => void;
  handleLikeComment: (commentId: number) => void;
}

export function CommentsSection({ comments, user, likedComments, likeCounts, handleAddComment, handleLikeComment }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onAddComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await handleAddComment(newComment.trim());
    setNewComment("");
    setIsSubmitting(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      {user && (
        <div className="flex gap-4 mb-4">
          <Avatar className="w-10 h-10">
            {user.avatar ? (
              <AvatarImage src={`http://localhost:3001${user.avatar}`} />
            ) : (
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              onKeyDown={(e) => e.key === 'Enter' && onAddComment()}
            />
            <Button 
              onClick={onAddComment}
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
            >
              Post Comment
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {comments.map(comment => (
          <Comment 
            key={comment.id} 
            comment={comment} 
            likedComments={likedComments} 
            likeCounts={likeCounts} 
            handleLikeComment={handleLikeComment} 
          />
        ))}
      </div>
    </div>
  );
}