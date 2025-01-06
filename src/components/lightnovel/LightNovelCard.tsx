// src/components/LightNovelCard.tsx
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Heart, Clock, BookOpen, User } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface LightNovelCardProps {
  novel: {
    id: number;
    title: string;
    description: string;
    coverImage: string;
    author: {
      id: number;
      name: string;
      avatar?: string;
    };
    createdAt: string;
    views: number;
    likes: number;
    status: string;
    chapters: {
      id: number;
      title: string;
      createdAt: string;
    }[];
    tags: { name: string }[];
  };
  onNovelClick: (novelId: number) => void;
}

export function LightNovelCard({ novel, onNovelClick }: LightNovelCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const latestChapter = novel.chapters[novel.chapters.length - 1];

    // src/components/lightnovel/LightNovelCard.tsx
const getImageUrl = (path: string) => {
  if (!path) return '/placeholder.png';
  if (path.startsWith('http')) return path;

  // Remove the full file system path and keep only what's after 'uploads'
  const uploadsPath = path.split('uploads').pop();
  if (!uploadsPath) return '/placeholder.png';

  // Clean up the path and ensure forward slashes
  const cleanPath = uploadsPath.replace(/\\/g, '/');

  // Construct the final URL
  return `http://localhost:3000/uploads${cleanPath}`;
};

  return (
    <Card 
      className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onNovelClick(novel.id)}
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={getImageUrl(novel.coverImage)}
          alt={novel.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          onError={(e) => {
            console.error('Error loading image:', novel.coverImage);
            e.currentTarget.src = '/placeholder.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Status Badge */}
      <div className="absolute top-2 right-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          novel.status === 'ONGOING' 
            ? 'bg-green-500/80 text-white' 
            : novel.status === 'COMPLETED'
            ? 'bg-blue-500/80 text-white'
            : 'bg-yellow-500/80 text-white'
        }`}>
          {novel.status}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        {/* Title */}
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{novel.title}</h3>

        {/* Author Info */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-6 h-6">
            {novel.author.avatar ? (
              <AvatarImage 
                src={getImageUrl(novel.author.avatar)} 
                alt={novel.author.name} 
              />
            ) : (
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm opacity-90">{novel.author.name}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {novel.tags.slice(0, 3).map(tag => (
            <span
              key={tag.name}
              className="text-xs px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm"
            >
              {tag.name}
            </span>
          ))}
          {novel.tags.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              +{novel.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm opacity-90">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {novel.views.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {novel.likes.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDistanceToNow(new Date(novel.createdAt), { addSuffix: true })}
          </div>
        </div>

        {/* Latest Chapter */}
        {latestChapter && (
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 w-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Chapter {novel.chapters.length}: {latestChapter.title}
          </Button>
        )}
      </div>
    </Card>
  );
}