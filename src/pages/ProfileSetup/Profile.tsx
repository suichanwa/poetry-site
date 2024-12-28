import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileActions } from "./ProfileActions";
import { ProfilePoems } from "./ProfilePoems";

interface Poem {
  id: number;
  title: string;
  content: string;
  author: string | { name: string; email: string };
  createdAt: string;
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
  const [followStats, setFollowStats] = useState<FollowStats>({
    followersCount: 0,
    followingCount: 0,
    isFollowing: false
  });

  // Fixed isOwnProfile check
  const isOwnProfile = !id ? true : parseInt(id) === user?.id;

  // Check follow status
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

  // Fetch user data and stats
// Fetch user data and stats
useEffect(() => {
  const fetchData = async () => {
    if (!id && !user?.id) return;

    try {
      const userId = id || user?.id;
      
      // First fetch user data
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

      // Then fetch other data
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
    }
  };

  fetchData();
}, [id, user?.id]); 

  if (!userData) {
    return (
      <div className="min-h-screen p-6">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="text-center">
            <p className="text-red-500">{error || "User not found"}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-6">
      <Card className="max-w-3xl mx-auto p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 mb-6">
          <ProfileAvatar
            avatar={userData.avatar}
            name={userData.name}
          />
          <ProfileInfo
            name={userData.name}
            email={userData.email}
            bio={userData.bio}
            followStats={followStats}
          />
          <ProfileActions
            isOwnProfile={isOwnProfile}
            userId={id}
            followStats={followStats}
            onFollowChange={(isFollowing) => {
              setFollowStats(prev => ({
                ...prev,
                followersCount: Math.max(0, prev.followersCount + (isFollowing ? 1 : -1)),
                isFollowing
              }));
            }}
            onLogout={() => {
              logout();
              navigate('/login');
            }}
          />
        </div>

        <ProfilePoems
          poems={userPoems}
          isOwnProfile={isOwnProfile}
          userName={userData.name}
          error={error}
        />
      </Card>
    </div>
  );
}