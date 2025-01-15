// src/pages/Communities/CommunitiesPage.tsx
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
  createdAt: string;
  _count: {
    members: number;
    posts: number;
  };
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
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/communities', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch communities');
        }
        
        const data = await response.json();
        if (Array.isArray(data)) {
          setCommunities(data);
          setFilteredCommunities(data);
        }
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
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search communities"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-auto"
            />
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Community
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCommunities.map(community => (
            <CommunityCard key={community.id} {...community} />
          ))}
        </div>

        <CreateCommunityModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCommunityCreated={handleCommunityCreated}
        />
      </div>
    </div>
  );
}