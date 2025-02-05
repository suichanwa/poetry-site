// src/components/Communities/PostCard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit2, Trash2, Bookmark, Share2, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    author: {
      id: number;
      name: string;
      avatar?: string;
    };
    _count: {
      comments: number;
    };
  };
}

export function PostCard({ post }: PostCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAuthor = user?.id === post.author.id;

  if (!post) {
    return null;
  }

  const handleBookmark = async () => {
    if (!user || !post.id) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${post.id}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to bookmark post');
      const data = await response.json();
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post.id || !confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete post');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.id) {
      navigate(`/edit-post/${post.id}`);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content,
          url: `${window.location.origin}/post/${post.id}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full"
    >
      <Card 
        className={cn(
          "overflow-hidden border bg-card hover:shadow-lg",
          "transition-all duration-300",
          "cursor-pointer"
        )}
        onClick={() => navigate(`/post/${post.id}`)}
      >
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Posted by {post.author.name}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Eye className="mr-1 h-4 w-4" />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none break-words">
            {post.content}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {post._count?.comments || 0} Comments
            </span>
            <div className="flex items-center gap-2">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={cn(
                  "hover:scale-110 transition-transform",
                  isBookmarked ? "text-primary" : ""
                )}
              >
                <Bookmark 
                  className="w-4 h-4" 
                  fill={isBookmarked ? "currentColor" : "none"} 
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="hover:scale-110 transition-transform"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}