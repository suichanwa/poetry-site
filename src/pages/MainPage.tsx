// src/pages/MainPage.tsx
import { useState, useEffect } from "react";
import { AddPoetryModal } from "@/components/AddPoetryModal";
import { useAuth } from "@/context/AuthContext";
import { PopularPoems } from "../pages/ProfileSetup/PopularPoems";
import { FeedTabs } from "../components/FeedTabs";

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

export default function MainPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>([]);
  const [popularPoems, setPopularPoems] = useState<Poem[]>([]);
  const [followingPoems, setFollowingPoems] = useState<Poem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("for-you");
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poemsResponse, popularPoemsResponse, tagsResponse] = await Promise.all([
          fetch('http://localhost:3000/api/poems'),
          fetch('http://localhost:3000/api/poems/popular'),
          fetch('http://localhost:3000/api/poems/tags')
        ]);

        const [poemsData, popularPoemsData, tagsData] = await Promise.all([
          poemsResponse.json(),
          popularPoemsResponse.json(),
          tagsResponse.json()
        ]);

        if (Array.isArray(poemsData)) setPoems(poemsData);
        if (Array.isArray(popularPoemsData)) setPopularPoems(popularPoemsData);
        if (Array.isArray(tagsData)) {
          setAvailableTags(tagsData.map((tag: { name: string }) => tag.name));
        }
        setFilteredPoems(poemsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFollowingPosts = async () => {
      if (!user || activeTab !== "following") return;
      try {
        const response = await fetch('http://localhost:3000/api/poems/following', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        const data = await response.json();
        if (Array.isArray(data)) setFollowingPoems(data);
      } catch (error) {
        console.error('Failed to fetch following posts:', error);
      }
    };

    fetchFollowingPosts();
  }, [activeTab, user]);

  useEffect(() => {
    const filterPoems = () => {
      const query = searchQuery.toLowerCase();
      const filtered = poems.filter(poem => {
        const matchesSearch = 
          poem.title.toLowerCase().includes(query) || 
          poem.author.name.toLowerCase().includes(query) ||
          poem.content.toLowerCase().includes(query);

        const matchesTags = 
          selectedTags.length === 0 || 
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


  return (
  <div className="min-h-screen p-6">
    <div className="max-w-4xl mx-auto">
      <PopularPoems poems={popularPoems} isLoading={isLoading} />

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
        onAddPoem={() => setIsModalOpen(true)}
      />
      
      <AddPoetryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPoetry={(newPoem) => {
          setPoems(prev => [newPoem, ...prev]);
          setFilteredPoems(prev => [newPoem, ...prev]);
        }}
      />
    </div>
  </div>
);
}