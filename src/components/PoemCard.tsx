import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PoemHeader } from "@/components/subcomponents/PoemHeader";
import { PoemContent } from "@/components/subcomponents/PoemContent";
import { PoemActions } from "@/components/subcomponents/PoemActions";
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

  const handleCardClick = () => {
    if (id) {
      navigate(`/poem/${id}`);
    }
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id || !confirm('Are you sure you want to delete this poem?')) return;

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

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      navigate(`/edit-poem/${id}`);
    }
  };

  const handleAddComment = async (comment: string) => {
    if (!user || !id) return;

    try {
      const response = await fetch(`http://localhost:3000/api/poems/${id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
          title,
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
    if (!user || !id) {
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

      if (!response.ok) throw new Error('Failed to bookmark poem');
      const data = await response.json();
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      console.error('Error bookmarking poem:', error);
    }
  };

  return (
    <Card 
      className={cn(
        "transform transition-all duration-300 hover:shadow-lg animate-fadeIn p-6",
        isPreview && id && "hover:scale-[1.01] cursor-pointer"
      )}
      onClick={handleCardClick}
    >
      <PoemHeader title={title} author={author} label={label} isPreview={isPreview} />

      <div className="mt-4 space-y-4">
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

        <div className="flex items-center justify-between pt-2 border-t mt-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Eye className="w-4 h-4" />
            <span>{views} views</span>
          </div>

          <div className="flex items-center gap-2">
            {isAuthor && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditClick}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteClick}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <Tag className="w-3 h-3" />
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {id && (
          <PoemActions 
            poemId={id}
            onAddComment={handleAddComment}
            onShare={handleShare}
            onBookmark={handleBookmark}
            isBookmarked={isBookmarked}
          />
        )}
      </div>
    </Card>
  );
}