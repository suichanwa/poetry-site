// src/components/lightnovel/LightNovelReader.tsx
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight,
  Settings,
  Bookmark,
  Sun,
  Moon,
  BookOpen,
  Maximize2,
  Minimize2,
  Type
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LightNovelReaderProps {
  chapter: {
    id: number;
    title: string;
    content: string;
    orderIndex: number;
  };
  onChapterChange: (chapterId: number) => void;
  onClose: () => void;
  totalChapters: number;
}

type Theme = 'light' | 'dark' | 'sepia';
type FontSize = 'small' | 'medium' | 'large';

export function LightNovelReader({ 
  chapter, 
  onChapterChange, 
  onClose,
  totalChapters 
}: LightNovelReaderProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      case 'sepia':
        return 'bg-[#f4ecd8] text-gray-900';
      default:
        return 'bg-white text-gray-900';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <div 
      ref={readerRef}
      className={`fixed inset-0 z-50 flex flex-col ${getThemeClass()}`}
    >
      {/* Top Controls */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b backdrop-blur-sm bg-background/50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <span className="text-sm font-medium">
            Chapter {chapter.orderIndex}: {chapter.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Font Size Control */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Type className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFontSize('small')}>
                Small
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFontSize('medium')}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFontSize('large')}>
                Large
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Control */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="w-4 h-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('sepia')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Sepia
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className={`max-w-3xl mx-auto p-8 ${getFontSizeClass()}`}>
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: chapter.content }}
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="sticky bottom-0 z-10 flex items-center justify-between p-4 border-t backdrop-blur-sm bg-background/50">
        <Button
          variant="outline"
          disabled={chapter.orderIndex === 1}
          onClick={() => onChapterChange(chapter.id - 1)}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous Chapter
        </Button>

        <Button
          variant="outline"
          disabled={chapter.orderIndex === totalChapters}
          onClick={() => onChapterChange(chapter.id + 1)}
        >
          Next Chapter
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}