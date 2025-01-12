// src/pages/ProfileSetup/Profile.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";
import { ProfileBanner } from "./ProfileBanner";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileActions } from "./ProfileActions";
import { ProfilePoems } from "./ProfilePoems";
import { ProfileManga } from "./ProfileManga";
import { ProfileLightNovels } from "./ProfileLightNovels";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddPoetryModal } from "@/components/AddPoetryModal";
import { AddMangaModal } from "@/components/AddMangaModal";
import { AddLightNovelModal } from "@/components/lightnovel/AddLightNovelModal";

interface Poem {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
  };
  viewCount: number;
  tags?: { name: string }[];
}

interface Manga {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  author: string;
}

interface LightNovel {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  author: string;
}

interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export default function Profile() {
  const { id } = useParams<{ id?: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userPoems, setUserPoems] = useState<Poem[]>([]);
  const [userManga, setUserManga] = useState<Manga[]>([]);
  const [userLightNovels, setUserLightNovels] = useState<LightNovel[]>([]);
  const [error, setError] = useState<string>("");
  const [userData, setUserData] = useState(user);
  const [isLoading, setIsLoading] = useState(true);
  const [followStats, setFollowStats] = useState<FollowStats>({
    followersCount: 0,
    followingCount: 0,
    isFollowing: false
  });
  const [activeTab, setActiveTab] = useState("poems");
  const [isPoemModalOpen, setIsPoemModalOpen] = useState(false);
  const [isMangaModalOpen, setIsMangaModalOpen] = useState(false);
  const [isLightNovelModalOpen, setIsLightNovelModalOpen] = useState(false);

  const isOwnProfile = !id ? true : parseInt(id) === user?.id;

  const onFollowChange = (isFollowing: boolean) => {
    setFollowStats(prev => ({
      ...prev,
      followersCount: Math.max(0, prev.followersCount + (isFollowing ? 1 : -1)),
      isFollowing
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        };

        const userResponse = await fetch(`http://localhost:3000/api/users/${id}`, { headers });
        const poemsResponse = await fetch(`http://localhost:3000/api/poems/user/${id}`, { headers });
        const mangaResponse = await fetch(`http://localhost:3000/api/manga/user/${id}`, { headers });
        const lightNovelsResponse = await fetch(`http://localhost:3000/api/lightnovels/user/${id}`, { headers });

        if (!userResponse.ok || !poemsResponse.ok || !mangaResponse.ok || !lightNovelsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const userData = await userResponse.json();
        const userPoems = await poemsResponse.json();
        const userManga = await mangaResponse.json();
        const userLightNovels = await lightNovelsResponse.json();

        setUserData(userData);
        setUserPoems(userPoems);
        setUserManga(userManga);
        setUserLightNovels(userLightNovels);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) return <LoadingState />;

  const handleAddPoem = (newPoem: Poem) => {
    setUserPoems(prev => [newPoem, ...prev]);
  };

  const handleAddManga = (newManga: Manga) => {
    setUserManga(prev => [newManga, ...prev]);
  };

  const handleAddLightNovel = (newNovel: LightNovel) => {
    setUserLightNovels(prev => [newNovel, ...prev]);
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <ProfileBanner 
        banner={userData?.banner} 
        userData={userData} 
        followStats={followStats} 
        onFollowChange={onFollowChange} 
      />
      
      <div className="mt-24">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <ProfileInfo
            name={userData?.name}
            email={userData?.email}
            bio={userData?.bio}
            followStats={followStats}
          />
          <ProfileActions
            isOwnProfile={isOwnProfile}
            userId={id}
            followStats={followStats}
            onFollowChange={onFollowChange}
          />
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            {isOwnProfile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setIsPoemModalOpen(true)}>
                    Add Poem
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setIsMangaModalOpen(true)}>
                    Add Manga
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setIsLightNovelModalOpen(true)}>
                    Add Light Novel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <Tabs defaultValue="poems" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="poems" className="text-sm md:text-base">
                Poems
              </TabsTrigger>
              <TabsTrigger value="manga" className="text-sm md:text-base">
                Manga
              </TabsTrigger>
              <TabsTrigger value="lightnovels" className="text-sm md:text-base">
                Light Novels
              </TabsTrigger>
            </TabsList>

            <TabsContent value="poems">
              <ProfilePoems 
                poems={userPoems} 
                isOwnProfile={isOwnProfile} 
                userName={userData?.name} 
                error={error} 
              />
            </TabsContent>

            <TabsContent value="manga">
              <ProfileManga 
                manga={userManga} 
                isOwnProfile={isOwnProfile} 
                userName={userData?.name} 
                error={error} 
              />
            </TabsContent>

            <TabsContent value="lightnovels">
              <ProfileLightNovels 
                lightNovels={userLightNovels} 
                isOwnProfile={isOwnProfile} 
                userName={userData?.name} 
                error={error} 
              />
            </TabsContent>
          </Tabs>
        </div>

        <AddPoetryModal
          isOpen={isPoemModalOpen}
          onClose={() => setIsPoemModalOpen(false)}
          onAddPoetry={handleAddPoem}
        />

        <AddMangaModal
          isOpen={isMangaModalOpen}
          onClose={() => setIsMangaModalOpen(false)}
          onAddManga={handleAddManga}
        />

        <AddLightNovelModal
          isOpen={isLightNovelModalOpen}
          onClose={() => setIsLightNovelModalOpen(false)}
          onAddLightNovel={handleAddLightNovel}
        />
      </div>
    </div>
  );
}