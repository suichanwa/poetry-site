import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { PoemCard } from "@/components/PoemCard";
import { Card } from "@/components/ui/card";

export default function BookmarksPage() {
  const { user } = useAuth();
  const [bookmarkedPoems, setBookmarkedPoems] = useState([]);

  useEffect(() => {
    const fetchBookmarkedPoems = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/poems/user/${user?.id}/bookmarks`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setBookmarkedPoems(data);
      } catch (error) {
        console.error('Error fetching bookmarked poems:', error);
      }
    };

    fetchBookmarkedPoems();
  }, [user?.id]);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-8">My Bookmarked Poems</h1>
      <div className="space-y-4">
        {bookmarkedPoems.length > 0 ? (
          bookmarkedPoems.map(poem => (
            <PoemCard key={poem.id} {...poem} />
          ))
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-500">You have no bookmarked poems.</p>
          </Card>
        )}
      </div>
    </div>
  );
}