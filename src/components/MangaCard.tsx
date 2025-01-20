// src/components/MangaCard.tsx
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Heart, Clock, BookOpen, User } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface MangaCardProps {
  manga: {
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
    chapters: {
      id: number;
      title: string;
      createdAt: string;
    }[];
    tags: { name: string }[];
  };
  onMangaClick: (mangaId: number) => void;
}

export function MangaCard({ manga, onMangaClick }: MangaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const latestChapter = manga.chapters[manga.chapters.length - 1];

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^.*[\/\\]uploads[\/\\]/, 'uploads/').replace(/\\/g, '/');
    return `http://localhost:3001/${cleanPath}`;
  };

  return (
    <Card 
      className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onMangaClick(manga.id)}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={getImageUrl(manga.coverImage)}
          alt={manga.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          onError={(e) => {
            console.error('Error loading image:', manga.coverImage);
            e.currentTarget.src = '/placeholder.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{manga.title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-6 h-6">
            {manga.author.avatar ? (
              <AvatarImage 
                src={getImageUrl(manga.author.avatar)} 
                alt={manga.author.name} 
              />
            ) : (
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm opacity-90">{manga.author.name}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {manga.tags.slice(0, 3).map(tag => (
            <span
              key={tag.name}
              className="text-xs px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm"
            >
              {tag.name}
            </span>
          ))}
          {manga.tags.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              +{manga.tags.length - 3}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm opacity-90">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {manga.views.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {manga.likes.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDistanceToNow(new Date(manga.createdAt), { addSuffix: true })}
          </div>
        </div>
        {latestChapter && (
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 w-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Chapter {manga.chapters.length}: {latestChapter.title}
          </Button>
        )}
      </div>
    </Card>
  );
}