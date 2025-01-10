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
import { motion } from "framer-motion";

// Keep all the interfaces
interface Poem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  viewCount: number;
  author: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

interface Manga {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  author: {
    id: number;
    name: string;
    avatar: string | null;
  };
  chapters: Array<{
    id: number;
    title: string;
    orderIndex: number;
  }>;
}

interface LightNovel {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  author: {
    id: number;
    name: string;
    avatar: string | null;
  };
  chapters: Array<{
    id: number;
    title: string;
    orderIndex: number;
  }>;
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

  const isOwnProfile = !id ? true : parseInt(id) === user?.id;

  const onFollowChange = (isFollowing: boolean) => {
    setFollowStats(prev => ({
      ...prev,
      followersCount: Math.max(0, prev.followersCount + (isFollowing ? 1 : -1)),
      isFollowing
    }));
  };

  // Keep the existing useEffect and data fetching logic
  useEffect(() => {
    const fetchData = async () => {
      if (!id && !user?.id) return;
      setIsLoading(true);

      try {
        const userId = id || user?.id;
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        const userRes = await fetch(`http://localhost:3000/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!userRes.ok) {
          if (userRes.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('User not found');
        }

        const userData = await userRes.json();
        setUserData(userData);

        const [poemsRes, mangaRes, lightNovelsRes, followersRes, followingRes] = await Promise.all([
          fetch(`http://localhost:3000/api/poems/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }),
          fetch(`http://localhost:3000/api/manga/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }),
          fetch(`http://localhost:3000/api/lightnovels/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }),
          fetch(`http://localhost:3000/api/follow/${userId}/followers`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }),
          fetch(`http://localhost:3000/api/follow/${userId}/following`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          })
        ]);

        const [poems, manga, lightNovels, followers, following] = await Promise.all([
          poemsRes.json(),
          mangaRes.json(),
          lightNovelsRes.json(),
          followersRes.ok ? followersRes.json() : [],
          followingRes.ok ? followingRes.json() : []
        ]);

        setUserPoems(poems);
        setUserManga(manga);
        setUserLightNovels(lightNovels);
        setFollowStats(prev => ({
          ...prev,
          followersCount: Array.isArray(followers) ? followers.length : 0,
          followingCount: Array.isArray(following) ? following.length : 0
        }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id || user?.id) {
      fetchData();
    }
  }, [id, user]);

  if (isLoading) return <LoadingState />;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <ProfileBanner banner={userData?.banner} userData={userData} followStats={followStats} onFollowChange={onFollowChange} />
      
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
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate('/write')}>
                    Add Poem
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/add-manga')}>
                    Add Manga
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/add-light-novel')}>
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
              <ProfilePoems poems={userPoems} isOwnProfile={isOwnProfile} userName={userData?.name} error={error} />
            </TabsContent>

            <TabsContent value="manga">
              <ProfileManga manga={userManga} isOwnProfile={isOwnProfile} userName={userData?.name} error={error} />
            </TabsContent>

            <TabsContent value="lightnovels">
              <ProfileLightNovels lightNovels={userLightNovels} isOwnProfile={isOwnProfile} userName={userData?.name} error={error} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}