import { useState } from "react";
import { Comment } from "./Comment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CommentSectionProps {
  comments: Comment[];
  onSubmit: (comment: string) => void;
  likedComments: Record<number, boolean>;
  likeCounts: Record<number, number>;
  handleLikeComment: (commentId: number) => void;
}

export default function CommentSection({
  comments,
  onSubmit,
  likedComments,
  likeCounts,
  handleLikeComment
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleSubmit = () => {
    if (!user) {
      setError("You must be logged in to comment.");
      return;
    }

    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    onSubmit(newComment);
    setNewComment("");
    setError("");
  };

  return (
    <div className="mt-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Leave a Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none mb-2"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <Button onClick={handleSubmit}>Post Comment</Button>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <div className="space-y-6">
        {comments.map((comment) => (
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