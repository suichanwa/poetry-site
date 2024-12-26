import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Settings, LogOut, PenSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PoemCard } from "@/components/PoemCard";
import { FollowButton } from "@/components/FollowButton";

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
}

export default function Profile() {
  const { id } = useParams<{ id?: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userPoems, setUserPoems] = useState<Poem[]>([]);
  const [bookmarkedPoems, setBookmarkedPoems] = useState<Poem[]>([]);
  const [error, setError] = useState<string>("");
  const [userData, setUserData] = useState(user);
  const [followStats, setFollowStats] = useState<FollowStats>({
    followersCount: 0,
    followingCount: 0,
  });

  const isOwnProfile = !id || id === user?.id.toString();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = id || user?.id;
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError("Failed to load user profile");
      }
    };

    if (id || user?.id) {
      fetchUserData();
    }
  }, [id, user?.id]);

  // Fetch user poems
  useEffect(() => {
    const fetchUserPoems = async () => {
      try {
        const userId = id || user?.id;
        const response = await fetch(`http://localhost:3000/api/poems/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserPoems(data);
        }
      } catch (error) {
        console.error('Failed to fetch user poems:', error);
        setError("Failed to load poems");
      }
    };

    if (id || user?.id) {
      fetchUserPoems();
    }
  }, [id, user?.id]);

  // Fetch follow stats
  useEffect(() => {
    const fetchFollowStats = async () => {
      try {
        const userId = id || user?.id;
        const [followersRes, followingRes] = await Promise.all([
          fetch(`http://localhost:3000/api/follow/${userId}/followers`),
          fetch(`http://localhost:3000/api/follow/${userId}/following`),
        ]);

        const followers = await followersRes.json();
        const following = await followingRes.json();

        setFollowStats({
          followersCount: followers.length,
          followingCount: following.length,
        });
      } catch (error) {
        console.error('Error fetching follow stats:', error);
      }
    };

    if (id || user?.id) {
      fetchFollowStats();
    }
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
      {/* Profile Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 mb-6">
        {/* Avatar Section - Reduced size */}
        <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          {userData?.avatar ? (
            <img 
              src={`http://localhost:3000${userData.avatar}`}
              alt={userData?.name || 'Profile'} 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Error loading avatar image');
                e.currentTarget.src = '';
              }}
            />
          ) : (
            <User className="w-8 h-8 lg:w-12 lg:h-12 text-gray-500 dark:text-gray-400" />
          )}
        </div>

        {/* User Info Section - Reduced text sizes */}
        <div className="flex-grow">
          <h1 className="text-2xl lg:text-3xl font-bold mb-1">{userData?.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">{userData?.email}</p>
          {userData?.bio && (
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm lg:text-base">{userData.bio}</p>
          )}
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm lg:text-base">
              <span className="font-bold">{followStats.followersCount}</span> followers
            </span>
            <span className="text-sm lg:text-base">
              <span className="font-bold">{followStats.followingCount}</span> following
            </span>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-2">
          {!isOwnProfile && (
            <FollowButton 
              userId={parseInt(id!)}
              onFollowChange={(isFollowing) => {
                setFollowStats(prev => ({
                  ...prev,
                  followersCount: Math.max(0, prev.followersCount + (isFollowing ? 1 : -1))
                }));
              }}
            />
          )}
          {isOwnProfile && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/write')}
              className="flex items-center space-x-1"
            >
              <PenSquare className="w-4 h-4" />
              <span>Write</span>
            </Button>
          )}
        </div>
      </div>

      {/* Action Buttons - Only show for own profile */}
      {isOwnProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            className="justify-start"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Button>
          <Button 
            variant="outline"
            size="sm" 
            className="justify-start text-red-500 hover:text-red-600"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      )}

      {/* Poems Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">
          {isOwnProfile ? "My Poems" : `${userData.name}'s Poems`}
        </h2>
        {error ? (
          <div className="text-red-500 text-center text-sm">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {userPoems.length > 0 ? (
              userPoems.map((poem) => (
                <PoemCard
                  key={poem.id}
                  title={poem.title}
                  content={poem.content}
                  author={userData?.name || poem.author}
                  id={poem.id}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-base mb-3">No poems yet.</p>
                {isOwnProfile && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/write')}
                  >
                    Write Your First Poem
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  </div>
);
}