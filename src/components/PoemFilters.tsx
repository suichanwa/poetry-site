import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, ChevronDown, X, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator"

interface PoemFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  availableTags: string[];
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  onAddPoem: () => void;
  onAddManga: () => void;
  onAddLightNovel: () => void;
  onAddBook: () => void;
}

export function PoemFilters({
  searchQuery,
  setSearchQuery,
  selectedTags,
  availableTags,
  toggleTag,
  clearFilters,
  onAddPoem,
  onAddManga,
  onAddLightNovel,
  onAddBook,
}: PoemFiltersProps) {
  const [isMangaModalOpen, setIsMangaModalOpen] = useState(false);
  const [isLightNovelModalOpen, setIsLightNovelModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // Add state for showing filters

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
            {availableTags.map((tag) => (
                <DropdownMenuCheckboxItem
                key={tag}
                checked={selectedTags.includes(tag)}
                onSelect={() => toggleTag(tag)}
                >
                {tag}
                </DropdownMenuCheckboxItem>
            ))}
            <Separator className="my-2" />
            <DropdownMenuItem onSelect={clearFilters}>
                Clear Filters
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onAddPoem}>Add Poem</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsMangaModalOpen(true)}>
            Add Manga
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAddBook}>Add Book</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsLightNovelModalOpen(true)}>
            Add Light Novel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}