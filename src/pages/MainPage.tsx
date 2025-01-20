// src/pages/MainPage.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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

export default function MainPage() {
  const [poems, setPoems] = useState([]);
  const [mangas, setMangas] = useState([]);
  const [lightNovels, setLightNovels] = useState([]);
  const [books, setBooks] = useState([]);
  const [filteredPoems, setFilteredPoems] = useState([]);
  const [popularPoems, setPopularPoems] = useState([]);
  const [followingPoems, setFollowingPoems] = useState([]);
  const [isPoemModalOpen, setIsPoemModalOpen] = useState(false);
  const [isMangaModalOpen, setIsMangaModalOpen] = useState(false);
  const [isLightNovelModalOpen, setIsLightNovelModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("for-you");
  const [mainContentTab, setMainContentTab] = useState("poems");
  const [searchResults, setSearchResults] = useState({
    poems: [],
    manga: [],
    lightNovels: [],
    books: []
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMangaClick = (mangaId) => {
    navigate(`/manga/${mangaId}`);
  };

  const handleLightNovelClick = (novelId) => {
    navigate(`/lightnovel/${novelId}`);
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  useEffect(() => {
    const fetchContent = async (endpoint, setter, isFollowing = false) => {
      try {
        const response = await fetch(`http://localhost:3001/api/${endpoint}`);
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        toast({
          title: "Error",
          description: `Failed to fetch ${endpoint}`,
          status: "error",
        });
      }
    };

    if (user) fetchContent("poems/following", setFollowingPoems, true);
    fetchContent("poems", setPoems);
    fetchContent("manga", setMangas);
    fetchContent("lightnovels", setLightNovels);
    fetchContent("books", setBooks);
    
    setIsLoading(false);
  }, [user, toast]);

  useEffect(() => {
    const filtered = poems.filter((poem) => {
      const matchesSearch = searchQuery 
        ? poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          poem.content.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesTags = selectedTags.every((tag) => poem.tags.some((t) => t.name === tag));

      return matchesSearch && matchesTags;
    });

    setFilteredPoems(filtered);
  }, [searchQuery, selectedTags, poems]);

  if (isLoading) return <LoadingState />;

  return (
    <div className="min-h-screen md:p-6 p-2">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-b">
          <Tabs defaultValue={mainContentTab} onValueChange={setMainContentTab}>
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
                />
              </div>
            </div>

            <TabsContent value="poems">
              <FeedTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isLoading={isLoading}
                filteredPoems={activeTab === "following" ? followingPoems : filteredPoems}
                popularPoems={popularPoems}
                followingPoems={followingPoems}
                user={user}
                hideFilters={true}
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
                className="pb-16 md:pb-0"
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
          poems={searchResults.poems} 
          manga={searchResults.manga} 
          lightNovels={searchResults.lightNovels} 
          books={searchResults.books}
        />

        <Modals
          isPoemModalOpen={isPoemModalOpen}
          setIsPoemModalOpen={setIsPoemModalOpen}
          isMangaModalOpen={isMangaModalOpen}
          setIsMangaModalOpen={setIsMangaModalOpen}
          isLightNovelModalOpen={isLightNovelModalOpen}
          setIsLightNovelModalOpen={setIsLightNovelModalOpen}
          onAddPoetry={(newPoem) => {
            setPoems(prev => [newPoem, ...prev]);
            setFilteredPoems(prev => [newPoem, ...prev]);
          }}
          onAddManga={(newManga) => setMangas(prev => [newManga, ...prev])}
          onAddLightNovel={(newNovel) => setLightNovels(prev => [newNovel, ...prev])}
        />

        <AddBookModal
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          onAddBook={(newBook) => {
            setBooks(prev => [newBook, ...prev]);
          }}
        />
      </div>
    </div>
  );
}