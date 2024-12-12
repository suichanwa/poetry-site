// src/components/subcomponents/PoemActions.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Bookmark } from "lucide-react";
import { LikeButton } from "@/components/LikeButton";
import { CommentButton } from "@/components/CommentButton";
import { cn } from "@/lib/utils";

interface PoemActionsProps {
  onAddComment: (comment: string) => Promise<void>;
  onShare: () => Promise<void>;
  onBookmark: () => Promise<void>;
  isBookmarked: boolean;
}

export function PoemActions({ onAddComment, onShare, onBookmark, isBookmarked }: PoemActionsProps) {
  return (
    <div className="border-t pt-2 flex justify-between items-center">
      <div className="flex space-x-2 sm:space-x-4">
        <LikeButton />
        <CommentButton onAddComment={onAddComment} />
      </div>
      <div className="flex space-x-1 sm:space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
          className="hover:scale-110 transition-transform w-8 h-8 sm:w-9 sm:h-9"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
          className={cn(
            "hover:scale-110 transition-transform w-8 h-8 sm:w-9 sm:h-9",
            isBookmarked ? "text-primary" : ""
          )}
        >
          <Bookmark 
            className="w-4 h-4 sm:w-5 sm:h-5" 
            fill={isBookmarked ? "currentColor" : "none"} 
          />
        </Button>
      </div>
    </div>
  );
}