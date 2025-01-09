// src/components/MangaReader.tsx
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  ChevronFirst,
  ChevronLast,
  Maximize2,
  Minimize2,
  X,
  Layout,
  ScrollText
} from "lucide-react";

interface MangaReaderProps {
  pages: {
    id: number;
    imageUrl: string;
    pageNumber: number;
  }[];
  currentChapter: {
    id: number;
    title: string;
    orderIndex: number;
  };
  onChapterChange: (chapterId: number) => void;
  onClose: () => void;
}

type ViewMode = 'paged' | 'scroll';

export function MangaReader({ pages, currentChapter, onChapterChange, onClose }: MangaReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('paged');
  const readerRef = useRef<HTMLDivElement>(null);

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^.*[\/\\]uploads[\/\\]/, 'uploads/').replace(/\\/g, '/');
    return `http://localhost:3000/${cleanPath}`;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (viewMode === 'paged') {
        switch(e.key) {
          case "ArrowRight":
            handleNextPage();
            break;
          case "ArrowLeft":
            handlePrevPage();
            break;
          case "f":
            toggleFullscreen();
            break;
          case "Escape":
            if (isFullscreen) {
              toggleFullscreen();
            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, isFullscreen, viewMode]);

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setScale(1);
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

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'paged' ? 'scroll' : 'paged');
    setCurrentPage(0);
    setScale(1);
  };

  return (
    <div ref={readerRef} className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Top Controls */}
      <div className="flex items-center justify-between p-4 bg-background/10 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-white">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="text-white hover:text-white/80"
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          <span className="text-sm">
            Chapter {currentChapter.orderIndex}: {currentChapter.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleViewMode}
            className="text-white hover:text-white/80"
          >
            {viewMode === 'paged' ? (
              <ScrollText className="h-4 w-4" />
            ) : (
              <Layout className="h-4 w-4" />
            )}
          </Button>
          {viewMode === 'paged' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                className="text-white hover:text-white/80"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetZoom}
                className="text-white hover:text-white/80"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                className="text-white hover:text-white/80"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-white hover:text-white/80"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'paged' ? (
        // Paged View
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={getImageUrl(pages[currentPage].imageUrl)}
              alt={`Page ${pages[currentPage].pageNumber}`}
              style={{ 
                transform: `scale(${scale})`,
                transition: 'transform 0.2s ease-in-out'
              }}
              className="max-h-full object-contain"
              onError={(e) => {
                console.error('Error loading page:', pages[currentPage].imageUrl);
                e.currentTarget.src = '/placeholder.png';
              }}
            />
          </div>

          {/* Navigation Overlays */}
          <div className="absolute inset-y-0 left-0 w-1/4 flex items-center">
            <Button
              variant="ghost"
              className="h-full w-full opacity-0 hover:opacity-100 transition-opacity"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-8 w-8 text-white" />
            </Button>
          </div>
          <div className="absolute inset-y-0 right-0 w-1/4 flex items-center">
            <Button
              variant="ghost"
              className="h-full w-full opacity-0 hover:opacity-100 transition-opacity"
              onClick={handleNextPage}
              disabled={currentPage === pages.length - 1}
            >
              <ChevronRight className="h-8 w-8 text-white" />
            </Button>
          </div>
        </div>
      ) : (
        // Scroll View
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-4xl mx-auto">
            {pages.map((page) => (
              <div key={page.id} className="flex justify-center">
                <img
                  src={getImageUrl(page.imageUrl)}
                  alt={`Page ${page.pageNumber}`}
                  className="max-w-full w-full h-auto"
                  onError={(e) => {
                    console.error('Error loading page:', page.imageUrl);
                    e.currentTarget.src = '/placeholder.png';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Controls - Only show in paged mode */}
      {viewMode === 'paged' && (
        <div className="p-4 bg-background/10 backdrop-blur-sm flex items-center justify-between">
          <div className="text-white text-sm">
            Page {currentPage + 1} of {pages.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
              className="text-white hover:text-white/80"
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="text-white hover:text-white/80"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === pages.length - 1}
              className="text-white hover:text-white/80"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(pages.length - 1)}
              disabled={currentPage === pages.length - 1}
              className="text-white hover:text-white/80"
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}