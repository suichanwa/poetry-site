import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FeedTabs } from "@/components/FeedTabs";
import { MangaGrid } from "@/components/MangaGrid";
import { LightNovelGrid } from "@/components/lightnovel/LightNovelGrid";
import { BookGrid } from "@/components/BookGrid";
import { PoemFilters } from "@/components/PoemFilters";
import { LoadingState } from "@/components/LoadingState";
import { SearchResults } from "@/components/SearchResults";
import { Modals } from "@/components/Modals";
import { AddBookModal } from "@/components/AddBookModal";
import { useContentFetch } from "@/hooks/useContentFetch";
import { useFilters } from "@/hooks/useFilters";
import { useModals } from "@/hooks/useModals";

export default function MainPage() {
  const { poems, mangas, lightNovels, books, followingPoems, isLoading } = useContentFetch();
  const { filteredPoems, searchQuery, setSearchQuery, selectedTags, availableTags, toggleTag, clearFilters, showFilters, setShowFilters } = useFilters(poems);
  const { isPoemModalOpen, setIsPoemModalOpen, isMangaModalOpen, setIsMangaModalOpen, isLightNovelModalOpen, setIsLightNovelModalOpen, isBookModalOpen, setIsBookModalOpen } = useModals();
  const navigate = useNavigate();

  const handleMangaClick = (mangaId) => {
    navigate(`/manga/${mangaId}`);
  };

  const handleLightNovelClick = (novelId) => {
    navigate(`/lightnovel/${novelId}`);
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="min-h-screen md:p-6 p-2">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-b">
          <Tabs defaultValue="poems">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="poems">Poems</TabsTrigger>
                <TabsTrigger value="manga">Manga</TabsTrigger>
                <TabsTrigger value="lightnovels">Light Novels</TabsTrigger>
                <TabsTrigger value="books">Books</TabsTrigger>
              </TabsList>

              <div className="w-full sm:w-auto">
                <PoemFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  selectedTags={selectedTags}
                  availableTags={availableTags}
                  toggleTag={toggleTag}
                  clearFilters={clearFilters}
                  onAddPoem={() => setIsPoemModalOpen(true)}
                  onAddManga={() => setIsMangaModalOpen(true)}
                  onAddLightNovel={() => setIsLightNovelModalOpen(true)}
                  onAddBook={() => setIsBookModalOpen(true)}
                />
              </div>
            </div>

            <TabsContent value="poems">
              <FeedTabs
                activeTab="for-you"
                setActiveTab={() => {}}
                isLoading={isLoading}
                filteredPoems={filteredPoems}
                popularPoems={[]}
                followingPoems={followingPoems}
                user={null}
                hideFilters={true}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
              />
            </TabsContent>

            <TabsContent value="manga">
              <MangaGrid 
                mangas={mangas} 
                onMangaClick={handleMangaClick}
                onAddManga={() => setIsMangaModalOpen(true)}
              />
            </TabsContent>

            <TabsContent value="lightnovels">
              <LightNovelGrid 
                novels={lightNovels} 
                onNovelClick={handleLightNovelClick}
                onAddNovel={() => setIsLightNovelModalOpen(true)}
              />
            </TabsContent>

            <TabsContent value="books">
              <BookGrid 
                books={books} 
                onBookClick={handleBookClick}
                onAddBook={() => setIsBookModalOpen(true)}
              />
            </TabsContent>
          </Tabs>
        </div>

        <SearchResults 
          poems={[]} 
          manga={[]} 
          lightNovels={[]} 
          books={[]}
        />

        <Modals
          isPoemModalOpen={isPoemModalOpen}
          setIsPoemModalOpen={setIsPoemModalOpen}
          isMangaModalOpen={isMangaModalOpen}
          setIsMangaModalOpen={setIsMangaModalOpen}
          isLightNovelModalOpen={isLightNovelModalOpen}
          setIsLightNovelModalOpen={setIsLightNovelModalOpen}
          isBookModalOpen={isBookModalOpen}
          setIsBookModalOpen={setIsBookModalOpen}
          onAddPoetry={(newPoem) => {
            setPoems(prev => [newPoem, ...prev]);
            setFilteredPoems(prev => [newPoem, ...prev]);
          }}
          onAddManga={(newManga) => setMangas(prev => [newManga, ...prev])}
          onAddLightNovel={(newNovel) => setLightNovels(prev => [newNovel, ...prev])}
          onAddBook={(newBook) => setBooks(prev => [newBook, ...prev])}
        />

        <AddBookModal
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          onAddBook={(newBook) => setBooks(prev => [newBook, ...prev])}
        />
      </div>
    </div>
  );
}