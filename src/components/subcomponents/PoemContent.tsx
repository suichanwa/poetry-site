// src/components/subcomponents/PoemContent.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface PoemContentProps {
  content: string;
  isPreview?: boolean;
  onClick?: () => void;
  formatting?: {
    isBold?: boolean;
    isItalic?: boolean;
    alignment?: 'left' | 'center' | 'right';
    fontSize?: 'small' | 'medium' | 'large';
  } | null;
}

export function PoemContent({ 
  content, 
  isPreview = true, 
  onClick,
  formatting = null
}: PoemContentProps) {
  const maxPreviewLength = window.innerWidth < 640 ? 100 : 150;
  const shouldTruncate = isPreview && content.length > maxPreviewLength;
  const displayContent = shouldTruncate 
    ? `${content.slice(0, maxPreviewLength)}...` 
    : content;

  const textStyles = cn(
    "leading-relaxed whitespace-pre-wrap",
    isPreview && "line-clamp-3 sm:line-clamp-4",
    formatting?.isBold && "font-bold",
    formatting?.isItalic && "italic",
    formatting?.alignment === 'center' && "text-center",
    formatting?.alignment === 'right' && "text-right",
    {
      'text-sm': formatting?.fontSize === 'small',
      'text-base': !formatting?.fontSize || formatting.fontSize === 'medium',
      'text-lg': formatting?.fontSize === 'large'
    }
  );

  return (
    <div className="py-2 sm:py-4" onClick={onClick}>
      <p className={textStyles}>
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