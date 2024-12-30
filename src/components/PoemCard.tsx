import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PoemHeader } from "@/components/subcomponents/PoemHeader";
import { PoemContent } from "@/components/subcomponents/PoemContent";
import { PoemActions } from "@/components/subcomponents/PoemActions";
import { PoemComments } from "@/components/subcomponents/PoemComments";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, Eye, Tag } from "lucide-react";

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
  viewCount?: number;
  tags?: { name: string }[];
}

export function PoemCard({ 
  title, 
  content, 
  author, 
  label, 
  id, 
  isPreview = true,
  formatting = {},
  viewCount = 0,
  tags = []
}: PoemCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [views, setViews] = useState(viewCount);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAuthor = user?.id === author.id;

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      if (!user || !id) return;

      try {
        const response = await fetch(`http://localhost:3000/api/poems/${id}/bookmark/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch bookmark status');
        const data = await response.json();
        setIsBookmarked(data.bookmarked);
      } catch (error) {
        console.error('Error fetching bookmark status:', error);
      }
    };

    fetchBookmarkStatus();
  }, [id, user]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if clicking the card itself, not its interactive children
    if (e.target === e.currentTarget && id) {
      navigate(`/poem/${id}`);
    }
  };

  const handleAddComment = async (comment: string) => {
    if (!user || !id) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/poems/${id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const newComment = await response.json();
      setComments(prev => [...prev, newComment.content]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = async () => {
    if (!id) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: content,
          url: `${window.location.origin}/poem/${id}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(`${window.location.origin}/poem/${id}`);
    }
  };

  const handleBookmark = async () => {
    if (!user || !id) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/poems/${id}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to bookmark poem');

      const data = await response.json();
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      console.error('Error bookmarking poem:', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;
    if (!confirm('Are you sure you want to delete this poem?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/poems/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete poem');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting poem:', error);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;
    navigate(`/edit-poem/${id}`);
  };

  return (
    <Card 
      className={cn(
        "transform transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800 animate-fadeIn p-3 sm:p-4",
        isPreview && id && "hover:scale-[1.01] cursor-pointer"
      )}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <PoemHeader title={title} author={author} label={label} isPreview={isPreview} />
          <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
            <Eye className="w-4 h-4" />
            <span>{views} views</span>
          </div>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                >
                  <Tag className="w-3 h-3" />
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
        {isAuthor && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              disabled={!id}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600"
              disabled={!id}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <PoemContent 
        content={content} 
        isPreview={isPreview} 
        formatting={formatting}
        isExpanded={isExpanded}
        onToggleExpand={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
      />
      
      {id && (
        <PoemActions 
          poemId={id}
          onAddComment={handleAddComment}
          onShare={handleShare}
          onBookmark={handleBookmark}
          isBookmarked={isBookmarked}
        />
      )}
      <PoemComments comments={comments} />
    </Card>
  );
}