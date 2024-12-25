// src/components/PoemCard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { PoemHeader } from "@/components/subcomponents/PoemHeader";
import { PoemContent } from "@/components/subcomponents/PoemContent";
import { PoemActions } from "@/components/subcomponents/PoemActions";
import { PoemComments } from "@/components/subcomponents/PoemComments";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export interface PoemCardProps {
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  label?: string;
  id: number;
  isPreview?: boolean;
  formatting?: {
    isBold?: boolean;
    isItalic?: boolean;
    alignment?: 'left' | 'center' | 'right';
    fontSize?: 'small' | 'medium' | 'large';
  };
}

export function PoemCard({ 
  title, 
  content, 
  author, 
  label, 
  id, 
  isPreview = true,
  formatting = {}
}: PoemCardProps){
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchBookmarkStatus();
  }, [id, user]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} by ${typeof author === 'string' ? author : author.name}`,
          text: content,
          url: `${window.location.origin}/poem/${id}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      const url = `${window.location.origin}/poem/${id}`;
      await navigator.clipboard.writeText(url);
    }
  };

const handleBookmark = async () => {
  if (!user) {
    navigate('/login');
    return;
  }

  const token = localStorage.getItem('token');
  console.log('Token:', token);

  const response = await fetch(`http://localhost:3000/api/poems/${id}/bookmark`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  console.log('Response status:', response.status);
  const responseText = await response.text();
  console.log('Response text:', responseText);

  if (response.ok) {
    const data = JSON.parse(responseText);
    setIsBookmarked(data.bookmarked);
  } else {
    console.error('Failed to bookmark poem:', responseText);
  }
};

  const handleNavigate = () => {
    if (isPreview) {
      navigate(`/poem/${id}`);
    }
  };

  const addComment = async (comment: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/poems/${id}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      setComments([...comments, comment]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Card 
      className={cn(
        "transform transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800 animate-fadeIn p-3 sm:p-4",
        isPreview && "hover:scale-[1.01] cursor-pointer"
      )}
      onClick={handleNavigate}
    >
      <PoemHeader title={title} author={author} label={label} isPreview={isPreview} />
      <PoemContent 
        content={content} 
        isPreview={isPreview} 
        onClick={handleNavigate}
        formatting={formatting}
      />
      <PoemActions 
        onAddComment={addComment}
        onShare={handleShare}
        onBookmark={handleBookmark}
        isBookmarked={isBookmarked}
      />
      <PoemComments comments={comments} />
    </Card>
  );
}