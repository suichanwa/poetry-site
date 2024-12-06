/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LikeButton } from "@/components/LikeButton";
import { CommentButton } from "@/components/CommentButton";
import { Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function PoemCard({
  title,
  content,
  author,
  label,
  id,
}: {
  title: string;
  content: string;
  author: string;
  label?: string;
  id: number;
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const { user } = useAuth();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} by ${author}`,
          text: content,
          url: `${window.location.origin}/poem/${id}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      const url = `${window.location.origin}/poem/${id}`;
      await navigator.clipboard.writeText(url);
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/poems/${id}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to bookmark poem');
      }

      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error bookmarking poem:', error);
    }
  };

  const addComment = async (comment: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/poems/${id}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      setComments([...comments, comment]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
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
      <div className="border-t pt-2 flex justify-between items-center">
        <div className="flex space-x-4">
          <LikeButton />
          <CommentButton onAddComment={addComment} />
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="hover:text-primary"
          >
            <Share2 className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className={`hover:text-primary ${isBookmarked ? 'text-primary' : ''}`}
          >
            <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
          </Button>
        </div>
      </div>
      {comments.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-semibold mb-2">Comments</h4>
          <div className="space-y-2">
            {comments.map((comment, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                {comment}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}