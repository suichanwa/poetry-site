import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";
import { CreateCommunityModal } from "@/components/Communities/CreateCommunityModal";
import { CommunityCard } from "@/components/Communities/CommunityCard";

interface Community {
  id: number;
  name: string;
  description: string;
  avatar?: string;
  banner?: string;
  createdAt: string;
  _count: {
    members: number;
    posts: number;
  };
  isPrivate: boolean;
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/communities');
        if (!response.ok) throw new Error('Failed to fetch communities');
        
        const data = await response.json();
        setCommunities(data);
        setFilteredCommunities(data);
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    const filtered = communities.filter(community =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCommunities(filtered);
  }, [searchQuery, communities]);

  const handleCommunityCreated = (newCommunity: Community) => {
    setCommunities(prev => [newCommunity, ...prev]);
    setFilteredCommunities(prev => [newCommunity, ...prev]);
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Communities</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-[300px]"
              />
            </div>
            {user && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Community
              </Button>
            )}
          </div>
        </div>

        {filteredCommunities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? 'No communities found matching your search.'
                : 'No communities yet. Be the first to create one!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommunities.map((community) => (
              <CommunityCard
                key={community.id}
                {...community}
              />
            ))}
          </div>
        )}

        <CreateCommunityModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCommunityCreated={handleCommunityCreated}
        />
      </div>
    </div>
  );
}