// src/components/CommentSection.tsx
import React from "react";
import { useAuth } from "@/context/AuthContext";

interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
}

interface CommentSectionProps {
  comments: Comment[];
  onSubmit: (comment: string) => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  isSubmitting: boolean;
}

export function CommentSection({
  comments,
  onSubmit,
  newComment,
  setNewComment,
  isSubmitting,
}: CommentSectionProps) {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white p-4 rounded-lg shadow transition-shadow hover:shadow-md"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <img
                src={comment.user.avatar || "/default-avatar.png"}
                alt={comment.user.name}
                className="w-10 h-10 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-800">{comment.user.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <p className="text-gray-700 mt-1">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}