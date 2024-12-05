import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LikeButton } from "@/components/LikeButton";
import { CommentButton } from "@/components/CommentButton";

export function PoemCard({
  title,
  content,
  author,
  label,
}: {
  title: string;
  content: string;
  author: string;
  label?: string;
}) {
  const [comments, setComments] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addComment = (comment: string) => {
    if (comments.length > 0) {
      setError("You can only post one comment.");
      return;
    }
    setComments([...comments, comment]);
    setError(null);
  };

  return (
    <Card className="shadow-md p-4">
      {label && <div className="text-sm font-semibold text-pink-200 mb-2">{label}</div>}
      <div className="border-b pb-2">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-gray-500">By {author}</p>
      </div>
      <div className="py-4">
        <p>{content}</p>
      </div>
      <div className="border-t pt-2 flex justify-end space-x-4">
        <LikeButton />
        <CommentButton onAddComment={addComment} />
      </div>
      {error && (
        <div className="mt-4 text-red-500">
          {error}
        </div>
      )}
      {comments.length > 0 && (
        <div className="mt-4 border rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-2">Comments</h4>
          <ul className="space-y-2">
            {comments.map((comment, index) => (
              <li key={index} className="0 p-2 rounded flex justify-between items-center">
                <span>{comment}</span>
                <LikeButton />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}