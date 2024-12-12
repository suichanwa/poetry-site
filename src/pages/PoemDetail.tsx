// src/pages/PoemDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/LikeButton";
import { CommentButton } from "@/components/CommentButton";
import { Share2, Bookmark } from "lucide-react";

interface Poem {
  id: number;
  title: string;
  content: string;
  author: { name: string; email: string };
  createdAt: string;
}

export default function PoemDetail() {
  const { id } = useParams<{ id: string }>();
  const [poem, setPoem] = useState<Poem | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPoem = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/poems/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPoem(data);
        } else {
          console.error('Failed to fetch poem details');
        }
      } catch (error) {
        console.error('Error fetching poem details:', error);
      }
    };

    const fetchBookmarkStatus = async () => {
      if (!user) return;

      try {
        const response = await fetch(`http://localhost:3000/api/poems/${id}/bookmark/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setIsBookmarked(data.bookmarked);
      } catch (error) {
        console.error('Error fetching bookmark status:', error);
      }
    };

    fetchPoem();
    fetchBookmarkStatus();
  }, [id, user]);

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/poems/${id}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to bookmark poem');
      }

      const data = await response.json();
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      console.error('Error bookmarking poem:', error);
    }
  };

  if (!poem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{poem.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">By {poem.author.name}</p>
        <p className="leading-relaxed text-sm sm:text-base mb-4">{poem.content}</p>
        <div className="flex space-x-2 sm:space-x-4 mb-4">
          <LikeButton />
          <CommentButton onAddComment={() => {}} />
        </div>
        <div className="flex space-x-1 sm:space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className={cn(
              "hover:scale-110 transition-transform w-8 h-8 sm:w-9 sm:h-9",
              isBookmarked ? "text-primary" : ""
            )}
          >
            <Bookmark 
              className="w-4 h-4 sm:w-5 sm:h-5" 
              fill={isBookmarked ? "currentColor" : "none"} 
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: poem.title,
                  text: poem.content,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="hover:scale-110 transition-transform w-8 h-8 sm:w-9 sm:h-9"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}