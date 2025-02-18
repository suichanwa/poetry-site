// src/components/FeedTabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForYouTab } from "./ForYouTab";
import { FollowingTab } from "./FollowingTab";
import { useState } from "react";

interface FeedTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  filteredPoems: any[];
  popularPoems: any[];
  followingPoems: any[];
  user: any;
  hideFilters: boolean;
  searchQuery: string;
  selectedTags: string[];
}

export function FeedTabs({
  activeTab,
  setActiveTab,
  isLoading,
  filteredPoems,
  popularPoems,
  followingPoems,
  user,
  hideFilters,
  searchQuery,
  selectedTags
}: FeedTabsProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    setActiveTab(value);
  };

  return (
    <div className="w-full">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="for-you">For You</TabsTrigger>
          <TabsTrigger value="following">
            Following
          </TabsTrigger>
        </TabsList>

        <TabsContent 
          value="for-you"
          className="mt-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <ForYouTab
            isLoading={isLoading}
            filteredPoems={filteredPoems}
            popularPoems={popularPoems}
            searchQuery={searchQuery}
            selectedTags={selectedTags}
          />
        </TabsContent>

        <TabsContent 
          value="following"
          className="mt-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <FollowingTab
            user={user}
            followingPoems={followingPoems}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}