// src/components/lightnovel/LightNovelReader.tsx
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
  Type,
  LineHeight,
  Layout,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
type Layout = 'single' | 'double';

export function LightNovelReader({ chapter, onChapterChange, onClose, totalChapters }: LightNovelReaderProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [layout, setLayout] = useState<Layout>('single');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const readerRef = useRef<HTMLDivElement>(null);

  const getThemeClass = () => {
    switch (theme) {
      case 'dark': return 'bg-gray-900 text-gray-100';
      case 'sepia': return 'bg-[#f4ecd8] text-gray-900';
      default: return 'bg-white text-gray-900';
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  let controlsTimeout: NodeJS.Timeout;

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => setShowControls(false), 2000);
  };

  useEffect(() => {
    return () => clearTimeout(controlsTimeout);
  }, []);

  return (
    <div 
      ref={readerRef}
      className={`fixed inset-0 z-50 flex flex-col ${getThemeClass()} transition-colors duration-200`}
      onMouseMove={handleMouseMove}
    >
      <div className={`${
        showControls ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-200 sticky top-0 z-10 flex items-center justify-between p-4 border-b backdrop-blur-sm bg-background/50`}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          <span className="text-sm font-medium">
            Chapter {chapter.orderIndex}: {chapter.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Type className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Font Size</span>
                    <span className="text-sm text-muted-foreground">{fontSize}px</span>
                  </div>
                  <Slider
                    value={[fontSize]}
                    min={12}
                    max={24}
                    step={1}
                    onValueChange={([value]) => setFontSize(value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Line Height</span>
                    <span className="text-sm text-muted-foreground">{lineHeight}x</span>
                  </div>
                  <Slider
                    value={[lineHeight * 10]}
                    min={12}
                    max={20}
                    step={1}
                    onValueChange={([value]) => setLineHeight(value / 10)}
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

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

          <Button variant="ghost" size="icon" onClick={() => setLayout(l => l === 'single' ? 'double' : 'single')}>
            <Layout className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="h-full overflow-auto px-4 md:px-0">
          <div 
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
            }}
            className={`max-w-3xl mx-auto p-8 prose prose-lg dark:prose-invert max-w-none ${
              layout === 'double' ? 'columns-2 gap-8' : ''
            }`}
            dangerouslySetInnerHTML={{ __html: chapter.content }}
          />
        </div>
        
        {/* Reading Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
          <div 
            className="h-full bg-primary transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className={`${
        showControls ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-200 sticky bottom-0 z-10 flex items-center justify-between p-4 border-t backdrop-blur-sm bg-background/50`}>
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