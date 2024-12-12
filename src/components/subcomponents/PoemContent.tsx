// src/components/subcomponents/PoemContent.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface PoemContentProps {
  content: string;
  isPreview?: boolean;
  onClick?: () => void;
}

export function PoemContent({ content, isPreview = true, onClick }: PoemContentProps) {
  const maxPreviewLength = window.innerWidth < 640 ? 100 : 150;
  const shouldTruncate = isPreview && content.length > maxPreviewLength;
  const displayContent = shouldTruncate 
    ? `${content.slice(0, maxPreviewLength)}...` 
    : content;

  return (
    <div className="py-2 sm:py-4" onClick={onClick}>
      <p className={cn(
        "leading-relaxed text-sm sm:text-base",
        isPreview && "line-clamp-3 sm:line-clamp-4"
      )}>
        {displayContent}
      </p>
      {shouldTruncate && (
        <button 
          className="text-primary text-xs sm:text-sm mt-2 hover:underline"
          onClick={onClick}
        >
          Read more
        </button>
      )}
    </div>
  );
}