// src/pages/ProfileSetup/Profile.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockApi } from "@/mockApi";
import { LoadingState } from "@/components/LoadingState";
import { ProfileBanner } from "./ProfileBanner";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileActions } from "./ProfileActions";
import { ProfilePoems } from "./ProfilePoems";
import { ProfileManga } from "./ProfileManga";
import { ProfileLightNovels } from "./ProfileLightNovels";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Profile() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [userPoems, setUserPoems] = useState([]);
  const [userManga, setUserManga] = useState([]);
  const [userLightNovels, setUserLightNovels] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followStats, setFollowStats] = useState({
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
  });
  const [activeTab, setActiveTab] = useState("poems");

  const isOwnProfile = !id;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const user = await mockApi.getUser();
        const poems = await mockApi.getPoems();
        const manga = await mockApi.getManga();
        const lightNovels = await mockApi.getLightNovels();

        setUserData(user);
        setUserPoems(poems);
        setUserManga(manga);
        setUserLightNovels(lightNovels);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) return <LoadingState />;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <ProfileBanner
        banner={userData?.banner}
        userData={userData}
        followStats={followStats}
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
          />
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
            <ProfilePoems poems={userPoems} isOwnProfile={isOwnProfile} />
          </TabsContent>

          <TabsContent value="manga">
            <ProfileManga manga={userManga} isOwnProfile={isOwnProfile} />
          </TabsContent>

          <TabsContent value="lightnovels">
            <ProfileLightNovels lightNovels={userLightNovels} isOwnProfile={isOwnProfile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}