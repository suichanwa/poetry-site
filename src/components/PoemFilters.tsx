// src/components/PoemFilters.tsx
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Tag as TagIcon, Plus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AddMangaModal } from "@/components/AddMangaModal";
import { AddLightNovelModal } from "@/components/lightnovel/AddLightNovelModal";
import type { LightNovel } from "@/types/lightNovel";

interface PoemFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedTags: string[];
  availableTags: string[];
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  onAddPoem: () => void;
  onAddManga: (manga: any) => void;
  onAddBook: () => void;
  onAddLightNovel: (lightNovel: LightNovel) => void;
}

export function PoemFilters({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  selectedTags,
  availableTags,
  toggleTag,
  clearFilters,
  onAddPoem,
  onAddManga,
  onAddBook,
  onAddLightNovel
}: PoemFiltersProps) {
  const [isMangaModalOpen, setIsMangaModalOpen] = useState(false);
  const [isLightNovelModalOpen, setIsLightNovelModalOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowFilters]);

  const handleMangaSubmit = (manga: any) => {
    if (onAddManga) {
      onAddManga(manga);
    }
    setIsMangaModalOpen(false);
  };

  const handleLightNovelSubmit = (lightNovel: LightNovel) => {
    if (onAddLightNovel) {
      onAddLightNovel(lightNovel);
    }
    setIsLightNovelModalOpen(false);
  };

  const updateRecentSearches = (query: string) => {
    if (query.trim()) {
      setRecentSearches(prev => {
        const newSearches = [
          query,
          ...prev.filter(item => item !== query)
        ].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(newSearches));
        return newSearches;
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        updateRecentSearches(value.trim());
      }, 1000);
    }
  };

  return (
    <div className="flex items-center gap-4 w-full sm:w-auto">
      <div className="relative flex-1 sm:flex-initial" ref={searchRef}>
        <div className="relative">
          <div className="flex items-center absolute left-3 top-1/2 transform -translate-y-1/2 gap-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            {selectedTags.length > 0 && (
              <TagIcon className="h-4 w-4 text-primary" />
            )}
          </div>
          <Input
            type="text"
            placeholder={selectedTags.length > 0 ? "Search with tags..." : "Search poems or add tags..."}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowFilters(true)}
            className={cn(
              "pl-10 pr-10 w-full sm:w-[300px]",
              selectedTags.length > 0 && "pl-16"
            )}
          />
          {(selectedTags.length > 0 || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto hover:bg-transparent"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="absolute z-[60] mt-1 w-full bg-popover rounded-md border shadow-md">
            {recentSearches.length > 0 && (
              <div className="p-2 border-b">
                <p className="text-sm font-medium text-muted-foreground mb-2">Recent Searches</p>
                <div className="flex flex-col space-y-1">
                  {recentSearches.map((query) => (
                    <Button
                      key={query}
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      onClick={() => handleSearch(query)}
                    >
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      {query}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="p-2">
              <p className="text-sm font-medium text-muted-foreground mb-2">Available Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {availableTags
                  .filter(tag => !selectedTags.includes(tag))
                  .map(tag => (
                    <Button
                      key={tag}
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleTag(tag)}
                      className="h-6 text-xs px-2 py-1 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      + {tag}
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onAddPoem}>
            Add Poem
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsMangaModalOpen(true)}>
            Add Manga
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAddBook}>
            Add Book
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsLightNovelModalOpen(true)}>
            Add Light Novel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddMangaModal
        isOpen={isMangaModalOpen}
        onClose={() => setIsMangaModalOpen(false)}
        onAddManga={handleMangaSubmit}
      />

      <AddLightNovelModal
        isOpen={isLightNovelModalOpen}
        onClose={() => setIsLightNovelModalOpen(false)}
        onAddLightNovel={handleLightNovelSubmit}
      />
    </div>
  );
}