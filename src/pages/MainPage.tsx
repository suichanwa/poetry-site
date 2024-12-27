// src/pages/MainPage.tsx
import { useState, useEffect } from "react";
import { PoemCard } from "@/components/PoemCard";
import { AddPoetryModal } from "@/components/AddPoetryModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch poems and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poemsResponse, tagsResponse] = await Promise.all([
          fetch('http://localhost:3000/api/poems'),
          fetch('http://localhost:3000/api/poems/tags')
        ]);

        const poemsData = await poemsResponse.json();
        const tagsData = await tagsResponse.json();

        setPoems(poemsData);
        setFilteredPoems(poemsData);
        setAvailableTags(tagsData.map((tag: any) => tag.name));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter poems based on search query and selected tags
  useEffect(() => {
    const filterPoems = () => {
      const query = searchQuery.toLowerCase();
      const filtered = poems.filter(poem => {
        // Match search query
        const matchesSearch = 
          poem.title.toLowerCase().includes(query) || 
          poem.author.name.toLowerCase().includes(query) ||
          poem.content.toLowerCase().includes(query);

        // Match selected tags
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
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold">Poetry Feed</h1>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search poems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-[300px]"
                />
              </div>
              <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button onClick={() => setIsModalOpen(true)}>+ Add Poem</Button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-semibold">Filter by Tags</h2>
                {(selectedTags.length > 0 || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear filters
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                    className="rounded-full"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredPoems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || selectedTags.length > 0 
                    ? 'No poems found matching your search criteria.' 
                    : 'No poems yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPoems.map((poem) => (
                  <PoemCard 
                    key={poem.id} 
                    {...poem} 
                    tags={poem.tags}
                    viewCount={poem.viewCount}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <AddPoetryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPoetry={(newPoem) => {
          setPoems(prev => [newPoem, ...prev]);
          setFilteredPoems(prev => [newPoem, ...prev]);
        }}
      />
    </div>
  );
}