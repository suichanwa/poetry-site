import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileActions } from "./ProfileActions";
import { ProfilePoems } from "./ProfilePoems";
import { BookOpen, Users, Star, Settings } from "lucide-react";
import { LoadingState } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FollowButton } from "@/components/FollowButton";

interface Poem {
  id: number;
  title: string;
  content: string;
  author: string | { name: string; email: string };
  createdAt: string;
  _count?: {
    likes: number;
  };
}

interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export default function Profile() {
  const { id } = useParams<{ id?: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userPoems, setUserPoems] = useState<Poem[]>([]);
  const [error, setError] = useState<string>("");
  const [userData, setUserData] = useState(user);
  const [isLoading, setIsLoading] = useState(true);
  const [followStats, setFollowStats] = useState<FollowStats>({
    followersCount: 0,
    followingCount: 0,
    isFollowing: false
  });

  const isOwnProfile = !id ? true : parseInt(id) === user?.id;

    const onFollowChange = (isFollowing: boolean) => {
    setFollowStats(prev => ({
      ...prev,
      followersCount: Math.max(0, prev.followersCount + (isFollowing ? 1 : -1)),
      isFollowing
    }));
  };

  useEffect(() => {
    if (!user || isOwnProfile || !id) return;

    const checkFollowStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/follow/${id}/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });

        if (!response.ok) throw new Error('Failed to fetch follow status');
        
        const data = await response.json();
        setFollowStats(prev => ({
          ...prev,
          isFollowing: data.isFollowing
        }));
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };

    checkFollowStatus();
  }, [id, user, isOwnProfile]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id && !user?.id) return;
      setIsLoading(true);

      try {
        const userId = id || user?.id;
        
        const userRes = await fetch(`http://localhost:3000/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });

        if (!userRes.ok) {
          throw new Error('User not found');
        }

        const userData = await userRes.json();
        setUserData(userData);

        const [poemsRes, followersRes, followingRes] = await Promise.all([
          fetch(`http://localhost:3000/api/poems/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          }),
          fetch(`http://localhost:3000/api/follow/${userId}/followers`),
          fetch(`http://localhost:3000/api/follow/${userId}/following`)
        ]);

        const [poems, followers, following] = await Promise.all([
          poemsRes.json(),
          followersRes.ok ? followersRes.json() : [],
          followingRes.ok ? followingRes.json() : []
        ]);

        setUserPoems(poems);
        setFollowStats(prev => ({
          ...prev,
          followersCount: Array.isArray(followers) ? followers.length : 0,
          followingCount: Array.isArray(following) ? following.length : 0
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user?.id]);

  if (isLoading) return <LoadingState />;

  if (!userData) {
    return (
      <div className="min-h-screen p-4">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="text-center">
            <p className="text-destructive">{error || "User not found"}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
  <div className="min-h-screen p-4 md:p-6">
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-visible bg-card">
        {/* Hero Section */}
        <div className="relative h-48 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="absolute -bottom-16 left-6 z-10">
            <ProfileAvatar
              avatar={userData.avatar}
              name={userData.name}
              size="lg"
            />
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="pt-20">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <ProfileInfo
                name={userData.name}
                email={userData.email}
                bio={userData.bio}
                followStats={followStats}
              />
              <div className="flex items-center gap-2">
                {!isOwnProfile && id && (
                  <FollowButton 
                    userId={parseInt(id)}
                    initialIsFollowing={followStats.isFollowing}
                    onFollowChange={onFollowChange}
                  />
                )}
                {isOwnProfile && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigate('/settings')}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex gap-6 mt-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="font-bold">{userPoems.length}</span>
              </div>
            </div>

            {/* Poems Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 pb-6"
            >
              <div className="border rounded-lg p-4 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                <ProfilePoems
                  poems={userPoems}
                  isOwnProfile={isOwnProfile}
                  userName={userData.name}
                  error={error}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </Card>
    </div>
  </div>
);
}