import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Settings, LogOut, PenSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PoemCard } from "@/components/PoemCard";

interface Poem {
  id: number;
  title: string;
  content: string;
  author: string | { name: string; email: string };
  createdAt: string;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userPoems, setUserPoems] = useState<Poem[]>([]);
  const [bookmarkedPoems, setBookmarkedPoems] = useState<Poem[]>([]);
  const [error, setError] = useState<string>("");
  const [userData, setUserData] = useState(user);

  // Fetch user data including avatar and bio
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched user data:', data);
          setUserData(data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  // Fetch user poems
  useEffect(() => {
    const fetchUserPoems = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/poems/user/${user?.id}`, {
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

    if (user?.id) {
      fetchUserPoems();
    }
  }, [user?.id]);

  // Fetch bookmarked poems
  useEffect(() => {
    const fetchBookmarkedPoems = async () => {
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
        setError("Failed to load bookmarked poems");
      }
    };

    if (user?.id) {
      fetchBookmarkedPoems();
    }
  }, [user?.id]);

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
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/write')}
          >
            <PenSquare className="w-5 h-5" />
          </Button>
        </div>

        {/* Action Buttons */}
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

        {/* User's Poems */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">My Poems</h2>
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
                  <p>You haven't written any poems yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/write')}
                  >
                    Write Your First Poem
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bookmarked Poems */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Bookmarked Poems</h2>
          {error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
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
          )}
        </div>
      </Card>
    </div>
  );
}