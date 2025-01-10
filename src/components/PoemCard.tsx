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
import { motion } from "framer-motion";

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
  const [isHovered, setIsHovered] = useState(false);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: isPreview ? 1.01 : 1 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={cn(
          "overflow-hidden border bg-card hover:shadow-lg",
          "transition-all duration-300",
          isPreview && id && "cursor-pointer"
        )}
        onClick={handleCardClick}
      >
        <div className="p-6">
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

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Eye className="w-4 h-4" />
                <span>{views} views</span>
              </div>

              {isAuthor && isHovered && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditClick}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteClick}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </div>

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <motion.span
                    key={tag.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 
                             text-xs font-medium rounded-full
                             bg-primary/10 text-primary
                             transition-all duration-300
                             hover:bg-primary/20 transform hover:scale-105"
                  >
                    <Tag className="w-3 h-3" />
                    {tag.name}
                  </motion.span>
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
        </div>
      </Card>
    </motion.div>
  );
}