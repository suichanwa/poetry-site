// src/components/lightnovel/reader/ReaderHeader.tsx
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  X, 
  Type, 
  Settings, 
  Sun, 
  Moon, 
  BookOpen, 
  Maximize2, 
  Minimize2, 
  Layout 
} from "lucide-react";

interface ReaderHeaderProps {
  chapter: {
    orderIndex: number;
    title: string;
  };
  onClose: () => void;
  onFontSizeChange: (size: FontSize) => void;
  onLineSpacingChange: (spacing: LineSpacing) => void;
  onThemeChange: (theme: Theme) => void;
  onLayoutChange: () => void;
  onFullscreenToggle: () => void;
  isFullscreen: boolean;
  showControls: boolean;
}

export function ReaderHeader({
  chapter,
  onClose,
  onFontSizeChange,
  onLineSpacingChange,
  onThemeChange,
  onLayoutChange,
  onFullscreenToggle,
  isFullscreen,
  showControls
}: ReaderHeaderProps) {
  return (
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
        {/* Font Size and Line Spacing Controls */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Type className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onFontSizeChange('small')}>
              Small Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFontSizeChange('medium')}>
              Medium Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFontSizeChange('large')}>
              Large Text
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onLineSpacingChange('normal')}>
              Normal Spacing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLineSpacingChange('relaxed')}>
              Relaxed Spacing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLineSpacingChange('loose')}>
              Loose Spacing
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Controls */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onThemeChange('light')}>
              <Sun className="w-4 h-4 mr-2" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onThemeChange('dark')}>
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onThemeChange('sepia')}>
              <BookOpen className="w-4 h-4 mr-2" />
              Sepia
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Layout Toggle */}
        <Button variant="ghost" size="icon" onClick={onLayoutChange}>
          <Layout className="w-4 h-4" />
        </Button>

        {/* Fullscreen Toggle */}
        <Button variant="ghost" size="icon" onClick={onFullscreenToggle}>
          {isFullscreen ? 
            <Minimize2 className="w-4 h-4" /> : 
            <Maximize2 className="w-4 h-4" />
          }
        </Button>
      </div>
    </div>
  );
}