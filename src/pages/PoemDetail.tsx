import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Tag, Eye } from "lucide-react";
import { PoemActions } from "@/components/subcomponents/PoemActions";
import { PoemDetailHeader } from "@/components/subcomponents/PoemDetailHeader";
import { PoemDetailComments } from "@/components/subcomponents/PoemDetailComments";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface Poem {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  comments: Array<{
    id: number;
    content: string;
    user: {
      id: number;
      name: string;
      avatar?: string;
    };
    likes: number;
  }>;
  tags: Array<{ name: string }>;
  formatting?: {
    isBold?: boolean;
    isItalic?: boolean;
    alignment?: 'left' | 'center' | 'right';
    fontSize?: 'small' | 'medium' | 'large';
  };
  _count?: {
    likes: number;
    comments: number;
    views?: number;
  };
  viewCount?: number;
}

export default function PoemDetail() {
  const { id } = useParams<{ id: string }>();
  const [poem, setPoem] = useState<Poem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const addComment = async (comment: string) => {
    if (!user || !poem) return;

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
      setPoem(prev => {
        if (!prev) return null;
        return {
          ...prev,
          comments: [newComment, ...prev.comments]
        };
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id || isNaN(parseInt(id))) {
          throw new Error('Invalid poem ID');
        }

        const [poemResponse, bookmarkResponse] = await Promise.all([
          fetch(`http://localhost:3000/api/poems/${id}`),
          user ? fetch(`http://localhost:3000/api/poems/${id}/bookmark/status`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }) : null
        ]);

        if (!poemResponse.ok) {
          if (poemResponse.status === 404) {
            throw new Error('Poem not found');
          }
          throw new Error('Failed to fetch poem');
        }

        const poemData = await poemResponse.json();
        setPoem(poemData);

        if (bookmarkResponse) {
          const bookmarkData = await bookmarkResponse.json();
          setIsBookmarked(bookmarkData.bookmarked);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load poem';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleShare = async () => {
    if (!poem) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: poem.title,
          text: poem.content,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  useEffect(() => {
    const incrementViewCount = async () => {
      if (!id) return;
      
      try {
        await fetch(`http://localhost:3000/api/poems/${id}/view`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    };

    incrementViewCount();
  }, [id]);

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

      if (!response.ok) throw new Error('Failed to bookmark poem');

      const data = await response.json();
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      console.error('Error bookmarking poem:', error);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error || !poem) return <ErrorState error={error} onBack={() => navigate(-1)} />;

    return (
    <div className="min-h-screen bg-background">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto p-4 md:p-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-none shadow-xl">
            {/* Header */}
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/5 via-primary/10 to-transparent"/>
              
              <div className="relative p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="group hover:bg-background/80"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back
                  </Button>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{poem.viewCount || 0} views</span>
                  </div>
                </div>

                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
                >
                  {poem.title}
                </motion.h1>

                <PoemDetailHeader 
                  author={poem.author} 
                  createdAt={poem.createdAt} 
                />
              </div>

              {/* Tags */}
              <AnimatePresence>
                {poem.tags && poem.tags.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-6 md:px-8 pb-6"
                  >
                    <div className="flex flex-wrap gap-2">
                      {poem.tags.map((tag, index) => (
                        <motion.span
                          key={tag.name}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                                   text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 
                                   transition-all duration-300 cursor-pointer transform hover:scale-105"
                        >
                          <Tag className="w-3 h-3" />
                          {tag.name}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-6 md:px-8 py-8 border-t border-muted"
              >
                <div className="prose dark:prose-invert max-w-none">
                  <p className={cn(
                    "whitespace-pre-wrap leading-relaxed tracking-wide",
                    poem.formatting?.isBold && "font-bold",
                    poem.formatting?.isItalic && "italic",
                    `text-${poem.formatting?.alignment || 'left'}`,
                    {
                      'text-base': poem.formatting?.fontSize === 'small',
                      'text-lg': !poem.formatting?.fontSize || poem.formatting?.fontSize === 'medium',
                      'text-xl': poem.formatting?.fontSize === 'large'
                    }
                  )}>
                    {poem.content}
                  </p>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky bottom-0 px-6 md:px-8 py-4 bg-background/95 backdrop-blur-md border-t border-muted"
              >
                <PoemActions
                  poemId={poem.id}
                  onAddComment={addComment}
                  onShare={handleShare}
                  onBookmark={handleBookmark}
                  isBookmarked={isBookmarked}
                  initialLikes={poem._count?.likes || 0}
                  commentsCount={poem._count?.comments || 0}
                />
              </motion.div>

              {/* Comments */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 md:p-8 bg-muted/20 border-t border-muted"
              >
                <PoemDetailComments 
                  comments={poem.comments}
                  onUserClick={(userId) => navigate(`/profile/${userId}`)}
                />
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}