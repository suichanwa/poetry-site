import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Filter, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useFilters } from "@/hooks/useFilters";
import { useContentFetch } from "@/hooks/useContentFetch";
import { useModals } from "@/hooks/useModals";
import { LoadingState } from "@/components/LoadingState";
import PoemList from "@/components/PoemList";
import { MangaGrid } from "@/components/MangaGrid";
import { LightNovelGrid } from "@/components/lightnovel/LightNovelGrid";
import { BookGrid } from "@/components/BookGrid";
import { useNavigate } from 'react-router-dom';
import BurgerMenu from "@/components/BurgerMenu";

export default function MainPage() {
  const [activeTab, setActiveTab] = useState<"poems" | "manga" | "lightnovels" | "books">("poems");
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    poems,
    mangas,
    lightNovels,
    books,
    followingPoems,
    isLoading,
    setPoems,
    setMangas,
    setLightNovels,
    setBooks,
  } = useContentFetch();
  const {
    filteredPoems,
    searchQuery,
    setSearchQuery,
    selectedTags,
    availableTags,
    toggleTag,
    clearFilters,
  } = useFilters(poems);
  const {
    isPoemModalOpen,
    setIsPoemModalOpen,
    isMangaModalOpen,
    setIsMangaModalOpen,
    isLightNovelModalOpen,
    setIsLightNovelModalOpen,
    isBookModalOpen,
    setIsBookModalOpen,
  } = useModals();

  const handleAddContent = (contentType: string) => {
    switch (contentType) {
      case "poems":
        setIsPoemModalOpen(true);
        break;
      case "manga":
        setIsMangaModalOpen(true);
        break;
      case "lightnovels":
        setIsLightNovelModalOpen(true);
        break;
      case "books":
        setIsBookModalOpen(true);
        break;
    }
  };

  const handleMangaClick = (mangaId: number) => {
    navigate(`/manga/${mangaId}`);
  };

  const handleLightNovelClick = (novelId: number) => {
    navigate(`/lightnovel/${novelId}`);
  };

  const handleBookClick = (bookId: number) => {
    navigate(`/book/${bookId}`);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <BurgerMenu />
          {/* Search Bar */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 px-4 py-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 px-3">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {availableTags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag.id}
                  checked={selectedTags.some(
                    (selectedTag) => selectedTag.id === tag.id
                  )}
                  onSelect={() => toggleTag(tag)}
                >
                  {tag.name}
                </DropdownMenuCheckboxItem>
              ))}
              <Separator className="my-2" />
              <DropdownMenuItem onSelect={clearFilters}>
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start gap-4">
          <Button
            variant={activeTab === "poems" ? "default" : "ghost"}
            onClick={() => setActiveTab("poems")}
            className="px-4 py-2 rounded-lg text-sm font-medium"
          >
            Poems
          </Button>
          <Button
            variant={activeTab === "manga" ? "default" : "ghost"}
            onClick={() => setActiveTab("manga")}
            className="px-4 py-2 rounded-lg text-sm font-medium"
          >
            Manga
          </Button>
          <Button
            variant={activeTab === "lightnovels" ? "default" : "ghost"}
            onClick={() => setActiveTab("lightnovels")}
            className="px-4 py-2 rounded-lg text-sm font-medium"
          >
            Light Novels
          </Button>
          <Button
            variant={activeTab === "books" ? "default" : "ghost"}
            onClick={() => setActiveTab("books")}
            className="px-4 py-2 rounded-lg text-sm font-medium"
          >
            Books
          </Button>
        </div>
        <Separator />

        {/* Content Display */}
        {activeTab === "poems" && <PoemList poems={filteredPoems} />}
        {activeTab === "manga" && (
          <MangaGrid mangas={mangas} onMangaClick={handleMangaClick} />
        )}
        {activeTab === "lightnovels" && (
          <LightNovelGrid
            novels={lightNovels}
            onNovelClick={handleLightNovelClick}
          />
        )}
        {activeTab === "books" && (
          <BookGrid books={books} onBookClick={handleBookClick} />
        )}
      </div>
    </div>
  );
}