import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { User, Settings, LogOut, PenSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PoemCard } from "@/components/PoemCard";
import { useState, useEffect } from "react";

interface Poem {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userPoems, setUserPoems] = useState<Poem[]>([]);

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
      }
    };

    if (user?.id) {
      fetchUserPoems();
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen p-6">
      <Card className="max-w-2xl mx-auto p-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User className="w-10 h-10 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="flex-grow">
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/write')}
            className="rounded-full"
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
          <div className="space-y-4">
            {userPoems.length > 0 ? (
              userPoems.map((poem) => (
                <PoemCard
                  key={poem.id}
                  title={poem.title}
                  content={poem.content}
                  author={user?.name || poem.author}
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
        </div>
      </Card>
    </div>
  );
}