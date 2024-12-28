import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, UserCheck } from "lucide-react";
import { ForYouTab } from "./ForYouTab";
import { FollowingTab } from "./FollowingTab";
import { PoemFilters } from "./PoemFilters";
import { Poem } from "../types";

interface FeedTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  filteredPoems: Poem[];
  popularPoems: Poem[];
  followingPoems: Poem[];
  user: any;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedTags: string[];
  availableTags: string[];
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  onAddPoem: () => void;
}

export function FeedTabs({
  activeTab,
  setActiveTab,
  isLoading,
  filteredPoems,
  popularPoems,
  followingPoems,
  user,
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  selectedTags,
  availableTags,
  toggleTag,
  clearFilters,
  onAddPoem
}: FeedTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
          <TabsTrigger value="for-you" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            For You
          </TabsTrigger>
          <TabsTrigger value="following" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Following
          </TabsTrigger>
        </TabsList>

        <PoemFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          selectedTags={selectedTags}
          availableTags={availableTags}
          toggleTag={toggleTag}
          clearFilters={clearFilters}
          onAddPoem={onAddPoem}
        />
      </div>

      <TabsContent value="for-you">
        <ForYouTab
          isLoading={isLoading}
          filteredPoems={filteredPoems}
          popularPoems={popularPoems}
          searchQuery={searchQuery}
          selectedTags={selectedTags}
        />
      </TabsContent>

      <TabsContent value="following">
        <FollowingTab
          user={user}
          followingPoems={followingPoems}
        />
      </TabsContent>
    </Tabs>
  );
}