import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";
import { ProfileBanner } from "./ProfileBanner";
import { ProfileContent } from "./ProfileContent";

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

        const [poemsRes, followersRes, followingRes] = await Promise.all([
          fetch(`http://localhost:3000/api/poems/user/${userId}`, {
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
  }, [id, user?.id, navigate]);

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
          <ProfileBanner banner={userData.banner} userData={userData} />
          <ProfileContent 
            userData={userData}
            followStats={followStats}
            isOwnProfile={isOwnProfile}
            userId={id}
            userPoems={userPoems}
            onFollowChange={onFollowChange}
            onLogout={logout}
            error={error}
          />
        </Card>
      </div>
    </div>
  );
}