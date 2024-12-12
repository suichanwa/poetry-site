// src/components/subcomponents/PoemComments.tsx
import React from "react";

interface PoemCommentsProps {
  comments: string[];
}

export function PoemComments({ comments }: PoemCommentsProps) {
  if (comments.length === 0) return null;

  return (
    <div className="mt-2 sm:mt-4 border-t pt-2 sm:pt-4">
      <h4 className="text-xs sm:text-sm font-semibold mb-2">Comments</h4>
      <div className="space-y-1 sm:space-y-2">
        {comments.map((comment, index) => (
          <div key={index} className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {comment}
          </div>
        ))}
      </div>
    </div>
  );
}