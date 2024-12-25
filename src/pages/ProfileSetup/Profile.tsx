// src/pages/ProfileSetup/Profile.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Add useParams import
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
          console.log('Fetched user data:', data);
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

  // Only fetch bookmarks for own profile
  useEffect(() => {
    const fetchBookmarkedPoems = async () => {
      if (!isOwnProfile) return;

      try {
        const response = await fetch(`http://localhost:3000/api/poems/user/${user?.id}/bookmarks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBookmarkedPoems(data);
        }
      } catch (error) {
        console.error('Failed to fetch bookmarked poems:', error);
      }
    };

    if (user?.id) {
      fetchBookmarkedPoems();
    }
  }, [user?.id, isOwnProfile]);

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
    <div className="min-h-screen p-6">
      <Card className="max-w-2xl mx-auto p-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
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
              <User className="w-10 h-10 text-gray-500 dark:text-gray-400" />
            )}
          </div>
          <div className="flex-grow">
            <h1 className="text-2xl font-bold">{userData?.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{userData?.email}</p>
            {userData?.bio && (
              <p className="text-gray-500 dark:text-gray-400 mt-2">{userData.bio}</p>
            )}
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm">
                <span className="font-bold">{followStats.followersCount}</span> followers
              </span>
              <span className="text-sm">
                <span className="font-bold">{followStats.followingCount}</span> following
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isOwnProfile && (
              <FollowButton 
                userId={parseInt(id!)}
                onFollowChange={(isFollowing) => {
                  setFollowStats(prev => ({
                    ...prev,
                    followersCount: prev.followersCount + (isFollowing ? 1 : -1)
                  }));
                }}
              />
            )}
            {isOwnProfile && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigate('/write')}
              >
                <PenSquare className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Action Buttons - Only show for own profile */}
        {isOwnProfile && (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-500 hover:text-red-600" 
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

        {/* User's Poems */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            {isOwnProfile ? "My Poems" : `${userData.name}'s Poems`}
          </h2>
          {error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div className="space-y-4">
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
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No poems yet.</p>
                  {isOwnProfile && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
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

        {/* Bookmarked Poems - Only show for own profile */}
        {isOwnProfile && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Bookmarked Poems</h2>
            <div className="space-y-4">
              {bookmarkedPoems.length > 0 ? (
                bookmarkedPoems.map((poem) => (
                  <PoemCard
                    key={poem.id}
                    title={poem.title}
                    content={poem.content}
                    author={poem.author.name}
                    id={poem.id}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>You haven't bookmarked any poems yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}