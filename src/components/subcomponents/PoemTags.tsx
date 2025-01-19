// src/components/subcomponents/PoemTags.tsx
import React from "react";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";

interface PoemTagsProps {
  tags: { name: string }[];
}

export function PoemTags({ tags }: PoemTagsProps) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <motion.span
            key={tag.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 
                     text-xs font-medium rounded-full
                     bg-primary/10 text-primary
                     transition-all duration-300
                     hover:bg-primary/20 transform hover:scale-105
                     max-w-[150px] truncate"
          >
            <Tag className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{tag.name}</span>
          </motion.span>
        ))}
      </div>
    </div>
  );
}