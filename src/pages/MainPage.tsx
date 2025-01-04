import { useState, useEffect } from "react";
import { AddPoetryModal } from "@/components/AddPoetryModal";
import { AddMangaModal } from "@/components/AddMangaModal";
import { useAuth } from "@/context/AuthContext";
import { PopularPoems } from "../pages/ProfileSetup/PopularPoems";
import { FeedTabs } from "../components/FeedTabs";
import { LoadingState } from "@/components/LoadingState";
import { Card } from "@/components/ui/card";

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
  fileUrl: string;
}

export default function MainPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
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
  const [activeTab, setActiveTab] = useState("for-you");
  const { user } = useAuth();

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

        const poemsResponse = await fetch('http://localhost:3000/api/poems', { headers });
        if (!poemsResponse.ok) throw new Error('Failed to fetch poems');
        const poemsData = await poemsResponse.json();
        setPoems(poemsData);
        setFilteredPoems(poemsData);

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
    const fetchFollowingPosts = async () => {
      if (!user) {
        setFollowingPoems([]);
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/poems/following', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch following posts');
        const data = await response.json();
        setFollowingPoems(data);
      } catch (error) {
        console.error('Failed to fetch following posts:', error);
        setFollowingPoems([]);
      }
    };

    if (activeTab === "following") {
      fetchFollowingPosts();
    }
  }, [user, activeTab]);

  useEffect(() => {
    const filterPoems = () => {
      const query = searchQuery.toLowerCase();
      const filtered = poems.filter(poem => {
        const matchesSearch = 
          poem.title.toLowerCase().includes(query) || 
          poem.author.name.toLowerCase().includes(query) ||
          poem.content.toLowerCase().includes(query);

        const matchesTags = 
          selectedTags.every(tag => 
            poem.tags.some(poemTag => poemTag.name === tag)
          );

        return matchesSearch && matchesTags;
      });

      setFilteredPoems(filtered);
    };

    filterPoems();
  }, [searchQuery, selectedTags, poems]);

  const toggleTag = (tag: string) => {
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

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="text-center text-red-500">
            {error}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:p-6 p-2">
      <div className="max-w-4xl mx-auto space-y-4">
        <PopularPoems 
          poems={popularPoems} 
          isLoading={isLoading} 
          className="mb-4"
        />

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
          onAddManga={() => {
            console.log("Opening Manga Modal");
            setIsMangaModalOpen(true);
          }}
          className="pb-16 md:pb-0"
        />
        
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
          onAddManga={(newManga) => {
            setPoems(prev => [newManga, ...prev]);
            setFilteredPoems(prev => [newManga, ...prev]);
          }}
        />
      </div>
    </div>
  );
}