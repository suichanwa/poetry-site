import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PoemTagsProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const AVAILABLE_TAGS = [
  "Love",
  "Nature",
  "Life",
  "Death",
  "Friendship",
  "Family",
  "Hope",
  "Dreams",
  "Sadness",
  "Joy",
  "Time",
  "Memory",
  "Philosophy",
  "Society",
  "Spirituality"
];

export function PoemTags({ tags, setTags }: PoemTagsProps) {
  const availableTags = AVAILABLE_TAGS.filter(tag => !tags.includes(tag));

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium">Tags</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              disabled={availableTags.length === 0}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Tag
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {availableTags.map(tag => (
              <DropdownMenuItem
                key={tag}
                onClick={() => addTag(tag)}
              >
                {tag}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}