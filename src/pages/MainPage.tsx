// src/pages/MainPage.tsx
import { useState, useEffect } from "react";
import { AddPoetryModal } from "@/components/AddPoetryModal";
import { AddMangaModal } from "@/components/AddMangaModal";
import { AddLightNovelModal } from "@/components/lightnovel/AddLightNovelModal";
import { useAuth } from "@/context/AuthContext";
import { FeedTabs } from "../components/FeedTabs";
import { LoadingState } from "@/components/LoadingState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MangaGrid } from "@/components/MangaGrid";
import { LightNovelGrid } from "@/components/lightnovel/LightNovelGrid";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PoemFilters } from "@/components/PoemFilters";
import { PoemCard } from "@/components/PoemCard";
import { MangaCard } from "@/components/MangaCard";
import { LightNovelCard } from "@/components/LightNovelCard";

export default function MainPage() {
  const [poems, setPoems] = useState([]);
  const [mangas, setMangas] = useState([]);
  const [lightNovels, setLightNovels] = useState([]);
  const [filteredPoems, setFilteredPoems] = useState([]);
  const [popularPoems, setPopularPoems] = useState([]);
  const [followingPoems, setFollowingPoems] = useState([]);
  const [isPoemModalOpen, setIsPoemModalOpen] = useState(false);
  const [isMangaModalOpen, setIsMangaModalOpen] = useState(false);
  const [isLightNovelModalOpen, setIsLightNovelModalOpen] = useState(false);
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
    lightNovels: []
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

  const handleTagSearch = async (tags) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/search/tags?tags=${tags.join(',')}`);
      if (!response.ok) throw new Error('Failed to search by tags');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching by tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setError("");

    const fetchContent = async (endpoint, setter, authRequired = false) => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          ...(authRequired && token && { Authorization: `Bearer ${token}` }),
        };

        const response = await fetch(`http://localhost:3001/api/${endpoint}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setter(data);
      } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err);
        setError(err instanceof Error ? err.message : "Failed to load content");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load content. Please try again later.",
        });
      }
    };

    fetchContent("poems", setPoems);
    if (user) fetchContent("poems/following", setFollowingPoems, true);
    fetchContent("manga", setMangas);
    fetchContent("lightnovels", setLightNovels);
    
    setIsLoading(false);
  }, [user, toast]);

  useEffect(() => {
    const filtered = poems.filter((poem) => {
      const matchesSearch = searchQuery 
        ? poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          poem.content.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every((tag) => poem.tags.some((t) => t.name === tag));

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
                  className="pb-16 md:pb-0"
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
          </Tabs>
        </div>

        {searchResults.poems.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold">Poems</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.poems.map(poem => (
                <PoemCard key={poem.id} {...poem} />
              ))}
            </div>
          </div>
        )}

        {searchResults.manga.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold">Manga</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.manga.map(manga => (
                <MangaCard key={manga.id} {...manga} />
              ))}
            </div>
          </div>
        )}

        {searchResults.lightNovels.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold">Light Novels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.lightNovels.map(novel => (
                <LightNovelCard key={novel.id} {...novel} />
              ))}
            </div>
          </div>
        )}

        <AddPoetryModal
          isOpen={isPoemModalOpen}
          onClose={() => setIsPoemModalOpen(false)}
          onAddPoetry={(newPoem) => {
            setPoems(prev => [newPoem, ...prev]);
            setFilteredPoems(prev => [newPoem, ...prev]);
          }}
        />

        <AddMangaModal
          isOpen={isMangaModalOpen}
          onClose={() => setIsMangaModalOpen(false)}
          onAddManga={(newManga) => setMangas(prev => [newManga, ...prev])}
        />

        <AddLightNovelModal
          isOpen={isLightNovelModalOpen}
          onClose={() => setIsLightNovelModalOpen(false)}
          onAddLightNovel={(newNovel) => setLightNovels(prev => [newNovel, ...prev])}
        />
      </div>
    </div>
  );
}