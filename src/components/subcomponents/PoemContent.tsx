import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PoemContentProps {
  content: string;
  poemId?: number;
  isPreview?: boolean;
  formatting?: {
    isBold?: boolean;
    isItalic?: boolean;
    alignment?: 'left' | 'center' | 'right';
    fontSize?: 'small' | 'medium' | 'large';
  } | null;
  isExpanded?: boolean;
  onToggleExpand?: (e: React.MouseEvent) => void;
}

export function PoemContent({ 
  content, 
  poemId,
  isPreview = true, 
  formatting = null,
  isExpanded,
  onToggleExpand
}: PoemContentProps) {
  const [height, setHeight] = useState<number | undefined>(undefined);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const maxPreviewLength = window.innerWidth < 640 ? 150 : 300; // Increased length
  const shouldTruncate = isPreview && content.length > maxPreviewLength && !isExpanded;

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(scrollHeight);
    }
  }, [content, isExpanded]);

  return (
    <div className="relative py-2 sm:py-4">
      <div 
        ref={contentRef}
        style={{ 
          maxHeight: isExpanded ? `${height}px` : '8rem', // Increased from 4.5rem to 8rem
          transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className="overflow-hidden"
      >
        <p className={cn(
          "whitespace-pre-wrap",
          formatting?.isBold && "font-bold",
          formatting?.isItalic && "italic",
          formatting?.alignment === 'center' && "text-center",
          formatting?.alignment === 'right' && "text-right",
          {
            'text-sm': formatting?.fontSize === 'small',
            'text-base': !formatting?.fontSize || formatting.fontSize === 'medium',
            'text-lg': formatting?.fontSize === 'large'
          },
          "transition-all duration-300 ease-in-out"
        )}>
          {content}
        </p>
      </div>
      
      {content.length > maxPreviewLength && (
        <button 
          className={cn(
            "mt-2 px-3 py-1.5",
            "text-primary font-semibold",
            "inline-flex items-center gap-2",
            "text-sm sm:text-base",
            "transition-all duration-300 ease-in-out transform",
            "hover:text-primary/80"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand && onToggleExpand(e);
          }}
        >
          <span>{isExpanded ? 'Show less' : 'Read more'}</span>
          <svg 
            className={cn(
              "w-4 h-4 transition-transform duration-500",
              isExpanded ? "rotate-180" : "rotate-0"
            )}
            viewBox="0 0 24 24"
          >
            <path 
              fill="currentColor" 
              d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}