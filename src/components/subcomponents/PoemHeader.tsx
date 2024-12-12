// src/components/subcomponents/PoemHeader.tsx
import React from "react";

interface PoemHeaderProps {
  title: string;
  author: string | { name: string; email: string };
  label?: string;
  isPreview?: boolean;
}

export function PoemHeader({ title, author, label, isPreview = true }: PoemHeaderProps) {
  const maxTitleLength = window.innerWidth < 640 ? 60 : 120;
  const displayTitle = isPreview && title.length > maxTitleLength 
    ? `${title.slice(0, maxTitleLength)}...` 
    : title;
  const authorName = typeof author === 'string' ? author : author.name;

  return (
    <>
      {label && (
        <div className="text-sm font-semibold text-blue-500 mb-2 animate-fadeIn">
          {label}
        </div>
      )}
      <div className="border-b pb-2">
        <h3 className="text-lg sm:text-xl font-bold hover:text-primary transition-colors line-clamp-2">
          {displayTitle}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          By {authorName}
        </p>
      </div>
    </>
  );
}