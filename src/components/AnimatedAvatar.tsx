import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

interface AnimatedAvatarProps {
  avatar: string;
  animation: string;
  cardStyle: string;
  size?: 'sm' | 'md' | 'lg';
}

const animations = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity }
  },
  bounce: {
    y: [0, -10, 0],
    transition: { duration: 1.5, repeat: Infinity }
  },
  rotate: {
    rotate: [0, 360],
    transition: { duration: 3, repeat: Infinity }
  }
};

const cardStyles = {
  glass: "bg-opacity-20 backdrop-blur-lg border border-white/20",
  minimal: "bg-primary/5",
  artistic: "border-2 border-primary shadow-lg rounded-xl"
};

export function AnimatedAvatar({ avatar, animation, cardStyle, size = 'md' }: AnimatedAvatarProps) {
  return (
    <motion.div
      className={cn(
        "overflow-hidden",
        cardStyles[cardStyle as keyof typeof cardStyles],
        size === 'sm' && "w-10 h-10 rounded-full",
        size === 'md' && "w-16 h-16 rounded-full",
        size === 'lg' && "w-24 h-24 rounded-full"
      )}
      animate={animations[animation as keyof typeof animations]}
    >
      <img 
        src={`http://localhost:3000${avatar}`}
        alt="Avatar"
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}