// src/pages/MainPage.tsx

import { useState, useEffect } from "react";
import { AddPoetryModal } from "@/components/AddPoetryModal";
import { AddMangaModal } from "@/components/AddMangaModal";
import { useAuth } from "@/context/AuthContext";
import { PopularPoems } from "../pages/ProfileSetup/PopularPoems";
import { FeedTabs } from "../components/FeedTabs";
import { LoadingState } from "@/components/LoadingState";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MangaGrid } from "@/components/MangaGrid";
import { useNavigate } from "react-router-dom";

interface Poem {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  tags: { name: string }[];
  viewCount: number;
  formatting?: {
    isBold?: boolean;
    isItalic?: boolean;
    alignment?: 'left' | 'center' | 'right';
    fontSize?: 'small' | 'medium' | 'large';
  };
}

interface Manga {
  id: number;
  title: string;
  description: string;
  author: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  tags: { name: string }[];
  coverImage: string;
  chapters: {
    id: number;
    title: string;
    orderIndex: number;
    pages: {
      id: number;
      imageUrl: string;
      pageNumber: number;
    }[];
  }[];
}

export default function MainPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>([]);
  const [popularPoems, setPopularPoems] = useState<Poem[]>([]);
  const [followingPoems, setFollowingPoems] = useState<Poem[]>([]);
  const [isPoemModalOpen, setIsPoemModalOpen] = useState(false);
  const [isMangaModalOpen, setIsMangaModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("poems");
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleTag = (tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        };

        // Fetch poems
        const poemsResponse = await fetch('http://localhost:3000/api/poems', { headers });
        if (!poemsResponse.ok) throw new Error('Failed to fetch poems');
        const poemsData = await poemsResponse.json();
        setPoems(poemsData);
        setFilteredPoems(poemsData);

        // Fetch mangas
        const mangasResponse = await fetch('http://localhost:3000/api/manga', { headers });
        if (!mangasResponse.ok) throw new Error('Failed to fetch manga');
        const mangasData = await mangasResponse.json();
        setMangas(mangasData);

      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery || selectedTags.length > 0) {
      const filtered = poems.filter(poem => {
        const matchesSearch = poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          poem.content.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTags = selectedTags.length === 0 ||
          selectedTags.every(tag => poem.tags.some(t => t.name === tag));

        return matchesSearch && matchesTags;
      });
      setFilteredPoems(filtered);
    } else {
      setFilteredPoems(poems);
    }
  }, [searchQuery, selectedTags, poems]);

  const handleMangaSubmit = async (manga: Manga) => {
    try {
      setMangas(prev => [manga, ...prev]);
      setIsMangaModalOpen(false);
      
      // Optionally refetch the manga list to ensure consistency
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/manga', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const updatedMangas = await response.json();
        setMangas(updatedMangas);
      }
    } catch (error) {
      console.error('Error handling manga submission:', error);
    }
  };

  const handleMangaClick = (mangaId: number) => {
    navigate(`/manga/${mangaId}`);
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="min-h-screen md:p-6 p-2">
      <div className="max-w-4xl mx-auto space-y-4">
        <PopularPoems 
          poems={popularPoems} 
          isLoading={isLoading} 
          className="mb-4"
        />

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="poems">Poems</TabsTrigger>
            <TabsTrigger value="manga">Manga</TabsTrigger>
          </TabsList>

          <TabsContent value="poems">
            <FeedTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isLoading={isLoading}
              filteredPoems={filteredPoems}
              popularPoems={popularPoems}
              followingPoems={followingPoems}
              user={user}
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
              className="pb-16 md:pb-0"
            />
          </TabsContent>

          <TabsContent value="manga">
            <MangaGrid 
              mangas={mangas} 
              onMangaClick={handleMangaClick}
            />
          </TabsContent>
        </Tabs>
        
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
          onAddManga={handleMangaSubmit}
        />
      </div>
    </div>
  );
}