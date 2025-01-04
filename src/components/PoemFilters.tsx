import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Tag as TagIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AddMangaModal } from "@/components/AddMangaModal";
import { AddLightNovelModal } from "@/components/AddLightNovelModal";

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
  onAddManga: () => void;
  onAddBook: () => void;
  onAddLightNovel: () => void;
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
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMangaModalOpen, setIsMangaModalOpen] = useState(false);
  const [isLightNovelModalOpen, setIsLightNovelModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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
      onAddManga(manga); // Only call if the function exists
    }
    setIsMangaModalOpen(false);
  };


  const handleLightNovelSubmit = (lightNovel: any) => {
    console.log("New light novel:", lightNovel);
    setIsLightNovelModalOpen(false);
    onAddLightNovel();
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
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              setSearchFocused(true);
              setShowFilters(true);
            }}
            onBlur={() => setSearchFocused(false)}
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

        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedTags.map(tag => (
              <Button
                key={tag}
                variant="default"
                size="sm"
                onClick={() => toggleTag(tag)}
                className="h-6 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
              >
                {tag}
                <X className="h-3 w-3 ml-1" />
              </Button>
            ))}
          </div>
        )}

        {showFilters && (
          <div className="absolute z-10 mt-1 w-full bg-popover rounded-md border shadow-md">
            <div className="p-2">
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