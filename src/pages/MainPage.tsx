// src/pages/MainPage.tsx
import { useState, useEffect } from "react";
import { PoemCard } from "@/components/PoemCard";
import { AddPoetryModal } from "@/components/AddPoetryModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Poem {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
}

export default function MainPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/poems');
        const data = await response.json();
        setPoems(data);
        setFilteredPoems(data);
      } catch (error) {
        console.error('Failed to fetch poems:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoems();
  }, []);

  useEffect(() => {
    const filterPoems = () => {
      const query = searchQuery.toLowerCase();
      const filtered = poems.filter(poem => 
        poem.title.toLowerCase().includes(query) || 
        (typeof poem.author === 'string' 
          ? poem.author.toLowerCase().includes(query)
          : poem.author.name.toLowerCase().includes(query))
      );
      setFilteredPoems(filtered);
    };

    filterPoems();
  }, [searchQuery, poems]);

  const handleAddPoetry = (newPoem: Poem) => {
    setPoems(prevPoems => [newPoem, ...prevPoems]);
    setFilteredPoems(prevPoems => [newPoem, ...prevPoems]);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
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
            <Button onClick={() => setIsModalOpen(true)}>+ Add Poem</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredPoems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No poems found matching your search.' : 'No poems yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPoems.map((poem) => (
                  <PoemCard key={poem.id} {...poem} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <AddPoetryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPoetry={handleAddPoetry}
      />
    </div>
  );
}